package com.assetManagement.entity;


import javax.persistence.*;
import lombok.Data;

@Table(schema = "return")
@Entity
@Data
public class ReturnDevice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int return_id;

    @ManyToOne()
    @JoinColumn(name ="sender_employee_id",referencedColumnName = "employee_id")
    private User senderEmployeeId;

    @ManyToOne
    @JoinColumn(name="receiver_employee_id")
    private User receiverEmployeeId;


    private String partner;
    private String sample;
    private String device_unique_id;
    private String status;
    private String comment;

}
