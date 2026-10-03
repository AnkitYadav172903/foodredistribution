package com.zerowastemeals.backend.notification.event;

/**
 * Raised once a claim is cancelled or rejected, which puts the listing back into circulation.
 */
public record ClaimReleasedEvent(
        Long donationId,
        Long donorId,
        Long ngoId,
        String ngoName,
        String title,
        String location
) {
}
