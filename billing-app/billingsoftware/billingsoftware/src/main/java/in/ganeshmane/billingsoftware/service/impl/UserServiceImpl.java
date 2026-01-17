package in.ganeshmane.billingsoftware.service.impl;

import in.ganeshmane.billingsoftware.entity.UserEntity;
import in.ganeshmane.billingsoftware.io.UserRequest;
import in.ganeshmane.billingsoftware.io.UserResponse;
import in.ganeshmane.billingsoftware.repository.UserRepository;
import in.ganeshmane.billingsoftware.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public UserResponse createUser(UserRequest request) {
        UserEntity userEntity =  convertToEntity(request);
        userEntity = userRepository.save(userEntity);
        UserResponse response = convertToRespone(userEntity);
        return response;
    }

    private UserEntity convertToEntity(UserRequest request){
        return UserEntity.builder()
                .userId(UUID.randomUUID().toString())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole().toUpperCase())
                .phoneNumber(request.getPhoneNumber())
                .name(request.getName())
                .build();
    }

    private UserResponse convertToRespone(UserEntity userEntity){
       return UserResponse.builder()
                .name(userEntity.getName())
                .email(userEntity.getEmail())
                .userId(userEntity.getUserId())
                .createdAt(userEntity.getCreatedAt())
               .phoneNumber(userEntity.getPhoneNumber())
                .role(userEntity.getRole())
                .build();
    }

    @Override
    public String userRole(String email) {
        try{
        UserEntity userEntity = userRepository.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("User not found for the Email : "+email));
        return userEntity.getRole();
        }catch (Exception e){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Email not Found");
        }

    }

    @Override
    public List<UserResponse> readUsers() {
        return userRepository.findAll()
                .stream()
                .map(userEntity -> convertToRespone(userEntity))
                .collect(Collectors.toList());
    }

    @Override
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void deleteUser(String id) {
            try{
                UserEntity userEntity = userRepository.findByUserId(id).orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"User Id not Found : "+id));
                userRepository.delete(userEntity);
            }catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"No User Id Found");
            }
    }
}
