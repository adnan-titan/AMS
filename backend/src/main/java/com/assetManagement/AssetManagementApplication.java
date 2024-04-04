package com.assetManagement;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication()
public class AssetManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(AssetManagementApplication.class, args);
    }
   /* @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }*/

    /*@Bean
    CommandLineRunner run(UserService userService) {
        return args -> {
           // userService.addUser(new User(1774991, null, null, null, null, null, null,"adnan_123"));
          userService.addRoleToUser(1774991,"USER");
        };
    }*/







}

