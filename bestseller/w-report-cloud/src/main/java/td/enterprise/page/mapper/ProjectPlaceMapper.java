package td.enterprise.page.mapper;

import org.springframework.stereotype.Component;
import td.enterprise.entity.ProjectPlace;
import td.enterprise.page.ProjectPlacePage;

@Component
public class ProjectPlaceMapper {

    public ProjectPlacePage projectPlaceToProjectPlacePage(ProjectPlace projectPlace) {

        ProjectPlacePage projectPlacePage = new ProjectPlacePage();

        if (projectPlace == null) {
            return projectPlacePage;
        }

        projectPlacePage.setId(projectPlace.getId());
        projectPlacePage.setPlaceName(projectPlace.getPlaceName());
        projectPlacePage.setOrderNumber(projectPlace.getOrderNumber());
        projectPlacePage.setProjectId(projectPlace.getProjectId());
        projectPlacePage.setDiagramId(projectPlace.getDiagramId());
        projectPlacePage.setDiagramName(projectPlace.getDiagramName());
        projectPlacePage.setTenantId(projectPlace.getTenantId());
        projectPlacePage.setStatus(projectPlace.getStatus());

        return projectPlacePage;
    }

    public ProjectPlace projectPlacePageToProjectPlace(ProjectPlacePage projectPlacPage) {

        ProjectPlace projectPlace = new ProjectPlace();

        if (projectPlacPage == null) {
            return projectPlace;
        }

        projectPlace.setId(projectPlacPage.getId());
        projectPlace.setPlaceName(projectPlacPage.getPlaceName());
        projectPlace.setOrderNumber(projectPlacPage.getOrderNumber());
        projectPlace.setProjectId(projectPlacPage.getProjectId());
        projectPlace.setDiagramId(projectPlacPage.getDiagramId());
        projectPlace.setDiagramName(projectPlacPage.getDiagramName());
        projectPlace.setTenantId(projectPlacPage.getTenantId());
        projectPlace.setStatus(projectPlacPage.getStatus());

        return projectPlace;
    }

}

