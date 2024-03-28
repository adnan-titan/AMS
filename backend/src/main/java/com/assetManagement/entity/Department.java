package com.assetManagement.entity;


import javax.persistence.*;
import lombok.Data;

@Table(schema = "department")
@Entity
@Data
public class Department {
    @Id
    private int department_id;
    private String department_name;
}
