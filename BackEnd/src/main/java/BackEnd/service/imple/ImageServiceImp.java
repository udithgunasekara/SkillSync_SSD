package BackEnd.service.imple;

import BackEnd.DTO.ImageEntityDTO;
import BackEnd.Mapper.ImageEntityMapper;
import BackEnd.entity.ImageEntity;
import BackEnd.repository.ImageRepository;
import BackEnd.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImageServiceImp implements ImageService {
    @Autowired
    private ImageRepository imageRepository;

    @Override
    public void saveImage(ImageEntity imageEntity) {
        ImageEntity imageEntity1=imageRepository.save(imageEntity);
        ImageEntityMapper.mapToImageEntityDTO(imageEntity1);
    }
    @Override
    public ImageEntityDTO getImageByusername(String username) {
        ImageEntity imageEntity = imageRepository.findByusername(username).orElse(null);
        return ImageEntityMapper.mapToImageEntityDTO(imageEntity);
    }

}
