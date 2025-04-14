import ProjectList, { Project } from "@/components/projects/ProjectList";
import { useState, useEffect } from "react";
import { BackendStatus } from "@/components/BackendStatus";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
import ProjectForm from "@/components/projects/ProjectForm";
import UploadArea from "@/components/projects/UploadArea";

export default function Projects() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
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
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleUploadComplete = (fileName: string) => {
    setUploadedFileName(fileName);
    setIsFormDialogOpen(true);
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

  const handleProjectSubmit = async (projectData: any) => {
    try {
      if (projectToEdit) {
        // Update existing project
        const response = await api.put<Project>(`/projects/${projectToEdit.id}`, projectData);
        if (response.error) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          });
        } else if (response.data) {
          setProjects(projects.map(p => p.id === projectToEdit.id ? response.data! : p));
          toast({
            title: "Project Updated",
            description: "Your project has been updated successfully.",
          });
        }
      } else {
        // Create new project
        const response = await api.post<Project>('/projects', projectData);
        if (response.error) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          });
        } else if (response.data) {
          setProjects([response.data, ...projects]);
          toast({
            title: "Project Added",
            description: "Your project has been added to your collection.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    } finally {
      setIsFormDialogOpen(false);
      setProjectToEdit(null);
      setUploadedFileName(null);
    }
  };

  return (
    <div className="container py-6 space-y-6 max-w-7xl">
      <h1 className="text-3xl font-bold">My Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {loading ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-center">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200">
              <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
              <p className="text-red-600">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : projects.length > 0 ? (
            <ProjectList 
              projects={projects} 
              onDeleteProject={handleDeleteProject} 
              onEditProject={handleEditProject}
            />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">No Projects Yet</h2>
              <p className="text-gray-500 mb-4">Your projects will appear here once you create them.</p>
              <Button
                onClick={() => setIsFormDialogOpen(true)}
              >
                Create New Project
              </Button>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <BackendStatus />
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            <Button
              className="w-full mt-2"
              onClick={() => setIsFormDialogOpen(true)}
            >
              Create Project
            </Button>
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Upload Code</p>
              <UploadArea onUploadComplete={handleUploadComplete} />
            </div>
          </div>
        </div>
      </div>

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