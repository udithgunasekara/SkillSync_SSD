package BackEnd.repository;


import BackEnd.entity.ClientDescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientDescriptionRepository extends JpaRepository<ClientDescription, String> {

    Optional<ClientDescription> findByUsername(String username);

    // ClientDescription updateClientDescription(String username, ClientDescriptionService clientDescription);
}