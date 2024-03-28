package com.assetManagement.entity;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import static javax.persistence.GenerationType.AUTO;
import static javax.persistence.GenerationType.IDENTITY;

@Entity
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class Role {
        @Id
        @GeneratedValue(strategy =AUTO)
        int id;
        String name;



}
