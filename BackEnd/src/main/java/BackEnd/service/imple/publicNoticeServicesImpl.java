package BackEnd.service.imple;

import BackEnd.DTO.publicNoticesDTO;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.entity.publicNotices;
import BackEnd.repository.publicNotcesRepo;
import BackEnd.service.publicNoticeServices;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class publicNoticeServicesImpl implements publicNoticeServices{
    private publicNotcesRepo publicnoticerepository;
    private ModelMapper modelmapper;

    //get all public notices
    @Override
    public List<publicNoticesDTO> getAllNotices() {
        List<publicNotices> noticeslist = publicnoticerepository.findAll();

        List<publicNoticesDTO> noticesDTOlist = new ArrayList<>();
        noticeslist.forEach(
                (p) -> {noticesDTOlist.add(modelmapper.map(p,publicNoticesDTO.class));}
        );
        return noticesDTOlist;
    }

    @Override
    public publicNoticesDTO addNotice(publicNoticesDTO publicNoticesDTO) {
        publicNotices addnotice = modelmapper.map(publicNoticesDTO, publicNotices.class);

        publicNotices notice = publicnoticerepository.save(addnotice);

        publicNoticesDTO noticesdto = modelmapper.map(notice,publicNoticesDTO.class);

        return noticesdto;
    }

    //find notice by id
    @Override
    public publicNoticesDTO findNoticeByID(Long id) {
        publicNotices notice = publicnoticerepository.findById(id).orElseThrow(
                () -> new ResourceNotFound("no notice found...")
        );
        return modelmapper.map(notice, publicNoticesDTO.class);
    }

    @Override
    public publicNoticesDTO updateNoticeByID(publicNoticesDTO updateinfo, Long id) {
        publicNotices notice = publicnoticerepository.findById(id).orElseThrow(
                () -> new ResourceNotFound("No notices found..failed to update")
        );
        notice.setTitle(updateinfo.getTitle());
        notice.setDescription(updateinfo.getDescription());
        notice.setAudience(updateinfo.getAudience());
        notice.setMoreDetailsLink(updateinfo.getMoreDetailsLink());
        notice.setImagelink(updateinfo.getImagelink());

        publicNotices updatednotice = publicnoticerepository.save(notice);

        return modelmapper.map(updatednotice, publicNoticesDTO.class);

    }

    @Override
    public String deleteNoticeById(Long id) {
        publicNotices targetnotice = publicnoticerepository.findById(id).orElseThrow(
                () -> new ResourceNotFound("No notices found")
        );
        publicnoticerepository.delete(targetnotice);
        return "Notice deleted successfully";

    }

    @Override
    public String deleteAllNotices() {
        publicnoticerepository.deleteAll();
        return "All notices deleted successfully";
    }

    @Override
    public Page<publicNoticesDTO> getNoticeByAudience(String audience, Pageable pageable) {
        Page<publicNotices> notices = publicnoticerepository.findByAudience(audience,pageable);
        Page<publicNoticesDTO> noticesDTO = notices.map(
                (p) -> {return modelmapper.map(p,publicNoticesDTO.class);}
        );

        return noticesDTO;
    }


    @Override
    public Page<publicNoticesDTO> searchNoticeByTitleOrDescription(String title, String description, Pageable pageable) {
        Page<publicNotices> notices = publicnoticerepository.findByTitleContainingOrDescriptionContaining(title, description,pageable);
        Page<publicNoticesDTO> noticesDTO = notices.map(
                (p) -> {return modelmapper.map(p,publicNoticesDTO.class);}
        );
        return noticesDTO;
    }

}
