package com.logfit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class LogfitApplication {
    public static void main(String[] args) {
        SpringApplication.run(LogfitApplication.class, args);
    }
}
