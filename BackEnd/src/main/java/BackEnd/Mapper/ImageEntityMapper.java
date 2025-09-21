package BackEnd.Mapper;

import BackEnd.DTO.ImageEntityDTO;
import BackEnd.entity.ImageEntity;

public class ImageEntityMapper {
    public static ImageEntityDTO mapToImageEntityDTO(ImageEntity imageEntity){
        if (imageEntity == null) {
            return null; // or throw an exception, depending on your use case
        }
        return new ImageEntityDTO(
                imageEntity.getUsername(),
                imageEntity.getImageName(),
                imageEntity.getImageData()
        );
    }

    public static ImageEntity mapToImageEntity(ImageEntityDTO imageEntityDTO){
        if (imageEntityDTO == null) {
            return null; // or throw an exception, depending on your use case
        }
        return new ImageEntity(
                imageEntityDTO.getUsername(),
                imageEntityDTO.getImageName(),
                imageEntityDTO.getImageData()
        );
    }

}