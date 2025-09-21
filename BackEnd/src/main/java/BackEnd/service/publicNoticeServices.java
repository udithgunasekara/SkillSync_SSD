package BackEnd.service;
import java.util.List;
import BackEnd.DTO.publicNoticesDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface publicNoticeServices {

    List<publicNoticesDTO> getAllNotices();

    publicNoticesDTO addNotice(publicNoticesDTO publicNoticesDTO);

    publicNoticesDTO findNoticeByID(Long id);

    publicNoticesDTO updateNoticeByID(publicNoticesDTO updateinfo, Long id);

    String deleteNoticeById(Long id);

    String deleteAllNotices();

    Page<publicNoticesDTO> getNoticeByAudience(String audience, Pageable pageable);

    Page<publicNoticesDTO> searchNoticeByTitleOrDescription(String title, String description, Pageable pageable);

}
