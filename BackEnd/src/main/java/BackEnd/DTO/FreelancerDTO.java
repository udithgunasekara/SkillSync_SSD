package BackEnd.DTO;


import BackEnd.entity.Interview;
import BackEnd.entity.Questions;
import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FreelancerDTO {
    //create varables for using freelancer entity
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String dob;
    private String nic;
    private Long level;
    private Long phone;
    private String userName;
    private String password;
    private String workOn;
    private LocalDate created_at;
    private List<Interview> interviews;
  //  private String role;

}
