package BackEnd.repository;

import BackEnd.entity.SocialLinks;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocialLinksRepo extends JpaRepository<SocialLinks, Long> {
}
