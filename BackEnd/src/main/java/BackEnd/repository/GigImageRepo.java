package BackEnd.repository;

import BackEnd.entity.GigImages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GigImageRepo extends JpaRepository<GigImages, Long> {
    List<GigImages> findByGigId(Long gigId);
}
