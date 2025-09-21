package BackEnd.Mapper;

import BackEnd.DTO.UserAttemptsDTO;
import BackEnd.entity.UserAttempts;

public class UserAttemptsMapper {

    public static UserAttemptsDTO mapToUserAttemptsDTO(UserAttempts userAttempts){
        return new UserAttemptsDTO(
                userAttempts.getUserName(),
                userAttempts.getExamId(),
                userAttempts.getNoOfAttempts()
        );
    }

    public static UserAttempts mapToUserAttempts(UserAttemptsDTO userAttemptsDTO){
        return new UserAttempts(
                userAttemptsDTO.getUserName(),
                userAttemptsDTO.getExamId(),
                userAttemptsDTO.getNoOfAttempts()
        );
    }
}
