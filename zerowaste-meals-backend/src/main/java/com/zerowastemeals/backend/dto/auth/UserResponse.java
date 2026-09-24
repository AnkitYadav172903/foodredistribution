package com.zerowastemeals.backend.dto.auth;

import com.zerowastemeals.backend.entity.Role;
import com.zerowastemeals.backend.entity.User;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        Role role,
        String organization,
        String city,
        LocalDateTime createdAt
) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getOrganization(),
                user.getCity(),
                user.getCreatedAt()
        );
    }
}