package BackEnd.controller;

import BackEnd.DTO.ImageEntityDTO;
import BackEnd.entity.ImageEntity;
import BackEnd.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@CrossOrigin
@RequestMapping("/api/images")
public class ImageController {
    @Autowired
    private ImageService imageService;

    @PostMapping("/upload/{username}")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            @PathVariable("username") String username) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload.");
        }

        ImageEntity imageEntity = new ImageEntity();
        imageEntity.setUsername(username);
        imageEntity.setImageName(file.getOriginalFilename());
        imageEntity.setImageData(file.getBytes());

        imageService.saveImage(imageEntity);

        return ResponseEntity.ok("Image uploaded successfully.");
    }

    @GetMapping("/{username}")
    public ResponseEntity<byte[]> getImageByusername(@PathVariable String username) {
        ImageEntityDTO imageEntity = imageService.getImageByusername(username);
        if (imageEntity != null) {
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + imageEntity.getImageName() + "\"")
                    .body(imageEntity.getImageData());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}