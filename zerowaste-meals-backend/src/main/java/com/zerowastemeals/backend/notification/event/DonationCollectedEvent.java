package com.zerowastemeals.backend.notification.event;

/**
 * Raised once a donor has confirmed that an NGO collected the food.
 */
public record DonationCollectedEvent(
        Long donationId,
        Long donorId,
        Long ngoId,
        String ngoName,
        String title
) {
}
