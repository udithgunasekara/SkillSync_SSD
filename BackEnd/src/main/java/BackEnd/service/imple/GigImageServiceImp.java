package BackEnd.service.imple;

import BackEnd.Config.ImageUtils;
import BackEnd.DTO.GigImagesDTO;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.entity.GigImages;
import BackEnd.repository.GigImageRepo;
import BackEnd.service.GigImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GigImageServiceImp implements GigImageService {

    @Autowired
    private GigImageRepo gigImageRepo;

    @Override
    public String uploadGigImages(Long gigId, MultipartFile file) {
        try {
            byte[] gigImageData = ImageUtils.compressImage(file.getBytes());
            GigImagesDTO gigImagesDTO = new GigImagesDTO(null, gigImageData);
            GigImages gigImages = new GigImages(gigImagesDTO.getGigImageId(), gigImagesDTO.getGigImage(), gigId);
            gigImages = gigImageRepo.save(gigImages);
            return "Gig Image uploaded successfully!";

        } catch (IOException e) {
            throw new ResourceNotFound("Image saver Error");
        }
    }

    @Override
    public Map<String, List<byte[]>> displayGigImages(Long gigId) {
        List<GigImages> gigImageData = gigImageRepo.findByGigId(gigId);
        if (gigImageData.isEmpty()) {
            throw new ResourceNotFound("No image data found for gig: " + gigId);
        }

        Map<String, List<byte[]>> gigImagesById = new HashMap<>();
        for (GigImages gigImages : gigImageData) {
            byte[] compressedImage = gigImages.getGigImage();
            byte[] decompressedImage = ImageUtils.decompressImage(compressedImage);
            gigImagesById.computeIfAbsent(gigImages.getGigImageId().toString(), k -> new ArrayList<>()).add(decompressedImage);
        }

        return gigImagesById;
    }

    @Override
    public byte[] displayFirstImage(Long gigId) {
        List<GigImages> gigImageData = gigImageRepo.findByGigId(gigId);

        if (gigImageData.isEmpty()) {
            throw new ResourceNotFound("No image data found for gig: " + gigId);
        }

        GigImages firstImage = gigImageData.get(0);
        byte[] compressedImage = firstImage.getGigImage();

        return ImageUtils.decompressImage(compressedImage);
    }

    @Override
    public String deleteGigImages(Long gigId) {
        List<GigImages> gigImages = gigImageRepo.findByGigId(gigId);
        if (gigImages.isEmpty()) {
            throw new ResourceNotFound("No image data found for gig: " + gigId);
        }

        gigImageRepo.deleteAll(gigImages);
        return "Gig Images deleted successfully!";
    }

}
