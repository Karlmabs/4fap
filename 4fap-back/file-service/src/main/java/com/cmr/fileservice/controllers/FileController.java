package com.cmr.fileservice.controllers;

import com.cmr.fileservice.dtos.FileDto;
import com.cmr.fileservice.entities.FileMetaData;
import com.cmr.fileservice.mappers.FileMapper;
import com.cmr.fileservice.services.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/file")
public class FileController {

    private final FileService fileService;
    private final FileMapper fileMapper;

    public FileController(FileService fileService, FileMapper fileMapper) {
        this.fileService = fileService;
        this.fileMapper = fileMapper;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<FileDto>> getFilesByUserId(@PathVariable Long userId) {
        List<FileMetaData> files = fileService.getFilesByUserId(userId);
        System.out.println("files: " + files);
        return ResponseEntity.ok(fileMapper.toDtoList(files));
    }

    @GetMapping("/minio-object-name/{minioObjectName}")
    public ResponseEntity<List<FileDto>> getFilesByMinioObjectName(@PathVariable String minioObjectName) {
        List<FileMetaData> files = fileService.getFilesByMinioObjectName(minioObjectName);
        return ResponseEntity.ok(fileMapper.toDtoList(files));
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<FileDto> getFileById(@PathVariable Long id) {
        FileMetaData file = fileService.getFileById(id);
        return ResponseEntity.ok(fileMapper.toDto(file));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FileDto>> getAllFiles() {
        List<FileMetaData> files = fileService.getAllFiles();
        return ResponseEntity.ok(fileMapper.toDtoList(files));
    }

    @GetMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long id) {
        fileService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<FileDto> saveFile(@RequestBody FileDto fileDto) {
        FileMetaData savedFile = fileService.saveFile(fileDto);
        return ResponseEntity.ok(fileMapper.toDto(savedFile));
    }
}
