package BackEnd.Mapper;

import BackEnd.DTO.GigImagesDTO;
import BackEnd.entity.GigImages;

public class GigImagesMapper {

    public static GigImagesDTO mapToGigImagesDTO(GigImages gigImages) {
        GigImagesDTO gigImagesDto = new GigImagesDTO();
        gigImagesDto.setGigImageId(gigImages.getGigImageId());
        gigImagesDto.setGigImage(gigImages.getGigImage());
        return gigImagesDto;
    }

    public static GigImages mapToGigImages(GigImagesDTO gigImagesDto) {
        GigImages gigImages = new GigImages();
        gigImages.setGigImageId(gigImagesDto.getGigImageId());
        gigImages.setGigImage(gigImagesDto.getGigImage());
        return gigImages;
    }

}
