package com.zerowastemeals.backend.service;

import com.zerowastemeals.backend.dto.admin.DashboardResponse;
import com.zerowastemeals.backend.entity.DonationStatus;
import com.zerowastemeals.backend.entity.Role;
import com.zerowastemeals.backend.repository.DonationRepository;
import com.zerowastemeals.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final DonationRepository donationRepository;

    public AdminService(UserRepository userRepository, DonationRepository donationRepository) {
        this.userRepository = userRepository;
        this.donationRepository = donationRepository;
    }

    public DashboardResponse getDashboard() {
        return new DashboardResponse(
                userRepository.count(),
                userRepository.countByRole(Role.DONOR),
                userRepository.countByRole(Role.NGO),
                donationRepository.count(),
                donationRepository.countByStatus(DonationStatus.AVAILABLE),
                donationRepository.countByStatus(DonationStatus.CLAIMED),
                donationRepository.countByStatus(DonationStatus.COLLECTED)
        );
    }
}