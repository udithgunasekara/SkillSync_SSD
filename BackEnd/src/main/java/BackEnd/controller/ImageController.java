package BackEnd.controller;

import BackEnd.DTO.ImageEntityDTO;
import BackEnd.entity.ImageEntity;
import BackEnd.service.ImageService;
import BackEnd.Config.FileUploadValidator;
import BackEnd.Config.FileUploadValidator.ValidationResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@CrossOrigin
@RequestMapping("/api/images")
public class ImageController {
    @Autowired
    private ImageService imageService;

    @Autowired
    private FileUploadValidator fileUploadValidator;

    @PostMapping("/upload/{username}")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            @PathVariable("username") String username) throws IOException {
        
        // Validate the uploaded file
        ValidationResult validationResult = fileUploadValidator.validateImageFile(file);
        if (!validationResult.isValid()) {
            return ResponseEntity.badRequest().body("File validation failed: " + validationResult.getMessage());
        }

        // Additional username validation (prevent path traversal in username)
        if (username == null || username.trim().isEmpty() || 
            username.contains("/") || username.contains("\\") || username.contains("..")) {
            return ResponseEntity.badRequest().body("Invalid username provided");
        }

        try {
            ImageEntity imageEntity = new ImageEntity();
            imageEntity.setUsername(username.trim());
            
            // Use sanitized filename
            String sanitizedFilename = fileUploadValidator.sanitizeFilename(file.getOriginalFilename());
            imageEntity.setImageName(sanitizedFilename);
            imageEntity.setImageData(file.getBytes());

            imageService.saveImage(imageEntity);

            return ResponseEntity.ok("Image uploaded successfully with filename: " + sanitizedFilename);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error processing uploaded file");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error occurred during upload");
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<byte[]> getImageByusername(@PathVariable String username) {
        ImageEntityDTO imageEntity = imageService.getImageByusername(username);
        if (imageEntity != null) {
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + imageEntity.getImageName() + "\"")
                    .body(imageEntity.getImageData());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}