package com.cmr.fileservice.mappers;

import com.cmr.fileservice.dtos.FileDto;
import com.cmr.fileservice.entities.FileMetaData;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface FileMapper {

    FileMetaData toEntity(FileDto fileDto);

    FileDto toDto(FileMetaData fileMetaData);

    List<FileDto> toDtoList(List<FileMetaData> users);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    FileMetaData partialUpdate(FileDto fileDto, @MappingTarget FileMetaData fileMetaData);
}
