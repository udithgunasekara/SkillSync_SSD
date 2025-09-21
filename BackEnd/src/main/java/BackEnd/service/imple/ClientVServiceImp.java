package BackEnd.service.imple;

import BackEnd.DTO.ClientVDTO;
import BackEnd.Mapper.ClientVMapper;
import BackEnd.entity.Client;
import BackEnd.repository.ClientVRepository;
import BackEnd.service.ClientVService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClientVServiceImp implements ClientVService {
    @Autowired
    private ClientVRepository clientVRepository;

    @Override
    public ClientVDTO getClientByUsername(String username) {
        Client client = clientVRepository.findByUserName(username).orElseThrow(() ->new RuntimeException("Client not found"));
        return ClientVMapper.mapToClientDTO(client);
    }

    @Override
    public void deleteClientById(Long id) {
        Client client = clientVRepository.findById(id).orElseThrow(() -> new RuntimeException("Client not found with id : " + id));
        clientVRepository.delete(client);
    }
}