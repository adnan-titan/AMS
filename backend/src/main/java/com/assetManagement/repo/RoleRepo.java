package com.assetManagement.repo;

import com.assetManagement.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface RoleRepo extends JpaRepository<Role,Integer> {

    @Query(value = "select id from role r where r.name =:name",nativeQuery = true)
    int  findRoleIdByRoleName(@Param("name") String name);

    @Query(value="select * from role r where r.id =:id",nativeQuery = true)
    Role getRoleById(@Param("id") int id);

    @Query(value="select roles_id from user_roles r where r.user_employee_id=:employeeId",nativeQuery = true)
    int getRoleIdByEmployeeId(@Param("employeeId") int employeeId);
}
