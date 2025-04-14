package io.github.decode4rahul.eaglegang.service;

import io.github.decode4rahul.eaglegang.exception.FileStorageException;
import io.github.decode4rahul.eaglegang.exception.FileNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Service responsible for handling file storage operations in the Eagle Gang application.
 * 
 * <p>This service manages file upload, storage, and retrieval operations. It handles
 * the physical storage of files in the file system, ensuring that files are stored
 * with unique names to avoid conflicts, and provides methods for retrieving files
 * when needed.</p>
 * 
 * <p>The service uses a configurable upload directory specified in the application
 * properties using the 'file.upload-dir' property.</p>
 *
 * @author decode4rahul
 * @version 1.0
 * @since 2025-04-14
 */
@Service
public class FileStorageService {

    /**
     * The path to the directory where files will be stored.
     */
    private final Path fileStorageLocation;

    /**
     * Constructs a new FileStorageService.
     * 
     * <p>Creates the directory for file storage if it doesn't already exist.</p>
     *
     * @param uploadDir the directory path where files will be stored,
     *                 injected from application properties with key 'file.upload-dir'
     * @throws FileStorageException if the directory cannot be created
     */
    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir)
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    /**
     * Stores a file in the file system.
     * 
     * <p>This method generates a unique filename based on UUID to avoid conflicts,
     * and preserves the original file extension. The original filename is sanitized
     * to prevent directory traversal attacks.</p>
     *
     * @param file the MultipartFile to store
     * @return the generated filename used to store the file
     * @throws FileStorageException if the file cannot be stored
     */
    public String storeFile(MultipartFile file) {
        // Generate a unique filename
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        int lastIndex = originalFileName.lastIndexOf('.');
        if (lastIndex > 0) {
            fileExtension = originalFileName.substring(lastIndex);
        }
        
        String fileName = UUID.randomUUID().toString() + fileExtension;
        
        try {
            // Check if the file's name contains invalid characters
            if (fileName.contains("..")) {
                throw new FileStorageException("Filename contains invalid path sequence " + fileName);
            }

            // Copy file to the target location (replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }
    
    /**
     * Loads a file as a Resource.
     * 
     * <p>This method retrieves a previously stored file and makes it
     * available as a Spring Resource, which can be used to download the file.</p>
     *
     * @param fileName the name of the file to load
     * @return a Resource object representing the file
     * @throws FileNotFoundException if the file does not exist
     */
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new FileNotFoundException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new FileNotFoundException("File not found " + fileName, ex);
        }
    }
    
    /**
     * Gets the absolute path to the file storage location.
     * 
     * <p>This method is useful for operations that need direct access
     * to the file system path where files are stored.</p>
     *
     * @return the absolute path to the file storage directory
     */
    public String getFileStorageLocation() {
        return fileStorageLocation.toString();
    }
} 