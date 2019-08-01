package td.enterprise.page.mapper;

import org.springframework.stereotype.Component;
import td.enterprise.entity.ParentChildProject;
import td.enterprise.entity.Project;
import td.enterprise.entity.ProjectIndex;
import td.enterprise.page.ProjectPage;
import td.enterprise.web.vm.*;

/**
 * Created by Yan on 2017/3/10.
 * Mapper for the entity Project and its Page ProjectPage.
 */
@Component
public class ProjectMapper {

    public ProjectPage projectToProjectPage(Project project) {

        ProjectPage projectPage = new ProjectPage();

        if (project == null) {
            return projectPage;
        }
        projectPage.setId(project.getId());
        projectPage.setProjectName(project.getProjectName());
        projectPage.setStatus(project.getStatus());
        projectPage.setProjectType(project.getProjectType());
        projectPage.setProjectPosition(project.getProjectPosition());
        projectPage.setOpeningTime(project.getOpeningTime());
        projectPage.setClosingTime(project.getClosingTime());
        projectPage.setTenantId(project.getTenantId());
        projectPage.setLatitude(project.getLatitude());
        projectPage.setLongitude(project.getLongitude());
        projectPage.setCity(project.getCity());
        projectPage.setRelatedId(project.getRelatedId());
        projectPage.setAffiliation(project.getAffiliation());
        projectPage.setDescription(project.getDescription());
        projectPage.setProjectNum(project.getProjectNum());
        projectPage.setProjectRemark(project.getProjectRemark());
        projectPage.setArea(project.getArea());
        projectPage.setOrderline(project.getOrderline());
        projectPage.setPicUrl(project.getPicUrl());
        projectPage.setDefaultCrowd(project.getDefaultCrowd());
        projectPage.setCategory(project.getCategory());
        projectPage.setBrand(project.getBrand());
        projectPage.setTypeId(project.getTypeId());

        return projectPage;
    }

    public ProjectAttributeVM projectToProjectAttributeVM(Project project) {


        ProjectAttributeVM projectAttributeVM = new ProjectAttributeVM();

        if (project == null) {
            return projectAttributeVM;
        }
        projectAttributeVM.setId(project.getId());
        projectAttributeVM.setProjectName(project.getProjectName());
        projectAttributeVM.setStatus(project.getStatus());
        projectAttributeVM.setProjectType(project.getProjectType());
        projectAttributeVM.setProjectPosition(project.getProjectPosition());
        projectAttributeVM.setOpeningTime(project.getOpeningTime());
        projectAttributeVM.setClosingTime(project.getClosingTime());
        projectAttributeVM.setTenantId(project.getTenantId());
        projectAttributeVM.setLatitude(project.getLatitude());
        projectAttributeVM.setLongitude(project.getLongitude());
        projectAttributeVM.setCity(project.getCity());
        projectAttributeVM.setRelatedId(project.getRelatedId());
        projectAttributeVM.setAffiliation(project.getAffiliation());
        projectAttributeVM.setDescription(project.getDescription());
        projectAttributeVM.setProjectNum(project.getProjectNum());
        projectAttributeVM.setProjectRemark(project.getProjectRemark());
        projectAttributeVM.setArea(project.getArea());
        projectAttributeVM.setOrderline(project.getOrderline());
        projectAttributeVM.setPicUrl(project.getPicUrl());
        projectAttributeVM.setDefaultCrowd(project.getDefaultCrowd());
        projectAttributeVM.setCategory(project.getCategory());
        projectAttributeVM.setBrand(project.getBrand());
        projectAttributeVM.setTypeId(project.getTypeId());

        return projectAttributeVM;
    }

    public Project projectPageToProject(ProjectPage page) {

        Project project = new Project();

        if (page == null) {
            return project;
        }
        project.setId(page.getId());
        project.setProjectName(page.getProjectName());
        project.setStatus(page.getStatus());
        project.setProjectType(page.getProjectType());
        project.setProjectPosition(page.getProjectPosition());
        project.setOpeningTime(page.getOpeningTime());
        project.setClosingTime(page.getClosingTime());
        project.setTenantId(page.getTenantId());
        project.setLatitude(page.getLatitude());
        project.setLongitude(page.getLongitude());
        project.setCity(page.getCity());
        project.setRelatedId(page.getRelatedId());
        project.setAffiliation(page.getAffiliation());
        project.setDescription(page.getDescription());
        project.setProjectNum(page.getProjectNum());
        project.setProjectRemark(page.getProjectRemark());
        project.setArea(page.getArea());
        project.setOrderline(page.getOrderline());
        project.setPicUrl(page.getPicUrl());
        project.setStatus(page.getStatus());
        project.setDefaultCrowd(page.getDefaultCrowd());
        project.setCategory(page.getCategory());
        project.setBrand(page.getBrand());
        project.setTypeId(page.getTypeId());

        return project;
    }

    public ParentChildProject proejctToParentChildProject(Project project) {

        ParentChildProject parentChildProject = new ParentChildProject();

        if (project == null) {
            return parentChildProject;
        }
        parentChildProject.setId(project.getId() + "");
        parentChildProject.setProjectName(project.getProjectName());
        parentChildProject.setProjectType(project.getProjectType() + "");
        parentChildProject.setCity(project.getCity());

        return parentChildProject;
    }

