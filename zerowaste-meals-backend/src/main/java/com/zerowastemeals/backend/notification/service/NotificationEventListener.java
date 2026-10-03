package com.zerowastemeals.backend.notification.service;

import com.zerowastemeals.backend.notification.event.ClaimReleasedEvent;
import com.zerowastemeals.backend.notification.event.DonationClaimedEvent;
import com.zerowastemeals.backend.notification.event.DonationCollectedEvent;
import com.zerowastemeals.backend.notification.event.DonationCreatedEvent;
import com.zerowastemeals.backend.notification.event.PickupStartedEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Bridges committed donation/claim activity to the notification fan-out.
 *
 * <p>Listening in {@link TransactionPhase#AFTER_COMMIT} keeps notifications out of the business
 * transaction: a client is never told about a donation that was rolled back, and a failure to
 * deliver a notification cannot fail the donation itself. This is what lets
 * {@code DonationService} and {@code ClaimService} stay free of notification logic beyond
 * publishing an event.
 */
@Component
public class NotificationEventListener {

    private final AreaNotificationService areaNotificationService;

    public NotificationEventListener(AreaNotificationService areaNotificationService) {
        this.areaNotificationService = areaNotificationService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onDonationCreated(DonationCreatedEvent event) {
        Set<Long> excluded = new LinkedHashSet<>();
        excluded.add(event.donorId());
        areaNotificationService.notifyNearbyNgos(event, excluded);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onDonationClaimed(DonationClaimedEvent event) {
        areaNotificationService.notifyDonationClaimed(event);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onPickupStarted(PickupStartedEvent event) {
        areaNotificationService.notifyPickupStarted(event);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onDonationCollected(DonationCollectedEvent event) {
        areaNotificationService.notifyDonationCollected(event);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onClaimReleased(ClaimReleasedEvent event) {
        areaNotificationService.notifyClaimReleased(event);
    }
}
