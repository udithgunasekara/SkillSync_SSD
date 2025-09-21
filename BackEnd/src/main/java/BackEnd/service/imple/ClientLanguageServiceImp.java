package BackEnd.service.imple;

import BackEnd.DTO.ClientLanguageDTO;
import BackEnd.Mapper.ClientLanguageMapper;
import BackEnd.entity.ClientLanguage;
import BackEnd.repository.ClientLanguageRepository;
import BackEnd.service.ClientLanguageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientLanguageServiceImp implements ClientLanguageService {
    @Autowired
    private ClientLanguageRepository clientLanguageRepository;

    @Override
    @Transactional
    public List<ClientLanguageDTO> getLanguagesByUsername(String username) {
        List<ClientLanguage> clientLanguageList = clientLanguageRepository.findByusername(username);

        return clientLanguageList.stream()
                .map(ClientLanguageMapper::mapToClientLanguageDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ClientLanguage addClientLanguage(ClientLanguage clientLanguage) {
        return clientLanguageRepository.save(clientLanguage);
    }

    @Override
    @Transactional
    public void deleteByusernameAndLanguage(String username, String language) {
        ClientLanguage clientLanguage = clientLanguageRepository.findByusernameAndLanguage(username, language);
        //.orElseThrow(() -> new RuntimeException("ClientLanguage not found with username: " + username + " and language: " + language));

        clientLanguageRepository.delete(clientLanguage);
    }
}