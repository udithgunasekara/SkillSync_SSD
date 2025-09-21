package BackEnd.service;

import BackEnd.DTO.ClientDTO;
import BackEnd.DTO.LoginDTO;

import java.util.List;

public interface ClientService {
    ClientDTO createClient(ClientDTO clientDTO);

    Long validateLogin(LoginDTO loginDTO);

    List<ClientDTO> getAllClients();
}
