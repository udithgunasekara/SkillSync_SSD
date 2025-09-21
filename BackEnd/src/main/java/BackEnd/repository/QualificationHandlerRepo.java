package BackEnd.repository;

import BackEnd.entity.QualificationHandler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface QualificationHandlerRepo extends JpaRepository<QualificationHandler, Long>{
    Optional<QualificationHandler> findByName(String name);
    List<QualificationHandler> findByUserNameAndTitle(String userName, String title);

//    @Query(value = "SELECT * FROM qualification WHERE user_name = :username LIMIT 1", nativeQuery = true)
//    Optional<QualificationHandler> findByUserNameRT1(String userName);

    @Query(value = "SELECT * FROM qualification WHERE user_name = :userName AND status = 'UnderReview' ", nativeQuery = true)
    List<QualificationHandler> findByUserNameRT1(@Param("userName") String userName);


    @Modifying
    @Transactional
    @Query(value = "DELETE FROM qualification WHERE user_name = :username", nativeQuery = true)
    void findByUsername(@Param("username") String username);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM qualification WHERE user_name = :username", nativeQuery = true)
    void deleteByUserName(@Param("username") String username);


    @Query(value = "SELECT * FROM qualification WHERE user_name = :userName AND status = 'Rejected' ", nativeQuery = true)
    List<QualificationHandler> findByUserNameRejected(@Param("userName") String userName);


}
