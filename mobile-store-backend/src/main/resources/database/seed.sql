-- ==============================================================================
-- AntiGravity Mobile Store — Seed Data Script (UUID Primary Keys)
-- Purpose: Initial production seed data for development, staging, and demo environments
-- ==============================================================================

USE `mobile_store`;

-- ------------------------------------------------------------------------------
-- 1. Default Admin Account
-- Email: admin@antigravity.com
-- Password: BCrypt hash of 'admin123' (Cost factor: 10)
-- Hash: $2a$10$OVyzRZYjiTkubTorTUbde.lOP9Uf1k7CFjlqi6Ht2QGHFvBT.JN..
-- ------------------------------------------------------------------------------
INSERT INTO `admins` (`id`, `name`, `email`, `password`)
VALUES
    ('e1a11111-1111-1111-1111-111111111111', 'Super Admin', 'admin@antigravity.com', '$2a$10$OVyzRZYjiTkubTorTUbde.lOP9Uf1k7CFjlqi6Ht2QGHFvBT.JN..')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `password` = VALUES(`password`);

-- ------------------------------------------------------------------------------
-- 1.1 Default Customer Account
-- Email: user@antigravity.com
-- Password: BCrypt hash of 'user123' (Cost factor: 10)
-- Hash: $2a$10$gCP.ntrAHa1eu03rYXeHe.gkxhbXtqi4I4F22CeKDHUF.SDifHULG
-- ------------------------------------------------------------------------------
INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `phone_number`, `role`, `enabled`, `email_verified`)
VALUES
    ('f1a11111-1111-1111-1111-111111111111', 'Customer User', 'user@antigravity.com', '$2a$10$gCP.ntrAHa1eu03rYXeHe.gkxhbXtqi4I4F22CeKDHUF.SDifHULG', '+91 98765 43210', 'ROLE_USER', TRUE, TRUE)
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`), `password` = VALUES(`password`);

-- ------------------------------------------------------------------------------
-- 2. Flagship Smartphones Seed Data
-- ------------------------------------------------------------------------------
INSERT INTO `mobiles` (`id`, `brand`, `name`, `price`, `ram`, `storage`, `processor`, `display`, `battery`, `stock_status`, `hidden`)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Apple', 'iPhone 16 Pro Max', 144999.00, '8GB', '256GB', 'Apple A18 Pro (3nm)', '6.9" Super Retina XDR OLED 120Hz', '4685 mAh (33W Fast Charging)', 'IN_STOCK', FALSE),
    ('a0000000-0000-0000-0000-000000000002', 'Samsung', 'Galaxy S25 Ultra', 134999.00, '12GB', '512GB', 'Snapdragon 8 Elite (3nm)', '6.8" Dynamic AMOLED 2X 120Hz', '5000 mAh (45W Fast Charging)', 'IN_STOCK', FALSE),
    ('a0000000-0000-0000-0000-000000000003', 'OnePlus', 'OnePlus 13', 69999.00, '16GB', '512GB', 'Snapdragon 8 Elite (3nm)', '6.82" 2K Oriental AMOLED 120Hz', '6000 mAh (100W SuperVOOC)', 'IN_STOCK', FALSE),
    ('a0000000-0000-0000-0000-000000000004', 'Google', 'Pixel 9 Pro XL', 109999.00, '16GB', '256GB', 'Google Tensor G4 (4nm)', '6.8" Super Actua LTPO OLED 120Hz', '5060 mAh (37W Fast Charging)', 'LIMITED_STOCK', FALSE),
    ('a0000000-0000-0000-0000-000000000005', 'Nothing', 'Nothing Phone (2)', 44999.00, '12GB', '256GB', 'Snapdragon 8+ Gen 1', '6.7" LTPO OLED 120Hz Glyph Matrix', '4700 mAh (45W Fast Charging)', 'IN_STOCK', FALSE),
    ('a0000000-0000-0000-0000-000000000006', 'Xiaomi', 'Xiaomi 14 Ultra', 99999.00, '16GB', '512GB', 'Snapdragon 8 Gen 3 (4nm)', '6.73" WQHD+ AMOLED 120Hz Leica', '5000 mAh (90W HyperCharge)', 'IN_STOCK', FALSE),
    ('a0000000-0000-0000-0000-000000000007', 'Vivo', 'Vivo X100 Pro', 89999.00, '16GB', '512GB', 'MediaTek Dimensity 9300', '6.78" 1.5K LTPO AMOLED 120Hz Zeiss', '5400 mAh (100W FlashCharge)', 'LIMITED_STOCK', FALSE),
    ('a0000000-0000-0000-0000-000000000008', 'Motorola', 'Razr 50 Ultra', 99999.00, '12GB', '512GB', 'Snapdragon 8s Gen 3', '6.9" Foldable LTPO AMOLED 165Hz', '4000 mAh (45W TurboPower)', 'IN_STOCK', FALSE)
ON DUPLICATE KEY UPDATE `price` = VALUES(`price`), `stock_status` = VALUES(`stock_status`);

-- ------------------------------------------------------------------------------
-- 3. Mobile Cloudinary & Product Showcase Images (1 to 5 per phone)
-- ------------------------------------------------------------------------------
INSERT INTO `mobile_images` (`id`, `mobile_id`, `image_url`, `image_order`)
VALUES
    -- iPhone 16 Pro Max
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', 1),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80', 2),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80', 3),

    -- Samsung Galaxy S25 Ultra
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80', 1),
    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', 2),

    -- OnePlus 13
    ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', 1),
    ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80', 2),

    -- Google Pixel 9 Pro XL
    ('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', 1),

    -- Nothing Phone (2)
    ('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', 1),

    -- Xiaomi 14 Ultra
    ('b0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80', 1),

    -- Vivo X100 Pro
    ('b0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80', 1),

    -- Motorola Razr 50 Ultra
    ('b0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', 1);

-- ------------------------------------------------------------------------------
-- 4. Customer Product Reviews Seed Data
-- ------------------------------------------------------------------------------
INSERT INTO `reviews` (`id`, `customer_name`, `customer_image`, `purchased_phone`, `rating`, `review_text`)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Aarav Sharma', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'iPhone 16 Pro Max', 5, 'Flawless unboxing experience! The Grade 5 Titanium chassis feels featherlight in hand, and the battery easily lasts 36 hours. Delivered in sealed tamper-proof packaging within 18 hours.'),
    ('c0000000-0000-0000-0000-000000000002', 'Priya Patel', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'Samsung Galaxy S25 Ultra', 5, 'The Galaxy AI real-time call translation and 200MP camera zoom are revolutionary for my travel photography. 100% genuine sealed Indian unit with official Samsung Care+ warranty.'),
    ('c0000000-0000-0000-0000-000000000003', 'Rohan Mehta', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'OnePlus 13', 5, 'Snapdragon 8 Elite is a performance beast. 100W SuperVOOC charges from 5% to 100% in under 26 minutes with zero heating. Customer support even helped transfer my WhatsApp backup seamlessly.'),
    ('c0000000-0000-0000-0000-000000000004', 'Ananya Iyer', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', 'Nothing Phone (2)', 5, 'The Glyph Matrix notification patterns and Nothing OS monochrome aesthetic are purely therapeutic. Easily the best head-turner smartphone at this price point.'),
    ('c0000000-0000-0000-0000-000000000005', 'Vikramaditya Rao', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'Pixel 9 Pro XL', 5, 'Tensor G4 combined with Gemini AI elevates voice typing and Magic Editor to sorcery. Best night photography I have ever witnessed. Best store for authentic flagship phones in India.');

-- ------------------------------------------------------------------------------
-- 5. Contact Concierge Inquiries Seed Data
-- ------------------------------------------------------------------------------
INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `message`)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'Siddharth Mukherjee', 'siddharth.m@example.com', '+91 98450 12345', 'Inquiring about corporate bulk procurement of 15 units of Samsung Galaxy S25 Ultra for our executive leadership team in Hyderabad.'),
    ('d0000000-0000-0000-0000-000000000002', 'Kavita Krishnan', 'kavita.k@example.com', '+91 97110 54321', 'Can you confirm if the iPhone 16 Pro Max units come with official 1-year Apple India warranty and GST tax invoice?');
