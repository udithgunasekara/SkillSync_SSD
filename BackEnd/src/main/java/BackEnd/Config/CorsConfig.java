package BackEnd.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Secure CORS Configuration
 * Fixes Cross-Domain Misconfiguration vulnerability by:
 * 1. Restricting allowed origins to trusted domains only
 * 2. Limiting allowed headers to specific ones instead of wildcard
 * 3. Configurable origins through application properties
 * 4. Proper method restrictions
 */
@Configuration
public class CorsConfig {
    
    @Value("${app.cors.allowed-origins:http://localhost:3000,http://127.0.0.1:3000}")
    private String[] allowedOrigins;
    
    @Value("${app.cors.allowed-headers:Content-Type,Authorization,X-Requested-With,Accept,Origin}")
    private String[] allowedHeaders;
    
    @Value("${app.cors.max-age:3600}")
    private long maxAge;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders(allowedHeaders)
                        .allowCredentials(true)
                        .maxAge(maxAge);
                        
                // Separate mapping for non-API endpoints with stricter rules
                registry.addMapping("/Client/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders(allowedHeaders)
                        .allowCredentials(true)
                        .maxAge(maxAge);
                        
                registry.addMapping("/Freelancer/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders(allowedHeaders)
                        .allowCredentials(true)
                        .maxAge(maxAge);
                        
                registry.addMapping("/Admin/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders(allowedHeaders)
                        .allowCredentials(true)
                        .maxAge(maxAge);
                        
                registry.addMapping("/Security/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("GET", "DELETE")
                        .allowedHeaders(allowedHeaders)
                        .allowCredentials(true)
                        .maxAge(maxAge);
            }
        };
    }
}
