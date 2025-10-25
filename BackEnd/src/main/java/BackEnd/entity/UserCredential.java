package BackEnd.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

//Entity class
public class UserCredential {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long userId;
   // @Column(nullable = false)
    private String userName;
    private String password;
    private String role ;
    
    // OAuth2 specific fields
    private String email;
    private String fullName;
    private String profilePicture;
    private String provider; // google, facebook, etc.
    private String providerId; // OAuth2 provider user ID

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Ticket> tickets = new ArrayList<>();

}
