package BackEnd.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Apply this to your API endpoints
                .allowedOrigins("http://localhost:3000") // Allow requests from this origin
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Allow these methods
                .allowedHeaders("*"); // Allow all headers
    }
}
