package BackEnd.DTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class publicNoticesDTO {
    private Long id;
    
    @NotBlank(message = "Title cannot be blank")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    @Pattern(regexp = "^[^<>\"'&]*$", message = "Title contains invalid characters")
    private String title;
    
    @NotBlank(message = "Description cannot be blank")
    @Size(min = 10, max = 2000, message = "Description must be between 10 and 2000 characters")
    @Pattern(regexp = "^[^<>\"'&]*$", message = "Description contains invalid characters")
    private String description;
    
    @NotBlank(message = "Audience cannot be blank")
    @Pattern(regexp = "^(Freelancer|client|all)$", message = "Audience must be 'Freelancer', 'client', or 'all'")
    private String audience;
    
    @URL(message = "More details link must be a valid URL")
    @Size(max = 500, message = "More details link cannot exceed 500 characters")
    private String moreDetailsLink;
    
    private LocalDateTime datecreated;
    private LocalDateTime lastupdated;
    
    @URL(message = "Image link must be a valid URL")
    @Size(max = 500, message = "Image link cannot exceed 500 characters")
    private String imagelink;
}
