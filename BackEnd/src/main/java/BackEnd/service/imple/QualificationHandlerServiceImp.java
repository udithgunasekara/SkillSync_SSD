package BackEnd.service.imple;

import BackEnd.Config.ImageUtils;
import BackEnd.DTO.QualificationHandlerDTO;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.QualificationHandlerMapper;
import BackEnd.entity.SocialLinks;
import BackEnd.DTO.SocialLinksDTO;
import BackEnd.repository.SocialLinksRepo;
import BackEnd.entity.QualificationHandler;
import BackEnd.repository.QualificationHandlerRepo;
import BackEnd.service.QualificationHandlerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class QualificationHandlerServiceImp implements QualificationHandlerService {

    @Autowired
    private QualificationHandlerRepo qualificationHandlerRepo;
    @Autowired
    private SocialLinksRepo socialLinksRepo;

    @Override
    public String uploadImage(MultipartFile file, String userName, String title, String startDate, String endDate) {
        try {
            byte[] imageData = ImageUtils.compressImage(file.getBytes());

            QualificationHandlerDTO dto = new QualificationHandlerDTO(0L, file.getOriginalFilename(),
                    file.getContentType(), userName, title, imageData, startDate, endDate);

            QualificationHandler qualificationHandler = QualificationHandlerMapper.toMapQualificationHandler(dto);

            qualificationHandler = qualificationHandlerRepo.save(qualificationHandler);


            return qualificationHandler != null ? "Image uploaded successfully! New Testing Passed !!" : null;

        } catch (IOException e) {
            throw new ResourceNotFound("Image saver Error");
        }
    }

    //saving images (Update function)
    //TODO: Resubmission form operation here
    @Override
    public String updateImage(List<MultipartFile> files, String userName, String title) {
        // Find existing qualifications by username and title
        List<QualificationHandler> existingQualifications = qualificationHandlerRepo.findByUserNameAndTitle(userName, title);

        if (existingQualifications.size() != files.size()) {
            throw new ResourceNotFound("The number of files does not match the number of existing qualifications");
        }

        try {
            for (int i = 0; i < files.size(); i++) {
                MultipartFile file = files.get(i);
                byte[] imageData = ImageUtils.compressImage(file.getBytes());
                // byte[] imageData = file.getBytes();

                QualificationHandler qualification = existingQualifications.get(i);
                qualification.setName(file.getOriginalFilename());
                qualification.setImage(imageData);
                qualification.setStatus("UnderReview");
                qualificationHandlerRepo.save(qualification);
            }
            return "Image updated successfully!";

        } catch (IOException e) {
            throw new ResourceNotFound("Image update Error");
        }
    }

    //Here add Social links to the database
    @Override
    public String addSocialLinks(SocialLinksDTO socialLinksDTO) {
        SocialLinks socialLinks = QualificationHandlerMapper.toMapSocialLinks(socialLinksDTO);
        socialLinksRepo.save(socialLinks);
        return "Social links added successfully!";
    }

    @Override
    public List<byte[]> downloadQualification(String userName) {
        List<QualificationHandler> dbImageDatas = qualificationHandlerRepo.findByUserNameRT1(userName);
        if (dbImageDatas.isEmpty()) {
            throw new IllegalStateException("No image data found for username: " + userName);
        }
        List<byte[]> decompressedImages = new ArrayList<>();
        for (QualificationHandler imageData : dbImageDatas) {
            byte[] compressedImage = imageData.getImage();
            byte[] decompressedImage = ImageUtils.decompressImage(compressedImage);
            decompressedImages.add(decompressedImage);
        }
        return decompressedImages;
    }

    @Override
    public Map<String, List<byte[]>> downloadQualificationsByUser(String username) {
        List<QualificationHandler> dbImageDatas = qualificationHandlerRepo.findByUserNameRT1(username);
        if (dbImageDatas.isEmpty()) {
            throw new IllegalStateException("No image data found for username: " + username);
        }

        Map<String, List<byte[]>> imagesByTitle = new HashMap<>();
        for (QualificationHandler imageData : dbImageDatas) {
            byte[] compressedImage = imageData.getImage();
            byte[] decompressedImage = ImageUtils.decompressImage(compressedImage);
            imagesByTitle.computeIfAbsent(imageData.getTitle(), k -> new ArrayList<>()).add(decompressedImage);
        }

        return imagesByTitle;
    }

    @Override
    public String updateQualificationStatus(String userName, String title, String status) {
        List<QualificationHandler> qualificationHandlers = qualificationHandlerRepo.findByUserNameAndTitle(userName, title);

        int count = qualificationHandlers.size();

        if (status.equals("Rejected")) { // Use .equals() for String comparison
            qualificationHandlers.forEach(handler -> {
                handler.setStatus("Rejected");
                qualificationHandlerRepo.save(handler);
            });

            return "Qualification Rejected";
        }
        return null;
    }

    @Override
    public Map<String, List<byte[]>> downloadRejectedQualificationByUser(String username) {
        List<QualificationHandler> dbImageDatas = qualificationHandlerRepo.findByUserNameRejected(username);
        if (dbImageDatas.isEmpty()) {
            throw new IllegalStateException("No image data found for username: " + username);
        }

        Map<String, List<byte[]>> imagesByTitle = new HashMap<>();
        for (QualificationHandler imageData : dbImageDatas) {
            byte[] compressedImage = imageData.getImage();
            byte[] decompressedImage = ImageUtils.decompressImage(compressedImage);
            imagesByTitle.computeIfAbsent(imageData.getTitle(), k -> new ArrayList<>()).add(decompressedImage);
        }

        return imagesByTitle;
    }


}


//Creating a download image method
//    public byte[] downloadImage(String name){
//      //here the using method optional we can use it byid
//        Optional<QualificationHandler> dbImageGetter = qualificationHandlerRepo.findByName(name);
//        byte[] image = ImageUtils.decompressImage(dbImageGetter.get().getImage());
//        return image;
//
//    }



