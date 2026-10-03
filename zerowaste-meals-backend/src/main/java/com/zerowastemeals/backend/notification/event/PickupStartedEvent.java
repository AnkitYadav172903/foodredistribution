package com.zerowastemeals.backend.notification.event;

/**
 * Raised once the NGO holding a claim has marked the pickup as under way.
 */
public record PickupStartedEvent(
        Long donationId,
        Long donorId,
        Long ngoId,
        String ngoName,
        String title,
        String location
) {
}
