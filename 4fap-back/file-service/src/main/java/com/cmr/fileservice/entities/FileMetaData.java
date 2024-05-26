package com.cmr.fileservice.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class FileMetaData {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String minioObjectName;

    private String name;
    private String size;
    private String modify;
    private String icon;
    private String folderClass;
    private String title;
    private String folderSize;
    private String modifyFolder;
}
