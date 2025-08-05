package com.aryantravels.repository;

import com.aryantravels.model.Journey;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JourneyRepository extends MongoRepository<Journey, String> {
    
    Optional<Journey> findByEmail(String email);
    
    Boolean existsByEmail(String email);

    List<Journey> findByUserId(String userId);
    
    // Optional<Journey> findByEmailAndEnabled(String email, boolean enabled);
}
