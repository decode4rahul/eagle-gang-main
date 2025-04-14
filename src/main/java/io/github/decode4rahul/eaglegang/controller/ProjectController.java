package io.github.decode4rahul.eaglegang.controller;

import io.github.decode4rahul.eaglegang.model.Project;
import io.github.decode4rahul.eaglegang.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * REST Controller that handles all project-related HTTP requests in the Eagle Gang application.
 * 
 * <p>This controller exposes endpoints for creating, retrieving, updating, and deleting projects,
 * as well as specialized operations like archiving projects and managing project files. It delegates
 * the actual business logic to the ProjectService.</p>
 * 
 * <p>The base URL for all endpoints is '/api/projects'.</p>
 *
 * @author decode4rahul
 * @version 1.0
 * @since 2025-04-14
 */
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    /**
     * Constructs a new ProjectController with the required service dependency.
     *
     * @param projectService the service for project operations
     */
    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    /**
     * Retrieves all active (non-archived) projects.
     *
     * @return a list of all active projects
     */
    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    /**
     * Retrieves a specific project by its ID.
     *
     * @param id the ID of the project to retrieve
     * @return a ResponseEntity containing the project if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable String id) {
        Project project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    /**
     * Creates a new project with an optional file upload.
     * 
     * <p>This endpoint accepts multipart form data, allowing for both project metadata
     * and file data to be submitted in a single request.</p>
     *
     * @param project the project metadata, deserialized from the 'project' part of the request
     * @param file the file to be associated with the project (optional)
     * @return a ResponseEntity containing the created project
     */
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Project> createProject(
            @RequestPart("project") Project project,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        
        Project createdProject = projectService.createProject(project, file);
        
        return ResponseEntity.ok(createdProject);
    }

    /**
     * Creates a new project without a file attachment.
     * 
     * <p>This endpoint provides compatibility for clients that cannot or do not
     * need to upload a file when creating a project.</p>
     *
     * @param project the project data in JSON format
     * @return a ResponseEntity containing the created project
     */
    @PostMapping(consumes = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project createdProject = projectService.createProject(project, null);
        return ResponseEntity.ok(createdProject);
    }

    /**
     * Updates an existing project's metadata.
     *
     * @param id the ID of the project to update
     * @param project the new project data
     * @return a ResponseEntity containing the updated project
     */
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable String id, @RequestBody Project project) {
        Project updatedProject = projectService.updateProject(id, project);
        return ResponseEntity.ok(updatedProject);
    }

    /**
     * Deletes a project by its ID.
     * 
     * <p>This operation removes both the project metadata from the database
     * and any associated file from the file system.</p>
     *
     * @param id the ID of the project to delete
     * @return a ResponseEntity containing a confirmation message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Project deleted successfully");
        response.put("id", id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Archives a project by setting its 'archived' flag to true.
     * 
     * <p>This is a soft-delete operation that keeps the project in the database
     * but excludes it from the main project list.</p>
     *
     * @param id the ID of the project to archive
     * @return a ResponseEntity containing the archived project
     */
    @PutMapping("/{id}/archive")
    public ResponseEntity<Project> archiveProject(@PathVariable String id) {
        Project project = projectService.archiveProject(id);
        return ResponseEntity.ok(project);
    }
    
    /**
     * Retrieves all archived projects.
     *
     * @return a list of all archived projects
     */
    @GetMapping("/archived")
    public List<Project> getArchivedProjects() {
        return projectService.getArchivedProjects();
    }
    
    /**
     * Provides a file download for a project's attachment.
     * 
     * <p>This endpoint streams the physical file associated with a project
     * as a downloadable resource, setting appropriate headers for browser handling.</p>
     *
     * @param id the ID of the project whose file is to be downloaded
     * @param request the HTTP request, used to determine content type
     * @return a ResponseEntity containing the file as a Resource
     */
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable String id, HttpServletRequest request) {
        Resource resource = projectService.downloadProjectFile(id);
        Project project = projectService.getProjectById(id);
        
        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // Fallback to default content type
        }
        
        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + project.getFileName() + "\"")
                .body(resource);
    }
    
    /**
     * Uploads a file for an existing project.
     * 
     * <p>This endpoint allows attaching or replacing a file for a project
     * that already exists in the database.</p>
     *
     * @param id the ID of the project to which the file should be attached
     * @param file the file to upload
     * @return a ResponseEntity containing the updated project
     */
    @PostMapping("/{id}/upload")
    public ResponseEntity<Project> uploadProjectFile(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        
        Project project = projectService.getProjectById(id);
        Project updatedProject = projectService.createProject(project, file);
        
        return ResponseEntity.ok(updatedProject);
    }
} 