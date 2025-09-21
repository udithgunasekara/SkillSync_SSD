package BackEnd.service;

import BackEnd.entity.UserCredential;

import java.util.List;

public interface UserCredentialVService {
    public UserCredential getUsersByUserNameAndRole(String userName, String role);
}
