import { BackendStatus } from "@/components/BackendStatus";
import { useState } from "react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    desktop: false
  });
  
  const [theme, setTheme] = useState("light");
  
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };
  
  const handleNotificationChange = (type: 'email' | 'desktop') => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  return (
    <div className="container py-6 space-y-6 max-w-7xl">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Theme</h3>
                <div className="flex items-center">
                  <select 
                    value={theme} 
                    onChange={handleThemeChange}
                    className="w-full md:w-1/3 px-3 py-2 border rounded-md"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="email-notifications"
                      checked={notifications.email}
                      onChange={() => handleNotificationChange('email')}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="email-notifications">
                      Email Notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="desktop-notifications"
                      checked={notifications.desktop}
                      onChange={() => handleNotificationChange('desktop')}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="desktop-notifications">
                      Desktop Notifications
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <BackendStatus />
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Connected Services</h2>
            <p className="text-sm text-gray-500 mb-4">
              Manage connections to external services and APIs.
            </p>
            <div className="flex items-center justify-between py-2 border-b">
              <span>Spring Boot API</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 