import { BackendStatus } from "@/components/BackendStatus";

export default function Profile() {
  return (
    <div className="container py-6 space-y-6 max-w-7xl">
      <h1 className="text-3xl font-bold">User Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-xl text-primary font-semibold">
                JD
              </div>
              <div>
                <h2 className="text-xl font-semibold">John Doe</h2>
                <p className="text-gray-500">john.doe@example.com</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value="John Doe"
                    className="w-full px-3 py-2 border rounded-md"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value="john.doe@example.com"
                    className="w-full px-3 py-2 border rounded-md"
                    disabled
                  />
                </div>
              </div>
              
              <div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <BackendStatus />
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Account Status</h2>
            <p className="text-sm text-gray-500 mb-2">
              Your account is active and in good standing.
            </p>
            <div className="flex items-center mt-4">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 