package io.github.decode4rahul.eaglegang.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web configuration class for the Eagle Gang application.
 * 
 * <p>This configuration class customizes the Spring MVC web layer,
 * particularly dealing with Cross-Origin Resource Sharing (CORS) settings
 * to allow frontend applications to communicate with the backend API.</p>
 *
 * @author decode4rahul
 * @version 1.0
 * @since 2025-04-14
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configures CORS settings for the application.
     * 
     * <p>This method allows the frontend application running at localhost:8090
     * to make API requests to the backend. It permits standard HTTP methods and
     * configures necessary headers for secure cross-origin communication.</p>
     *
     * @param registry the CorsRegistry to configure
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:8090")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
} 