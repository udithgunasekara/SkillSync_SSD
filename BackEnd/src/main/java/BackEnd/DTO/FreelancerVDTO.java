package BackEnd.DTO;

import BackEnd.entity.Interview;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class FreelancerVDTO {
    private Long id;
    private String lastName;
    private String email;
    private String dob;
    private Long phone;
    private String firstName;
    private String userName;
    private String password;
    private String nic;
    private Long level;
    private String workOn;
    private LocalDate created_at;
    private String app_status = "In Progress";
    private List<Interview> interviews;
}
