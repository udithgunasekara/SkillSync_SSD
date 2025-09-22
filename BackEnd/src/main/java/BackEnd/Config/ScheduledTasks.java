package BackEnd.Config;

import BackEnd.repository.LoginAttemptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class ScheduledTasks {
    
    @Autowired
    private LoginAttemptRepository loginAttemptRepository;
    
    @Scheduled(fixedRate = 3600000) // Run every hour
    @Transactional
    public void cleanupOldLoginAttempts() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(24);
        loginAttemptRepository.deleteByLastAttemptBefore(cutoffTime);
    }
}