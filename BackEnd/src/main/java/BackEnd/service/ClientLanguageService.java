package BackEnd.service;

import BackEnd.DTO.ClientLanguageDTO;
import BackEnd.entity.ClientLanguage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

public interface ClientLanguageService {

    public List<ClientLanguageDTO> getLanguagesByUsername(String username);

    public ClientLanguage addClientLanguage(ClientLanguage clientLanguage);

    public void deleteByusernameAndLanguage(String username, String language) ;


}