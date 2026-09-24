package com.zerowastemeals.backend.controller;

import com.zerowastemeals.backend.dto.donation.DonationRequest;
import com.zerowastemeals.backend.dto.donation.DonationResponse;
import com.zerowastemeals.backend.entity.DonationStatus;
import com.zerowastemeals.backend.entity.User;
import com.zerowastemeals.backend.repository.UserRepository;
import com.zerowastemeals.backend.security.UserPrincipal;
import com.zerowastemeals.backend.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;
    private final UserRepository userRepository;

    public DonationController(DonationService donationService, UserRepository userRepository) {
        this.donationService = donationService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<DonationResponse> list(@RequestParam(required = false) DonationStatus status) {
        return donationService.getListings(status);
    }

    @GetMapping("/my-listings")
    public List<DonationResponse> myListings(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return donationService.getMyListings(principal.getId());
    }

    @GetMapping("/{id}")
    public DonationResponse get(@PathVariable Long id) {
        return donationService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DonationResponse create(@Valid @RequestBody DonationRequest request, Authentication authentication) {
        return donationService.create(currentUser(authentication), request);
    }

    @PutMapping("/{id}")
    public DonationResponse update(@PathVariable Long id,
                                   @Valid @RequestBody DonationRequest request,
                                   Authentication authentication) {
        return donationService.update(id, currentUser(authentication), request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication authentication) {
        donationService.delete(id, currentUser(authentication));
    }

    private User currentUser(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new com.zerowastemeals.backend.exception.ResourceNotFoundException("User not found"));
    }
}