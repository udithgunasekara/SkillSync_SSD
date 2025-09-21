package BackEnd.service;

import BackEnd.DTO.UserAttemptsDTO;

public interface UserAttemptsService {
    UserAttemptsDTO saveAttempt(UserAttemptsDTO userAttemptsDTO);

    UserAttemptsDTO getUserAttemptsById(String userName, Long examId);

    UserAttemptsDTO updateUserAttemptsById(String userName, Long examId, UserAttemptsDTO userAttemptsDTO);
}
