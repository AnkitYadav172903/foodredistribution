package com.zerowastemeals.backend.dto.claim;

import com.zerowastemeals.backend.entity.Claim;
import com.zerowastemeals.backend.entity.DonationStatus;

import java.time.LocalDateTime;

public record ClaimResponse(
        Long id,
        Long donationId,
        String donationTitle,
        String donorName,
        String imageUrl,
        String location,
        DonationStatus status,
        String ngoName,
        LocalDateTime createdAt
) {

    public static ClaimResponse from(Claim claim) {
        return new ClaimResponse(
                claim.getId(),
                claim.getDonation().getId(),
                claim.getDonation().getTitle(),
                claim.getDonation().getDonor().getName(),
                claim.getDonation().getImageUrl(),
                claim.getDonation().getLocation(),
                claim.getStatus(),
                claim.getNgo().getName(),
                claim.getCreatedAt()
        );
    }
}