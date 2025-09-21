package BackEnd.DTO;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class publicNoticesDTO {
    private Long id;
//    private byte[] images;
    private String title;
    private String description;
    private String audience;
    private String moreDetailsLink;
    private LocalDateTime datecreated;
    private LocalDateTime lastupdated;
    private String imagelink;
}
