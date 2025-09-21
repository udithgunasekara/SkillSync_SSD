package BackEnd.service.imple;

import BackEnd.DTO.ProjectDto;
import BackEnd.entity.Project;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.ProjectMapper;
import BackEnd.repository.ProjectRepository;
import BackEnd.service.ProjectService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private ProjectRepository projectRepository;

    @Override
    public ProjectDto createProject(ProjectDto projectDto) {
        Project project = ProjectMapper.mapToProject(projectDto);
        Project savedProject = projectRepository.save(project);
        return ProjectMapper.mapToProjectDto(savedProject);
    }

    @Override
    public ProjectDto getProjectByID(Long projectID) {

        //Validation
        Project project = projectRepository.findById(projectID)
                .orElseThrow(() ->
                        new ResourceNotFound("Project is not exists with given id : "+projectID));
        return ProjectMapper.mapToProjectDto(project);
    }

    @Override
    public List<ProjectDto> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        return projects.stream().map((project) -> ProjectMapper.mapToProjectDto(project))
                .collect(Collectors.toList());
    }

    @Override
    public ProjectDto updateProject(Long projectId, ProjectDto updateProject) {

        //Validation
        Project project = projectRepository.findById(projectId).orElseThrow(
                () -> new ResourceNotFound("Project is not exists with given id : "+projectId)
        );

        project.setClientID(updateProject.getClientID());
        project.setDescription(updateProject.getDescription());
        project.setFreelanceID(updateProject.getFreelanceID());

        Project updateProjectObj = projectRepository.save(project);

        return ProjectMapper.mapToProjectDto(updateProjectObj);
    }

    @Override
    public void deleteProject(Long projectId) {

        //Validation
        Project project = projectRepository.findById(projectId).orElseThrow(
                () -> new ResourceNotFound("Project is not exists with given id : "+projectId)
        );

        projectRepository.deleteById(projectId);

    }


}

