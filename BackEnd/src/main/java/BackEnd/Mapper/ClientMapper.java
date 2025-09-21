package BackEnd.Mapper;

import BackEnd.DTO.ClientDTO;
import BackEnd.entity.Client;

public class ClientMapper {

    public static ClientDTO mapToClientDTO(Client client) {
        return new ClientDTO(
                client.getId(),
                client.getFirstName(),
                client.getLastName(),
                client.getEmail(),
                client.getDob(),
                client.getPassword(),
                client.getPhone(),
                client.getUserName(),
                client.getCountry(),
                client.getCreated_at()
        );
    }

    public static Client mapToClient(ClientDTO clientDTO) {
        Client client = new Client();
        client.setId(clientDTO.getId());
        client.setFirstName(clientDTO.getFirstName());
        client.setLastName(clientDTO.getLastName());
        client.setEmail(clientDTO.getEmail());
        client.setDob(clientDTO.getDob());
        client.setPassword(clientDTO.getPassword());
        client.setPhone(clientDTO.getPhone());
        client.setUserName(clientDTO.getUserName());
        client.setCountry(clientDTO.getCountry());
        client.setCreated_at(clientDTO.getCreated_at());
        //ignoring created_at and role
        return client;
    }


}
