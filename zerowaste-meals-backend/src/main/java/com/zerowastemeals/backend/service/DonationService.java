package com.zerowastemeals.backend.service;

import com.zerowastemeals.backend.dto.donation.DonationRequest;
import com.zerowastemeals.backend.dto.donation.DonationResponse;
import com.zerowastemeals.backend.entity.Donation;
import com.zerowastemeals.backend.entity.DonationStatus;
import com.zerowastemeals.backend.entity.Role;
import com.zerowastemeals.backend.entity.User;
import com.zerowastemeals.backend.exception.ResourceNotFoundException;
import com.zerowastemeals.backend.exception.UnauthorizedException;
import com.zerowastemeals.backend.repository.ClaimRepository;
import com.zerowastemeals.backend.repository.DonationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DonationService {

    private final DonationRepository donationRepository;
    private final ClaimRepository claimRepository;

    public DonationService(DonationRepository donationRepository, ClaimRepository claimRepository) {
        this.donationRepository = donationRepository;
        this.claimRepository = claimRepository;
    }

    public List<DonationResponse> getListings(DonationStatus status) {
        List<Donation> donations = status != null
                ? donationRepository.findByStatusOrderByCreatedAtDesc(status)
                : donationRepository.findAllByOrderByCreatedAtDesc();
        return toResponses(donations);
    }

    public List<DonationResponse> getMyListings(Long donorId) {
        return toResponses(donationRepository.findByDonorIdOrderByCreatedAtDesc(donorId));
    }

    public DonationResponse getById(Long id) {
        return toResponse(find(id));
    }

    @Transactional
    public DonationResponse create(User donor, DonationRequest request) {
        Donation donation = new Donation();
        apply(donation, request);
        donation.setDonor(donor);
        donation.setStatus(DonationStatus.AVAILABLE);
        return toResponse(donationRepository.save(donation));
    }

    @Transactional
    public DonationResponse update(Long id, User actor, DonationRequest request) {
        Donation donation = find(id);
        ensureOwner(actor, donation);
        apply(donation, request);
        return toResponse(donationRepository.save(donation));
    }

    @Transactional
    public void delete(Long id, User actor) {
        Donation donation = find(id);
        ensureOwner(actor, donation);
        donationRepository.delete(donation);
    }

    private void apply(Donation donation, DonationRequest request) {
        donation.setTitle(request.title().trim());
        donation.setCategory(request.category());
        donation.setQuantity(request.quantity());
        donation.setUnit(request.unit());
        donation.setDescription(request.description());
        donation.setLocation(request.location().trim());
        donation.setPickupBy(request.pickupBy());
        donation.setImageUrl(request.imageUrl());
    }

    private Donation find(Long id) {
        return donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));
    }

    private void ensureOwner(User actor, Donation donation) {
        if (actor.getRole() != Role.ADMIN && !donation.getDonor().getId().equals(actor.getId())) {
            throw new UnauthorizedException("You can only manage your own listings");
        }
    }

    private DonationResponse toResponse(Donation donation) {
        String claimedByName = claimRepository
                .findFirstByDonationIdOrderByCreatedAtAsc(donation.getId())
                .map(claim -> claim.getNgo().getName())
                .orElse(null);
        return DonationResponse.from(donation, claimedByName);
    }

    private List<DonationResponse> toResponses(List<Donation> donations) {
        if (donations.isEmpty()) {
            return List.of();
        }

        List<Long> donationIds = donations.stream().map(Donation::getId).toList();
        Map<Long, String> claimedByName = claimRepository.findByDonationIdIn(donationIds).stream()
                .collect(Collectors.groupingBy(
                        claim -> claim.getDonation().getId(),
                        Collectors.collectingAndThen(
                                Collectors.minBy(Comparator.comparing(claim -> claim.getCreatedAt() == null
                                        ? java.time.LocalDateTime.MAX
                                        : claim.getCreatedAt())),
                                claim -> claim.map(c -> c.getNgo().getName()).orElse(null)
                        )
                ));

        return donations.stream()
                .map(donation -> DonationResponse.from(donation, claimedByName.get(donation.getId())))
                .toList();
    }
}