package com.zerowastemeals.backend.entity;

/**
 * Lifecycle of a donation listing and the claims attached to it.
 */
public enum DonationStatus {
    AVAILABLE,
    CLAIMED,
    COLLECTED,
    EXPIRED,
    CANCELLED
}