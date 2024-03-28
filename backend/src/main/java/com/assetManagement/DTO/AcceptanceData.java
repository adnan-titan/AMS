package com.assetManagement.DTO;

import com.assetManagement.entity.AssetAcceptance;
import com.assetManagement.entity.AssetDistribution;
import lombok.Data;


@Data
public class AcceptanceData {
    private int  distributionId;
    private int acceptanceId;
}
