package com.assetManagement.DTO;

import lombok.Data;

@Data
public class UserLoginResponse {
    String role;
    int statusCode;

    String token;
}
