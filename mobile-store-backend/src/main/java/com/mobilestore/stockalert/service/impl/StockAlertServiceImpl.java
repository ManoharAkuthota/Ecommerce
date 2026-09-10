package com.mobilestore.stockalert.service.impl;

import com.mobilestore.exception.BadRequestException;
import com.mobilestore.exception.MobileNotFoundException;
import com.mobilestore.exception.ResourceNotFoundException;
import com.mobilestore.mobile.entity.Mobile;
import com.mobilestore.mobile.entity.MobileImage;
import com.mobilestore.mobile.repository.MobileRepository;
import com.mobilestore.stockalert.dto.StockAlertRequest;
import com.mobilestore.stockalert.dto.StockAlertResponse;
import com.mobilestore.stockalert.entity.StockAlert;
import com.mobilestore.stockalert.repository.StockAlertRepository;
import com.mobilestore.stockalert.service.StockAlertService;
import com.mobilestore.user.entity.User;
import com.mobilestore.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * StockAlertServiceImpl
 * Module: stockalert
 * Handles stock restock subscriptions, subscriber lookups, and automated notification processing.
 */
@Slf4j
@Service
public class StockAlertServiceImpl implements StockAlertService {

    private final StockAlertRepository stockAlertRepository;
    private final MobileRepository mobileRepository;
    private final UserRepository userRepository;

    public StockAlertServiceImpl(
            StockAlertRepository stockAlertRepository,
            MobileRepository mobileRepository,
            UserRepository userRepository
    ) {
        this.stockAlertRepository = stockAlertRepository;
        this.mobileRepository = mobileRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public StockAlertResponse subscribe(StockAlertRequest request, String authenticatedEmail) {
        log.info("Processing stock alert request for mobile [{}] from email [{}]", request.getMobileId(), request.getEmail());

        Mobile mobile = mobileRepository.findById(request.getMobileId())
                .orElseThrow(() -> new MobileNotFoundException(request.getMobileId()));

        String cleanEmail = request.getEmail().trim().toLowerCase();

        // Check if already subscribed for active restock alert
        if (stockAlertRepository.existsByMobileAndEmailIgnoreCaseAndNotifiedFalse(mobile, cleanEmail)) {
            log.info("Email [{}] is already subscribed to restock alert for [{}]", cleanEmail, mobile.getName());
            throw new BadRequestException("You are already subscribed to restock alerts for this smartphone.");
        }

        // Link registered user if present
        User user = null;
        String lookupEmail = (authenticatedEmail != null && !authenticatedEmail.isBlank()) ? authenticatedEmail : cleanEmail;
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(lookupEmail.trim().toLowerCase());
        if (userOpt.isPresent()) {
            user = userOpt.get();
        }

        StockAlert alert = StockAlert.builder()
                .mobile(mobile)
                .user(user)
                .email(cleanEmail)
                .phoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null)
                .notified(false)
                .build();

        StockAlert saved = stockAlertRepository.save(alert);
        log.info("Saved stock alert subscription ID [{}] for mobile [{}]", saved.getId(), mobile.getName());

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void notifySubscribers(Mobile mobile) {
        if (mobile == null) return;

        List<StockAlert> pendingAlerts = stockAlertRepository.findByMobileAndNotifiedFalse(mobile);
        if (pendingAlerts.isEmpty()) {
            log.debug("No pending stock alert subscribers for mobile [{}]", mobile.getName());
            return;
        }

        log.info("Found [{}] pending restock alert subscribers for mobile [{}] ({})",
                pendingAlerts.size(), mobile.getName(), mobile.getId());

        LocalDateTime now = LocalDateTime.now();
        for (StockAlert alert : pendingAlerts) {
            alert.setNotified(true);
            alert.setNotifiedAt(now);
            // Simulated / logged notification dispatch
            log.info(">> DISPATCHING RESTOCK ALERT to subscriber [{}] for phone [{}] ({})",
                    alert.getEmail(), mobile.getName(), mobile.getBrand());
        }

        stockAlertRepository.saveAll(pendingAlerts);
        log.info("Successfully notified and fulfilled [{}] restock subscribers for [{}]",
                pendingAlerts.size(), mobile.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockAlertResponse> getUserAlerts(String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            return List.of();
        }

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(userEmail.trim().toLowerCase());
        if (userOpt.isEmpty()) {
            return List.of();
        }

        return stockAlertRepository.findByUserOrderByCreatedAtDesc(userOpt.get()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void unsubscribe(UUID id, String userEmail) {
        StockAlert alert = stockAlertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StockAlert", "id", id));

        stockAlertRepository.delete(alert);
        log.info("Stock alert [{}] deleted for [{}]", id, userEmail);
    }

    @Override
    @Transactional(readOnly = true)
    public long getPendingAlertsCount() {
        return stockAlertRepository.countByNotifiedFalse();
    }

    private StockAlertResponse mapToResponse(StockAlert alert) {
        String mobileImage = null;
        if (alert.getMobile() != null && alert.getMobile().getImages() != null && !alert.getMobile().getImages().isEmpty()) {
            mobileImage = alert.getMobile().getImages().get(0).getImageUrl();
        }

        return StockAlertResponse.builder()
                .id(alert.getId())
                .mobileId(alert.getMobile() != null ? alert.getMobile().getId() : null)
                .mobileName(alert.getMobile() != null ? alert.getMobile().getName() : null)
                .mobileBrand(alert.getMobile() != null ? alert.getMobile().getBrand() : null)
                .mobileImage(mobileImage)
                .email(alert.getEmail())
                .phoneNumber(alert.getPhoneNumber())
                .notified(alert.isNotified())
                .createdAt(alert.getCreatedAt())
                .notifiedAt(alert.getNotifiedAt())
                .build();
    }
}
