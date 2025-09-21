package BackEnd.controller;

import BackEnd.DTO.ProjectDto;
import BackEnd.service.ProjectService;
import lombok.AllArgsConstructor;
import org.hibernate.dialect.unique.CreateTableUniqueDelegate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private ProjectService projectService;

    //Build Add Project REST API
    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto projectDto) {
        ProjectDto savedProject = projectService.createProject(projectDto);
        return new ResponseEntity<>(savedProject, HttpStatus.CREATED);
    }

    //Build Get Project REST API
    @GetMapping("{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable("id") Long projectId) {
        ProjectDto projectDto = projectService.getProjectByID(projectId);
        return ResponseEntity.ok(projectDto);
    }

    //Build Get All Projects REST API
    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        List<ProjectDto> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    //Build Update Project REST API
    @PutMapping("{id}")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable("id") Long projectId,
                                                    @RequestBody  ProjectDto updateProject) {
        ProjectDto projectDto = projectService.updateProject(projectId, updateProject);
        return ResponseEntity.ok(projectDto);
    }

    //Build Delete Project REST API
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteProject(@PathVariable("id") Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.ok("Project deleted successfully!.");
    }

}

