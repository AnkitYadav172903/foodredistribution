package com.zerowastemeals.backend.repository;

import com.zerowastemeals.backend.entity.Donation;
import com.zerowastemeals.backend.entity.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findAllByOrderByCreatedAtDesc();

    List<Donation> findByStatusOrderByCreatedAtDesc(DonationStatus status);

    List<Donation> findByDonorIdOrderByCreatedAtDesc(Long donorId);

    long countByStatus(DonationStatus status);
}