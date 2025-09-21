package BackEnd.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GigImagesDTO {

    private Long gigImageId;
    private byte[] gigImage;

}
