package com.assetManagement.service;

import com.assetManagement.DTO.AcceptanceData;
import com.assetManagement.DTO.DistributionData;
import com.assetManagement.entity.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
@Service
public interface AssetService {
    // for user
    void addEmployee(User user);
    void deleteUser(int employee_id);
    void updateUser(User user);

    User getEmployeeDetails(int employee_id);


    // for adding asset to inventory

    void addAssetToInventory(AssetInventory assetInventory);

    void updateAssetDetail(AssetInventory assetInventory);

    List<String>getPartners();


    //for distributing asset

    int assignAsset(AssetDistribution assetDistribution);

    void distributeAsset(DistributionData distributionData);

    void transferAsset(TransferDevice transferDevice);
    List<AssetInventory> getInventory(String partner);

    void assetDeviceMap(DeviceMap deviceMap);

    void returnDevice(ReturnDevice returnDevice);
    List<Integer>getInventoryId(String partner);
    int getAvailableQuantity(int inventory_id);
    List<AssetInventory>getAllInventory();
    List<DistributionDetail>assetDistributionDetailByEmployeeId(int employee_id);
    List<AssetDeviceMapper>getHistoryOfDevice(String device_unique_id);
    List<AssetAcceptance>getPendingAcceptanceData(int employee_id);
    void approvedAcceptance(AcceptanceData acceptanceData);

    List<AssetAcceptance>getWaitingForApprovalOfEmployee(int employeeId);


}
