package BackEnd.repository;

import BackEnd.entity.OTPRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OTPRequestRepo extends JpaRepository<OTPRequest, Long>{

    Optional<OTPRequest> findByEmail(String email);
}
