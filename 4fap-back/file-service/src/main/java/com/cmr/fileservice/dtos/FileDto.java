package com.cmr.fileservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileDto {
    private Long id;
    private Long userId;
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
