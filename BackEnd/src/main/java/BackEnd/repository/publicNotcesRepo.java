package BackEnd.repository;

import BackEnd.entity.publicNotices;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface publicNotcesRepo extends JpaRepository<publicNotices,Long>{

    Page<publicNotices> findByTitleContainingOrDescriptionContaining(@RequestParam("title") String title, @RequestParam("description") String description, Pageable pageable);

    Page<publicNotices> findByAudience(@RequestParam("audience")String audience,Pageable pageable);

}
