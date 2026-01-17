package in.ganeshmane.billingsoftware.controller;

import in.ganeshmane.billingsoftware.io.UserRequest;
import in.ganeshmane.billingsoftware.io.UserResponse;
import in.ganeshmane.billingsoftware.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class UserController {
    private final UserService userService;
//    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add-user")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse registerUser(@RequestBody UserRequest request){
        try{

            UserResponse response = userService.createUser(request);
            System.out.println(response);
            return response;
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Could not add user"+e.getMessage());
        }
    }

    @GetMapping("/get-all-users")
    public List<UserResponse> getAllUsers(){
        try{
            return userService.readUsers();
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Error while Fetching users.");
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete-user/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable("userId") String userId){
        try{
            userService.deleteUser(userId);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"No User Found...!!"+e.getMessage());
        }
    }

}
