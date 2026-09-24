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
import com.zerowastemeals.backend.repository.ClaimRepository;
import com.zerowastemeals.backend.repository.DonationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final DonationRepository donationRepository;

    public ClaimService(ClaimRepository claimRepository, DonationRepository donationRepository) {
        this.claimRepository = claimRepository;
        this.donationRepository = donationRepository;
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

        return ClaimResponse.from(saved);
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
    }

    @Transactional
    public void confirmCollection(Long claimId, User actor) {
        Claim claim = find(claimId);
        ensureDonor(actor, claim.getDonation());
        if (claim.getStatus() != DonationStatus.CLAIMED) {
            throw new BadRequestException("Claim is not in a state that can be confirmed");
        }
        setStatus(claim, DonationStatus.COLLECTED);
    }

    @Transactional
    public void reject(Long claimId, User actor) {
        Claim claim = find(claimId);
        ensureDonor(actor, claim.getDonation());
        setStatus(claim, DonationStatus.CANCELLED);
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
}