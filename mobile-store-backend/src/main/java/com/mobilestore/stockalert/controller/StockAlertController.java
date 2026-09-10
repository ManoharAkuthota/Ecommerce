package com.mobilestore.stockalert.controller;

import com.mobilestore.stockalert.dto.StockAlertRequest;
import com.mobilestore.stockalert.dto.StockAlertResponse;
import com.mobilestore.stockalert.service.StockAlertService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * StockAlertController
 * Module: stockalert
 * REST controller for customer smartphone restock notifications.
 */
@Slf4j
@RestController
@RequestMapping("/api/stock-alerts")
public class StockAlertController {

    private final StockAlertService stockAlertService;

    public StockAlertController(StockAlertService stockAlertService) {
        this.stockAlertService = stockAlertService;
    }

    /**
     * POST /api/stock-alerts
     * Subscribe an email/phone for restock alerts when a smartphone is back in stock.
     */
    @PostMapping
    public ResponseEntity<StockAlertResponse> subscribe(
            @Valid @RequestBody StockAlertRequest request,
            Authentication authentication
    ) {
        String authEmail = (authentication != null && authentication.isAuthenticated())
                ? authentication.getName()
                : null;

        log.info("REST request to subscribe to stock alert for mobile ID: {}", request.getMobileId());
        StockAlertResponse response = stockAlertService.subscribe(request, authEmail);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * GET /api/stock-alerts/my-alerts
     * Fetch active alerts for the currently authenticated customer.
     */
    @GetMapping("/my-alerts")
    public ResponseEntity<List<StockAlertResponse>> getMyAlerts(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<StockAlertResponse> alerts = stockAlertService.getUserAlerts(authentication.getName());
        return ResponseEntity.ok(alerts);
    }

    /**
     * DELETE /api/stock-alerts/{id}
     * Unsubscribe from a stock alert.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> unsubscribe(@PathVariable UUID id, Authentication authentication) {
        String userEmail = authentication != null ? authentication.getName() : null;
        stockAlertService.unsubscribe(id, userEmail);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/stock-alerts/admin/metrics
     * Admin inspection of total pending restock subscribers.
     */
    @GetMapping("/admin/metrics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminMetrics() {
        long pending = stockAlertService.getPendingAlertsCount();
        return ResponseEntity.ok(Map.of("pendingStockAlerts", pending));
    }
}
