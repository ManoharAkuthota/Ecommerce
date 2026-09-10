package com.mobilestore.stockalert.service;

import com.mobilestore.mobile.entity.Mobile;
import com.mobilestore.stockalert.dto.StockAlertRequest;
import com.mobilestore.stockalert.dto.StockAlertResponse;

import java.util.List;
import java.util.UUID;

/**
 * StockAlertService Interface
 * Module: stockalert
 */
public interface StockAlertService {

    StockAlertResponse subscribe(StockAlertRequest request, String authenticatedEmail);

    void notifySubscribers(Mobile mobile);

    List<StockAlertResponse> getUserAlerts(String userEmail);

    void unsubscribe(UUID id, String userEmail);

    long getPendingAlertsCount();
}
