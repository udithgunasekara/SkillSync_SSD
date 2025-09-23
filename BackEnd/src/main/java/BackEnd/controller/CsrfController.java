package BackEnd.controller;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
public class CsrfController {

    @GetMapping("/csrf")
    public Map<String, String> csrf(HttpServletRequest request) {
        CsrfToken csrf = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        Map<String, String> response = new HashMap<>();
        
        if (csrf != null) {
            response.put("token", csrf.getToken());
            response.put("headerName", csrf.getHeaderName());
            response.put("parameterName", csrf.getParameterName());
        }
        
        return response;
    }
}