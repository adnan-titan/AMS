package com.assetManagement.entity;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;

import static javax.persistence.FetchType.EAGER;
import static javax.persistence.FetchType.LAZY;

@Table(schema = "user")
@Entity
@Data

@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @Column(name = "employee_id")
    private int employee_id;
    private String employee_name;
    private String email;

    @ManyToOne
    @JoinColumn(name = "department_id",referencedColumnName = "department_id")
    private Department department;

    private LocalDate doj;
    private String employee_type;
    private String reporting_manager;
    private String password;
    @ManyToMany(cascade = CascadeType.ALL,fetch = EAGER)
    Collection<Role> roles=new ArrayList<>();


}
