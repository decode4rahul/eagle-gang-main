package io.github.decode4rahul.eaglegang.model;

public class UserSettings {
    private String userId;
    private String theme;
    private boolean emailNotifications;
    private boolean desktopNotifications;

    public UserSettings() {
    }

    public UserSettings(String userId, String theme, boolean emailNotifications, boolean desktopNotifications) {
        this.userId = userId;
        this.theme = theme;
        this.emailNotifications = emailNotifications;
        this.desktopNotifications = desktopNotifications;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public boolean isEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public boolean isDesktopNotifications() {
        return desktopNotifications;
    }

    public void setDesktopNotifications(boolean desktopNotifications) {
        this.desktopNotifications = desktopNotifications;
    }
} 