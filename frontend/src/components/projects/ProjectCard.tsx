import { useState } from "react";
import { MoreVertical, Edit, Trash, Archive, Code2, Download } from "lucide-react";
import { Project } from "./ProjectList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onArchive?: (id: string) => void;
  onDownload?: (id: string) => void;
}

export default function ProjectCard({ 
  project, 
  onDelete, 
  onEdit,
  onArchive,
  onDownload
}: ProjectCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const formatDate = (date?: Date) => {
    if (!date) return "Unknown date";
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleEdit = () => {
    onEdit(project.id);
    setIsMenuOpen(false);
  };
  
  const handleDelete = () => {
    onDelete(project.id);
    setIsMenuOpen(false);
  };
  
  const handleArchive = () => {
    if (onArchive) {
      onArchive(project.id);
      setIsMenuOpen(false);
    }
  };
  
  const handleDownload = () => {
    if (onDownload) {
      onDownload(project.id);
    } else if (project.filePath) {
      // Default download handler
      api.downloadFile(`/projects/${project.id}/download`);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
          <p className="text-sm text-gray-500 mb-3">
            Created {formatDate(project.createdAt)}
          </p>
        </div>
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            
            {project.filePath && (
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
            )}
            
            {onArchive && (
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="mr-2 h-4 w-4" />
                <span>Archive</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <p className="text-sm mb-4 line-clamp-2">{project.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {project.tags && project.tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="px-2 py-0.5 text-xs">
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Code2 className="h-4 w-4 text-primary mr-1" />
          <span className="text-sm font-medium">{project.language || "Unknown"}</span>
        </div>
        
        {project.fileName && (
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm"
              className="h-7 text-xs"
              onClick={handleDownload}
            >
              <Download className="mr-1 h-3 w-3" />
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
