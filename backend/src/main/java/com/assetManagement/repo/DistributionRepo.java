package com.assetManagement.repo;

import com.assetManagement.entity.AssetDistribution;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
@Transactional
public interface DistributionRepo extends JpaRepository<AssetDistribution,Integer> {
    @Query(value = "select inventory_id from asset_distribution a where a.distribution_id = :distribution_id",nativeQuery = true)
    int getAssetDeviceMapper(@Param("distribution_id") int distribution_id);

    @Query(value ="select * from asset_distribution d where d.distribution_id = :distribution_id",nativeQuery = true)
    AssetDistribution getDistribution(@Param("distribution_id") int distribution_id);

    @Query(value="select * from asset_distribution where distribution_id=(SELECT LAST_INSERT_ID())",nativeQuery = true)
    AssetDistribution getLastDistributed();

    @Query(value="select * from asset_distribution ad where ad.distribution_employee_id=:employee_id order by inventory_id desc limit 1",nativeQuery = true)
    AssetDistribution getLastDistributedDeviceByEmployeeId(@Param("employee_id") int employee_id);


    @Query(value = "select ad.distribution_id from asset_distribution ad left join asset_device_mapper adm on adm.assigned_employee_id =ad.distribution_employee_id  and adm.ad_id is null where ad.distribution_employee_id = :employee_id and ad.inventory_id=:inventory_id order by ad.quantity desc limit 1",nativeQuery=true)
    int getMaxInventoryToBeAdded(@Param("employee_id") int employee_id ,@Param("inventory_id") int inventory_id);

}
