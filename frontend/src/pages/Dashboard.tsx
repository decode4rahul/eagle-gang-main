import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import UploadArea from "@/components/projects/UploadArea";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectList, { Project } from "@/components/projects/ProjectList";
import { BackendStatus } from "@/components/BackendStatus";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from "uuid";

export default function Dashboard() {
  const { toast } = useToast();
  
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [uploadedProjectId, setUploadedProjectId] = useState<string | null>(null);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Project[]>('/projects');
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setProjects(response.data);
      }
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = (fileName: string, projectId?: string) => {
    setUploadedFileName(fileName);
    
    if (projectId) {
      // If the file was uploaded directly with project data
      setUploadedProjectId(projectId);
      toast({
        title: "Project Created",
        description: "Your project was created with the uploaded file. You can edit it to add more details.",
      });
      // Refresh the project list
      fetchProjects();
    } else {
      // If we need additional project info
      setIsFormDialogOpen(true);
    }
  };

  const handleProjectSubmit = async (projectData: any) => {
    try {
      let response;
      
      if (projectToEdit) {
        // Update existing project
        response = await api.put<Project>(`/projects/${projectToEdit.id}`, {
          ...projectData,
          id: projectToEdit.id
        });
      } else if (uploadedProjectId) {
        // Update the project created during upload
        response = await api.put<Project>(`/projects/${uploadedProjectId}`, {
          ...projectData,
          id: uploadedProjectId
        });
      } else {
        // Create new project
        response = await api.post<Project>('/projects', projectData);
      }
      
      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      } else {
        if (projectToEdit) {
          setProjects(prev => prev.map(p => p.id === projectToEdit.id ? response.data! : p));
          toast({
            title: "Project Updated",
            description: "Your project has been updated successfully.",
          });
        } else {
          setProjects(prev => [response.data!, ...prev]);
          toast({
            title: "Project Created",
            description: "Your project has been created successfully.",
          });
        }
        setProjectToEdit(null);
        setUploadedProjectId(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsFormDialogOpen(false);
      setUploadedFileName(null);
    }
  };

  const handleDeleteProject = (id: string) => {
    setProjectToDelete(id);
  };

  const confirmDeleteProject = async () => {
    if (projectToDelete) {
      try {
        const response = await api.delete(`/projects/${projectToDelete}`);
        if (response.error) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          });
        } else {
          setProjects(projects.filter(p => p.id !== projectToDelete));
          toast({
            title: "Project Deleted",
            description: "Your project has been deleted successfully.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete project",
          variant: "destructive",
        });
      } finally {
        setProjectToDelete(null);
      }
    }
  };

  const handleEditProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setProjectToEdit(project);
      setIsFormDialogOpen(true);
    }
  };

  const handleDownloadProject = (id: string) => {
    api.downloadFile(`/projects/${id}/download`);
  };

  return (
    <div className="container py-6 space-y-8 max-w-7xl">
      <h1 className="text-3xl font-bold">My Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <BackendStatus />
        </div>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            <p className="text-sm text-gray-500 mb-4">Create a new project or upload files</p>
            <button 
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded"
              onClick={() => setIsFormDialogOpen(true)}
            >
              Create New Project
            </button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-6 mt-6">
          {isLoading ? (
            <div className="bg-muted/30 border rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Loading projects...</h3>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error loading projects</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                className="px-4 py-2 bg-primary text-primary-foreground rounded"
                onClick={fetchProjects}
              >
                Try Again
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-muted/30 border rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload your first code archive to get started
              </p>
              <UploadArea onUploadComplete={handleUploadComplete} />
            </div>
          ) : (
            <>
              <UploadArea onUploadComplete={handleUploadComplete} />
              <ProjectList 
                projects={projects} 
                onDeleteProject={handleDeleteProject} 
                onEditProject={handleEditProject}
                onDownloadProject={handleDownloadProject}
              />
            </>
          )}
        </TabsContent>
        
        <TabsContent value="recent">
          <div className="mt-6">
            {!isLoading && !error && projects.length > 0 ? (
              <ProjectList 
                projects={projects.slice(0, 3)} 
                onDeleteProject={handleDeleteProject} 
                onEditProject={handleEditProject}
                onDownloadProject={handleDownloadProject}
              />
            ) : (
              <div className="bg-muted/30 border rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium mb-2">No recent projects</h3>
                <p className="text-muted-foreground">
                  Your most recent projects will appear here
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="popular">
          <div className="mt-6">
            {!isLoading && !error && projects.length > 0 ? (
              <ProjectList 
                projects={projects.slice(0, 2)} 
                onDeleteProject={handleDeleteProject} 
                onEditProject={handleEditProject}
                onDownloadProject={handleDownloadProject}
              />
            ) : (
              <div className="bg-muted/30 border rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium mb-2">No popular projects</h3>
                <p className="text-muted-foreground">
                  Your most popular projects will appear here
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog 
        open={isFormDialogOpen} 
        onOpenChange={(open) => {
          setIsFormDialogOpen(open);
          if (!open) {
            setProjectToEdit(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {projectToEdit ? "Edit Project" : "Project Details"}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm 
            fileName={projectToEdit?.fileName || uploadedFileName || ""} 
            onSubmit={handleProjectSubmit}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={projectToDelete !== null} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and remove it from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProject}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
