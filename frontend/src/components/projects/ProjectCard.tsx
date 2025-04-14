
import { useState } from "react";
import { 
  Calendar, 
  Code2, 
  FileCode, 
  MoreVertical, 
  Pencil, 
  Tag, 
  Trash2 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

export interface Project {
  id: string;
  title: string;
  description: string;
  language: string;
  techStack: string[];
  tags: string[];
  date: Date;
  fileName: string;
}

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function ProjectCard({ project, onDelete, onEdit }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const languageColorMap: Record<string, string> = {
    JavaScript: "bg-yellow-500",
    TypeScript: "bg-blue-500",
    Python: "bg-green-500",
    Java: "bg-red-500",
    "C#": "bg-purple-500",
    Go: "bg-cyan-500",
    Ruby: "bg-pink-500",
    PHP: "bg-indigo-500",
    Swift: "bg-orange-500",
    Kotlin: "bg-violet-500",
    Rust: "bg-amber-500",
    "C++": "bg-emerald-500",
    C: "bg-blue-700"
  };

  const languageColor = languageColorMap[project.language] || "bg-gray-500";

  return (
    <Card 
      className={`overflow-hidden transition-transform duration-200 ${
        isHovered ? "shadow-lg transform scale-[1.02]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`h-1 w-full ${languageColor}`} />
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-1">{project.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(project.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(project.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <FileCode className="h-3 w-3" />
          <span>{project.fileName}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        
        <div className="flex flex-wrap gap-1 mt-3">
          <div className="flex items-center bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md">
            <Code2 className="h-3 w-3 mr-1" />
            {project.language}
          </div>
          
          {project.techStack.slice(0, 2).map((tech) => (
            <div key={tech} className="bg-secondary/50 text-xs px-2 py-1 rounded-md">
              {tech}
            </div>
          ))}
          
          {project.techStack.length > 2 && (
            <div className="bg-secondary/50 text-xs px-2 py-1 rounded-md">
              +{project.techStack.length - 2}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          {format(new Date(project.date), "MMM dd, yyyy")}
        </div>
        
        <div className="flex flex-wrap gap-1 justify-end">
          {project.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Tag className="h-2 w-2 mr-1" />
              {tag}
            </Badge>
          ))}
          
          {project.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - 2}
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
