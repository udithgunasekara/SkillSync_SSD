package BackEnd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "login_attempts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginAttempt {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String ipAddress;
    
    @Column(nullable = false)
    private String username;
    
    @Column(nullable = false)
    private int attemptCount;
    
    @Column(nullable = false)
    private LocalDateTime lastAttempt;
    
    @Column(nullable = false)
    private LocalDateTime blockedUntil;
    
    @Column(nullable = false)
    private boolean isBlocked;
}