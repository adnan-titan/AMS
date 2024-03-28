package com.assetManagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;


@Table(name = "asset_acceptance")
@Entity
@Data


public class AssetAcceptance {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "acceptance_id")
    private int acceptanceId;

    @ManyToOne
    @JoinColumn(name = "receiver_employee_id")
    private User receiverEmployeeId;

    @ManyToOne
    @JoinColumn(name = "sender_employee_id")
    private  User senderEmployeeId;



    @ManyToOne
    @JoinColumn(name = "distribution_id")
    private AssetDistribution assetDistribution;

    @ManyToOne
    @JoinColumn(name="sender_distribution_id")
    private AssetDistribution senderDistribution;

    @Column(name="is_accepted")
    private boolean isAccepted;
    private String acceptance_type;
    private Integer assetDeviceId;

}
