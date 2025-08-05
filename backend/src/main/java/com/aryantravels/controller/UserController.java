package com.aryantravels.controller;

import com.aryantravels.model.User;
import com.aryantravels.service.AuthService;
import com.aryantravels.util.JwtUtil;
import com.aryantravels.service.JourneyService;
import com.aryantravels.dto.CreateJourneyRequest;
import com.aryantravels.dto.JourneyResponse;
import com.aryantravels.repository.JourneyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JourneyService journeyService;

    @Autowired
    private JourneyRepository journeyRepository;

    @PostMapping("/createjourney")
    public ResponseEntity<JourneyResponse>createJourney(@RequestBody CreateJourneyRequest journeyRequest) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            String userId = (String) authentication.getDetails();

            // String userId = jwtUtil.extractUserIdFromToken(authentication.getDetails().toString());
            System.out.println(userId);
            JourneyResponse response = journeyService.createJourney(journeyRequest,userId);

          if (response.getMessage() != null && response.getMessage().startsWith("Error:")) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/journeys")
    public ResponseEntity<List<JourneyResponse>> getJourneys() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            String userId = (String) authentication.getDetails();
            // String role = jwtUtil.extractRoleFromToken(token);
            // System.out.println(role);
            String role = authentication.getAuthorities().stream()
            .findFirst()
            .map(auth -> auth.getAuthority().replace("ROLE_", ""))
            .orElse("USER");
            List<JourneyResponse> journeys = journeyService.getJourneys(userId,role);

            return ResponseEntity.ok(journeys);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/journeys/{journeyId}")
    public ResponseEntity<JourneyResponse> updateJourney(@PathVariable String journeyId, @RequestBody CreateJourneyRequest journeyRequest) {
        try {
            JourneyResponse response = journeyService.updateJourney(journeyId, journeyRequest);
            return ResponseEntity.ok(response);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            String userId = (String) authentication.getDetails();

            User user = authService.getUserByEmail(email);
            
            if (user == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "User not found");
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            response.put("createdAt", user.getCreatedAt());

            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get user profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getUserDashboard() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            User user = authService.getUserByEmail(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Welcome to your dashboard, " + user.getName() + "!");
            response.put("user", Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole()
            ));

            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get dashboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
