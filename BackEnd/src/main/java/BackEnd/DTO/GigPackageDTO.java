package BackEnd.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

public class GigPackageDTO {
    private Long packageId;
    private String packageName;
    private String packageDescription;
    private String packagePrice;
    private String packageDeliveryTime;
    private Long gigId;
}
