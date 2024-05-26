package com.cmr.fileservice.services;

import com.cmr.fileservice.dtos.FileDto;
import com.cmr.fileservice.entities.FileMetaData;
import com.cmr.fileservice.mappers.FileMapper;
import com.cmr.fileservice.repositories.FileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileService {

    private final FileRepository fileRepository;
    private final FileMapper fileMapper;

    public FileService(FileRepository fileRepository, FileMapper fileMapper) {
        this.fileRepository = fileRepository;
        this.fileMapper = fileMapper;
    }


    public List<FileMetaData> getFilesByUserId(Long userId) {
        return fileRepository.findByUserId(userId);
    }

    public List<FileMetaData> getFilesByMinioObjectName(String minioObjectName) {
        return fileRepository.findByMinioObjectName(minioObjectName);
    }

    public FileMetaData saveFile(FileDto fileDto) {
        FileMetaData entity = fileMapper.toEntity(fileDto);
        return fileRepository.save(entity);
    }

    public void deleteFile(Long id) {
        fileRepository.deleteById(id);
    }

    public FileMetaData getFileById(Long id) {
        return fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found"));
    }

    public List<FileMetaData> getAllFiles() {
        return fileRepository.findAll();
    }
}
