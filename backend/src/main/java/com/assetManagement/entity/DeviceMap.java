package com.assetManagement.entity;

import lombok.Data;
import org.springframework.core.serializer.Serializer;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class DeviceMap{
    private AssetDistribution assetDistribution;;
    private List<String> device_unique_id;
}
