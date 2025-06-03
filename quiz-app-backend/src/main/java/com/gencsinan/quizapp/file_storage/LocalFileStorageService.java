package com.gencsinan.quizapp.file_storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class LocalFileStorageService implements FileStorageService {
    private final Path uploadDir = Paths.get("uploaded_files", "questions");

    public LocalFileStorageService() {
        try {
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory", e);
        }
    }

    @Override
    public String saveFile(MultipartFile file, String fileName) {
        try {
            Path filePath = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
            String fileUrlPath = "/files/questions/" + fileName;

            return baseUrl + fileUrlPath;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public void deleteFile(String fileName) {
        try {
            Path filePath = uploadDir.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not delete file " + fileName, e);
        }
    }

    public static String getExtension(String originalName) {
        if (originalName == null) return "";
        int dot = originalName.lastIndexOf('.');
        return (dot != -1) ? originalName.substring(dot) : "";
    }

    public static String extractFileNameFromPath(String imagePath) {
        if (imagePath == null) return null;
        int lastSlash = imagePath.lastIndexOf('/');
        if (lastSlash == -1) return imagePath;
        return imagePath.substring(lastSlash + 1);
    }
}
