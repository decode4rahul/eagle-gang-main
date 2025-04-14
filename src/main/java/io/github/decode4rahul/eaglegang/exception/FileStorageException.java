package io.github.decode4rahul.eaglegang.exception;

/**
 * Exception thrown when there is an error during file storage operations.
 * 
 * <p>This exception is used to indicate problems related to storing, accessing,
 * or managing files in the application's file storage system. Common scenarios
 * include disk space issues, permission problems, or file system errors.</p>
 *
 * @author decode4rahul
 * @version 1.0
 * @since 2025-04-14
 */
public class FileStorageException extends RuntimeException {
    
    /**
     * Constructs a new FileStorageException with the specified detail message.
     *
     * @param message the detail message
     */
    public FileStorageException(String message) {
        super(message);
    }

    /**
     * Constructs a new FileStorageException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause of the exception
     */
    public FileStorageException(String message, Throwable cause) {
        super(message, cause);
    }
} 