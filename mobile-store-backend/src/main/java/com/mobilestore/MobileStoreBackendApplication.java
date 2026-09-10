package com.mobilestore;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.mobilestore")
@EnableJpaRepositories(basePackages = "com.mobilestore")
public class MobileStoreBackendApplication {

    public static void main(String[] args) {
        // Load .env variables into System properties before Spring initializes
        try {
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMissing()
                    .load();

            dotenv.entries().forEach(entry -> {
                if (System.getProperty(entry.getKey()) == null) {
                    System.setProperty(entry.getKey(), entry.getValue());
                }
            });
        } catch (Exception e) {
            System.out.println("Notice: No .env file loaded or dotenv-java initialized with system env.");
        }

        SpringApplication.run(MobileStoreBackendApplication.class, args);

        System.out.println("**************Application started Successfully**************");
    }
}
