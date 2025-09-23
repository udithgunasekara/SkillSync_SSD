package BackEnd.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import BackEnd.DTO.ClientDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClientController.class)
public class CsrfProtectionTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    public void testCsrfTokenRequired() throws Exception {
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setUserName("testuser");
        clientDTO.setPassword("password");
        clientDTO.setEmail("test@test.com");
        
        // Request without CSRF token should fail
        mockMvc.perform(post("/Client/Registration")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(clientDTO)))
                .andExpect(status().isForbidden());
    }
    
    @Test
    @WithMockUser
    public void testCsrfTokenValid() throws Exception {
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setUserName("testuser");
        clientDTO.setPassword("password");
        clientDTO.setEmail("test@test.com");
        
        // Request with CSRF token should succeed
        mockMvc.perform(post("/Client/Registration")
                .with(csrf())
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(clientDTO)))
                .andExpect(status().isCreated());
    }
    
    @Test
    public void testCsrfTokenEndpoint() throws Exception {
        // CSRF token endpoint should be accessible
        mockMvc.perform(get("/csrf"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.headerName").value("X-CSRF-TOKEN"));
    }
}