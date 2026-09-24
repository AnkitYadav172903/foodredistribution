package com.zerowastemeals.backend.dto.admin;

public record DashboardResponse(
        Long totalUsers,
        Long donors,
        Long ngos,
        Long totalListings,
        Long availableListings,
        Long claimedListings,
        Long collectedListings
) {
}