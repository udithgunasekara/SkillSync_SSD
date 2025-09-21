package BackEnd.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class QualificationHandlerDTO {
    private Long id = 0L;
    private String name;
    private String type;
    private String userName;
    private String title;
    private byte[] image;
    private String startDate;
    private String endDate;

}
