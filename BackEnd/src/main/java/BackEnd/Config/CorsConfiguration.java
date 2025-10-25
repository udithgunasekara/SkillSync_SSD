package BackEnd.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * DEPRECATED: CORS configuration moved to SecurityConfig.java
 * 
 * This file is kept for backward compatibility but is no longer used.
 * All CORS settings are now handled in SecurityConfig.corsConfigurationSource()
 * which is integrated with Spring Security CSRF protection.
 * 
 * CORS settings:
 * - Allowed Origins: http://localhost:3000
 * - Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
 * - Allowed Headers: Authorization, Content-Type, X-Requested-With, X-CSRF-TOKEN, X-XSRF-TOKEN
 * - Allowed Credentials: true
 * - Exposed Headers: X-CSRF-TOKEN
 * 
 * @see BackEnd.Config.SecurityConfig#corsConfigurationSource()
 */
@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        // CORS configuration has been moved to SecurityConfig.java
        // This method is left empty to avoid conflicts with the new configuration
        // Do not add any mappings here as they may conflict with SecurityConfig
    }
}

