package BackEnd.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface GigImageService {
    String uploadGigImages(Long gigId, MultipartFile file);
    Map<String, List<byte[]>> displayGigImages(Long gigId);
    byte[] displayFirstImage(Long gigId);
    String deleteGigImages(Long gigId);
}

