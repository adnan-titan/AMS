package com.assetManagement.service;

import com.assetManagement.DTO.UserResponseData;
import com.assetManagement.entity.User;

import java.util.List;

public interface UserService {
    void addEmployee(User user);
    void deleteUser(int employee_id);
    void updateUser(User user);

    User getEmployeeDetails(int employee_id);

    User addUser(User user);
    User checkUser(User user);
   void  addRoleToUser(int userName, String roleName);
    List<String> getAllDeviceUniqueId(int employee_id);
    User getUser(int employee_id);

    List<UserResponseData>getAllEmployeeId();

}
