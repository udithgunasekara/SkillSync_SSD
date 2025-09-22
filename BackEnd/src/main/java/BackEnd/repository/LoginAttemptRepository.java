package BackEnd.repository;

import BackEnd.entity.LoginAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, Long> {
    
    Optional<LoginAttempt> findByIpAddressAndUsername(String ipAddress, String username);
    
    void deleteByLastAttemptBefore(LocalDateTime cutoffTime);
}