package com.cmr.fileservice.minio;

import io.minio.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class MinioService {

    private final MinioClient minioClient;

    private final MinioProperties minioProperties;

    public MinioService(MinioClient minioClient, MinioProperties minioProperties) {
        this.minioClient = minioClient;
        this.minioProperties = minioProperties;
    }

    public String uploadImage(MultipartFile file) throws RuntimeException {
        try {

            if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(minioProperties.getBucketName()).build())) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(minioProperties.getBucketName()).build());
            }

            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(minioProperties.getBucketName())
                    .object(file.getOriginalFilename())
                    .stream(file.getInputStream(), file.getInputStream().available(), -1)
                    .contentType(file.getContentType())
                    .build());

            return file.getOriginalFilename();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to upload image");
        }
    }

    public void deleteFile(String objectName) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(minioProperties.getBucketName())
                            .object(objectName)
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file");
        }
    }

    public InputStream downloadImage(String objectName) {
        try {
            return minioClient.getObject(GetObjectArgs.builder().bucket(minioProperties.getBucketName()).object(objectName).build());
        } catch (Exception e) {
            // Handle exception
            return null;
        }
    }
}