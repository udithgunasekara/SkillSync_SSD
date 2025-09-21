package BackEnd.entity;

//Who created this ?? supe or vinu

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String username;
    @Lob
    @Column(name = "image", columnDefinition = "MEDIUMBLOB")
    private List<String> images;
    private byte[] data;
}
