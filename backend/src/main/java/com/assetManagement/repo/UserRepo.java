package com.assetManagement.repo;

import com.assetManagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<User,Integer> {

    @Query(value = "select * from user u where u.employee_id =:employee_id",nativeQuery = true)
    User getUserByEmployeeId(@Param("employee_id") int employee_id);

    @Query(value="select employee_id, employee_name from user ",nativeQuery = true)
    List<?> getAllEmployeeId();
}
