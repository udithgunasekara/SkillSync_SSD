package BackEnd.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.security.rate-limit")
public class RateLimitConfig {
    
    private int maxAttempts = 3;
    private int blockDurationMinutes = 15;
    
    public int getMaxAttempts() {
        return maxAttempts;
    }
    
    public void setMaxAttempts(int maxAttempts) {
        this.maxAttempts = maxAttempts;
    }
    
    public int getBlockDurationMinutes() {
        return blockDurationMinutes;
    }
    
    public void setBlockDurationMinutes(int blockDurationMinutes) {
        this.blockDurationMinutes = blockDurationMinutes;
    }
}