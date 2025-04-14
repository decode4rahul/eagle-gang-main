
import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Dashboard from "@/pages/Dashboard";
import AuthForm from "@/components/auth/AuthForm";

export default function Index() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthenticated) {
    return <AuthForm onAuthenticate={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <Header 
        toggleSidebar={toggleSidebar} 
        isAuthenticated={isAuthenticated} 
        setIsAuthenticated={setIsAuthenticated}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}
