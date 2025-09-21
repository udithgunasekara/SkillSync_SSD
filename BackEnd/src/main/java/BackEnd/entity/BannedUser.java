package BackEnd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bannedUsers" )

public class BannedUser {

        @Id
        @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String dob;
        private Long phone;

        private String nic;

        // private String userName;
        //private String password;

}
