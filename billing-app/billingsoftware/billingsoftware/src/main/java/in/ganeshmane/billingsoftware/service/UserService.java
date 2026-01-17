package in.ganeshmane.billingsoftware.service;

import in.ganeshmane.billingsoftware.io.UserRequest;
import in.ganeshmane.billingsoftware.io.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest request);
    String userRole(String email);
    List<UserResponse> readUsers();
    void deleteUser(String id);
}
