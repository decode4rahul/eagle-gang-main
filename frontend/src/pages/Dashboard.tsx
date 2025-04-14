import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import UploadArea from "@/components/projects/UploadArea";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectList, { Project } from "@/components/projects/ProjectList";
import { BackendStatus } from "@/components/BackendStatus";
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
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const handleUploadComplete = (fileName: string) => {
    setUploadedFileName(fileName);
    setIsFormDialogOpen(true);
  };

  const handleProjectSubmit = (projectData: any) => {
    const newProject = {
      ...projectData,
      id: projectToEdit ? projectToEdit.id : uuidv4(),
    };

    if (projectToEdit) {
      setProjects(projects.map(p => p.id === projectToEdit.id ? newProject : p));
      toast({
        title: "Project Updated",
        description: "Your project has been updated successfully.",
      });
      setProjectToEdit(null);
    } else {
      setProjects([newProject, ...projects]);
      toast({
        title: "Project Added",
        description: "Your project has been added to your collection.",
      });
    }
    
    setIsFormDialogOpen(false);
    setUploadedFileName(null);
  };

  const handleDeleteProject = (id: string) => {
    setProjectToDelete(id);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      setProjects(projects.filter(p => p.id !== projectToDelete));
      toast({
        title: "Project Deleted",
        description: "Your project has been deleted successfully.",
      });
      setProjectToDelete(null);
    }
  };

  const handleEditProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setProjectToEdit(project);
      setIsFormDialogOpen(true);
    }
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
          {projects.length === 0 ? (
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
              />
            </>
          )}
        </TabsContent>
        
        <TabsContent value="recent">
          <div className="mt-6">
            <ProjectList 
              projects={projects.slice(0, 3)} 
              onDeleteProject={handleDeleteProject} 
              onEditProject={handleEditProject}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="popular">
          <div className="mt-6">
            <ProjectList 
              projects={projects.slice(0, 2)} 
              onDeleteProject={handleDeleteProject} 
              onEditProject={handleEditProject}
            />
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
