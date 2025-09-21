package BackEnd.repository;

import BackEnd.entity.GigPackages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GigPackageRepo extends JpaRepository<GigPackages, Long> {
    @Query(value = "select * from gig_packages where gig_id = :gigId", nativeQuery = true)
    List<GigPackages> findByGigId(Long gigId);

    @Modifying
    @Query(value = "delete from gig_packages where gig_id = :gigId", nativeQuery = true)
    void deleteByGigId(Long gigId);

    @Query(value = "select min(package_price) from gig_packages where gig_id = :gigId", nativeQuery = true)
    Double findMinPriceByGigId(Long gigId);

    @Query(value = "select min(package_delivery_time) from gig_packages where gig_id = :gigId", nativeQuery = true)
    Double findMinTimeByGigId(Long gigId);

}
