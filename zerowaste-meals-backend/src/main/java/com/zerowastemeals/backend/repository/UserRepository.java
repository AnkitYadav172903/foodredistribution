package com.zerowastemeals.backend.repository;

import com.zerowastemeals.backend.entity.Role;
import com.zerowastemeals.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(Role role);

    List<User> findByRole(Role role);

    /**
     * Finds users of a role whose registered city matches a free-text pickup location. A listing
     * location such as "Andheri West, Mumbai" still matches an NGO registered in "Mumbai".
     */
    @Query("""
            select u from User u
             where u.role = :role
               and (
                    lower(trim(u.city)) = lower(trim(:location))
                 or lower(:location) like '%' || lower(trim(u.city)) || '%'
               )
            """)
    List<User> findByRoleAndCityMatchingLocation(@Param("role") Role role,
                                                 @Param("location") String location);
}