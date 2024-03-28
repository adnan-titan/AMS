package com.assetManagement.controller;

import com.assetManagement.DTO.UserLoginResponse;
import com.assetManagement.DTO.UserResponseData;
import com.assetManagement.entity.AssetDeviceMapper;
import com.assetManagement.entity.Role;
import com.assetManagement.entity.User;
import com.assetManagement.securityFilter.JwtUtil;
import com.assetManagement.service.AssetService;
import com.assetManagement.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    @Autowired
    private AssetService assetService;
    private final JwtUtil jwt;

    @Autowired
    private UserService userService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @PostMapping("/addUser")
    void  addUser(@RequestBody User user){
        assetService.addEmployee(user);
      //  System.out.println(user.getDepartment().getDepartment_id());

    }

    @PutMapping("/updateUser")
    void updateUser(@RequestBody User user){
        assetService.updateUser(user);
    }

    @DeleteMapping("/removeUser")
    void removeUser(@RequestParam int employee_id){
        assetService.deleteUser(employee_id);
    }
    @GetMapping("/getEmployeeDetail/{employee_id}")
    User getEmployeeDetail(@PathVariable("employee_id") int employee_id){
        return assetService.getEmployeeDetails(employee_id);
    }

    @GetMapping("/getEmployeeDetail")
    User getEmployee(@RequestParam("employee_id") int employee_id){
        return assetService.getEmployeeDetails(employee_id);
    }

    @GetMapping("/getManager")
    String getManager(@RequestParam("employee_id") int employee_id){
        System.out.println(employee_id);
        return assetService.getEmployeeDetails(employee_id).getReporting_manager();
    }

    @PostMapping("/signUp")
    ResponseEntity<?>signup(@RequestBody User user){
        log.info("user "+user.getEmployee_id()+" "+user.getPassword());
       /* UserDetails user1 =
            userDetailsService.loadUserByUsername(Integer.toString(user.getEmployee_id()));
        log.info("after loadUserName");
        if(user1!=null)
            return ResponseEntity.status(403).body("user already exist ");*/

       return ResponseEntity.status(201).body(userService.addUser(user));
    }
    @PostMapping("/checkUser")
    ResponseEntity<?>checkUserExistence(@RequestBody User user){
       if(userService.checkUser(user)!=null){
           return  ResponseEntity.status(200).body("user already exist ");
       }
       return ResponseEntity.status(201).body("user not  found");


    }




    @PostMapping("/signIn")
    public ResponseEntity<UserLoginResponse> authentication(@RequestBody User user){
        UserLoginResponse userLoginResponse=new UserLoginResponse();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmployee_id(), user.getPassword(), null));
            UserDetails user1 =
                    userDetailsService.loadUserByUsername(Integer.toString(user.getEmployee_id()));
            User userLogin =userService.getUser(user.getEmployee_id());

            ArrayList<Role>roles= new ArrayList<>(userLogin.getRoles());
            log.info(roles.toString());
            String role=roles.get(0).getName();
                userLoginResponse.setRole(role);
                userLoginResponse.setStatusCode(200);
                userLoginResponse.setToken(jwt.generateToken(user1));
                return ResponseEntity.ok(userLoginResponse);

        }
        catch(BadCredentialsException ex){
            userLoginResponse.setStatusCode(401);
           return ResponseEntity.status(401).body(userLoginResponse);
        }


    }


    @GetMapping("/getDevices/{employee_id}")
    List<String> getAllDeviceUniqueIdByEmployeeId(@PathVariable  int employee_id){
    return userService.getAllDeviceUniqueId(employee_id);

    }

    @GetMapping("/getAllEmployeeId")
    List<UserResponseData>getAllEmployeeId()
    {
        return userService.getAllEmployeeId();
    }




}
