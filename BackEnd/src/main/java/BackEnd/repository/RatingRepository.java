package BackEnd.repository;

import BackEnd.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByUserID(String userID);

    @Query("SELECT r FROM Rating r WHERE LOWER(r.review) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Rating> findReviewsByKeyword(@Param("keyword") String keyword);

}

