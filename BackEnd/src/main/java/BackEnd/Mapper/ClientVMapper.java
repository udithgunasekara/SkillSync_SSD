package BackEnd.Mapper;


import BackEnd.DTO.ClientVDTO;
import BackEnd.entity.Client;

public class ClientVMapper {
    public static ClientVDTO mapToClientDTO(Client client){
        return new ClientVDTO(
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
    public static Client mapToClient(ClientVDTO clientVDTO){
        return new Client(
                clientVDTO.getId(),
                clientVDTO.getFirstName(),
                clientVDTO.getLastName(),
                clientVDTO.getEmail(),
                clientVDTO.getDob(),
                clientVDTO.getPassword(),
                clientVDTO.getPhone(),
                clientVDTO.getUserName(),
                clientVDTO.getCountry(),
                clientVDTO.getCreated_at()
        );
    }
}
