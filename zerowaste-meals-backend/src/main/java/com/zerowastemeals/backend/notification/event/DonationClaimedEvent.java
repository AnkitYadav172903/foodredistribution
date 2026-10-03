package com.zerowastemeals.backend.notification.event;

/**
 * Raised once an NGO has claimed a listing and the listing is no longer available.
 */
public record DonationClaimedEvent(
        Long donationId,
        Long donorId,
        String donorName,
        Long ngoId,
        String ngoName,
        String title,
        String location
) {
}
