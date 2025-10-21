package BackEnd.Config;

import BackEnd.service.JwtService;
import BackEnd.service.OAuthUserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    private final OAuthUserService oAuthUserService;
    
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, 
                                  @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        // Skip JWT validation for public endpoints
        String requestPath = request.getServletPath();
        if (isPublicEndpoint(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String authHeader = request.getHeader("Authorization");
        
        // Skip if no Authorization header or not Bearer token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            String token = authHeader.substring(7);
            
            // Validate token
            if (!oAuthUserService.validateToken(token)) {
                filterChain.doFilter(request, response);
                return;
            }
            
            // Extract user information from token
            String googleId = jwtService.getGoogleIdFromToken(token);
            String email = jwtService.getEmailFromToken(token);
            String role = jwtService.getRoleFromToken(token);
            String username = jwtService.getUsernameFromToken(token);
            
            if (googleId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // Create authorities based on role
                List<SimpleGrantedAuthority> authorities = List.of(
                    new SimpleGrantedAuthority("ROLE_" + role),
                    new SimpleGrantedAuthority("ROLE_USER")
                );
                
                // Create authentication object
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    username != null ? username : email, // principal
                    null, // credentials
                    authorities
                );
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Set authentication in security context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
            
        } catch (Exception e) {
            logger.error("Cannot set user authentication: ", e);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private boolean isPublicEndpoint(String path) {
        return path.startsWith("/auth/") ||
               path.startsWith("/csrf") ||
               path.startsWith("/error") ||
               path.startsWith("/Client/login") ||
               path.startsWith("/Freelancer/login") ||
               path.startsWith("/Client/Registration") ||
               path.startsWith("/Freelancer/Registration") ||
               path.startsWith("/api/public");
    }
}