package BackEnd.controller;

import BackEnd.service.QualificationHandlerService;
import BackEnd.DTO.SocialLinksDTO;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@RestController
@RequestMapping("/qualification")
public class QualificationHandlerController {

    @Autowired
    private QualificationHandlerService qualificationHandlerService;

    //Save bulk images. Contain username and title
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("image") List<MultipartFile> files,
                                         @RequestParam("username") String userName,
                                         @RequestParam("startDate") String startDate,
                                         @RequestParam("endDate") String endDate,
                                         @RequestParam("title") String title) throws IOException {
        List<String> uploadResults = files.stream()
                .map(file -> qualificationHandlerService.uploadImage(file, userName, title, startDate, endDate))
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(uploadResults);
    }

    //update re submission images
    @PutMapping("/update")
    public ResponseEntity<?> updateImage(@RequestParam("image") List<MultipartFile> files,
                                         @RequestParam("username") String userName,
                                         @RequestParam("title") String title) throws IOException {
        String updateResult = qualificationHandlerService.updateImage(files, userName, title);
        return ResponseEntity.status(HttpStatus.OK).body(updateResult);
    }


    @PostMapping("/addSocialLinks")
    public ResponseEntity<?> addSocialLinks(@RequestBody SocialLinksDTO socialLinksDTO){
        String result = qualificationHandlerService.addSocialLinks(socialLinksDTO);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

   //For updating title and each images
    @GetMapping("/image/{userName}")
    public ResponseEntity<List<String>> getQualificationImage(@PathVariable String userName) {
        List<byte[]> imageContents = qualificationHandlerService.downloadQualification(userName);

        if (imageContents.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Collect Base64-encoded representations
        List<String> base64Images = new ArrayList<>();
        for (byte[] imageData : imageContents) {
            String base64Image = Base64.getEncoder().encodeToString(imageData);
            base64Images.add(base64Image);
        }

        // Return JSON array of images
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(base64Images);
    }

    //Get rejected titles and images using username
    @GetMapping("/Rejected/{username}")
    public ResponseEntity<Map<String, List<String>>> getRejectedImageByUser(@PathVariable String username) {
        Map<String, List<byte[]>> titleImagesMap = qualificationHandlerService.downloadRejectedQualificationByUser(username);

        if (titleImagesMap.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Map<String, List<String>> titleBase64ImagesMap = new HashMap<>();
        titleImagesMap.forEach((title, images) -> {
            List<String> base64Images = images.stream()
                    .map(image -> Base64.getEncoder().encodeToString(image))
                    .collect(Collectors.toList());
            titleBase64ImagesMap.put(title, base64Images);
        });

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(titleBase64ImagesMap);
    }


    @GetMapping("/images/{username}")
    public ResponseEntity<Map<String, List<String>>> getQualificationImagesByUser(@PathVariable String username) {
        Map<String, List<byte[]>> titleImagesMap = qualificationHandlerService.downloadQualificationsByUser(username);

        if (titleImagesMap.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Map<String, List<String>> titleBase64ImagesMap = new HashMap<>();

        //Without doing byte to string:
            //Use URLs to images. save images into cloud base: NOT REC learning curve and time management.
            //Use Multipart

        titleImagesMap.forEach((title, images) -> {
            List<String> base64Images = images.stream()
                    .map(image -> Base64.getEncoder().encodeToString(image))
                    .collect(Collectors.toList());
            titleBase64ImagesMap.put(title, base64Images);
        });





        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(titleBase64ImagesMap);
    }

    //Handle Rejected Qualification
    @PutMapping("/reject/Application")
    public ResponseEntity<String> updateQualificationStatus(@RequestParam("username") String username,
                                                            @RequestParam("title") String title) {

        String status = qualificationHandlerService.updateQualificationStatus(username, title, "Rejected");
            return ResponseEntity.ok("Qualification updated successfully");
    }











}
