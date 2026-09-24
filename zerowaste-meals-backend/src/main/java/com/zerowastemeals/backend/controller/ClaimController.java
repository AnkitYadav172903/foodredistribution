package com.zerowastemeals.backend.controller;

import com.zerowastemeals.backend.dto.claim.ClaimRequest;
import com.zerowastemeals.backend.dto.claim.ClaimResponse;
import com.zerowastemeals.backend.entity.User;
import com.zerowastemeals.backend.exception.ResourceNotFoundException;
import com.zerowastemeals.backend.repository.UserRepository;
import com.zerowastemeals.backend.security.UserPrincipal;
import com.zerowastemeals.backend.service.ClaimService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ClaimController {

    private final ClaimService claimService;
    private final UserRepository userRepository;

    public ClaimController(ClaimService claimService, UserRepository userRepository) {
        this.claimService = claimService;
        this.userRepository = userRepository;
    }

    @PostMapping("/api/listings/{listingId}/claim")
    @ResponseStatus(HttpStatus.CREATED)
    public ClaimResponse claim(@PathVariable Long listingId,
                               @RequestBody(required = false) ClaimRequest request,
                               Authentication authentication) {
        return claimService.claim(currentUser(authentication), listingId, request);
    }

    @PostMapping("/api/claims/{claimId}/cancel")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(@PathVariable Long claimId, Authentication authentication) {
        claimService.cancel(claimId, currentUser(authentication));
    }

    @PostMapping("/api/claims/{claimId}/confirm")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void confirmCollection(@PathVariable Long claimId, Authentication authentication) {
        claimService.confirmCollection(claimId, currentUser(authentication));
    }

    @PostMapping("/api/claims/{claimId}/reject")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reject(@PathVariable Long claimId, Authentication authentication) {
        claimService.reject(claimId, currentUser(authentication));
    }

    @GetMapping("/api/claims/my-claims")
    public List<ClaimResponse> myClaims(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return claimService.getMyClaims(principal.getId());
    }

    @GetMapping("/api/listings/{listingId}/claims")
    public List<ClaimResponse> claimsForListing(@PathVariable Long listingId, Authentication authentication) {
        return claimService.getClaimsForListing(listingId, currentUser(authentication));
    }

    private User currentUser(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}