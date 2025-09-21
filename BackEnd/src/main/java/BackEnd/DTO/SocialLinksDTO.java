package BackEnd.DTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SocialLinksDTO {

    private String userName;
    private String linkedIn;
    private String behance;
    private String portfolio;
}
