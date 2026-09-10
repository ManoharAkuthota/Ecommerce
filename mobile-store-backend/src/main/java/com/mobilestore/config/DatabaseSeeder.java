package com.mobilestore.config;

import com.mobilestore.admin.entity.Admin;
import com.mobilestore.admin.repository.AdminRepository;
import com.mobilestore.contact.entity.ContactMessage;
import com.mobilestore.contact.repository.ContactMessageRepository;
import com.mobilestore.mobile.entity.Mobile;
import com.mobilestore.mobile.entity.MobileImage;
import com.mobilestore.mobile.entity.enums.StockStatus;
import com.mobilestore.mobile.repository.MobileRepository;
import com.mobilestore.review.entity.Review;
import com.mobilestore.review.repository.ReviewRepository;
import com.mobilestore.user.entity.User;
import com.mobilestore.user.entity.UserRole;
import com.mobilestore.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.mobilestore.chat.entity.ChatMessage;
import com.mobilestore.chat.repository.ChatMessageRepository;
import com.mobilestore.order.entity.Order;
import com.mobilestore.order.entity.OrderItem;
import com.mobilestore.order.entity.enums.DeliveryType;
import com.mobilestore.order.entity.enums.OrderStatus;
import com.mobilestore.order.entity.enums.PaymentMethod;
import com.mobilestore.order.entity.enums.PaymentStatus;
import com.mobilestore.order.repository.OrderRepository;
import com.mobilestore.wishlist.entity.Wishlist;
import com.mobilestore.wishlist.repository.WishlistRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final MobileRepository mobileRepository;
    private final OrderRepository orderRepository;
    private final WishlistRepository wishlistRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ReviewRepository reviewRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        try {
            seedAdmin();
            seedUser();
            seedMobiles();
            seedCustomerData();
            seedReviews();
            seedContactMessages();
        } catch (Exception e) {
            log.warn("DatabaseSeeder notice: {}", e.getMessage());
        }
    }

    private void seedAdmin() {
        if (!adminRepository.existsByEmailIgnoreCase("admin@antigravity.com")) {
            Admin admin = Admin.builder()
                    .name("Super Admin")
                    .email("admin@antigravity.com")
                    .password(passwordEncoder.encode("admin123"))
                    .build();
            adminRepository.save(admin);
            log.info("Seeded default Super Admin: admin@antigravity.com");
        }
    }

    private void seedUser() {
        if (!userRepository.existsByEmailIgnoreCase("user@antigravity.com")) {
            User user = User.builder()
                    .fullName("Customer User")
                    .email("user@antigravity.com")
                    .password(passwordEncoder.encode("user123"))
                    .phoneNumber("+91 98765 43210")
                    .role(UserRole.ROLE_USER)
                    .enabled(true)
                    .emailVerified(true)
                    .build();
            userRepository.save(user);
            log.info("Seeded default Customer User: user@antigravity.com");
        }
    }

    private void seedMobiles() {
        if (mobileRepository.count() == 0) {
            // 1. iPhone 16 Pro Max
            Mobile iphone = Mobile.builder()
                    .brand("Apple")
                    .name("iPhone 16 Pro Max")
                    .price(new BigDecimal("144999.00"))
                    .ram("8GB")
                    .storage("256GB")
                    .processor("Apple A18 Pro (3nm)")
                    .display("6.9\" Super Retina XDR OLED 120Hz")
                    .battery("4685 mAh (33W Fast Charging)")
                    .stockStatus(StockStatus.IN_STOCK)
                    .hidden(false)
                    .build();
            iphone.addImage(MobileImage.builder().imageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80").imageOrder(1).build());
            iphone.addImage(MobileImage.builder().imageUrl("https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80").imageOrder(2).build());
            mobileRepository.save(iphone);

            // 2. Samsung Galaxy S25 Ultra
            Mobile samsung = Mobile.builder()
                    .brand("Samsung")
                    .name("Galaxy S25 Ultra")
                    .price(new BigDecimal("134999.00"))
                    .ram("12GB")
                    .storage("512GB")
                    .processor("Snapdragon 8 Elite (3nm)")
                    .display("6.8\" Dynamic AMOLED 2X 120Hz")
                    .battery("5000 mAh (45W Fast Charging)")
                    .stockStatus(StockStatus.IN_STOCK)
                    .hidden(false)
                    .build();
            samsung.addImage(MobileImage.builder().imageUrl("https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80").imageOrder(1).build());
            samsung.addImage(MobileImage.builder().imageUrl("https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80").imageOrder(2).build());
            mobileRepository.save(samsung);

            // 3. OnePlus 13
            Mobile oneplus = Mobile.builder()
                    .brand("OnePlus")
                    .name("OnePlus 13")
                    .price(new BigDecimal("69999.00"))
                    .ram("16GB")
                    .storage("512GB")
                    .processor("Snapdragon 8 Elite (3nm)")
                    .display("6.82\" 2K Oriental AMOLED 120Hz")
                    .battery("6000 mAh (100W SuperVOOC)")
                    .stockStatus(StockStatus.IN_STOCK)
                    .hidden(false)
                    .build();
            oneplus.addImage(MobileImage.builder().imageUrl("https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80").imageOrder(1).build());
            mobileRepository.save(oneplus);

            // 4. Google Pixel 9 Pro XL
            Mobile pixel = Mobile.builder()
                    .brand("Google")
                    .name("Pixel 9 Pro XL")
                    .price(new BigDecimal("109999.00"))
                    .ram("16GB")
                    .storage("256GB")
                    .processor("Google Tensor G4 (4nm)")
                    .display("6.8\" Super Actua LTPO OLED 120Hz")
                    .battery("5060 mAh (37W Fast Charging)")
                    .stockStatus(StockStatus.LIMITED_STOCK)
                    .hidden(false)
                    .build();
            pixel.addImage(MobileImage.builder().imageUrl("https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80").imageOrder(1).build());
            mobileRepository.save(pixel);

            // 5. Nothing Phone (2)
            Mobile nothing = Mobile.builder()
                    .brand("Nothing")
                    .name("Nothing Phone (2)")
                    .price(new BigDecimal("44999.00"))
                    .ram("12GB")
                    .storage("256GB")
                    .processor("Snapdragon 8+ Gen 1")
                    .display("6.7\" LTPO OLED 120Hz Glyph Matrix")
                    .battery("4700 mAh (45W Fast Charging)")
                    .stockStatus(StockStatus.IN_STOCK)
                    .hidden(false)
                    .build();
            nothing.addImage(MobileImage.builder().imageUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80").imageOrder(1).build());
            mobileRepository.save(nothing);

            // 6. Xiaomi 14 Ultra
            Mobile xiaomi = Mobile.builder()
                    .brand("Xiaomi")
                    .name("Xiaomi 14 Ultra")
                    .price(new BigDecimal("99999.00"))
                    .ram("16GB")
                    .storage("512GB")
                    .processor("Snapdragon 8 Gen 3 (4nm)")
                    .display("6.73\" WQHD+ AMOLED 120Hz Leica")
                    .battery("5000 mAh (90W HyperCharge)")
                    .stockStatus(StockStatus.IN_STOCK)
                    .hidden(false)
                    .build();
            xiaomi.addImage(MobileImage.builder().imageUrl("https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80").imageOrder(1).build());
            mobileRepository.save(xiaomi);

            // 7. Vivo X100 Pro
            Mobile vivo = Mobile.builder()
                    .brand("Vivo")
                    .name("Vivo X100 Pro")
                    .price(new BigDecimal("89999.00"))
                    .ram("16GB")
                    .storage("512GB")
                    .processor("MediaTek Dimensity 9300")
                    .display("6.78\" 1.5K LTPO AMOLED 120Hz Zeiss")
                    .battery("5400 mAh (100W FlashCharge)")
                    .stockStatus(StockStatus.LIMITED_STOCK)
                    .hidden(false)
                    .build();
            vivo.addImage(MobileImage.builder().imageUrl("https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80").imageOrder(1).build());
            mobileRepository.save(vivo);

            // 8. Motorola Razr 50 Ultra
            Mobile moto = Mobile.builder()
                    .brand("Motorola")
                    .name("Razr 50 Ultra")
                    .price(new BigDecimal("99999.00"))
                    .ram("12GB")
                    .storage("512GB")
                    .processor("Snapdragon 8s Gen 3")
                    .display("6.9\" Foldable LTPO AMOLED 165Hz")
                    .battery("4000 mAh (45W TurboPower)")
                    .stockStatus(StockStatus.IN_STOCK)
                    .hidden(false)
                    .build();
            moto.addImage(MobileImage.builder().imageUrl("https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80").imageOrder(1).build());
            mobileRepository.save(moto);

            log.info("Seeded 8 Flagship Smartphones into catalog");
        }
    }

    private void seedReviews() {
        if (reviewRepository.count() == 0) {
            reviewRepository.saveAll(List.of(
                    Review.builder()
                            .customerName("Aarav Sharma")
                            .customerImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
                            .purchasedPhone("iPhone 16 Pro Max")
                            .rating(5)
                            .reviewText("Flawless unboxing experience! The Grade 5 Titanium chassis feels featherlight in hand, and the battery easily lasts 36 hours.")
                            .build(),
                    Review.builder()
                            .customerName("Priya Patel")
                            .customerImage("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80")
                            .purchasedPhone("Samsung Galaxy S25 Ultra")
                            .rating(5)
                            .reviewText("The Galaxy AI real-time call translation and 200MP camera zoom are revolutionary for my travel photography.")
                            .build(),
                    Review.builder()
                            .customerName("Rohan Mehta")
                            .customerImage("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80")
                            .purchasedPhone("OnePlus 13")
                            .rating(5)
                            .reviewText("Snapdragon 8 Elite is a performance beast. 100W SuperVOOC charges from 5% to 100% in under 26 minutes with zero heating.")
                            .build()
            ));
            log.info("Seeded verified customer reviews");
        }
    }

    private void seedCustomerData() {
        User customer = userRepository.findByEmailIgnoreCase("user@antigravity.com").orElse(null);
        if (customer == null) return;

        List<Mobile> mobiles = mobileRepository.findAll();
        if (mobiles.isEmpty()) return;

        // 1. Seed Customer Wishlist (3 items)
        if (wishlistRepository.countByUser(customer) == 0) {
            for (int i = 0; i < Math.min(3, mobiles.size()); i++) {
                Mobile m = mobiles.get(i);
                wishlistRepository.save(Wishlist.builder()
                        .user(customer)
                        .mobile(m)
                        .build());
            }
            log.info("Seeded 3 wishlist flagships for Customer user@antigravity.com");
        }

        // 2. Seed Customer Orders (1 in-transit, 1 delivered)
        if (orderRepository.findByUserOrderByCreatedAtDesc(customer).isEmpty()) {
            Mobile phone1 = mobiles.size() > 1 ? mobiles.get(1) : mobiles.get(0); // Samsung Galaxy S25 Ultra
            Mobile phone2 = mobiles.size() > 2 ? mobiles.get(2) : mobiles.get(0); // OnePlus 13

            String img1 = phone1.getImages().isEmpty() ? null : phone1.getImages().get(0).getImageUrl();
            String img2 = phone2.getImages().isEmpty() ? null : phone2.getImages().get(0).getImageUrl();

            // Order 1: Active In-Transit (SHIPPED)
            Order order1 = Order.builder()
                    .orderNumber("ORD-2026-98124")
                    .user(customer)
                    .orderStatus(OrderStatus.SHIPPED)
                    .paymentStatus(PaymentStatus.PAID)
                    .paymentMethod(PaymentMethod.UPI)
                    .deliveryType(DeliveryType.STANDARD_DELIVERY)
                    .subtotal(phone1.getPrice())
                    .taxAmount(BigDecimal.ZERO)
                    .shippingFee(BigDecimal.ZERO)
                    .discountAmount(BigDecimal.ZERO)
                    .totalAmount(phone1.getPrice())
                    .recipientName(customer.getFullName())
                    .recipientPhone(customer.getPhoneNumber())
                    .recipientEmail(customer.getEmail())
                    .addressLine1("Flat 402, Prestige Silicon Oasis")
                    .addressLine2("Electronic City Phase 1")
                    .city("Bengaluru")
                    .state("Karnataka")
                    .postalCode("560100")
                    .carrier("BlueDart Express")
                    .trackingNumber("BLUEDART-88492019")
                    .notes("Please call recipient before doorstep delivery.")
                    .build();

            OrderItem item1 = OrderItem.builder()
                    .mobile(phone1)
                    .mobileName(phone1.getName())
                    .mobileBrand(phone1.getBrand())
                    .mobileImage(img1)
                    .ram(phone1.getRam())
                    .storage(phone1.getStorage())
                    .unitPrice(phone1.getPrice())
                    .quantity(1)
                    .totalPrice(phone1.getPrice())
                    .build();
            order1.addItem(item1);
            orderRepository.save(order1);

            // Order 2: Completed (DELIVERED)
            Order order2 = Order.builder()
                    .orderNumber("ORD-2026-77319")
                    .user(customer)
                    .orderStatus(OrderStatus.DELIVERED)
                    .paymentStatus(PaymentStatus.PAID)
                    .paymentMethod(PaymentMethod.CARD)
                    .deliveryType(DeliveryType.STANDARD_DELIVERY)
                    .subtotal(phone2.getPrice())
                    .taxAmount(BigDecimal.ZERO)
                    .shippingFee(BigDecimal.ZERO)
                    .discountAmount(BigDecimal.ZERO)
                    .totalAmount(phone2.getPrice())
                    .recipientName(customer.getFullName())
                    .recipientPhone(customer.getPhoneNumber())
                    .recipientEmail(customer.getEmail())
                    .addressLine1("Flat 402, Prestige Silicon Oasis")
                    .addressLine2("Electronic City Phase 1")
                    .city("Bengaluru")
                    .state("Karnataka")
                    .postalCode("560100")
                    .carrier("Delhivery Surface")
                    .trackingNumber("DLV-99382710")
                    .build();

            OrderItem item2 = OrderItem.builder()
                    .mobile(phone2)
                    .mobileName(phone2.getName())
                    .mobileBrand(phone2.getBrand())
                    .mobileImage(img2)
                    .ram(phone2.getRam())
                    .storage(phone2.getStorage())
                    .unitPrice(phone2.getPrice())
                    .quantity(1)
                    .totalPrice(phone2.getPrice())
                    .build();
            order2.addItem(item2);
            orderRepository.save(order2);

            log.info("Seeded 2 orders for customer user@antigravity.com");
        }

        // 3. Seed Support Concierge Dialogue
        if (chatMessageRepository.findByUserOrderByCreatedAtAsc(customer).isEmpty()) {
            chatMessageRepository.saveAll(List.of(
                    ChatMessage.builder()
                            .user(customer)
                            .senderRole("CUSTOMER")
                            .senderName(customer.getFullName())
                            .senderEmail(customer.getEmail())
                            .message("Hello! Can you confirm when my Galaxy S25 Ultra order ORD-2026-98124 will arrive?")
                            .channel("SUPPORT")
                            .isReadByCustomer(true)
                            .isReadByAdmin(true)
                            .build(),
                    ChatMessage.builder()
                            .user(customer)
                            .senderRole("ADMIN")
                            .senderName("MS Concierge Support")
                            .senderEmail("admin@antigravity.com")
                            .message("Hello Customer! Your Galaxy S25 Ultra is in transit via BlueDart Express (Tracking: BLUEDART-88492019). Delivery is scheduled for tomorrow between 10:00 AM - 1:00 PM.")
                            .channel("SUPPORT")
                            .isReadByCustomer(false)
                            .isReadByAdmin(true)
                            .build()
            ));
            log.info("Seeded concierge inquiry dialogue for user@antigravity.com");
        }
    }

    private void seedContactMessages() {
        if (contactMessageRepository.count() == 0) {
            contactMessageRepository.saveAll(List.of(
                    ContactMessage.builder()
                            .name("Siddharth Mukherjee")
                            .email("siddharth.m@example.com")
                            .phone("+91 98450 12345")
                            .message("Inquiring about corporate bulk procurement of 15 units of Samsung Galaxy S25 Ultra.")
                            .status("PENDING")
                            .build(),
                    ContactMessage.builder()
                            .name("Kavita Krishnan")
                            .email("kavita.k@example.com")
                            .phone("+91 97110 54321")
                            .message("Can you confirm if the iPhone 16 Pro Max units come with official 1-year Apple India warranty?")
                            .status("PENDING")
                            .build()
            ));
            log.info("Seeded initial concierge inquiries");
        }
    }
}
