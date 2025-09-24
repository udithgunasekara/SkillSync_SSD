package BackEnd.Config;

import BackEnd.service.CorsSecurityService;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * CORS Security Filter
 * Additional security layer for CORS requests
 * Prevents Cross-Domain Misconfiguration attacks
 */
@Component
@Order(1)
public class CorsSecurityFilter implements Filter {
    
    private static final Logger logger = LoggerFactory.getLogger(CorsSecurityFilter.class);
    
    @Autowired
    private CorsSecurityService corsSecurityService;
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String origin = httpRequest.getHeader("Origin");
        String method = httpRequest.getMethod();
        String path = httpRequest.getRequestURI();
        
        // Log the CORS request for monitoring
        if (origin != null) {
            corsSecurityService.logCorsRequest(origin, method, path);
            
            // Additional security check
            if (!corsSecurityService.isOriginAllowed(origin)) {
                logger.warn("CORS Security Filter: Blocking request from unauthorized origin: {} to path: {}", 
                           origin, path);
                httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
                httpResponse.getWriter().write("{\"error\":\"CORS: Origin not allowed\",\"code\":\"CORS_ORIGIN_DENIED\"}");
                httpResponse.setContentType("application/json");
                return;
            }
        }
        
        // Check for suspicious headers
        String[] requestHeaders = httpRequest.getHeaderNames() != null ? 
            java.util.Collections.list(httpRequest.getHeaderNames()).toArray(new String[0]) : null;
        
        if (!corsSecurityService.areHeadersSafe(requestHeaders)) {
            logger.warn("CORS Security Filter: Blocking request with suspicious headers from: {}", origin);
            httpResponse.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            httpResponse.getWriter().write("{\"error\":\"CORS: Suspicious headers detected\",\"code\":\"CORS_HEADERS_DENIED\"}");
            httpResponse.setContentType("application/json");
            return;
        }
        
        chain.doFilter(request, response);
    }
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.info("CORS Security Filter initialized");
    }
    
    @Override
    public void destroy() {
        logger.info("CORS Security Filter destroyed");
    }
}