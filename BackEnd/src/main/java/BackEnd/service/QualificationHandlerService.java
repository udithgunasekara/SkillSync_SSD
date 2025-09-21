package BackEnd.service;

import BackEnd.DTO.SocialLinksDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface QualificationHandlerService {
    String uploadImage(MultipartFile file, String userName, String title, String startDate, String endDate);

    String updateImage(List<MultipartFile> file, String userName, String title);

    String addSocialLinks(SocialLinksDTO socialLinksDTO);

    List<byte[]> downloadQualification(String userName);

    Map<String, List<byte[]>> downloadQualificationsByUser(String username);

    String updateQualificationStatus(String userName, String title, String status);

    Map<String, List<byte[]>> downloadRejectedQualificationByUser(String username);

}
