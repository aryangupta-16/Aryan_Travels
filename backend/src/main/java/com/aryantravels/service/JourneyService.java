package com.aryantravels.service;

import com.aryantravels.dto.AuthResponse;
import com.aryantravels.dto.LoginRequest;
import com.aryantravels.dto.SignupRequest;
import com.aryantravels.dto.CreateJourneyRequest;
import com.aryantravels.dto.JourneyResponse;
import com.aryantravels.model.Journey;
import com.aryantravels.repository.UserRepository;
import com.aryantravels.repository.JourneyRepository;
import com.aryantravels.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JourneyService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JourneyRepository journeyRepository;


    public JourneyResponse createJourney(CreateJourneyRequest journeyRequest,String userId) {
        try {

            Journey journey = new Journey(
                journeyRequest.getFullName(),
                journeyRequest.getEmail(),
                journeyRequest.getContactNumber(),
                journeyRequest.getSource(),
                journeyRequest.getDestination(),
                journeyRequest.getMode(),
                userId
            );

            journey.setStatus("Pending");

            Journey savedJourney = journeyRepository.save(journey);

            return new JourneyResponse(
                savedJourney.getId(),
                savedJourney.getFullName(),
                savedJourney.getEmail(),
                savedJourney.getContactNumber(),
                savedJourney.getSource(),
                savedJourney.getDestination(),
                savedJourney.getMode(),
                savedJourney.getStatus()
            );

        } catch (Exception e) {
            return new JourneyResponse("Error: Failed to create journey - " + e.getMessage());
        }
    }

    public List<JourneyResponse> getJourneys(String userId,String role) {
        try {

            if(role.toLowerCase().equals("admin")){
                System.out.println("Admin");
                return journeyRepository.findAll().stream()
                .map(journey -> new JourneyResponse(
                    journey.getId(),
                    journey.getFullName(),
                    journey.getEmail(),
                    journey.getContactNumber(),
                    journey.getSource(),
                    journey.getDestination(),
                    journey.getMode(),
                    journey.getStatus()
                ))
                .collect(Collectors.toList());
            }

            List<Journey> journeys = journeyRepository.findByUserId(userId);
            return journeys.stream()
                .map(journey -> new JourneyResponse(
                    journey.getId(),
                    journey.getFullName(),
                    journey.getEmail(),
                    journey.getContactNumber(),
                    journey.getSource(),
                    journey.getDestination(),
                    journey.getMode(),
                    journey.getStatus()
                ))
                .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error: No Journeys found - " + e.getMessage());
        }
    }

    public JourneyResponse updateJourney(String journeyId, CreateJourneyRequest journeyRequest) {
        try {

            Journey journey = journeyRepository.findById(journeyId).orElse(null);
            if (journey == null) {
                return new JourneyResponse("Error: Journey not found");
            }
            journey.setStatus(journeyRequest.getStatus());
            Journey savedJourney = journeyRepository.save(journey);
            return new JourneyResponse(
                savedJourney.getId(),
                savedJourney.getFullName(),
                savedJourney.getEmail(),
                savedJourney.getContactNumber(),
                savedJourney.getSource(),
                savedJourney.getDestination(),
                savedJourney.getMode(),
                savedJourney.getStatus()
            );
        } catch (Exception e) {
            return new JourneyResponse("Error: Failed to update journey - " + e.getMessage());
        }
    }

    // public JourneyResponse getUserByEmail(String email) {
    //     return journeyRepository.findByEmail(email).orElse(null);
    // }

    // public JourneyResponse getUserById(String id) {
    //     return journeyRepository.findById(id).orElse(null);
    // }
}
