package BackEnd.DTO;

import BackEnd.entity.UserCredential;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TicketDto {

    private Long id;
    
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;
    
    @NotBlank(message = "Related to field cannot be blank")
    @Size(max = 100, message = "Related to field cannot exceed 100 characters")
    @Pattern(regexp = "^[^<>\"'&]*$", message = "Related to field contains invalid characters")
    private String relatedTo;
    
    @NotBlank(message = "Subject cannot be blank")
    @Size(min = 5, max = 200, message = "Subject must be between 5 and 200 characters")
    @Pattern(regexp = "^[^<>\"'&]*$", message = "Subject contains invalid characters")
    private String Subject;
    
    @NotBlank(message = "Description cannot be blank")
    @Size(min = 10, max = 2000, message = "Description must be between 10 and 2000 characters")
    @Pattern(regexp = "^[^<>\"'&]*$", message = "Description contains invalid characters")
    private String Description;
    
    private UserCredential user;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    
    @Pattern(regexp = "^(open|in-progress|resolved|closed)$", message = "Status must be 'open', 'in-progress', 'resolved', or 'closed'")
    private String status;
}
