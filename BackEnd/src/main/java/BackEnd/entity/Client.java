package BackEnd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "client")
public class Client {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long id;
    private String firstName;
    private String lastName;
    private String email;
    private String dob;
    private String password;
    private long phone;
    private String userName;
    private String country;
    @CreationTimestamp
    @Column(nullable = false)
    private LocalDate created_at;;
}
