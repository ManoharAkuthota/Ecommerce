package com.mobilestore.stockalert.repository;

import com.mobilestore.mobile.entity.Mobile;
import com.mobilestore.stockalert.entity.StockAlert;
import com.mobilestore.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * StockAlertRepository
 * Module: stockalert
 * Spring Data JPA repository for customer restock subscriptions.
 */
@Repository
public interface StockAlertRepository extends JpaRepository<StockAlert, UUID> {

    List<StockAlert> findByMobileAndNotifiedFalse(Mobile mobile);

    boolean existsByMobileAndEmailIgnoreCaseAndNotifiedFalse(Mobile mobile, String email);

    List<StockAlert> findByUserOrderByCreatedAtDesc(User user);

    long countByMobileAndNotifiedFalse(Mobile mobile);

    long countByNotifiedFalse();
}
