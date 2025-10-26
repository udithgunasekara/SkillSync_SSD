package BackEnd.controller;

import BackEnd.service.GigImageService;
import BackEnd.Config.FileUploadValidator;
import BackEnd.Config.FileUploadValidator.ValidationResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/freelancer-gigs/{gigId}/gig-images")
@CrossOrigin(origins = "http://localhost:3000")
public class GigImageController {

    @Autowired
    private GigImageService gigImageService;

    @Autowired
    private FileUploadValidator fileUploadValidator;

    @PostMapping("/upload")
    public ResponseEntity<List<String>> uploadGigImages(@PathVariable Long gigId,
                                                        @RequestParam("image") List<MultipartFile> files) {
        
        // Validate gig ID
        if (gigId == null || gigId <= 0) {
            return ResponseEntity.badRequest().body(List.of("Invalid gig ID provided"));
        }

        // Limit number of files that can be uploaded at once (prevent resource exhaustion)
        if (files.size() > 10) {
            return ResponseEntity.badRequest().body(List.of("Maximum 10 images can be uploaded at once"));
        }

        List<String> uploadResults = files.stream()
                .map(file -> {
                    try {
                        // Validate each file
                        ValidationResult validationResult = fileUploadValidator.validateImageFile(file);
                        if (!validationResult.isValid()) {
                            return "File validation failed for " + file.getOriginalFilename() + ": " + validationResult.getMessage();
                        }

                        // Process the upload with sanitized filename
                        String sanitizedFilename = fileUploadValidator.sanitizeFilename(file.getOriginalFilename());
                        String result = gigImageService.uploadGigImages(gigId, file);
                        
                        return "Successfully uploaded: " + sanitizedFilename;
                    } catch (Exception e) {
                        return "Upload failed for " + file.getOriginalFilename() + ": " + e.getMessage();
                    }
                })
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(uploadResults);
    }

    @GetMapping("/my-gig-images")
    public ResponseEntity<Map<String, List<String>>> displayGigImages(@PathVariable Long gigId) {
        Map<String, List<byte[]>> gigImageMap = gigImageService.displayGigImages(gigId);

        if (gigImageMap.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Map<String, List<String>> titleBase64ImagesMap = new HashMap<>();
        gigImageMap.forEach((title, images) -> {
            List<String> base64Images = images.stream()
                    .map(image -> Base64.getEncoder().encodeToString(image))
                    .collect(Collectors.toList());
            titleBase64ImagesMap.put(title, base64Images);
        });

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(titleBase64ImagesMap);
    }

    @GetMapping("/first-gig-image")
    public ResponseEntity<String> displayGigImage(@PathVariable Long gigId) {
        byte[] imageBytes = gigImageService.displayFirstImage(gigId);

        if (imageBytes == null) {
            return ResponseEntity.notFound().build();
        }

        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(base64Image);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteGigImages(@PathVariable Long gigId) {
        String deleteResult = gigImageService.deleteGigImages(gigId);
        return ResponseEntity.ok(deleteResult);
    }

}
