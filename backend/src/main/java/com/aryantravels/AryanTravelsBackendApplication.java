package com.aryantravels;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class AryanTravelsBackendApplication {

    public static void main(String[] args) {
        // System.out.println("Starting backend application")
        SpringApplication.run(AryanTravelsBackendApplication.class, args);
    }
}
