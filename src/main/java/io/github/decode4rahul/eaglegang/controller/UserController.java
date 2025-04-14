package io.github.decode4rahul.eaglegang.controller;

import io.github.decode4rahul.eaglegang.model.UserProfile;
import io.github.decode4rahul.eaglegang.model.UserSettings;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    // Placeholder for demo purposes (would use a user repository in production)
    private UserProfile demoProfile = new UserProfile(
            "1",
            "John Doe",
            "john.doe@example.com",
            "https://randomuser.me/api/portraits/men/1.jpg"
    );
    
    private UserSettings demoSettings = new UserSettings(
            "1",
            "light",
            true,
            false
    );

    // Get user profile
    @GetMapping("/profile")
    public ResponseEntity<UserProfile> getUserProfile() {
        return ResponseEntity.ok(demoProfile);
    }
    
    // Update user profile
    @PutMapping("/profile")
    public ResponseEntity<UserProfile> updateUserProfile(@RequestBody UserProfile updatedProfile) {
        // In a real app, we would validate the user's identity
        demoProfile.setName(updatedProfile.getName());
        demoProfile.setEmail(updatedProfile.getEmail());
        if (updatedProfile.getAvatarUrl() != null) {
            demoProfile.setAvatarUrl(updatedProfile.getAvatarUrl());
        }
        
        return ResponseEntity.ok(demoProfile);
    }
    
    // Get user settings
    @GetMapping("/settings")
    public ResponseEntity<UserSettings> getUserSettings() {
        return ResponseEntity.ok(demoSettings);
    }
    
    // Update user settings
    @PutMapping("/settings")
    public ResponseEntity<UserSettings> updateUserSettings(@RequestBody UserSettings updatedSettings) {
        // In a real app, we would validate the user's identity
        demoSettings.setTheme(updatedSettings.getTheme());
        demoSettings.setEmailNotifications(updatedSettings.isEmailNotifications());
        demoSettings.setDesktopNotifications(updatedSettings.isDesktopNotifications());
        
        return ResponseEntity.ok(demoSettings);
    }
} 