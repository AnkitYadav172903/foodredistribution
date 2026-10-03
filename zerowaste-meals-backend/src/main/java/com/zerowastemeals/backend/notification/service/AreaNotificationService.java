package com.zerowastemeals.backend.notification.service;

import com.zerowastemeals.backend.entity.Role;
import com.zerowastemeals.backend.entity.User;
import com.zerowastemeals.backend.notification.entity.NotificationType;
import com.zerowastemeals.backend.notification.event.ClaimReleasedEvent;
import com.zerowastemeals.backend.notification.event.DonationClaimedEvent;
import com.zerowastemeals.backend.notification.event.DonationCollectedEvent;
import com.zerowastemeals.backend.notification.event.DonationCreatedEvent;
import com.zerowastemeals.backend.notification.event.PickupStartedEvent;
import com.zerowastemeals.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * Translates donation and claim activity into the notifications each party should receive.
 *
 * <p>Recipients are resolved from the data on the event, never from client input, so a user can
 * only ever be notified about their own donations and claims.
 */
@Service
@Transactional(readOnly = true)
public class AreaNotificationService {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public AreaNotificationService(NotificationService notificationService, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    /**
     * Notifies every NGO serving the pickup area that a new listing is available.
     *
     * @param excludeUserIds users to skip, such as the donor or the NGO that just claimed it
     */
    public void notifyNearbyNgos(DonationCreatedEvent event, Set<Long> excludeUserIds) {
        String title = "New food listing near you";
        String message = buildQuantity(event.quantity(), event.unit())
                + " of \"" + event.title() + "\" is available for pickup at " + event.location() + ".";

        for (User ngo : findNgosInArea(event.location())) {
            if (excludeUserIds.contains(ngo.getId())) {
                continue;
            }
            notificationService.notify(
                    ngo.getId(),
                    NotificationType.NEW_DONATION,
                    title,
                    message,
                    event.donationId(),
                    "/available-food");
        }
    }

    /**
     * Tells the donor their listing was claimed, and every other NGO in the area that it has gone.
     */
    public void notifyDonationClaimed(DonationClaimedEvent event) {
        notificationService.notify(
                event.donorId(),
                NotificationType.DONATION_ACCEPTED,
                "Your donation was accepted",
                event.ngoName() + " has claimed \"" + event.title()
                        + "\" and will collect it from " + event.location() + ".",
                event.donationId(),
                "/my-listings");

        Set<Long> excluded = new LinkedHashSet<>();
        excluded.add(event.ngoId());
        excluded.add(event.donorId());
        for (User ngo : findNgosInArea(event.location())) {
            if (excluded.contains(ngo.getId())) {
                continue;
            }
            notificationService.notify(
                    ngo.getId(),
                    NotificationType.SYSTEM_ALERT,
                    "Listing no longer available",
                    "\"" + event.title() + "\" has already been claimed by "
                            + event.ngoName() + ".",
                    event.donationId(),
                    "/available-food");
        }
    }

    /**
     * Tells the donor that the NGO holding the claim is on its way to collect.
     */
    public void notifyPickupStarted(PickupStartedEvent event) {
        notificationService.notify(
                event.donorId(),
                NotificationType.PICKUP_STARTED,
                "Pickup started",
                event.ngoName() + " has started collecting \"" + event.title()
                        + "\" from " + event.location() + ".",
                event.donationId(),
                "/my-listings");
    }

    /**
     * Tells both sides the hand-off is done: the donor that the food reached the community, and the
     * NGO that the donor confirmed the collection.
     */
    public void notifyDonationCollected(DonationCollectedEvent event) {
        notificationService.notify(
                event.donorId(),
                NotificationType.PICKUP_COMPLETED,
                "Pickup completed — thank you!",
                event.ngoName() + " collected \"" + event.title()
                        + "\". This food has reached the community instead of being wasted.",
                event.donationId(),
                "/my-listings");

        notificationService.notify(
                event.ngoId(),
                NotificationType.PICKUP_COMPLETED,
                "Pickup completed — thank you!",
                "The donor confirmed collection of \"" + event.title()
                        + "\". This meal reached your community.",
                event.donationId(),
                "/claimed-food");
    }

    /**
     * Tells the NGO their claim ended, alerts the donor, and re-opens the listing to nearby NGOs.
     */
    public void notifyClaimReleased(ClaimReleasedEvent event) {
        if (event.ngoId() != null) {
            notificationService.notify(
                    event.ngoId(),
                    NotificationType.SYSTEM_ALERT,
                    "Claim ended",
                    "\"" + event.title() + "\" is available again. Your claim is no longer active.",
                    event.donationId(),
                    "/available-food");
        }

        if (event.donorId() != null) {
            notificationService.notify(
                    event.donorId(),
                    NotificationType.SYSTEM_ALERT,
                    "Your listing is available again",
                    "\"" + event.title() + "\" is back on the market and visible to nearby NGOs.",
                    event.donationId(),
                    "/my-listings");
        }

        Set<Long> excluded = new LinkedHashSet<>();
        excluded.add(event.ngoId());
        excluded.add(event.donorId());
        notifyNearbyNgos(
                new DonationCreatedEvent(
                        event.donationId(), event.donorId(), null, event.title(), event.location(),
                        null, null),
                excluded);
    }

    /**
     * NGOs registered in the pickup area. Falls back to every NGO when the listing carries no
     * usable location, so a listing is never silently dropped.
     */
    private List<User> findNgosInArea(String location) {
        if (location == null || location.isBlank()) {
            return userRepository.findByRole(Role.NGO);
        }
        List<User> matches = userRepository.findByRoleAndCityMatchingLocation(Role.NGO, location.trim());
        return matches.isEmpty() ? userRepository.findByRole(Role.NGO) : matches;
    }

    private static String buildQuantity(Double quantity, String unit) {
        if (quantity == null) {
            return "Fresh surplus food";
        }
        String amount = quantity % 1 == 0
                ? String.valueOf(quantity.longValue())
                : String.valueOf(quantity);
        return amount + (unit == null || unit.isBlank() ? " portions" : " " + unit.trim());
    }
}
