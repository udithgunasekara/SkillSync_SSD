package BackEnd.Mapper;

import BackEnd.DTO.UserResultDTO;
import BackEnd.entity.UserResult;

public class UserResultMapper {

    public static UserResultDTO mapToUserResultDTO(UserResult userResult){
        return new UserResultDTO(
                userResult.getUserNamePk(),
                userResult.getExamIdPk(),
                userResult.getResult()
        );
    }

    public static UserResult maptoUserResult(UserResultDTO userResultDTO){
        return new UserResult(
                userResultDTO.getUserNamePk(),
                userResultDTO.getExamIdPk(),
                userResultDTO.getResult()
        );
    }
}
