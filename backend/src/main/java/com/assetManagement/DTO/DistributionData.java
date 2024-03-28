package com.assetManagement.DTO;

import lombok.Data;

@Data
public class DistributionData{
    private int asset_distribution_id;
    private int inventory_id;
    private int employee_id;
    private int distribution_quantity;
}
