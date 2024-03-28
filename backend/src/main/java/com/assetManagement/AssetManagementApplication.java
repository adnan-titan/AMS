package com.assetManagement;

import com.assetManagement.entity.User;
import com.assetManagement.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.SpringServletContainerInitializer;

import java.util.*;

@SpringBootApplication
public class AssetManagementApplication {

    public static void main(String[] args) {

        SpringApplication.run(AssetManagementApplication.class, args);
    }
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    /*@Bean
    CommandLineRunner run(UserService userService) {
        return args -> {
           // userService.addUser(new User(1774991, null, null, null, null, null, null,"adnan_123"));
          userService.addRoleToUser(1774991,"USER");
        };
    }*/







}

