package BackEnd.Mapper;

import BackEnd.DTO.ClientDescriptionDTO;
import BackEnd.entity.ClientDescription;

public class ClientDescriptionMapper {
    public static ClientDescriptionDTO mapToClientDescriptionDTO(ClientDescription clientDescription){
        return new ClientDescriptionDTO(
                clientDescription.getUsername(),
                clientDescription.getDescription()
        );
    }

    public static ClientDescription mapToClientDescription(ClientDescriptionDTO clientDescriptionDTO){
        return new ClientDescription(
                clientDescriptionDTO.getUsername(),
                clientDescriptionDTO.getDescription()
        );
    }
}