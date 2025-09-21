package BackEnd.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {

    //create all the fields for the client
    private long Id;
    private String firstName;
    private String lastName;
    private String email;
    private String dob;
    private String password;
    private long phone;
    private String userName;
    private String country;
    private LocalDate created_at;
  //  private String role;
}
