package BackEnd.repository;

import BackEnd.entity.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepository extends JpaRepository<ImageEntity,Long> {
    Optional<ImageEntity> findByusername(String username);
}