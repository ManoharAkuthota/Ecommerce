package com.mobilestore.mobile.repository;

import com.mobilestore.mobile.entity.Mobile;
import com.mobilestore.mobile.entity.MobileImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * MobileImageRepository
 * Module: mobile
 * Spring Data JPA repository for Cloudinary media asset management.
 */
@Repository
public interface MobileImageRepository extends JpaRepository<MobileImage, UUID> {

    List<MobileImage> findByMobileIdOrderByImageOrderAsc(UUID mobileId);

    List<MobileImage> findByMobileOrderByImageOrderAsc(Mobile mobile);

    Optional<MobileImage> findByMobileIdAndImageOrder(UUID mobileId, Integer imageOrder);

    @Modifying
    @Query("DELETE FROM MobileImage mi WHERE mi.mobile.id = :mobileId")
    void deleteByMobileId(@Param("mobileId") UUID mobileId);

    void deleteByMobile(Mobile mobile);

    long countByMobileId(UUID mobileId);

    boolean existsByMobileIdAndImageOrder(UUID mobileId, Integer imageOrder);
}
