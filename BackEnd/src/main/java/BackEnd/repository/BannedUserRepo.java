package BackEnd.repository;

import BackEnd.entity.BannedUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BannedUserRepo extends JpaRepository<BannedUser, Long>{
}
