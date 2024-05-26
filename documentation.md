# Technical Documentation

## Introduction
This document provides a detailed description of the web and desktop applications developed for the scalable storage platform designed for SovereignCloud. The platform includes functionalities for file management via a web interface and file synchronization via a desktop application. This documentation outlines the features, implementation details, and technologies used in the development of the project.

## Application Features

### Web Application

#### User Registration and Authentication
- **User Registration:** New users can register by providing necessary details. A unique tenant is created for each user.
- **Authentication:** The authentication process includes two-factor authentication (2FA) to enhance security.

#### File Management
- **Folder Creation:** Users can create new folders within their storage space.
- **File Upload:** Users can upload files using a drag-and-drop interface.
- **File Deletion:** Users can delete files or entire directories.
- **User Interface:** A user-friendly interface designed to be intuitive for non-tech-savvy users.

## Implementation Details

### Technologies and Tools Used
- **Frontend:**
  - Framework: Next.js for building the web interface.
- **Backend:**
  - Spring Boot for developing the microservices (User Service and File Service).
  - PostgreSQL for database management.
- **Security:**
  - Implemented 2FA for enhanced security.

### Setup and Configuration

#### Docker Compose Configuration

The platform's infrastructure is managed using Docker Compose. Below is the configuration and explanation of each service:

```yaml
version: '3.8'
services:

  discovery-server:
    build: ./4fap-back/discovery-server
    networks:
      - 4fap-network
    ports:
      - "8761:8761"

  user-db:
    image: postgres
    networks:
      - 4fap-network
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: users
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - user-data:/var/lib/postgresql/data

  user-service:
    build: ./4fap-back/user-service
    networks:
      - 4fap-network
    ports:
      - "8080:8080"
    depends_on:
      - user-db
      - discovery-server
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://user-db/users
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: password

  files-db:
    image: postgres
    networks:
      - 4fap-network
    ports:
      - "5433:5432"
    environment:
      POSTGRES_DB: files
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - files-data:/var/lib/postgresql/data

  files-service:
    build: ./4fap-back/file-service
    networks:
      - 4fap-network
    ports:
      - "8081:8081"
    depends_on:
      - files-db
      - discovery-server
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://files-db/files
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: password

  minio:
    container_name: s3minio
    image: bitnami/minio:latest
    networks:
      - 4fap-network
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_storage:/data

  nextjs:
    build:
      context: ./4fap-webapp
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_BASE_URL: "http://localhost:8080"
    ports:
      - "3000:3000"

networks:
  4fap-network:

volumes:
  user-data:
  files-data:
  minio_storage:
```

### Code Structure
- **Backend (Spring Boot Microservices):**
  - `/user-service`: Manages user-related operations, including authentication and user data management.
  - `/file-service`: Manages file-related operations, including file storage, retrieval, and deletion.
  - Each service has its own PostgreSQL database (`user-db` for user data and `files-db` for file data).

- **Frontend (Next.js):**
  - Components: Contains React components for the UI.
  - Pages: Contains different pages of the application.
  - Services: Functions for making API calls to the backend.

## Infrastructure

### Scalability and High Availability
- The use of Docker Compose allows for easy scaling of services.
- Each microservice is containerized, making it easy to deploy and manage.
- The `discovery-server` facilitates service discovery, improving the resilience and scalability of the system.

### Backup Solution
- **MinIO** is used for object storage, providing a scalable and performant solution for file storage.
- The backup strategy involves regular backups of PostgreSQL databases and MinIO storage.

## Business Plan and Roadmap

### Business Planification
- **Data Analytics:** Using file statistics to understand user behavior and storage needs.
- **Customer Segmentation:** Identifying and targeting different user types for tailored marketing strategies.

### Roadmap
- **Future Features:**
  - Integration of file editing capabilities within the web application.
  - Enhanced analytics for deeper insights.
  - Mobile application for on-the-go file management.
- **User Feedback Integration:** Continuously improving the platform based on user feedback during the beta phase.

## Conclusion
This document outlines the key features, implementation details, and future plans for the scalable storage platform. The project successfully integrates essential functionalities for file management and synchronization while ensuring security and scalability. Future developments will focus on enhancing user experience and expanding the platform's capabilities.
