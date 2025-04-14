package io.github.decode4rahul.eaglegang.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * Entity class representing a project in the Eagle Gang application.
 * 
 * <p>This class maps to the 'projects' table in the database and stores information
 * about user projects including metadata and file details. Each project can have
 * a title, description, programming language, technology stack, tags, and an
 * associated file.</p>
 * 
 * <p>Projects can be archived, which allows for logical organization without permanent deletion.</p>
 * 
 * @author decode4rahul
 * @version 1.0
 * @since 2025-04-14
 */
@Entity
@Table(name = "projects")
public class Project {
    /**
     * Unique identifier for the project.
     */
    @Id
    private String id;
    
    /**
     * The title of the project.
     */
    private String title;
    
    /**
     * A detailed description of the project.
     */
    private String description;
    
    /**
     * The primary programming language used in the project.
     */
    private String language;
    
    /**
     * A list of technologies or frameworks used in the project.
     * Stored in a separate table with a one-to-many relationship.
     */
    @ElementCollection
    @CollectionTable(name = "project_tech_stack", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "tech")
    private List<String> techStack;
    
    /**
     * A list of tags associated with the project for categorization.
     * Stored in a separate table with a one-to-many relationship.
     */
    @ElementCollection
    @CollectionTable(name = "project_tags", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "tag")
    private List<String> tags;
    
    /**
     * The original name of the uploaded file.
     */
    private String fileName;
    
    /**
     * The system path where the file is stored.
     */
    private String filePath;
    
    /**
     * The size of the file in bytes.
     */
    private Long fileSize;
    
    /**
     * The MIME type of the file.
     */
    private String fileType;
    
    /**
     * Flag indicating whether the project is archived.
     */
    private boolean archived;
    
    /**
     * Timestamp when the project was created.
     * This field is automatically set by Hibernate and cannot be updated.
     */
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private Date createdAt;
    
    /**
     * Timestamp when the project was last updated.
     * This field is automatically updated by Hibernate when the entity is modified.
     */
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date updatedAt;

    /**
     * Default constructor required by JPA.
     */
    public Project() {
    }

    /**
     * Gets the unique identifier of the project.
     * 
     * @return the project's ID
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the unique identifier of the project.
     * 
     * @param id the project's ID to set
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Gets the title of the project.
     * 
     * @return the project's title
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the title of the project.
     * 
     * @param title the project's title to set
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Gets the description of the project.
     * 
     * @return the project's description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the description of the project.
     * 
     * @param description the project's description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Gets the primary programming language used in the project.
     * 
     * @return the project's programming language
     */
    public String getLanguage() {
        return language;
    }

    /**
     * Sets the primary programming language used in the project.
     * 
     * @param language the project's programming language to set
     */
    public void setLanguage(String language) {
        this.language = language;
    }

    /**
     * Gets the list of technologies or frameworks used in the project.
     * 
     * @return a list of technologies in the project's tech stack
     */
    public List<String> getTechStack() {
        return techStack;
    }

    /**
     * Sets the list of technologies or frameworks used in the project.
     * 
     * @param techStack a list of technologies to set as the project's tech stack
     */
    public void setTechStack(List<String> techStack) {
        this.techStack = techStack;
    }

    /**
     * Gets the list of tags associated with the project.
     * 
     * @return a list of tags for the project
     */
    public List<String> getTags() {
        return tags;
    }

    /**
     * Sets the list of tags associated with the project.
     * 
     * @param tags a list of tags to set for the project
     */
    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    /**
     * Gets the original name of the uploaded file.
     * 
     * @return the original file name
     */
    public String getFileName() {
        return fileName;
    }

    /**
     * Sets the original name of the uploaded file.
     * 
     * @param fileName the original file name to set
     */
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    /**
     * Gets the system path where the file is stored.
     * 
     * @return the file path on the server
     */
    public String getFilePath() {
        return filePath;
    }

    /**
     * Sets the system path where the file is stored.
     * 
     * @param filePath the file path on the server to set
     */
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    /**
     * Gets the size of the file in bytes.
     * 
     * @return the file size in bytes
     */
    public Long getFileSize() {
        return fileSize;
    }

    /**
     * Sets the size of the file in bytes.
     * 
     * @param fileSize the file size in bytes to set
     */
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    /**
     * Gets the MIME type of the file.
     * 
     * @return the file's MIME type
     */
    public String getFileType() {
        return fileType;
    }

    /**
     * Sets the MIME type of the file.
     * 
     * @param fileType the file's MIME type to set
     */
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    /**
     * Checks if the project is archived.
     * 
     * @return true if the project is archived, false otherwise
     */
    public boolean isArchived() {
        return archived;
    }

    /**
     * Sets the archived status of the project.
     * 
     * @param archived true to archive the project, false to unarchive
     */
    public void setArchived(boolean archived) {
        this.archived = archived;
    }

    /**
     * Gets the timestamp when the project was created.
     * 
     * @return the creation timestamp
     */
    public Date getCreatedAt() {
        return createdAt;
    }

    /**
     * Sets the timestamp when the project was created.
     * This is generally handled automatically by Hibernate.
     * 
     * @param createdAt the creation timestamp to set
     */
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Gets the timestamp when the project was last updated.
     * 
     * @return the last update timestamp
     */
    public Date getUpdatedAt() {
        return updatedAt;
    }

    /**
     * Sets the timestamp when the project was last updated.
     * This is generally handled automatically by Hibernate.
     * 
     * @param updatedAt the update timestamp to set
     */
    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * Compares this Project object with another object for equality.
     * 
     * @param o the object to compare with
     * @return true if the objects are equal, false otherwise
     */
    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Project project = (Project) o;
        return archived == project.archived && Objects.equals(id, project.id) && Objects.equals(title, project.title) && Objects.equals(description, project.description) && Objects.equals(language, project.language) && Objects.equals(techStack, project.techStack) && Objects.equals(tags, project.tags) && Objects.equals(fileName, project.fileName) && Objects.equals(filePath, project.filePath) && Objects.equals(fileSize, project.fileSize) && Objects.equals(fileType, project.fileType) && Objects.equals(createdAt, project.createdAt) && Objects.equals(updatedAt, project.updatedAt);
    }

    /**
     * Generates a hash code for this Project object.
     * 
     * @return the hash code value
     */
    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, language, techStack, tags, fileName, filePath, fileSize, fileType, archived, createdAt, updatedAt);
    }

    /**
     * Returns a string representation of this Project object.
     * 
     * @return a string containing all project details
     */
    @Override
    public String toString() {
        return "Project{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", language='" + language + '\'' +
                ", techStack=" + techStack +
                ", tags=" + tags +
                ", fileName='" + fileName + '\'' +
                ", filePath='" + filePath + '\'' +
                ", fileSize=" + fileSize +
                ", fileType='" + fileType + '\'' +
                ", archived=" + archived +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}