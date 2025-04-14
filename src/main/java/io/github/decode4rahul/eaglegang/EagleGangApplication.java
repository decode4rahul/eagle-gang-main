package io.github.decode4rahul.eaglegang;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The main entry point for the Eagle Gang application.
 * 
 * <p>This Spring Boot application provides a platform for storing and managing project files.
 * It includes features for uploading, downloading, and storing project files in a MySQL database,
 * along with metadata and user information.</p>
 * 
 * <p>The application serves as a central repository for academic projects,
 * allowing users to organize, share, and archive their work.</p>
 *
 * @author decode4rahul
 * @version 1.0
 * @since 2025-04-14
 */
@SpringBootApplication
public class EagleGangApplication {

	/**
	 * The main method that starts the Eagle Gang application.
	 *
	 * <p>This method bootstraps the Spring Boot application context and
	 * initializes all configured components, services, and controllers.</p>
	 *
	 * @param args command-line arguments passed to the application
	 */
	public static void main(String[] args) {
		SpringApplication.run(EagleGangApplication.class, args);
	}

}
