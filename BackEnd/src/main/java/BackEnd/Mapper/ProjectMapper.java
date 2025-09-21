package BackEnd.Mapper;

import BackEnd.DTO.ProjectDto;
import BackEnd.entity.Project;

public class ProjectMapper {

    public static ProjectDto mapToProjectDto(Project project) {
        return new ProjectDto(
                project.getId(),
                project.getFreelanceID(),
                project.getClientID(),
                project.getDescription()
        );
    }

    public static Project mapToProject(ProjectDto projectDto) {
        return new Project(
                projectDto.getId(),
                projectDto.getFreelanceID(),
                projectDto.getClientID(),
                projectDto.getDescription()
        );
    }

}

