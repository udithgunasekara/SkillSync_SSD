package BackEnd.Mapper;

import BackEnd.DTO.ClientLanguageDTO;
import BackEnd.entity.ClientLanguage;


public class ClientLanguageMapper {
    public static ClientLanguageDTO mapToClientLanguageDTO(ClientLanguage clientLanguage){
        return new ClientLanguageDTO(
                clientLanguage.getId(),
                clientLanguage.getUsername(),
                clientLanguage.getLanguage()
        );
    }

    public static ClientLanguage mapToClientLanguage(ClientLanguageDTO clientLanguageDTO){
        return new ClientLanguage(
                clientLanguageDTO.getId(),
                clientLanguageDTO.getUsername(),
                clientLanguageDTO.getLanguage()
        );
    }
}