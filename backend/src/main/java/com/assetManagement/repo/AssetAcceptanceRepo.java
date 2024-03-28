package com.assetManagement.repo;

import com.assetManagement.entity.AssetAcceptance;
import com.assetManagement.entity.AssetDistribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetAcceptanceRepo extends JpaRepository<AssetAcceptance,Integer> {
    @Query(value="select * from asset_acceptance ac where ac.receiver_employee_id=:employee_id order by acceptance_id desc limit 1",nativeQuery = true)
   AssetAcceptance getLastInventoryAddedByEmployee(@Param("employee_id") int employee_id);

    @Query(value="select * from asset_acceptance where receiver_employee_id =:employee_id and is_accepted=0",nativeQuery = true)
    List<AssetAcceptance> getPendingAcceptanceByEmployeeId(@Param("employee_id") int employee_id);


    @Query(value = "select * from asset_acceptance where acceptance_id=:acceptanceId",nativeQuery = true)
    AssetAcceptance getAcceptance(@Param("acceptanceId") int acceptanceId);

    @Query(value="select * from asset_acceptance where sender_employee_id =:employee_id and is_accepted=0",nativeQuery = true)
    List<AssetAcceptance>getWaitingForApprovalOfEmployeeId(@Param("employee_id") int employee_id);


}
