package com.assetManagement.repo;

import com.assetManagement.entity.ReturnDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReturnDeviceRepo extends JpaRepository<ReturnDevice,Integer> {
}
