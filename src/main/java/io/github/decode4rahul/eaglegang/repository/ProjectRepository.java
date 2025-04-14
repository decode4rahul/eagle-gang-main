package io.github.decode4rahul.eaglegang.repository;

import io.github.decode4rahul.eaglegang.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Project entity operations.
 * 
 * <p>This interface provides database access operations for Project entities using Spring Data JPA.
 * It extends JpaRepository to inherit common CRUD operations and adds custom query methods
 * for specific data access needs, such as filtering by archived status.</p>
 * 
 * <p>The repository uses String as the ID type for Project entities.</p>
 *
 * @author decode4rahul
 * @version 1.0
 * @since 2025-04-14
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    
    /**
     * Finds all projects that are marked as archived.
     * 
     * <p>This method leverages Spring Data JPA's method name query derivation to
     * automatically generate a query based on the method name.</p>
     *
     * @return a list of all archived projects
     */
    List<Project> findByArchivedTrue();
    
    /**
     * Finds all projects that are not archived.
     * 
     * <p>This method leverages Spring Data JPA's method name query derivation to
     * automatically generate a query based on the method name.</p>
     *
     * @return a list of all active (non-archived) projects
     */
    List<Project> findByArchivedFalse();
} 