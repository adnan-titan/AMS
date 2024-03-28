package com.assetManagement.controller;


import com.assetManagement.DTO.AcceptanceData;
import com.assetManagement.DTO.DistributionData;
import com.assetManagement.entity.*;
import com.assetManagement.repo.AssetDeviceMapRepo;
import com.assetManagement.service.AssetService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/distribution")
@CrossOrigin(origins = "*")
public class DistributionController {

    @Autowired
    AssetService assetService;

    @Autowired
    AssetDeviceMapRepo assetDeviceMapRepo;

    @PostMapping("/assignAsset")
    int assignAsset(@RequestBody AssetDistribution assetDistribution){
        return assetService.assignAsset(assetDistribution);
    }
    @PostMapping("/distributeAsset")
    void distributeAsset(@RequestBody DistributionData distributionData){
         assetService.distributeAsset(distributionData);
    }

    @GetMapping("/getDistributionByEmployeeId/{employee_id}")
  List<DistributionDetail> getDistributionByEmployeeId(@PathVariable("employee_id") int employee_id){
        return assetService.assetDistributionDetailByEmployeeId(employee_id);

    }

    @GetMapping("/getPendingAcceptance/{employee_id}")
    List<AssetAcceptance>getPendingForAcceptanceData(@PathVariable("employee_id") int employee_id){
        return assetService.getPendingAcceptanceData(employee_id);
    }

    @PostMapping("/approvedAcceptance")
    void approvedAcceptance(@RequestBody AcceptanceData acceptanceData){
        assetService.approvedAcceptance(acceptanceData);
    }

    @GetMapping("/getWaitingForApproval/{employeeId}")
    List<AssetAcceptance>getWaitingApproval(@PathVariable("employeeId") int employeeId){
        return assetService.getWaitingForApprovalOfEmployee(employeeId);
    }








}





