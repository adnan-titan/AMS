package com.assetManagement.repo;

import com.assetManagement.entity.AssetDistribution;
import com.assetManagement.entity.AssetInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetInventoryRepo extends JpaRepository<AssetInventory,Integer> {

    @Query(value ="select * from asset_inventory a where a.partner=:partner",nativeQuery = true )
    List<AssetInventory> getInventory(@Param("partner") String partner);

    @Query(value = "select distinct partner from asset_inventory",nativeQuery = true)
    List<String>getPartners();

    @Query(value = "select inventory_id from asset_inventory a where a.partner=:partner",nativeQuery = true)
    List<Integer>getInventoryId(@Param("partner") String partner);

    @Query(value = "select quantity_available from asset_inventory a where a.inventory_id=:inventory_id",nativeQuery = true)
     int getAvailableQuantity(@Param("inventory_id") int inventory_id);


    @Query(value="SELECT asset_name from asset_inventory where inventory_id = :inventory_id",nativeQuery = true)
    String getAssetNameByInventoryId(@Param("inventory_id") int inventory_id);


    @Query(value="select * from asset_inventory where employee_id=:employee_id order by inventory_id desc limit 1",nativeQuery = true)
    AssetInventory getLastAssetAddedByEmployee(@Param("employee_id") int employee_id);
}
