package com.zerowastemeals.backend.dto.donation;

import com.zerowastemeals.backend.entity.Donation;
import com.zerowastemeals.backend.entity.DonationStatus;

import java.time.LocalDateTime;

public record DonationResponse(
        Long id,
        String title,
        String category,
        Double quantity,
        String unit,
        String description,
        String location,
        LocalDateTime pickupBy,
        String imageUrl,
        DonationStatus status,
        String donorName,
        String claimedByName,
        LocalDateTime createdAt
) {

    public static DonationResponse from(Donation donation, String claimedByName) {
        return new DonationResponse(
                donation.getId(),
                donation.getTitle(),
                donation.getCategory(),
                donation.getQuantity(),
                donation.getUnit(),
                donation.getDescription(),
                donation.getLocation(),
                donation.getPickupBy(),
                donation.getImageUrl(),
                donation.getStatus(),
                donation.getDonor().getName(),
                claimedByName,
                donation.getCreatedAt()
        );
    }
}