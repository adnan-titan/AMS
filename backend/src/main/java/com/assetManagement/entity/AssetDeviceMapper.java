package com.assetManagement.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import lombok.Data;

import java.sql.Date;
import java.time.LocalDate;


@Table
@Entity
@Data

public class AssetDeviceMapper {
    @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int asset_device_id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
    @JoinColumn(name = "ad_id",referencedColumnName = "distribution_id")
    private AssetDistribution assetDistribution;
    private String device_unique_id;
    private String conditions;
    private String comments;
    private boolean is_returned;
    private LocalDate assignedDate;
    private LocalDate returnedDate;

   // private int assigned_employee_id;

    @ManyToOne
    @JoinColumn(name = "assigned_employee_id")
    private User assignedEmployeeId;

    private Boolean pending;
}
