package com.assetManagement.repo;

import com.assetManagement.entity.AssetDeviceMapper;
import javax.persistence.NamedQueries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetDeviceMapRepo extends JpaRepository<AssetDeviceMapper,Integer> {

    // here is_returned to be false;
    //add AND condition
    @Query(value = "select * from asset_device_mapper a where a.device_unique_id = :device_unique_id AND a.is_returned=0",nativeQuery = true)

    AssetDeviceMapper getAssetDeviceMapper(@Param("device_unique_id") String device_unique_id);

    @Query(value="select device_unique_id from asset_device_mapper a where a.employee_id =:employee_id AND a.is_returned=0",nativeQuery = true)
    List<String> getAllMacIdByEmployeeId(@Param("employee_id")int employee_id);


   @Query(value="SELECT *\n" +
           "FROM asset_distribution ad\n" +
           "left JOIN asset_device_mapper adm ON ad.distribution_id = adm.ad_id \n" +
           "WHERE  ad.distribution_employee_id = :employee_id and adm.ad_id IS NULL and ad.quantity <> 0 and and ad.acceptance=1 ",nativeQuery = true)

        List<?> getDistributionDetail(@Param("employee_id") int employee_id);

//   @Query(value="SELECT * FROM asset_distribution ad \n" +
//           "LEFT JOIN asset_device_mapper adm ON ad.distribution_id = adm.distribution_id where ad.employee_id=:employee_id and ad.quantity <> 0 and  ad.acceptance=1 and (adm.is_returned=0 or adm.distribution_id is null)  \n" +
//           "UNION \n" +
//           "SELECT * FROM asset_distribution ad\n" +
//           "RIGHT JOIN asset_device_mapper adm ON ad.distribution_id = adm.distribution_id where  adm.employee_id=:employee_id and adm.distribution_id IS NULL and adm.is_returned=0 ",nativeQuery = true)
 @Query(value="SELECT * FROM asset_distribution ad \n" +
         "           LEFT JOIN asset_device_mapper adm ON ad.distribution_id = adm.ad_id where ad.distribution_employee_id=:employee_id\n" +
         "           and ad.quantity <> 0 and ad.acceptance=1 and  (adm.pending=0 or adm.pending is null) and (adm.is_returned=0 or adm.ad_id is null) \n" +
         "           UNION \n" +
         "           SELECT * FROM asset_distribution ad\n" +
         "           RIGHT JOIN asset_device_mapper adm ON ad.distribution_id = adm.ad_id where  " +
         "adm.assigned_employee_id=:employee_id \n" +
         "           and adm.ad_id IS NULL and adm.is_returned=0",nativeQuery = true)
    List<?>getUserDistributionDetail(@Param("employee_id") int employee_id);

   @Query(value="select * from asset_device_mapper adm where adm.device_unique_id =:device_unique_id ",nativeQuery = true)
    List<AssetDeviceMapper>getHistoryOfDevice(@Param("device_unique_id") String device_unique_id);




}
