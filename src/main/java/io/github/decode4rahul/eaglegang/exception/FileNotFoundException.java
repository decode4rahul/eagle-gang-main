package io.github.decode4rahul.eaglegang.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a requested file cannot be found in the application.
 * 
 * <p>This exception is used when attempting to access a file (such as a project
 * attachment) that does not exist or cannot be accessed. It is annotated with
 * ResponseStatus to automatically translate the exception to an HTTP 404
 * response when thrown during request handling.</p>
 *
 * @author decode4rahul
 * @version 1.0
 * @since 2025-04-14
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class FileNotFoundException extends RuntimeException {
    
    /**
     * Constructs a new FileNotFoundException with the specified detail message.
     *
     * @param message the detail message
     */
    public FileNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructs a new FileNotFoundException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause of the exception
     */
    public FileNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
} 