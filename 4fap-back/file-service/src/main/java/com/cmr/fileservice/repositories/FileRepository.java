package com.cmr.fileservice.repositories;

import com.cmr.fileservice.entities.FileMetaData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<FileMetaData, Long> {

    List<FileMetaData> findByUserId(Long userId);
    List<FileMetaData> findByMinioObjectName(String minioObjectName);
}
