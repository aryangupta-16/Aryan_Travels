package com.aryantravels.dto;

public class JourneyResponse {
    
    private String id;
    private String fullName;
    private String email;
    private String contactNumber;
    private String source;
    private String destination;
    private String mode;
    private String status;
    private String message;
    // Constructors
    public JourneyResponse() {}
    
    public JourneyResponse(String id, String fullName, String email, String contactNumber, String source, String destination, String mode, String status) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.contactNumber = contactNumber;
        this.source = source;
        this.destination = destination;
        this.mode = mode;
        this.status = status;
    }
    
    public JourneyResponse(String message) {
        this.message = message;
    }
    
    // // Getters and Setters
    // public String getToken() {
    //     return token;
    // }
    
    // public void setToken(String token) {
    //     this.token = token;
    // }
    
    // public String getType() {
    //     return type;
    // }
    
    // public void setType(String type) {
    //     this.type = type;
    // }
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getContactNumber() {
        return contactNumber;
    }
    
    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }
    
    public String getMessage() {
        return message;
    }

    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }


    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}
