package BackEnd.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "social_links")
public class SocialLinks {
    @Id
    @GeneratedValue (strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long id;
    @Column(name = "user_name", nullable = false)
    private String userName;
    private String linkedIn;
    private String behance;
    private String portfolio;
}
