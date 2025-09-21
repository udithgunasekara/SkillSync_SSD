package BackEnd.service;

import BackEnd.DTO.ClientVDTO;

public interface ClientVService {

    public ClientVDTO getClientByUsername(String username);

    public void deleteClientById(Long id);
}