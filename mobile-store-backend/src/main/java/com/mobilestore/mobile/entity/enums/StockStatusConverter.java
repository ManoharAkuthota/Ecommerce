package com.mobilestore.mobile.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * StockStatusConverter
 * Module: mobile
 * JPA AttributeConverter for seamless bidirectional mapping between the StockStatus enum
 * and database VARCHAR column, transparently handling legacy Title Case entries.
 */
@Converter(autoApply = true)
public class StockStatusConverter implements AttributeConverter<StockStatus, String> {

    @Override
    public String convertToDatabaseColumn(StockStatus attribute) {
        return attribute != null ? attribute.name() : StockStatus.IN_STOCK.name();
    }

    @Override
    public StockStatus convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return StockStatus.IN_STOCK;
        }
        return StockStatus.fromString(dbData);
    }
}
