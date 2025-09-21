package BackEnd.service.imple;

import BackEnd.DTO.ClientDescriptionDTO;
import BackEnd.Mapper.ClientDescriptionMapper;
import BackEnd.entity.ClientDescription;
import BackEnd.repository.ClientDescriptionRepository;
import BackEnd.service.ClientDescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClientDescriptionServiceImp implements ClientDescriptionService {
    @Autowired
    private ClientDescriptionRepository clientDescriptionRepository;
    @Override
    public ClientDescriptionDTO getClientDescriptionByUsername(String username) {
        Optional<ClientDescription> clientDescriptionOptional = clientDescriptionRepository.findByUsername(username);
        if (clientDescriptionOptional.isPresent()) {
            ClientDescription clientDescription = clientDescriptionOptional.get();
            return ClientDescriptionMapper.mapToClientDescriptionDTO(clientDescription);
        } else {
            return null;
        }
    }

    @Override
    public ClientDescriptionDTO saveClientDescription(ClientDescription clientDescription) {
        ClientDescription clientDescription1 = clientDescriptionRepository.save(clientDescription);
        return ClientDescriptionMapper.mapToClientDescriptionDTO(clientDescription1);
    }
}