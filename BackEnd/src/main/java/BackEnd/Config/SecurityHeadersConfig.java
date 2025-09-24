package BackEnd.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.web.servlet.FilterRegistrationBean;

import java.io.IOException;

@Configuration
public class SecurityHeadersConfig implements WebMvcConfigurer {

    @Bean
    public FilterRegistrationBean<SecurityHeadersFilter> securityHeadersFilter() {
        FilterRegistrationBean<SecurityHeadersFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new SecurityHeadersFilter());
        registrationBean.addUrlPatterns("/*");
        registrationBean.setOrder(1);
        return registrationBean;
    }

    public static class SecurityHeadersFilter implements Filter {
        
        @Override
        public void init(FilterConfig filterConfig) throws ServletException {
            // Initialization code if needed
        }

        @Override
        public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                throws IOException, ServletException {
            
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            
            // Content Security Policy to prevent XSS
            httpResponse.setHeader("Content-Security-Policy", 
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; " +
                "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; " +
                "img-src 'self' data: https: blob:; " +
                "connect-src 'self' http://localhost:8082 https:; " +
                "frame-ancestors 'none'; " +
                "base-uri 'self'; " +
                "form-action 'self'; " +
                "upgrade-insecure-requests"
            );
            
            // X-Frame-Options to prevent clickjacking
            httpResponse.setHeader("X-Frame-Options", "DENY");
            
            // X-Content-Type-Options to prevent MIME type sniffing
            httpResponse.setHeader("X-Content-Type-Options", "nosniff");
            
            // X-XSS-Protection header (legacy browsers)
            httpResponse.setHeader("X-XSS-Protection", "1; mode=block");
            
            // Referrer Policy
            httpResponse.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
            
            // Permissions Policy (formerly Feature Policy)
            httpResponse.setHeader("Permissions-Policy", 
                "camera=(), microphone=(), geolocation=(), payment=()");
            
            chain.doFilter(request, response);
        }

        @Override
        public void destroy() {
            // Cleanup code if needed
        }
    }
}