    public static ProjectIndex proejctToProjectIndex(Project project) {

        ProjectIndex projectIndex = new ProjectIndex();

        if (project == null) {
            return projectIndex;
        }
        projectIndex.setProjectId(project.getId());
        projectIndex.setProjectName(project.getProjectName());
        projectIndex.setProjectType(project.getProjectType());
        projectIndex.setProjectNum(project.getProjectNum());
        projectIndex.setStatus(project.getStatus());

        return projectIndex;
    }

    public ProjectIndexVM projectIndexToProjectIndexVM(ProjectIndex projectIndex) {
        ProjectIndexVM projectIndexVM = new ProjectIndexVM();
        if (projectIndex == null) {
            return projectIndexVM;
        }
        projectIndexVM.setProjectId(projectIndex.getProjectId());
        projectIndexVM.setProjectName(projectIndex.getProjectName());
        projectIndexVM.setProjectType(projectIndex.getProjectType());
        projectIndexVM.setProjectNum(projectIndex.getProjectNum());
        projectIndexVM.setStatus(projectIndex.getStatus());

        projectIndexVM.setTodayFlow(projectIndex.getTodayFlow());
        projectIndexVM.setSevenDaysFlow(projectIndex.getSevenDaysFlow());
        projectIndexVM.setThirtyDaysFlow(projectIndex.getThirtyDaysFlow());
        projectIndexVM.setSevenChain(projectIndex.getSevenChain());
        projectIndexVM.setThirtyChain(projectIndex.getThirtyChain());
        Double absSevenChain = 0.0;
        if (projectIndex.getSevenChain() != null) {
            absSevenChain = Math.abs(Double.parseDouble(projectIndex.getSevenChain()));
        }
        Double absThirtyChain = 0.0;
        if (projectIndex.getSevenChain() != null) {
            absThirtyChain = Math.abs(Double.parseDouble(projectIndex.getThirtyChain()));
        }
        projectIndexVM.setAbsSevenChain(absSevenChain+"");
        projectIndexVM.setAbsThirtyChain(absThirtyChain+"");
        return projectIndexVM;
    }

    public ProjectUserRelationVM projectToProjectUserRelationVM(Project project) {
        ProjectUserRelationVM projectUserRelationVM = new ProjectUserRelationVM();

        if (project == null) {
            return projectUserRelationVM;
        }
        projectUserRelationVM.setId(project.getId());
        projectUserRelationVM.setProjectName(project.getProjectName());
        projectUserRelationVM.setStatus(project.getStatus());
        projectUserRelationVM.setProjectType(project.getProjectType());
        projectUserRelationVM.setProjectPosition(project.getProjectPosition());
        projectUserRelationVM.setOpeningTime(project.getOpeningTime());
        projectUserRelationVM.setClosingTime(project.getClosingTime());
        projectUserRelationVM.setTenantId(project.getTenantId());
        projectUserRelationVM.setLatitude(project.getLatitude());
        projectUserRelationVM.setLongitude(project.getLongitude());
        projectUserRelationVM.setCity(project.getCity());
        projectUserRelationVM.setRelatedId(project.getRelatedId());
        projectUserRelationVM.setAffiliation(project.getAffiliation());
        projectUserRelationVM.setDescription(project.getDescription());
        projectUserRelationVM.setProjectNum(project.getProjectNum());
        projectUserRelationVM.setProjectRemark(project.getProjectRemark());
        projectUserRelationVM.setArea(project.getArea());
        projectUserRelationVM.setOrderline(project.getOrderline());
        projectUserRelationVM.setPicUrl(project.getPicUrl());
        projectUserRelationVM.setDefaultCrowd(project.getDefaultCrowd());
        projectUserRelationVM.setCategory(project.getCategory());
        projectUserRelationVM.setBrand(project.getBrand());
        projectUserRelationVM.setTypeId(project.getTypeId());
        return projectUserRelationVM;
    }

    public CompeteProjectVM projectToCompeteProjectVM(Project project) {
        CompeteProjectVM competeProjectVM = new CompeteProjectVM();

        if (project == null) {
            return competeProjectVM;
        }

        competeProjectVM.setId(project.getId());
        competeProjectVM.setProjectName(project.getProjectName());
        competeProjectVM.setStatus(project.getStatus());
        competeProjectVM.setProjectType(project.getProjectType());
        competeProjectVM.setProjectPosition(project.getProjectPosition());
        competeProjectVM.setTenantId(project.getTenantId());
        competeProjectVM.setCity(project.getCity());
        competeProjectVM.setRelatedId(project.getRelatedId());
        competeProjectVM.setAffiliation(project.getAffiliation());
        competeProjectVM.setDescription(project.getDescription());
        competeProjectVM.setProjectNum(project.getProjectNum());
        competeProjectVM.setPicUrl(project.getPicUrl());
        competeProjectVM.setDefaultCrowd(project.getDefaultCrowd());
        competeProjectVM.setCategory(project.getCategory());
        competeProjectVM.setRoomCount(project.getRoomCount());
        competeProjectVM.setSsidCount(project.getSsidCount());
        return competeProjectVM;
    }

    public ProjectChildrenVM projectToProjectChildrenVM(Project project, String parentId, int layer) {
        ProjectChildrenVM projectChildrenVM = new ProjectChildrenVM();

        if (project == null) {
            return projectChildrenVM;
        }
        layer += 1;
        projectChildrenVM.setProjectId(project.getId() + "");
        projectChildrenVM.setProjectName(project.getProjectName());
        projectChildrenVM.setProjectType(project.getProjectType() + "");
        projectChildrenVM.setParentId(parentId);
        projectChildrenVM.setLayer(layer);

        return projectChildrenVM;
    }
}

