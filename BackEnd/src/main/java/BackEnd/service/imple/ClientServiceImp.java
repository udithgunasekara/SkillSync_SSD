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
        Client client = clientRepo.findByUserName(loginDTO.getUsername());
        long userid = client.getId();
        if (client != null && client.getPassword().equals(loginDTO.getPassword())) {
            return userid;
        }
        return null ;
    }

    @Override
    public List<ClientDTO> getAllClients() {
        List<Client> clients = clientRepo.findAll();
        return clients.stream()
                .map(ClientMapper::mapToClientDTO)
                .collect(Collectors.toList());

    }

}
