package com.zerowastemeals.backend.notification.event;

/**
 * Raised once a donation listing has been committed. Carries plain values rather than the entity
 * so the listener can run after the transaction closes (lazy loading is disabled in this app).
 */
public record DonationCreatedEvent(
        Long donationId,
        Long donorId,
        String donorName,
        String title,
        String location,
        Double quantity,
        String unit
) {
}
