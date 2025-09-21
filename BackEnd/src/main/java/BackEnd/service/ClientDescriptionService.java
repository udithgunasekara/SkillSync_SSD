package BackEnd.service;

import BackEnd.DTO.ClientDescriptionDTO;
import BackEnd.entity.ClientDescription;

public interface ClientDescriptionService {

    public ClientDescriptionDTO getClientDescriptionByUsername(String username);

    public ClientDescriptionDTO saveClientDescription(ClientDescription clientDescription);
}