package com.mobilestore.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Universal DataSource Configuration
 * Module: config/DataSourceConfig.java
 * 
 * Automatically detects and parses:
 * - Render / Supabase / Neon postgres:// URIs
 * - Standard JDBC PostgreSQL (jdbc:postgresql://...)
 * - Standard JDBC MySQL / TiDB (jdbc:mysql://...)
 * - Embedded H2 fallback (jdbc:h2:...)
 */
@Configuration
@Slf4j
public class DataSourceConfig {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username:}")
    private String dbUsername;

    @Value("${spring.datasource.password:}")
    private String dbPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        String rawUrl = dbUrl != null ? dbUrl.trim() : "";

        if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
            try {
                String parseable = rawUrl.replaceFirst("^postgres(ql)?://", "http://");
                URI uri = URI.create(parseable);

                String host = uri.getHost();
                int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                String path = uri.getPath() != null ? uri.getPath().replaceAll("^/", "") : "postgres";

                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + path;
                config.setJdbcUrl(jdbcUrl);
                config.setDriverClassName("org.postgresql.Driver");

                if (uri.getUserInfo() != null) {
                    String[] parts = uri.getUserInfo().split(":", 2);
                    config.setUsername(parts[0]);
                    if (parts.length > 1) {
                        config.setPassword(parts[1]);
                    }
                } else {
                    if (!dbUsername.isEmpty()) config.setUsername(dbUsername);
                    if (!dbPassword.isEmpty()) config.setPassword(dbPassword);
                }

                log.info("Auto-configured PostgreSQL DataSource for host: {}:{}", host, port);
            } catch (Exception e) {
                log.warn("Failed to parse PostgreSQL URI, falling back to standard parsing: {}", e.getMessage());
                config.setJdbcUrl(rawUrl);
                if (!dbUsername.isEmpty()) config.setUsername(dbUsername);
                if (!dbPassword.isEmpty()) config.setPassword(dbPassword);
            }
        } else if (rawUrl.startsWith("mysql://")) {
            try {
                String parseable = rawUrl.replaceFirst("^mysql://", "http://");
                URI uri = URI.create(parseable);

                String host = uri.getHost();
                int port = uri.getPort() != -1 ? uri.getPort() : 3306;
                String path = uri.getPath() != null ? uri.getPath().replaceAll("^/", "") : "mobile_store";

                String jdbcUrl = "jdbc:mysql://" + host + ":" + port + "/" + path + "?useSSL=true&allowPublicKeyRetrieval=true";
                config.setJdbcUrl(jdbcUrl);
                config.setDriverClassName("com.mysql.cj.jdbc.Driver");

                if (uri.getUserInfo() != null) {
                    String[] parts = uri.getUserInfo().split(":", 2);
                    config.setUsername(parts[0]);
                    if (parts.length > 1) {
                        config.setPassword(parts[1]);
                    }
                } else {
                    if (!dbUsername.isEmpty()) config.setUsername(dbUsername);
                    if (!dbPassword.isEmpty()) config.setPassword(dbPassword);
                }

                log.info("Auto-configured MySQL DataSource for host: {}:{}", host, port);
            } catch (Exception e) {
                config.setJdbcUrl(rawUrl);
                if (!dbUsername.isEmpty()) config.setUsername(dbUsername);
                if (!dbPassword.isEmpty()) config.setPassword(dbPassword);
            }
        } else {
            config.setJdbcUrl(rawUrl);
            if (!dbUsername.isEmpty()) config.setUsername(dbUsername);
            if (!dbPassword.isEmpty()) config.setPassword(dbPassword);

            if (rawUrl.contains("postgresql")) {
                config.setDriverClassName("org.postgresql.Driver");
            } else if (rawUrl.contains("mysql")) {
                config.setDriverClassName("com.mysql.cj.jdbc.Driver");
            } else if (rawUrl.contains("h2")) {
                config.setDriverClassName("org.h2.Driver");
            }
        }

        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(30000);
        config.setConnectionTimeout(30000);
        config.setMaxLifetime(1800000);

        return new HikariDataSource(config);
    }
}
