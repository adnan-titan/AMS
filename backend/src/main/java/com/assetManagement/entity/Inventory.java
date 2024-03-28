package com.assetManagement.entity;


import javax.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Table(name = "inventory")
@Entity
@Data
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private int inventoryId;

    @Column(name = "asset_name")
    private String assetName;

    @Column(name = "quantity_available")
    private int quantityAvailable;

    @Column(name="partner")
    private String partner;

    @Column(name = "sample_type")
    private String sampleType;
    @ManyToOne
    @JoinColumn(name = "inventory_employee_id")
    private User user;
}
