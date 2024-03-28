package com.assetManagement.controller;

import com.assetManagement.entity.*;
import com.assetManagement.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/asset")
@CrossOrigin(origins = "*")
public class AssetController {

    @Autowired
    AssetService assetService;

    //axios.post(url,adnan)->
    @PostMapping("/addAsset")
    void addAssetInInventory(@RequestBody AssetInventory assetInventory) {
        assetService.addAssetToInventory(assetInventory);

    }

    @PutMapping("/updateAsset")
    void updateAsset(@RequestBody AssetInventory assetInventory) {
        assetService.addAssetToInventory(assetInventory);
    }





    //get inventory by partner name
    @GetMapping
    List<AssetInventory> listOfInventoryByPartner(@RequestParam String partner) {

        return assetService.getInventory(partner);
    }

    @PostMapping("/assetDeviceMapping")
    void assetDeviceMap(@RequestBody DeviceMap deviceMap) {
        assetService.assetDeviceMap(deviceMap);
    }

    @PostMapping("/returnAsset")
    void returnAsset(@RequestBody ReturnDevice returnDevice){
        assetService.returnDevice(returnDevice);
    }
    @PostMapping("/transferAsset")
    void reAssignAsset(@RequestBody TransferDevice transferDevice){
        assetService.transferAsset(transferDevice);
    }

    @GetMapping("/getPartner")
    List<String>getPartner(){
        return assetService.getPartners();
        
    }


    @GetMapping("/getInventory")
    List<Integer>getInventory(@RequestParam("partner") String partner){
        return assetService.getInventoryId(partner);
    }

    @GetMapping("/getAvailableQuantity")
    int getAvailableQuantity(@RequestParam("inventory_id")int inventory_id){
        return assetService.getAvailableQuantity(inventory_id);
    }

    @GetMapping("/getAllInventory")
    List<AssetInventory>getAllInventory(){
        return assetService.getAllInventory();
    }


    @GetMapping("/getDeviceHistory/{device_unique_id}")
    List<AssetDeviceMapper>getDeviceHistory(@PathVariable("device_unique_id")String device_unique_id){
        return assetService.getHistoryOfDevice(device_unique_id);
    }











}
