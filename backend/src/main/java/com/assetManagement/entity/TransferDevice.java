package com.assetManagement.entity;

import lombok.Data;

@Data
public class TransferDevice{
    private int current_user_employee_id;
    private int transfer_user_employee_id;
    private String device_unique_id;
}
