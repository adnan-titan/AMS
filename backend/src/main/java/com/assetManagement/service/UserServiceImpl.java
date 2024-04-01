package com.assetManagement.service;

import com.assetManagement.DTO.UserResponseData;
import com.assetManagement.entity.Role;
import com.assetManagement.entity.User;
import com.assetManagement.repo.AssetDeviceMapRepo;
import com.assetManagement.repo.RoleRepo;
import com.assetManagement.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepo userRepo;
    /*@Autowired
    PasswordEncoder passwordEncoder;*/

    private  final PasswordEncoder passwordEncoder;

    private final RoleRepo roleRepo;


    private final AssetDeviceMapRepo assetDeviceMapRepo;

    public UserServiceImpl(@Lazy UserRepo userRepo, @Lazy PasswordEncoder passwordEncoder, RoleRepo roleRepo, AssetDeviceMapRepo assetDeviceMapRepo) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.roleRepo = roleRepo;
        this.assetDeviceMapRepo = assetDeviceMapRepo;
    }



    @Override
    public void addEmployee(User user) {

    }

    @Override
    public void deleteUser(int employee_id) {

    }

    @Override
    public void updateUser(User user) {

    }

    @Override
    public User getEmployeeDetails(int employee_id) {
        return null;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        int employeeId=Integer.parseInt(username);
        log.info(username);

        User user = userRepo.getUserByEmployeeId(employeeId);
        if (user == null) {
            log.error("user not found in data base");
            throw new UsernameNotFoundException("user not found in data base");
        } else {
            log.info("user found in data base : {}", username);
        }
       Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        user.getRoles().forEach(role ->
                authorities.add(new SimpleGrantedAuthority(role.getName()))
        );
        return new org.springframework.security.core.userdetails.User(username, user.getPassword(),authorities);
    }

    @Override
    public User addUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
      ArrayList<Role>user_role= (ArrayList<Role>) user.getRoles();
      int  roleId=roleRepo.findRoleIdByRoleName(user_role.get(0).getName());
       Role role=roleRepo.getRoleById(roleId);
       Collection<Role> roles=new ArrayList<>();
       roles.add(role);
       user.setRoles(roles);
        return userRepo.save(user);
    }

    @Override
    public User checkUser(User user) {
        return userRepo.getUserByEmployeeId(user.getEmployee_id());
    }

    @Override
    public void addRoleToUser(int userName, String roleName) {
        User user = userRepo.getUserByEmployeeId(userName);

      //  List<Role> roles = roleRepo.findRoleByRoleName(roleName);
        // log.info("adding role {} to user");
       // user.getRoles().addAll(roles);
    }

    @Override
    public List<String> getAllDeviceUniqueId(int employee_id) {
        return assetDeviceMapRepo.getAllMacIdByEmployeeId(employee_id);
    }

    @Override
    public User getUser(int employee_id) {
        return userRepo.getUserByEmployeeId(employee_id);
    }

    @Override
    public List<UserResponseData> getAllEmployeeId() {
        List<?>employeeList=userRepo.getAllEmployeeId();
        List<UserResponseData>userResponseDataList=new ArrayList<>();
        Object[]response;

       for(Object employee:employeeList){
           response=(Object[])employee;
           UserResponseData userResponseData=new UserResponseData();
           userResponseData.setEmployee_id(Integer.parseInt(response[0].toString()));
           userResponseData.setEmployee_name(response[1].toString());
           int roleId=roleRepo.getRoleIdByEmployeeId(userResponseData.getEmployee_id());
           String roleName=roleId==2?"ADMIN":"USER";
           userResponseData.setRole(roleName);
           userResponseDataList.add(userResponseData);
       }
       return userResponseDataList;
    }

}



