import { BackendStatus } from "@/components/BackendStatus";

export default function Archive() {
  return (
    <div className="container py-6 space-y-6 max-w-7xl">
      <h1 className="text-3xl font-bold">Archive</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Archived Projects</h2>
            <p className="text-gray-500 mb-4">Your archived projects will appear here.</p>
            
            <div className="bg-muted/30 border rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium mb-2">No archived projects</h3>
              <p className="text-muted-foreground">
                Projects you archive will be stored here for future reference
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <BackendStatus />
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Archive Info</h2>
            <p className="text-sm text-gray-500 mb-4">
              Archived projects are not deleted, but they're hidden from your main projects list.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 