package com.assetManagement.entity;



import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;

@Table(schema = "asset_inventory")
@Entity
@Data
public class AssetInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int inventory_id;
    private String asset_name;
    private int quantity_received;
    private int quantity_available;
    private LocalDate received_date;
    private LocalDate updated_date;
    private String partner;
    private String courier_service;
    private String sample_type;
    private String details;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private User user;
}
