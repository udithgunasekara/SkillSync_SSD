package BackEnd.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        
        // Create CSRF token handler
        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName("_csrf");

        http
            // CORS configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // CSRF configuration - PRESERVED from original implementation
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .csrfTokenRequestHandler(requestHandler)
                .ignoringRequestMatchers(
                    "/api/public/**",           // Public endpoints
                    "/auth/**",                 // OAuth endpoints - NEW
                    "/Client/login",            // Traditional login endpoints
                    "/Freelancer/login",        
                    "/Client/Registration",     // Registration endpoints  
                    "/Freelancer/Registration",
                    "/csrf",                    // CSRF token endpoint
                    "/error"                    // Error endpoints
                )
            )
            
            // Session management - UPDATED for JWT
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // Allow sessions for CSRF
                .maximumSessions(5) // Increased for multiple devices
                .maxSessionsPreventsLogin(false)
            )
            
            // Add JWT filter BEFORE UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            
            // Authorization rules - UPDATED
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/api/public/**", "/error").permitAll()
                
                // Authentication endpoints 
                .requestMatchers("/auth/**").permitAll()  // OAuth endpoints
                .requestMatchers("/Client/login", "/Freelancer/login").permitAll() // Traditional login
                .requestMatchers("/Client/Registration", "/Freelancer/Registration").permitAll() // Registration
                .requestMatchers("/csrf").permitAll()  // CSRF token endpoint
                
                // Role-based access (works with both traditional and OAuth)
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/Client/**").hasAnyRole("CLIENT", "ADMIN") 
                .requestMatchers("/Freelancer/**").hasAnyRole("FREELANCER", "ADMIN")
                
                // All other requests require authentication (either session or JWT)
                .anyRequest().authenticated()
            )
            
            // Disable default form login for API (OAuth/JWT based)
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // FIXED: Specific origins instead of wildcard
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000", 
            "http://127.0.0.1:3000"
        ));
        
        // FIXED: Specific methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // FIXED: Specific headers including CSRF and OAuth
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",         // JWT Bearer tokens
            "Content-Type", 
            "X-Requested-With",
            "X-CSRF-TOKEN",          // CSRF token header - PRESERVED
            "X-XSRF-TOKEN"           // Alternative CSRF token header - PRESERVED
        ));
        
        // Allow credentials for CSRF cookies and OAuth
        configuration.setAllowCredentials(true);
        
        // Expose headers
        configuration.setExposedHeaders(Arrays.asList("X-CSRF-TOKEN", "Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}