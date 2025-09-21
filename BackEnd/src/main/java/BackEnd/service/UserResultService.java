package BackEnd.service;

import BackEnd.DTO.UserResultDTO;

import java.util.List;

public interface UserResultService {

    UserResultDTO saveUSerResult(UserResultDTO userResultDTO);

    List<UserResultDTO> getSavedResultByExamId();

    List<UserResultDTO> getSavedResultByUserName(String userName);

    UserResultDTO getSavedResultById(String userName, Long examId);
}
