package com.assetManagement.entity;

import lombok.Data;

@Data
public
class DistributionDetail{
    private int asset_distribution_id;
    private int distribution_quantity;
    private int inventory_id;
    private int employee_id;
    private  String device_name;
    private String partner;
    private String sample_type;
    private String asset_name;
    private int asset_device_id;
    private String comment;
    private String device_unique_id;
    private int mapper_distribution_id;
    private String condition;
    private boolean isReturned;

    public boolean isReturned() {
        return isReturned;
    }

    public void setReturned(boolean returned) {
        isReturned = returned;
    }
}