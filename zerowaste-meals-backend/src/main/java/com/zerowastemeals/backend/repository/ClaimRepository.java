package com.zerowastemeals.backend.repository;

import com.zerowastemeals.backend.entity.Claim;
import com.zerowastemeals.backend.entity.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByNgoIdOrderByCreatedAtDesc(Long ngoId);

    List<Claim> findByDonationId(Long donationId);

    List<Claim> findByDonationIdIn(Collection<Long> donationIds);

    Optional<Claim> findFirstByDonationIdOrderByCreatedAtAsc(Long donationId);

    boolean existsByDonationIdAndStatus(Long donationId, DonationStatus status);
}