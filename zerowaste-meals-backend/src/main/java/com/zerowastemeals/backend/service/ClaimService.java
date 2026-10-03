package com.zerowastemeals.backend.service;

import com.zerowastemeals.backend.dto.claim.ClaimRequest;
import com.zerowastemeals.backend.dto.claim.ClaimResponse;
import com.zerowastemeals.backend.entity.Claim;
import com.zerowastemeals.backend.entity.Donation;
import com.zerowastemeals.backend.entity.DonationStatus;
import com.zerowastemeals.backend.entity.Role;
import com.zerowastemeals.backend.entity.User;
import com.zerowastemeals.backend.exception.BadRequestException;
import com.zerowastemeals.backend.exception.ResourceNotFoundException;
import com.zerowastemeals.backend.exception.UnauthorizedException;
import com.zerowastemeals.backend.notification.event.ClaimReleasedEvent;
import com.zerowastemeals.backend.notification.event.DonationClaimedEvent;
import com.zerowastemeals.backend.notification.event.DonationCollectedEvent;
import com.zerowastemeals.backend.notification.event.PickupStartedEvent;
import com.zerowastemeals.backend.repository.ClaimRepository;
import com.zerowastemeals.backend.repository.DonationRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final DonationRepository donationRepository;
    private final ApplicationEventPublisher eventPublisher;

    public ClaimService(ClaimRepository claimRepository,
                        DonationRepository donationRepository,
                        ApplicationEventPublisher eventPublisher) {
        this.claimRepository = claimRepository;
        this.donationRepository = donationRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public ClaimResponse claim(User ngo, Long listingId, ClaimRequest request) {
        Donation donation = donationRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + listingId));

        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new BadRequestException("This listing is no longer available");
        }
        if (donation.getDonor().getId().equals(ngo.getId())) {
            throw new BadRequestException("You cannot claim your own donation");
        }
        if (claimRepository.existsByDonationIdAndStatus(donation.getId(), DonationStatus.CLAIMED)) {
            throw new BadRequestException("This listing has already been claimed");
        }

        Claim claim = new Claim();
        claim.setDonation(donation);
        claim.setNgo(ngo);
        claim.setStatus(DonationStatus.CLAIMED);
        if (request != null) {
            claim.setMessage(request.message());
        }
        Claim saved = claimRepository.save(claim);

        donation.setStatus(DonationStatus.CLAIMED);
        donationRepository.save(donation);

        // Donor is told an NGO accepted; other NGOs in the area are told it has gone.
        eventPublisher.publishEvent(new DonationClaimedEvent(
                donation.getId(),
                donation.getDonor().getId(),
                donation.getDonor().getName(),
                ngo.getId(),
                ngo.getName(),
                donation.getTitle(),
                donation.getLocation()));

        return ClaimResponse.from(saved);
    }

    /**
     * Marks a held claim's pickup as under way and tells the donor the NGO is on its way.
     *
     * <p>The listing stays CLAIMED; only the claim records when the pickup began, so no existing
     * status filter or count changes meaning. Re-issuing the call for a claim that already has a
     * pickup timestamp is rejected rather than re-notifying the donor.
     */
    @Transactional
    public void startPickup(Long claimId, User actor) {
        Claim claim = find(claimId);
        if (actor.getRole() != Role.ADMIN && !claim.getNgo().getId().equals(actor.getId())) {
            throw new UnauthorizedException("You can only start pickup for your own claims");
        }
        if (claim.getStatus() != DonationStatus.CLAIMED) {
            throw new BadRequestException("Claim is not in a state where pickup can start");
        }
        if (claim.getPickupStartedAt() != null) {
            throw new BadRequestException("Pickup has already started for this claim");
        }

        claim.setPickupStartedAt(LocalDateTime.now());
        claimRepository.save(claim);

        Donation donation = claim.getDonation();
        eventPublisher.publishEvent(new PickupStartedEvent(
                donation.getId(),
                donation.getDonor().getId(),
                claim.getNgo().getId(),
                claim.getNgo().getName(),
                donation.getTitle(),
                donation.getLocation()));
    }

    @Transactional
    public void cancel(Long claimId, User actor) {
        Claim claim = find(claimId);
        if (actor.getRole() != Role.ADMIN && !claim.getNgo().getId().equals(actor.getId())) {
            throw new UnauthorizedException("You can only cancel your own claims");
        }
        if (claim.getStatus() != DonationStatus.CLAIMED) {
            throw new BadRequestException("Claim is not in a state that can be cancelled");
        }
        setStatus(claim, DonationStatus.CANCELLED);
        publishReleased(claim);
    }

    @Transactional
    public void confirmCollection(Long claimId, User actor) {
        Claim claim = find(claimId);
        ensureDonor(actor, claim.getDonation());
        if (claim.getStatus() != DonationStatus.CLAIMED) {
            throw new BadRequestException("Claim is not in a state that can be confirmed");
        }
        setStatus(claim, DonationStatus.COLLECTED);

        // Donor confirmed hand-off, so the NGO's pickup is complete.
        Donation donation = claim.getDonation();
        eventPublisher.publishEvent(new DonationCollectedEvent(
                donation.getId(),
                donation.getDonor().getId(),
                claim.getNgo().getId(),
                claim.getNgo().getName(),
                donation.getTitle()));
    }

    @Transactional
    public void reject(Long claimId, User actor) {
        Claim claim = find(claimId);
        ensureDonor(actor, claim.getDonation());
        setStatus(claim, DonationStatus.CANCELLED);
        publishReleased(claim);
    }

    public List<ClaimResponse> getMyClaims(Long ngoId) {
        return claimRepository.findByNgoIdOrderByCreatedAtDesc(ngoId)
                .stream()
                .map(ClaimResponse::from)
                .toList();
    }

    public List<ClaimResponse> getClaimsForListing(Long listingId, User actor) {
        Donation donation = donationRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + listingId));
        ensureDonor(actor, donation);
        return claimRepository.findByDonationId(listingId)
                .stream()
                .map(ClaimResponse::from)
                .toList();
    }

    private Claim find(Long claimId) {
        return claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + claimId));
    }

    private void setStatus(Claim claim, DonationStatus status) {
        claim.setStatus(status);
        claimRepository.save(claim);

        Donation donation = claim.getDonation();
        if (status == DonationStatus.CANCELLED && donation.getStatus() == DonationStatus.CLAIMED) {
            donation.setStatus(DonationStatus.AVAILABLE);
            donationRepository.save(donation);
        } else if (status == DonationStatus.COLLECTED) {
            donation.setStatus(DonationStatus.COLLECTED);
            donationRepository.save(donation);
        }
    }

    private void ensureDonor(User actor, Donation donation) {
        if (actor.getRole() != Role.ADMIN && !donation.getDonor().getId().equals(actor.getId())) {
            throw new UnauthorizedException("Only the donor of this listing can perform this action");
        }
    }

    /**
     * The listing is back in circulation, so the NGO that held the claim, the donor, and nearby
     * NGOs all need to hear about it.
     */
    private void publishReleased(Claim claim) {
        Donation donation = claim.getDonation();
        eventPublisher.publishEvent(new ClaimReleasedEvent(
                donation.getId(),
                donation.getDonor().getId(),
                claim.getNgo().getId(),
                claim.getNgo().getName(),
                donation.getTitle(),
                donation.getLocation()));
    }
}