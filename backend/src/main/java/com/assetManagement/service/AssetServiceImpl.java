package com.assetManagement.service;


import com.assetManagement.DTO.AcceptanceData;
import com.assetManagement.DTO.DistributionData;
import com.assetManagement.entity.*;
import com.assetManagement.repo.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.transaction.Transactional;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.io.DataInput;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;


@Service
@Transactional
@Slf4j
public class AssetServiceImpl implements AssetService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    AssetInventoryRepo assetInventoryRepo;

    @Autowired
    DistributionRepo distributionRepo;
    @Autowired
    AssetDeviceMapRepo assetDeviceMapRepo;

    @Autowired
    ReturnDeviceRepo returnDeviceRepo;
    @Autowired
    AssetAcceptanceRepo assetAcceptanceRepo;

    @Override
    public void addEmployee(User user) {
        userRepo.save(user);
    }

    @Override
    public void deleteUser(int employee_id) {
        userRepo.deleteById(employee_id);
    }

    @Override
    public void updateUser(User user) {
        userRepo.save(user);
    }

    @Override
    public User getEmployeeDetails(int employee_id) {
        return userRepo.getUserByEmployeeId(employee_id);
    }

    @Override
    public void addAssetToInventory(AssetInventory assetInventory) {
        assetInventory.setAsset_name(assetInventory.getAsset_name().toUpperCase());
        assetInventory.setUpdated_date(LocalDate.now());
        assetInventory.setPartner(assetInventory.getPartner().toUpperCase());
        assetInventory.setQuantity_available(assetInventory.getQuantity_received());
        assetInventory.setSample_type(assetInventory.getSample_type().toUpperCase());

        User employee = userRepo.getUserByEmployeeId(assetInventory.getUser().getEmployee_id());
        assetInventory.setUser(employee);
        assetInventoryRepo.save(assetInventory);

        //AssetInventory userInventory=assetInventoryRepo.getLastAssetAddedByEmployee(employee.getEmployee_id());

        // for adding to distribution
        AssetDistribution assetDistribution = new AssetDistribution();
        assetDistribution.setAsset_inventory(assetInventory);
        assetDistribution.setEmployee(employee);
        assetDistribution.setQuantity(assetInventory.getQuantity_received());
        assetDistribution.setAsset_name(assetInventory.getAsset_name());
        assetDistribution.setPartner(assetInventory.getPartner());
        assetDistribution.setSample_type(assetInventory.getSample_type());

        distributionRepo.save(assetDistribution);
        //AssetDistribution assetDistribution1=distributionRepo.getLastDistributedDeviceByEmployeeId(employee.getEmployee_id());
        AssetAcceptance assetAcceptance = new AssetAcceptance();
        assetAcceptance.setAssetDistribution(assetDistribution);
        assetAcceptance.setReceiverEmployeeId(employee);
        assetAcceptance.setSenderEmployeeId(employee);
        assetAcceptance.setAccepted(true);

        assetAcceptanceRepo.save(assetAcceptance);
        //AssetAcceptance assetAcceptance1= assetAcceptanceRepo.getLastInventoryAddedByEmployee(employee.getEmployee_id());
        assetDistribution.setAcceptance(assetAcceptance.isAccepted());

        assetDistribution.setAssetAcceptance(assetAcceptance);
        distributionRepo.save(assetDistribution);

    }

    @Override
    public void updateAssetDetail(AssetInventory assetInventory) {
        assetInventoryRepo.save(assetInventory);
    }

    @Override
    public List<String> getPartners() {
        return assetInventoryRepo.getPartners();
    }


    @Override
    public int assignAsset(AssetDistribution assetDistribution) {
        AbstractMap<Integer, Integer> map = new HashMap<>();
        int inventory_id = assetDistribution.getAsset_inventory().getInventory_id();
        Optional<AssetInventory> assetInventory = assetInventoryRepo.findById(inventory_id);

        if (assetInventory.isPresent()) {
            int available_quantity = assetInventory.get().getQuantity_available();
            assetInventory.get().setQuantity_available(available_quantity - assetDistribution.getQuantity());

            assetDistribution.setAsset_inventory(assetInventory.get());
        }
        User employee = userRepo.getUserByEmployeeId(assetDistribution.getEmployee().getEmployee_id());
        assetDistribution.setEmployee(employee);
        distributionRepo.save(assetDistribution);
        return distributionRepo.getLastDistributed().getDistribution_id();

    }

    @Override
    public void distributeAsset(DistributionData distributionData) {
        // for decreasing the quantity from inventory
        AssetDistribution senderDistribution = distributionRepo.getDistribution(distributionData.getAsset_distribution_id());
        senderDistribution.setQuantity(senderDistribution.getQuantity() - distributionData.getDistribution_quantity());
        distributionRepo.save(senderDistribution);

        //decrease the quantity in inventory
        int inventoryId = distributionData.getInventory_id();
        AssetInventory assetInventory = assetInventoryRepo.findById(inventoryId).get();
        assetInventory.setQuantity_available(senderDistribution.getQuantity());
        assetInventoryRepo.save(assetInventory);

        // for adding to distribution for given employee
        AssetDistribution receiverDistribution = new AssetDistribution();
        receiverDistribution.setAsset_name(senderDistribution.getAsset_name());
        receiverDistribution.setQuantity(distributionData.getDistribution_quantity());
        receiverDistribution.setAsset_inventory(senderDistribution.getAsset_inventory());
        User receiverEmployee = userRepo.getUserByEmployeeId(distributionData.getEmployee_id());
        receiverDistribution.setEmployee(receiverEmployee);
        receiverDistribution.setPartner(senderDistribution.getPartner());
        receiverDistribution.setSample_type(senderDistribution.getSample_type());
        receiverDistribution.setAcceptance(false);
        receiverDistribution = distributionRepo.save(receiverDistribution);
        //log.info(String.valueOf(assetDistribution1.getDistribution_id()));


        // AssetDistribution recentlyAddedAssetDistribution=distributionRepo.getLastDistributedDeviceByEmployeeId(receiverEmployee.getEmployee_id());

        // log.info("recently added"+String.valueOf(recentlyAddedAssetDistribution.getDistribution_id()));

        AssetAcceptance assetAcceptance = new AssetAcceptance();
        assetAcceptance.setAssetDistribution(receiverDistribution);
        assetAcceptance.setReceiverEmployeeId(receiverEmployee);
        assetAcceptance.setSenderEmployeeId(senderDistribution.getEmployee());
        assetAcceptance.setAccepted(false);
        assetAcceptance.setAcceptance_type("distribution");

        assetAcceptance = assetAcceptanceRepo.save(assetAcceptance);


//        log.info("error down");
//        AssetAcceptance assetAcceptance1= assetAcceptanceRepo.getLastInventoryAddedByEmployee(receiverEmployee.getEmployee_id());
//         log.info("error up");
//        assetDistribution1.setAcceptance(assetAcceptance1.isAccepted());

        receiverDistribution.setAssetAcceptance(assetAcceptance);
        distributionRepo.save(receiverDistribution);

    }



 /*   // made this earlier ,changes done in the second one
  //  @Override
    public void transferAsset1(TransferDevice transferDevice) {

        User sender=userRepo.getUserByEmployeeId(transferDevice.getCurrent_user_employee_id());
        User receiver=userRepo.getUserByEmployeeId(transferDevice.getTransfer_user_employee_id());

        String deviceUniqueId=transferDevice.getDevice_unique_id();
        AssetDeviceMapper assetDeviceMapper=assetDeviceMapRepo.getAssetDeviceMapper(deviceUniqueId);
        assetDeviceMapper.set_returned(true);
        assetDeviceMapper.setReturnedDate(LocalDate.now());
        assetDeviceMapRepo.save(assetDeviceMapper);
        int distribution_id = assetDeviceMapper.getAssetDistribution().getDistribution_id();

        //in distribution table
        AssetDistribution assetDistribution=distributionRepo.getReferenceById(assetDeviceMapper.getAssetDistribution().getDistribution_id());
        assetDistribution.setQuantity(assetDistribution.getQuantity() - 1);

        distributionRepo.save(assetDistribution);


        AssetDistribution receiverDistribution=new AssetDistribution();
        receiverDistribution.setAcceptance(false);
        receiverDistribution.setAsset_name(assetDistribution.getAsset_name());
        AssetInventory assetInventory = assetInventoryRepo.getReferenceById(assetDistribution.getAsset_inventory().getInventory_id());
        receiverDistribution.setAsset_inventory(assetInventory);
        receiverDistribution.setPartner(assetDistribution.getPartner());
        receiverDistribution.setEmployee(receiver);
        receiverDistribution.setSample_type(assetDistribution.getSample_type());
        receiverDistribution.setQuantity(1);
        receiverDistribution=distributionRepo.save(receiverDistribution);

//        AssetDistribution lastDistributionByEmployee=distributionRepo.getLastDistributedDeviceByEmployeeId(receiver.getEmployee_id());
        //Adding distribution to asset acceptance
        AssetAcceptance assetAcceptance=new AssetAcceptance();
        assetAcceptance.setAssetDistribution(receiverDistribution);
        assetAcceptance.setSenderEmployeeId(sender);
        assetAcceptance.setReceiverEmployeeId(receiver);
        assetAcceptance.setAcceptance_type("transfer");
        assetAcceptance.setAccepted(false);

        assetAcceptance=assetAcceptanceRepo.save(assetAcceptance);

//        AssetAcceptance acceptance=assetAcceptanceRepo.getLastInventoryAddedByEmployee(sender.getEmployee_id());

        receiverDistribution.setAssetAcceptance(assetAcceptance);
        distributionRepo.save(receiverDistribution);

        // for mapping the device with new EmployeeId
        AssetDeviceMapper receiverDistributionMapper = new AssetDeviceMapper();

        receiverDistributionMapper.setAssetDistribution(receiverDistribution);
        receiverDistributionMapper.setDevice_unique_id(deviceUniqueId);
        receiverDistributionMapper.setConditions("GOOD");
        receiverDistributionMapper.setComments("Device transferred from " + transferDevice.getCurrent_user_employee_id());
        receiverDistributionMapper.setEmployee_id(receiver.getEmployee_id());
        receiverDistributionMapper.setAssignedEmployeeId(receiver);
        receiverDistributionMapper.setAssignedDate(LocalDate.now());
        receiverDistributionMapper.set_returned(false);

        assetDeviceMapRepo.save(receiverDistributionMapper);

    }*/

    @Override
    public void transferAsset(TransferDevice transferDevice) {
        User sender = userRepo.getUserByEmployeeId(transferDevice.getCurrent_user_employee_id());
        User receiver = userRepo.getUserByEmployeeId(transferDevice.getTransfer_user_employee_id());

        String deviceUniqueId = transferDevice.getDevice_unique_id();
        // to get data  from assigned user to set new user
        AssetDeviceMapper senderAssetDeviceMapper = assetDeviceMapRepo.getAssetDeviceMapper(deviceUniqueId);

        senderAssetDeviceMapper.setPending(true);
        assetDeviceMapRepo.save(senderAssetDeviceMapper);
        int senderDistributionId = senderAssetDeviceMapper.getAssetDistribution().getDistribution_id();
        AssetDistribution senderAssetDistribution = distributionRepo.findById(senderDistributionId).get();

        //setting for new User
        AssetDistribution receiverDistribution = new AssetDistribution();
        receiverDistribution.setAcceptance(false);
        receiverDistribution.setAsset_name(senderAssetDistribution.getAsset_name());

        int senderInventoryId = senderAssetDistribution.getAsset_inventory().getInventory_id();
        AssetInventory senderInventoryDetail = assetInventoryRepo.findById(senderInventoryId).get();
        receiverDistribution.setAsset_inventory(senderInventoryDetail);
        receiverDistribution.setPartner(senderInventoryDetail.getPartner());
        receiverDistribution.setEmployee(receiver);
        receiverDistribution.setSample_type(senderInventoryDetail.getSample_type());
        receiverDistribution.setQuantity(1);
        receiverDistribution = distributionRepo.save(receiverDistribution);

        AssetAcceptance assetAcceptance = new AssetAcceptance();
        assetAcceptance.setAssetDistribution(receiverDistribution);
        assetAcceptance.setSenderEmployeeId(sender);
        assetAcceptance.setReceiverEmployeeId(receiver);
        assetAcceptance.setAcceptance_type("transfer");
        assetAcceptance.setAccepted(false);
        log.info("line 281 " + String.valueOf(senderAssetDeviceMapper.getAsset_device_id()));
        assetAcceptance.setAssetDeviceId(senderAssetDeviceMapper.getAsset_device_id());
        assetAcceptance.setSenderDistribution(senderAssetDistribution);
        assetAcceptance = assetAcceptanceRepo.save(assetAcceptance);


        receiverDistribution.setAssetAcceptance(assetAcceptance);
        distributionRepo.save(receiverDistribution);


        AssetDeviceMapper receiverDistributionMapper = new AssetDeviceMapper();

        receiverDistributionMapper.setAssetDistribution(receiverDistribution);
        receiverDistributionMapper.setDevice_unique_id(deviceUniqueId);
        receiverDistributionMapper.setConditions("GOOD");
        receiverDistributionMapper.setComments("Device transferred from " + transferDevice.getCurrent_user_employee_id());
        receiverDistributionMapper.setAssignedEmployeeId(userRepo.getUserByEmployeeId(receiver.getEmployee_id()));
        receiverDistributionMapper.setAssignedEmployeeId(receiver);
        receiverDistributionMapper.setAssignedDate(LocalDate.now());
        receiverDistributionMapper.set_returned(false);

        assetDeviceMapRepo.save(receiverDistributionMapper);

    }

    @Override
    public void returnDevice(ReturnDevice returnDevice) {
        User sender = userRepo.getUserByEmployeeId(returnDevice.getSenderEmployeeId().getEmployee_id());
        User receiver = userRepo.getUserByEmployeeId(returnDevice.getReceiverEmployeeId().getEmployee_id());
        returnDeviceRepo.save(returnDevice);

        /*String deviceUniqueId=returnDevice.getDevice_unique_id();
        AssetDeviceMapper assetDeviceMapper=assetDeviceMapRepo.getAssetDeviceMapper(deviceUniqueId);
        assetDeviceMapper.set_returned(true);
        assetDeviceMapper.setReturnedDate(LocalDate.now());
        assetDeviceMapRepo.save(assetDeviceMapper);
        int distribution_id = assetDeviceMapper.getAssetDistribution().getDistribution_id();

        //in distribution table
        AssetDistribution assetDistribution=distributionRepo.getReferenceById(assetDeviceMapper.getAssetDistribution().getDistribution_id());
        assetDistribution.setQuantity(assetDistribution.getQuantity() - 1);

        distributionRepo.save(assetDistribution);*/

        String deviceUniqueId = returnDevice.getDevice_unique_id();
        AssetDeviceMapper senderAssetDeviceMapper = assetDeviceMapRepo.getAssetDeviceMapper(deviceUniqueId);
        senderAssetDeviceMapper.setPending(true);
        assetDeviceMapRepo.save(senderAssetDeviceMapper);
        int senderDistributionId = senderAssetDeviceMapper.getAssetDistribution().getDistribution_id();
        AssetDistribution senderAssetDistribution = distributionRepo.findById(senderDistributionId).get();

        AssetDistribution receiverDistribution = new AssetDistribution();
        receiverDistribution.setAcceptance(false);
        receiverDistribution.setAsset_name(senderAssetDistribution.getAsset_name());
        AssetInventory assetInventory = assetInventoryRepo.findById(senderAssetDistribution.getAsset_inventory().getInventory_id()).get();
        receiverDistribution.setAsset_inventory(assetInventory);
        receiverDistribution.setPartner(senderAssetDistribution.getPartner());

        receiverDistribution.setEmployee(receiver);
        receiverDistribution.setSample_type(senderAssetDistribution.getSample_type());


        if (returnDevice.getStatus().equals("GOOD")) {
            receiverDistribution.setQuantity(1);
        } else {
            receiverDistribution.setQuantity(0);
        }
        receiverDistribution = distributionRepo.save(receiverDistribution);

        //  AssetDistribution lastDistributionByEmployee=distributionRepo.getLastDistributedDeviceByEmployeeId(receiver.getEmployee_id());
        //Adding distribution to asset acceptance
        AssetAcceptance assetAcceptance = new AssetAcceptance();
        assetAcceptance.setAssetDistribution(receiverDistribution);
        assetAcceptance.setSenderEmployeeId(sender);
        assetAcceptance.setReceiverEmployeeId(receiver);
        assetAcceptance.setAcceptance_type("return");
        assetAcceptance.setAccepted(false);
        assetAcceptanceRepo.save(assetAcceptance);

    }

    @Override
    public List<AssetInventory> getInventory(String partner) {


        return assetInventoryRepo.getInventory(partner);
    }

    @Override
    public void assetDeviceMap(DeviceMap deviceMap) {
        int distribution_id = deviceMap.getAssetDistribution().getDistribution_id();
        AssetDistribution assetDistribution = distributionRepo.getDistribution(distribution_id);

        int employee_id = assetDistribution.getEmployee().getEmployee_id();
        List<String> deviceNumberList = deviceMap.getDevice_unique_id();
        User assignedEmployee = userRepo.getUserByEmployeeId(employee_id);

        for (String deviceNumber : deviceNumberList) {
            AssetDeviceMapper assetDeviceMapper = new AssetDeviceMapper();
            assetDeviceMapper.setAssetDistribution(assetDistribution);
            assetDeviceMapper.setAssignedDate(LocalDate.now());
            assetDeviceMapper.setDevice_unique_id(deviceNumber);
            assetDeviceMapper.setAssignedEmployeeId(assignedEmployee);
            assetDeviceMapper.set_returned(false);
            assetDeviceMapper.setConditions("GOOD");
            assetDeviceMapRepo.save(assetDeviceMapper);
        }
    }


    @Override
    public List<Integer> getInventoryId(String partner) {
        return assetInventoryRepo.getInventoryId(partner);
    }

    @Override
    public int getAvailableQuantity(int inventory_id) {
        return assetInventoryRepo.getAvailableQuantity(inventory_id);
    }

    @Override
    public List<AssetInventory> getAllInventory() {
        return assetInventoryRepo.findAll();
    }

    @Override
    public List<DistributionDetail> assetDistributionDetailByEmployeeId(int employee_id) {
        List<?> distributionDetailList1 = assetDeviceMapRepo.getUserDistributionDetail(employee_id);
        List<DistributionDetail> distributionDetailListResponse = new ArrayList<>();
        Object[] info;
        for (Object dsl : distributionDetailList1) {
            info = (Object[]) dsl;
            DistributionDetail distributionDetail = new DistributionDetail();
            if (info[0] != null) {
                distributionDetail.setAsset_distribution_id(Integer.parseInt(info[0].toString()));
            }
            if (info[2] != null) {
                distributionDetail.setDevice_name(info[2].toString());
                distributionDetail.setAsset_name(info[2].toString());
            }
            if (info[3] != null) {
                distributionDetail.setPartner(info[3].toString());
            }
            if (info[4] != null) {
                distributionDetail.setDistribution_quantity(Integer.parseInt(info[4].toString()));
            }

            if (info[5] != null) {
                distributionDetail.setSample_type(info[5].toString());
            }

            if (info[7] != null) {
                distributionDetail.setInventory_id(Integer.parseInt(info[7].toString()));
            }
            if (info[8] != null) {
                distributionDetail.setEmployee_id(Integer.parseInt(info[8].toString()));
            }

            if (info[10] != null) {
                distributionDetail.setAsset_device_id(Integer.parseInt(info[10].toString()));
                distributionDetail.setMapper_distribution_id(Integer.parseInt(info[10].toString()));
            }
            if (info[12] != null) {
                distributionDetail.setComment(info[12].toString());
            }
            if (info[13] != null) {
                distributionDetail.setCondition(info[13].toString());
            }
            if (info[14] != null) {
                distributionDetail.setDevice_unique_id(info[14].toString());
            }
            if (info[15] != null) {
                distributionDetail.setReturned(Boolean.parseBoolean(info[15].toString()));
            }
            distributionDetailListResponse.add(distributionDetail);
        }
        return distributionDetailListResponse;

    }

    @Override
    public List<AssetDeviceMapper> getHistoryOfDevice(String device_unique_id) {
        return assetDeviceMapRepo.getHistoryOfDevice(device_unique_id);
    }

    @Override
    public List<AssetAcceptance> getPendingAcceptanceData(int employee_id) {
        return assetAcceptanceRepo.getPendingAcceptanceByEmployeeId(employee_id);
    }

    @Override
    public void approvedAcceptance(AcceptanceData acceptanceData) {
        AssetDistribution receiverAssetDistribution = distributionRepo.getDistribution(acceptanceData.getDistributionId());
        AssetAcceptance acceptance = assetAcceptanceRepo.getAcceptance(acceptanceData.getAcceptanceId());

        //for sender
        Integer senderAssetDeviceId = acceptance.getAssetDeviceId();
        AssetDeviceMapper senderAssetDeviceMapper;
        if (senderAssetDeviceId != null) {
            senderAssetDeviceMapper = assetDeviceMapRepo.findById(senderAssetDeviceId).get();
            senderAssetDeviceMapper.set_returned(true);
            senderAssetDeviceMapper.setPending(false);
            senderAssetDeviceMapper.setReturnedDate(LocalDate.now());
            senderAssetDeviceMapper = assetDeviceMapRepo.save(senderAssetDeviceMapper);
            AssetDistribution senderDistribution = senderAssetDeviceMapper.getAssetDistribution();
            senderDistribution.setQuantity(senderDistribution.getQuantity() - 1);
            distributionRepo.save(senderDistribution);
        }


        // for receiver
//        AssetDeviceMapper senderAssetDeviceMapper=assetDeviceMapRepo.getReferenceById()
        acceptance.setAccepted(true);
        assetAcceptanceRepo.save(acceptance);
        receiverAssetDistribution.setAssetAcceptance(acceptance);
        receiverAssetDistribution.setAcceptance(true);

        if (acceptance.getAcceptance_type() == null || acceptance.getAcceptance_type().equals("distribution")) {
            distributionRepo.save(receiverAssetDistribution);

        }


//        else if(acceptance.getAcceptance_type().equals("return")){
        else {
            if (receiverAssetDistribution.getQuantity() == 1) {
                int employeeId = receiverAssetDistribution.getEmployee().getEmployee_id();
                int inventory_id = receiverAssetDistribution.getAsset_inventory().getInventory_id();
                int distribution_id = distributionRepo.getMaxInventoryToBeAdded(employeeId, inventory_id);
                AssetDistribution assetDistribution1 = distributionRepo.getDistribution(distribution_id);
                assetDistribution1.setQuantity(assetDistribution1.getQuantity() + 1);
                AssetInventory assetInventory = assetInventoryRepo.findById(inventory_id).get();
                assetInventory.setQuantity_available(assetInventory.getQuantity_available() + 1);
                assetInventoryRepo.save(assetInventory);
                distributionRepo.save(assetDistribution1);
            }
        }

    }

    @Override
    public List<AssetAcceptance> getWaitingForApprovalOfEmployee(int employeeId) {
        return assetAcceptanceRepo.getWaitingForApprovalOfEmployeeId(employeeId);
    }
}
