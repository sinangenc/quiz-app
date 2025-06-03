package com.gencsinan.quizapp.file_storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String saveFile(MultipartFile file, String fileName);
    void deleteFile(String fileName);
}
