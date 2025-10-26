package BackEnd.controller;

import BackEnd.Config.FileUploadValidator;
import BackEnd.service.ImageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class to verify secure file upload functionality works correctly
 */
@WebMvcTest(ImageController.class)
public class SecureFileUploadTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ImageService imageService;

    @MockBean
    private FileUploadValidator fileUploadValidator;

    @Test
    @WithMockUser
    public void testValidImageUploadShouldSucceed() throws Exception {
        // Create a valid JPEG file
        byte[] validJpegContent = new byte[]{
            (byte)0xFF, (byte)0xD8, (byte)0xFF, (byte)0xE0, // JPEG header
            0x00, 0x10, 0x4A, 0x46, 0x49, 0x46 // JFIF marker
        };
        
        MockMultipartFile validImageFile = new MockMultipartFile(
            "file", 
            "test-image.jpg", 
            "image/jpeg", 
            validJpegContent
        );

        mockMvc.perform(multipart("/api/images/upload/testuser")
                .file(validImageFile)
                .with(csrf())
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("uploaded successfully")));
    }

    @Test
    @WithMockUser
    public void testInvalidFileTypeShouldBeRejected() throws Exception {
        // Create an executable file disguised as image
        byte[] executableContent = new byte[]{
            0x4D, 0x5A // PE executable signature
        };
        
        MockMultipartFile maliciousFile = new MockMultipartFile(
            "file", 
            "malware.exe", 
            "application/octet-stream", 
            executableContent
        );

        mockMvc.perform(multipart("/api/images/upload/testuser")
                .file(maliciousFile)
                .with(csrf())
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("File validation failed")));
    }

    @Test
    @WithMockUser
    public void testOversizedFileShouldBeRejected() throws Exception {
        // Create a file larger than 5MB
        byte[] largeContent = new byte[6 * 1024 * 1024]; // 6MB
        
        MockMultipartFile largeFile = new MockMultipartFile(
            "file", 
            "large-image.jpg", 
            "image/jpeg", 
            largeContent
        );

        mockMvc.perform(multipart("/api/images/upload/testuser")
                .file(largeFile)
                .with(csrf())
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("File validation failed")));
    }

    @Test
    @WithMockUser
    public void testEmptyFileShouldBeRejected() throws Exception {
        MockMultipartFile emptyFile = new MockMultipartFile(
            "file", 
            "empty.jpg", 
            "image/jpeg", 
            new byte[0]
        );

        mockMvc.perform(multipart("/api/images/upload/testuser")
                .file(emptyFile)
                .with(csrf())
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("File validation failed")));
    }

    @Test
    @WithMockUser
    public void testMaliciousFilenameShouldBeSanitized() throws Exception {
        byte[] validJpegContent = new byte[]{
            (byte)0xFF, (byte)0xD8, (byte)0xFF, (byte)0xE0,
            0x00, 0x10, 0x4A, 0x46, 0x49, 0x46
        };
        
        // Filename with path traversal attempt
        MockMultipartFile fileWithMaliciousName = new MockMultipartFile(
            "file", 
            "../../../etc/passwd.jpg", 
            "image/jpeg", 
            validJpegContent
        );

        mockMvc.perform(multipart("/api/images/upload/testuser")
                .file(fileWithMaliciousName)
                .with(csrf())
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("../"))));
    }

    @Test
    @WithMockUser
    public void testInvalidUsernameShouldBeRejected() throws Exception {
        byte[] validJpegContent = new byte[]{
            (byte)0xFF, (byte)0xD8, (byte)0xFF, (byte)0xE0,
            0x00, 0x10, 0x4A, 0x46, 0x49, 0x46
        };
        
        MockMultipartFile validFile = new MockMultipartFile(
            "file", 
            "test.jpg", 
            "image/jpeg", 
            validJpegContent
        );

        // Test with path traversal in username
        mockMvc.perform(multipart("/api/images/upload/../admin")
                .file(validFile)
                .with(csrf())
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Invalid username")));
    }
}