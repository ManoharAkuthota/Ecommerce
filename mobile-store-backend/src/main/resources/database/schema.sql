-- ==============================================================================
-- AntiGravity Mobile Store — Production MySQL Database Schema (UUID Primary Keys)
-- Charset: UTF8MB4 (Full Unicode Support including Emojis)
-- Collation: utf8mb4_unicode_ci (Accurate multilingual sorting & comparisons)
-- ==============================================================================

-- 1. Database Initialization
CREATE DATABASE IF NOT EXISTS `mobile_store`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `mobile_store`;

-- Drop existing tables in reverse dependency order to ensure clean UUID migration
DROP TABLE IF EXISTS `mobile_images`;
DROP TABLE IF EXISTS `mobiles`;
DROP TABLE IF EXISTS `admins`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `users`;

-- ------------------------------------------------------------------------------
-- Table 1: admins
-- Purpose: Store administrative accounts with BCrypt-hashed credentials and UUID PK
-- ------------------------------------------------------------------------------
CREATE TABLE `admins` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `chk_admins_email_not_empty` CHECK (CHAR_LENGTH(TRIM(`email`)) > 0),
    CONSTRAINT `chk_admins_name_not_empty` CHECK (CHAR_LENGTH(TRIM(`name`)) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 2: mobiles
-- Purpose: Store smartphone catalog specifications, pricing, and stock status with UUID PK
-- ------------------------------------------------------------------------------
CREATE TABLE `mobiles` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `brand` VARCHAR(50) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `ram` VARCHAR(20) NOT NULL,
    `storage` VARCHAR(20) NOT NULL,
    `processor` VARCHAR(100) NOT NULL,
    `display` VARCHAR(150) NOT NULL,
    `battery` VARCHAR(100) NOT NULL,
    `stock_status` VARCHAR(30) NOT NULL DEFAULT 'IN_STOCK',
    `hidden` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `chk_mobiles_price_positive` CHECK (`price` >= 0.00),
    CONSTRAINT `chk_mobiles_brand_not_empty` CHECK (CHAR_LENGTH(TRIM(`brand`)) > 0),
    CONSTRAINT `chk_mobiles_name_not_empty` CHECK (CHAR_LENGTH(TRIM(`name`)) > 0),
    CONSTRAINT `chk_mobiles_stock_status` CHECK (`stock_status` IN ('IN_STOCK', 'LIMITED_STOCK', 'OUT_OF_STOCK', 'In Stock', 'Limited Stock', 'Out of Stock'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 3: mobile_images
-- Purpose: Store Cloudinary image URLs for each mobile (1 to 5 images per phone)
-- Relationship: One Mobile -> Many MobileImages (Foreign Key on UUID with Cascade Delete)
-- ------------------------------------------------------------------------------
CREATE TABLE `mobile_images` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `mobile_id` VARCHAR(36) NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `image_order` INT NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_mobile_images_mobile`
        FOREIGN KEY (`mobile_id`) REFERENCES `mobiles` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `chk_mobile_images_order_range` CHECK (`image_order` BETWEEN 1 AND 5),
    CONSTRAINT `chk_mobile_images_url_not_empty` CHECK (CHAR_LENGTH(TRIM(`image_url`)) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 4: reviews
-- Purpose: Store authentic customer product reviews and star ratings (1 to 5) with UUID PK
-- ------------------------------------------------------------------------------
CREATE TABLE `reviews` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `customer_name` VARCHAR(100) NOT NULL,
    `customer_image` VARCHAR(500) DEFAULT NULL,
    `purchased_phone` VARCHAR(150) DEFAULT NULL,
    `rating` INT NOT NULL,
    `review_text` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `chk_reviews_rating_range` CHECK (`rating` BETWEEN 1 AND 5),
    CONSTRAINT `chk_reviews_customer_name_not_empty` CHECK (CHAR_LENGTH(TRIM(`customer_name`)) > 0),
    CONSTRAINT `chk_reviews_text_not_empty` CHECK (CHAR_LENGTH(TRIM(`review_text`)) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 5: contact_messages
-- Purpose: Store customer concierge inquiries and support contact submissions with UUID PK
-- ------------------------------------------------------------------------------
CREATE TABLE `contact_messages` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(30) DEFAULT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `chk_contact_name_not_empty` CHECK (CHAR_LENGTH(TRIM(`name`)) > 0),
    CONSTRAINT `chk_contact_email_not_empty` CHECK (CHAR_LENGTH(TRIM(`email`)) > 0),
    CONSTRAINT `chk_contact_message_not_empty` CHECK (CHAR_LENGTH(TRIM(`message`)) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 6: users
-- Purpose: Store customer accounts with UUID PK, profile information, and BCrypt credentials
-- ------------------------------------------------------------------------------
CREATE TABLE `users` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(30) NOT NULL,
    `profile_image` VARCHAR(500) DEFAULT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    `enabled` BOOLEAN NOT NULL DEFAULT TRUE,
    `email_verified` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `chk_users_email_not_empty` CHECK (CHAR_LENGTH(TRIM(`email`)) > 0),
    CONSTRAINT `chk_users_full_name_not_empty` CHECK (CHAR_LENGTH(TRIM(`full_name`)) > 0),
    CONSTRAINT `chk_users_phone_not_empty` CHECK (CHAR_LENGTH(TRIM(`phone_number`)) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE SEARCH, FILTERING, AND SORTING
-- ==============================================================================

-- 1. Mobiles Indexes
CREATE INDEX `idx_mobiles_brand` ON `mobiles` (`brand`);
CREATE INDEX `idx_mobiles_name` ON `mobiles` (`name`);
CREATE INDEX `idx_mobiles_price` ON `mobiles` (`price`);
CREATE INDEX `idx_mobiles_ram` ON `mobiles` (`ram`);
CREATE INDEX `idx_mobiles_storage` ON `mobiles` (`storage`);
CREATE INDEX `idx_mobiles_stock_status` ON `mobiles` (`stock_status`);
CREATE INDEX `idx_mobiles_hidden` ON `mobiles` (`hidden`);
CREATE INDEX `idx_mobiles_created_at` ON `mobiles` (`created_at` DESC);

-- 2. Mobile Images Indexes
CREATE INDEX `idx_mobile_images_mobile_id` ON `mobile_images` (`mobile_id`);
CREATE INDEX `idx_mobile_images_order` ON `mobile_images` (`mobile_id`, `image_order`);

-- 3. Reviews Indexes
CREATE INDEX `idx_reviews_created_at` ON `reviews` (`created_at` DESC);
CREATE INDEX `idx_reviews_rating` ON `reviews` (`rating`);

-- 4. Contact Messages Indexes
CREATE INDEX `idx_contact_messages_email` ON `contact_messages` (`email`);
CREATE INDEX `idx_contact_messages_created_at` ON `contact_messages` (`created_at` DESC);

-- 5. Users Indexes
CREATE INDEX `idx_users_email` ON `users` (`email`);
CREATE INDEX `idx_users_role` ON `users` (`role`);
CREATE INDEX `idx_users_created_at` ON `users` (`created_at` DESC);

