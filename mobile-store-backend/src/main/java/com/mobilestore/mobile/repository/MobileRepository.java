package com.mobilestore.mobile.repository;

import com.mobilestore.mobile.entity.Mobile;
import com.mobilestore.mobile.entity.enums.StockStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * MobileRepository
 * Module: mobile
 * Enterprise Spring Data JPA repository for smartphone catalog operations.
 */
@Repository
public interface MobileRepository extends JpaRepository<Mobile, UUID>, JpaSpecificationExecutor<Mobile> {

    List<Mobile> findByHiddenFalse();

    Page<Mobile> findByHiddenFalse(Pageable pageable);

    List<Mobile> findByHiddenFalse(Sort sort);

    long countByHiddenFalse();

    List<Mobile> findTop8ByHiddenFalseOrderByCreatedAtDesc();

    List<Mobile> findByHiddenFalseOrderByCreatedAtDesc();

    List<Mobile> findByHiddenTrue();

    Page<Mobile> findByHiddenTrue(Pageable pageable);

    List<Mobile> findByHiddenTrue(Sort sort);

    List<Mobile> findByHiddenTrueOrderByCreatedAtDesc();

    long countByHiddenTrue();

    List<Mobile> findByBrandIgnoreCaseAndHiddenFalse(String brand);

    Page<Mobile> findByBrandIgnoreCaseAndHiddenFalse(String brand, Pageable pageable);

    Page<Mobile> findByBrandIgnoreCase(String brand, Pageable pageable);

    List<Mobile> findByStockStatusAndHiddenFalse(StockStatus stockStatus);

    Page<Mobile> findByStockStatusAndHiddenFalse(StockStatus stockStatus, Pageable pageable);

    Page<Mobile> findByStockStatus(StockStatus stockStatus, Pageable pageable);

    long countByStockStatus(StockStatus stockStatus);

    List<Mobile> findByHiddenFalseOrderByPriceAsc();

    List<Mobile> findByHiddenFalseOrderByPriceDesc();

    Page<Mobile> findByPriceBetweenAndHiddenFalse(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    Page<Mobile> findByNameContainingIgnoreCaseAndHiddenFalse(String name, Pageable pageable);

    List<Mobile> findByRamIgnoreCaseAndHiddenFalse(String ram);

    Page<Mobile> findByRamIgnoreCaseAndHiddenFalse(String ram, Pageable pageable);

    List<Mobile> findByStorageIgnoreCaseAndHiddenFalse(String storage);

    Page<Mobile> findByStorageIgnoreCaseAndHiddenFalse(String storage, Pageable pageable);

    @Query("SELECT m FROM Mobile m WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           " LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(m.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(m.processor) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:brand IS NULL OR :brand = '' OR LOWER(m.brand) = LOWER(:brand)) AND " +
           "(:minPrice IS NULL OR m.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR m.price <= :maxPrice) AND " +
           "(:ram IS NULL OR :ram = '' OR LOWER(m.ram) = LOWER(:ram)) AND " +
           "(:storage IS NULL OR :storage = '' OR LOWER(m.storage) = LOWER(:storage)) AND " +
           "(:stockStatus IS NULL OR m.stockStatus = :stockStatus) AND " +
           "(:hidden IS NULL OR m.hidden = :hidden)")
    Page<Mobile> searchMobiles(
        @Param("keyword") String keyword,
        @Param("brand") String brand,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("ram") String ram,
        @Param("storage") String storage,
        @Param("stockStatus") StockStatus stockStatus,
        @Param("hidden") Boolean hidden,
        Pageable pageable
    );

    @Query("SELECT DISTINCT m.brand FROM Mobile m WHERE m.hidden = false ORDER BY m.brand ASC")
    List<String> findDistinctBrands();

    @Query("SELECT DISTINCT m.ram FROM Mobile m WHERE m.hidden = false ORDER BY m.ram ASC")
    List<String> findDistinctRamOptions();

    @Query("SELECT DISTINCT m.storage FROM Mobile m WHERE m.hidden = false ORDER BY m.storage ASC")
    List<String> findDistinctStorageOptions();

    Page<Mobile> findAll(Pageable pageable);

    Page<Mobile> findByHidden(Boolean hidden, Pageable pageable);
}
