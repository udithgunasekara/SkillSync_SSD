package BackEnd.DTO;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClientVDTO {
    private long id;
    private String firstName;
    private String lastName;
    private String email;
    private String dob;
    private String password;
    private long phone;
    private String userName;
    private String country;
    private LocalDate created_at;
}
