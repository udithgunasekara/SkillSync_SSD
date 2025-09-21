package BackEnd.service;

import BackEnd.DTO.ImageEntityDTO;
import BackEnd.entity.ImageEntity;

public interface ImageService {
    public void saveImage(ImageEntity imageEntity);
    public ImageEntityDTO getImageByusername(String username);

}