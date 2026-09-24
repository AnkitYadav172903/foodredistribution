package com.zerowastemeals.backend.dto.donation;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record DonationRequest(
        @NotBlank(message = "Title is required") String title,
        String category,
        @NotNull(message = "Quantity is required") @Positive(message = "Quantity must be positive") Double quantity,
        String unit,
        String description,
        @NotBlank(message = "Pickup location is required") String location,
        @Future(message = "Pickup time must be in the future") LocalDateTime pickupBy,
        String imageUrl
) {
}