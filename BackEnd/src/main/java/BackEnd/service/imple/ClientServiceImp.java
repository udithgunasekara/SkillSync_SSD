package BackEnd.service.imple;

import BackEnd.DTO.ClientDTO;
import BackEnd.DTO.LoginDTO;
import BackEnd.Mapper.ClientMapper;
import BackEnd.Mapper.FreelancerMapper;
import BackEnd.Mapper.UserControllerMapper;
import BackEnd.entity.Freelancer;
import BackEnd.entity.UserCredential;
import BackEnd.repository.UserCredentialRepo;
import BackEnd.entity.Client;
import BackEnd.repository.ClientRepo;
import BackEnd.service.ClientService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ClientServiceImp implements ClientService {

    private ClientRepo clientRepo;
   private UserCredentialRepo userCredentialRepo;
    private ModelMapper modelMapper;

    @Override
    public ClientDTO createClient(ClientDTO clientDTO) {
        //save client values
        Client client = ClientMapper.mapToClient(clientDTO);
        Client saveClient = clientRepo.save(client);

        //save user credentials
        UserCredential userCredential = UserControllerMapper.mapToUserCredential(clientDTO);
        UserCredential savedUserCredential = userCredentialRepo.save(userCredential);

        return ClientMapper.mapToClientDTO(saveClient);
    }

    @Override
    public Long validateLogin(LoginDTO loginDTO) {
        // FIXED: Input validation to prevent SQL injection
        String username = loginDTO.getUsername();
        String password = loginDTO.getPassword();
        
        // Validate username - only allow alphanumeric and underscore
        if (!username.matches("^[a-zA-Z0-9_]{3,50}$")) {
            throw new IllegalArgumentException("Invalid username format");
        }
        
        // Use parameterized query (JPA method) which is safe from SQL injection
        Client client = clientRepo.findByUserName(username);
        
        // Always check if client exists before accessing properties
        if (client != null && client.getPassword().equals(password)) {
            return client.getId();
        }
        return null;
    }

    @Override
    public List<ClientDTO> getAllClients() {
        List<Client> clients = clientRepo.findAll();
        return clients.stream()
                .map(ClientMapper::mapToClientDTO)
                .collect(Collectors.toList());

    }

}
