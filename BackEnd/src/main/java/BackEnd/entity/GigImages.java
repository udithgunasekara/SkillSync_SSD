package BackEnd.entity;

import BackEnd.DTO.GigImagesDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "gig_images")
public class GigImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gig_image_id")
    private Long gigImageId;

    @Lob
    @Column(name = "image", length = 1999999999)
    private byte gigImage[];

    @Column(name = "gig_id")
    private Long gigId;

}
