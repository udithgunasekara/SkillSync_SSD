package BackEnd.service;

import BackEnd.DTO.ProjectDto;

import java.util.List;

public interface ProjectService {
    ProjectDto createProject(ProjectDto projectDto);

    ProjectDto getProjectByID(Long projectID);

    List<ProjectDto> getAllProjects();

    ProjectDto updateProject(Long projectId, ProjectDto updateProject);

    void deleteProject(Long projectId);

}

