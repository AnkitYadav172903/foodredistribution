package com.zerowastemeals.backend.dto.claim;

/**
 * Optional payload for a claim (e.g. a short message or capacity note).
 */
public record ClaimRequest(
        String message
) {
}