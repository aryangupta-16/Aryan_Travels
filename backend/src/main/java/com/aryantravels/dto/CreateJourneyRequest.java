package com.aryantravels.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public class CreateJourneyRequest{
    
    @NotBlank(message = "Name is required")
    private String fullName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Contact Number is required")
    private String contactNumber;

    @NotBlank(message = "Source is required")
    private String source;
    
    @NotBlank(message = "Destination is required")
    private String destination;
    
    @NotBlank(message = "Mode is required")
    private String mode;

    private String status = "Pending";

    public CreateJourneyRequest() {}

    public CreateJourneyRequest(String fullName,String email,String contactNumber,String source,String destination,String mode) {
        this.fullName = fullName;
        this.email = email;
        this.contactNumber = contactNumber;
        this.source = source;
        this.destination = destination;
        this.mode = mode;

        System.out.println("constructor called1");
    }

    public CreateJourneyRequest(String fullName,String email,String contactNumber,String source,String destination,String mode,String status) {
        this.fullName = fullName;
        this.email = email;
        this.contactNumber = contactNumber;
        this.source = source;
        this.destination = destination;
        this.mode = mode;
        this.status = status;

        System.out.println("constructor called");
    }

    public CreateJourneyRequest(String status){
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
    
    public String getMode() {
        return mode;
    }
    
    public void setMode(String mode) {
        this.mode = mode;
    }
}