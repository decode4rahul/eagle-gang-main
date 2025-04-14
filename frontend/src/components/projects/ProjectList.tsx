import { useState } from "react";
import { 
  Filter, 
  Grid, 
  LayoutGrid, 
  List, 
  Search, 
  SlidersHorizontal 
} from "lucide-react";
import ProjectCard from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

interface ProjectListProps {
  projects: Project[];
  onDeleteProject: (id: string) => void;
  onEditProject: (id: string) => void;
}

export default function ProjectList({ 
  projects, 
  onDeleteProject, 
  onEditProject 
}: ProjectListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const languages = Array.from(new Set(projects.map(project => project.language)));
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLanguage = filterLanguage === "" || project.language === filterLanguage;
    
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="md:w-[180px]">
            <div className="flex items-center gap-2">
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden md:inline">Filter</span>
                </Button>
              </CollapsibleTrigger>
              
              <div className="flex gap-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <CollapsibleContent className="mt-2">
              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Languages</SelectItem>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20">
          <Grid className="h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="font-medium text-lg">No projects found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
          : "space-y-4"
        }>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={onDeleteProject}
              onEdit={onEditProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
