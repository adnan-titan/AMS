package com.assetManagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@Table(schema = "asset_distribution")
@Entity
@Data
@ToString(exclude = "assetAcceptance")
public class AssetDistribution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int distribution_id;

    @ManyToOne
    @JoinColumn(name="distribution_employee_id",referencedColumnName = "employee_id")
    private User employee;

    @ManyToOne
    @JoinColumn(name="inventory_id",referencedColumnName = "inventory_id")
    private AssetInventory asset_inventory;

    private String asset_name;
    private String sample_type;
    private String partner;

    private int quantity;


    @OneToOne
    @JsonIgnore
    private AssetAcceptance assetAcceptance;

    private boolean acceptance;

    @Column(name = "ad_pending")
    private Boolean pending;

}
