package io.github.decode4rahul.eaglegang.service;

import io.github.decode4rahul.eaglegang.exception.FileNotFoundException;
import io.github.decode4rahul.eaglegang.model.Project;
import io.github.decode4rahul.eaglegang.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Service responsible for all operations related to projects in the Eagle Gang application.
 * 
 * <p>This service provides methods for creating, retrieving, updating, and deleting projects,
 * as well as handling project-specific operations like archiving and file management. It acts
 * as an intermediary between the controllers and the repository layer, implementing business
 * logic for project operations.</p>
 * 
 * <p>Project file management is delegated to the FileStorageService.</p>
 *
 * @author decode4rahul
 * @version 1.0
 * @since 2025-04-14
 */
@Service
public class ProjectService {

    /**
     * Repository for project data access.
     */
    private final ProjectRepository projectRepository;
    
    /**
     * Service for handling file storage operations.
     */
    private final FileStorageService fileStorageService;

    /**
     * Constructs a new ProjectService with the required dependencies.
     *
     * @param projectRepository repository for project data operations
     * @param fileStorageService service for file storage operations
     */
    @Autowired
    public ProjectService(ProjectRepository projectRepository, FileStorageService fileStorageService) {
        this.projectRepository = projectRepository;
        this.fileStorageService = fileStorageService;
    }

    /**
     * Retrieves all non-archived projects.
     *
     * @return a list of all active (non-archived) projects
     */
    public List<Project> getAllProjects() {
        return projectRepository.findByArchivedFalse();
    }

    /**
     * Retrieves a project by its ID.
     *
     * @param id the ID of the project to retrieve
     * @return the project with the specified ID
     * @throws RuntimeException if no project is found with the given ID
     */
    public Project getProjectById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    /**
     * Creates a new project or updates an existing one, with an optional file attachment.
     *
     * <p>If an ID is not provided, a new UUID is generated. If a file is provided,
     * it is stored and its metadata is saved with the project.</p>
     *
     * @param project the project data to save
     * @param file the file to attach to the project (can be null)
     * @return the saved project with all fields updated
     */
    public Project createProject(Project project, MultipartFile file) {
        // Generate a new ID if not provided
        if (project.getId() == null) {
            project.setId(UUID.randomUUID().toString());
        }
        
        // Set timestamp
        project.setCreatedAt(new Date());
        
        // Handle file storage if a file is provided
        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            project.setFileName(file.getOriginalFilename());
            project.setFilePath(fileName);
            project.setFileSize(file.getSize());
            project.setFileType(file.getContentType());
        }
        
        return projectRepository.save(project);
    }

    /**
     * Updates an existing project's metadata.
     *
     * <p>This method does not update file information unless explicitly provided.
     * It maintains existing file data unless new file data is part of the updated project.</p>
     *
     * @param id the ID of the project to update
     * @param project the new project data
     * @return the updated project
     * @throws RuntimeException if no project is found with the given ID
     */
    public Project updateProject(String id, Project project) {
        Project existingProject = getProjectById(id);
        
        // Update fields
        existingProject.setTitle(project.getTitle());
        existingProject.setDescription(project.getDescription());
        existingProject.setLanguage(project.getLanguage());
        existingProject.setTechStack(project.getTechStack());
        existingProject.setTags(project.getTags());
        
        // Don't override file information unless explicitly provided
        if (project.getFileName() != null) {
            existingProject.setFileName(project.getFileName());
        }
        
        existingProject.setUpdatedAt(new Date());
        
        return projectRepository.save(existingProject);
    }

    /**
     * Deletes a project by its ID, including any associated file.
     *
     * <p>This method removes both the database entry and the physical file
     * associated with the project.</p>
     *
     * @param id the ID of the project to delete
     * @throws RuntimeException if no project is found with the given ID
     */
    public void deleteProject(String id) {
        Project project = getProjectById(id);
        
        // Delete the physical file if it exists
        if (project.getFilePath() != null) {
            try {
                java.nio.file.Path filePath = java.nio.file.Paths.get(fileStorageService.getFileStorageLocation())
                    .resolve(project.getFilePath());
                java.nio.file.Files.deleteIfExists(filePath);
            } catch (Exception e) {
                // Log the error but continue with database deletion
                System.err.println("Error deleting file for project " + id + ": " + e.getMessage());
            }
        }
        
        // Delete from database
        projectRepository.delete(project);
    }

    /**
     * Archives a project by setting its 'archived' flag to true.
     *
     * <p>This is a soft-delete operation that allows projects to be hidden from
     * the main project list while still being retrievable if needed.</p>
     *
     * @param id the ID of the project to archive
     * @return the updated project with archived status
     * @throws RuntimeException if no project is found with the given ID
     */
    public Project archiveProject(String id) {
        Project project = getProjectById(id);
        project.setArchived(true);
        project.setUpdatedAt(new Date());
        return projectRepository.save(project);
    }

    /**
     * Retrieves all archived projects.
     *
     * @return a list of all archived projects
     */
    public List<Project> getArchivedProjects() {
        return projectRepository.findByArchivedTrue();
    }
    
    /**
     * Retrieves a project's file as a downloadable resource.
     *
     * <p>This method uses the FileStorageService to locate and provide
     * access to the file associated with a project.</p>
     *
     * @param id the ID of the project whose file should be downloaded
     * @return a Resource object representing the project file
     * @throws FileNotFoundException if the project has no associated file
     * @throws RuntimeException if no project is found with the given ID
     */
    public Resource downloadProjectFile(String id) {
        Project project = getProjectById(id);
        if (project.getFilePath() == null) {
            throw new FileNotFoundException("No file found for project with id: " + id);
        }
        
        return fileStorageService.loadFileAsResource(project.getFilePath());
    }
} 