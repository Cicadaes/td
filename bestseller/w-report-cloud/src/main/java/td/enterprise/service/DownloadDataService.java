package td.enterprise.service;

import com.tendcloud.enterprise.um.umic.entity.ExtResource;
import com.tendcloud.enterprise.um.umic.entity.User;
import com.tendcloud.enterprise.um.umic.rmi.SecurityService;
import com.tendcloud.enterprise.um.umic.rmi.UmRmiServiceFactory;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import td.enterprise.dao.DownloadDataDao;
import td.enterprise.entity.DownloadData;
import td.enterprise.entity.Project;
import td.enterprise.entity.ProjectRelation;
import td.enterprise.entity.type.ProjectTypeEnum;
import td.enterprise.page.DownloadDataPage;
import td.enterprise.page.ProjectPage;
import td.enterprise.page.ProjectRelationPage;
import td.enterprise.service.DTO.SysConfigProperties;
import td.enterprise.web.util.UserInfoUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.*;

/**
 * <br>
 * <b>功能：</b>数据下载 DownloadDataService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-07 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("downloadDataService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class DownloadDataService extends BaseService<DownloadData> {
    public final static Logger logger = Logger.getLogger(DownloadDataService.class);

    @Autowired
    private DownloadDataDao dao;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private ProjectRelationService projectRelationService;
    @Autowired
    private SysConfigProperties sysConfigProperties;

    public DownloadDataDao getDao() {
        return dao;
    }

    /**
     * 通过条件查询下载列表
     *
     * @param page
     * @return
     * @throws Exception
     */
    public List<DownloadData> query(DownloadDataPage page) throws Exception {
        //=================如果是查询单个任务，走下面逻辑
        String code = page.getCode();
        if (code != null) {
            page.setPageEnabled(false);
            //默认按照 sequence 降序排序
            if(StringUtils.isBlank(page.getSort())){
                 page.setSort("sequence");
                 page.setOrder("desc");
            }
            return dao.queryByList(page);
        }

        User user = UserInfoUtil.getUser();
        Map <String, Project> allPermissionProject = projectService.findAllPermissionProject();
        List<String> list = new ArrayList <>(allPermissionProject.keySet());
        //===================================================到这里结束========================================================


        //已经得到当前租户被授权的所有项目	list==================================================
        List<Integer> projectidlist = new ArrayList<>();
        Map<Integer, TreeSet<Integer>> getfinalyprojectlist = getfinalyprojectlist();
        for (String projectId : list) {
            Integer id = Integer.parseInt(projectId);
            projectidlist.add(id);
            TreeSet<Integer> treeSet = getfinalyprojectlist.get(id);
            if (treeSet != null) {
                for (Integer integer : treeSet) {
                    projectidlist.add(integer);
                }
            }
        }

        //还需要加上能看到自己创建的任务   projectidlist============================================
        ProjectPage ppage = new ProjectPage();
        ppage.setCreateBy(user.getUmid());
        ppage.setPageEnabled(false);
        List<Project> queryByList = projectService.queryByList(ppage);
        if (queryByList != null && queryByList.size() > 0) {
            for (Project project : queryByList) {
                Integer id = project.getId();
                projectidlist.add(id);
            }
        }
        //使用项目list去查询，该租户能看到的所有项目，再把page里面的东西取出来===============================
        page.setMultiStatusValue(page.getMultiStatusValue());
        if (projectidlist.size() > 0) {
            page.setProjectlist(projectidlist);
        } else {
            page.setProjectId(-1);
        }

        return queryByProjectList(page);
    }

    /**
     * 检查下载任务
     *
     * @param dataId
     * @return
     * @throws Exception
     */
    public Boolean checkDownload(Integer dataId) throws Exception {
        DownloadDataPage page = new DownloadDataPage();
        page.setId(dataId);
        List<DownloadData> rows = dao.queryByList(page);
        String filePath = null;
        if (rows.size() > 0) {
            DownloadData dataVO = rows.get(0);
            filePath = dataVO.getFilePath();
        }
        boolean result;
        result = !(filePath == null || "".equals(filePath));
        return result;
    }

    /**
     * 任务下载
     *
     * @param dataId
     * @param response
     * @throws Exception
     */
    public void download(Integer dataId, HttpServletResponse response,HttpServletRequest request) throws Exception {

        DownloadDataPage page = new DownloadDataPage();
        page.setId(dataId);
        List<DownloadData> rows = dao.queryByList(page);
        if (rows.size() > 0) {
            DownloadData dataVO = rows.get(0);

            String fileName = dataVO.getName() + "_" + dataVO.getStartDate() + "_" + dataVO.getEndDate() + ".xlsx";
            String filePath = dataVO.getFilePath();
//			String docType = "application/vnd.ms-excel";
            String docType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            writeFileToResponses(response, fileName, filePath, docType, request);
        }
    }

    /**
     * 创建下载
     *
     * @param downloadData
     * @return
     * @throws Exception
     */
    public DownloadData create(@RequestBody DownloadData downloadData) throws Exception {

        User user = UserInfoUtil.getUser();
        String umid = user.getUmid();

        downloadData.setTenantId(UserInfoUtil.getCurrentUserTenantId());

        if (downloadData.getSequence() == 1) {
            Integer selectbiggersequence = dao.selectbiggersequence();
            if (selectbiggersequence == null) {
                selectbiggersequence = 1;
            }
            selectbiggersequence++;
            downloadData.setSequence(selectbiggersequence);
        }

        Integer projectId = downloadData.getProjectId();
        String tenantId = downloadData.getTenantId();
        if (tenantId == null || projectId == null) {
            throw new RuntimeException("项目id为空/tenantid为空");
        }
        ProjectPage projectPage = new ProjectPage();
        projectPage.setId(projectId);
        List<Project> queryByList = projectService.queryByList(projectPage);
        if (queryByList == null || queryByList.size() == 0) {
            throw new RuntimeException("所选项目不存在");
        }
        Project project = queryByList.get(0);
        String projectName = project.getProjectName();
        Integer projectType = project.getProjectType();
        String name = "";
        if (projectType == ProjectTypeEnum.PROJECT_ERROR.getCode()) {
            name += "ALL-";
        }
        name += projectName;
        downloadData.setName(name);
        String code = UUID.randomUUID().toString();
        code = code.replace("-", "");
        downloadData.setCode(code);
        downloadData.setCreator(user.getUserName());
        downloadData.setCreateBy(umid);
        dao.insert(downloadData);
        return downloadData;
    }

    /**
     * 通过umid获取资源列表
     *
     * @param umid
     * @param extResourceType
     * @return
     */
    private List<ExtResource> getExtResourceListByUmid(String umid, String extResourceType) {
        List<ExtResource> list = new ArrayList<>();
        try {
            if (sysConfigProperties == null) {
                throw new Exception("没有找到SysConfigProperties配置文件信息");
            }
            SecurityService securityService = UmRmiServiceFactory.getSecurityService();
            String appCode = sysConfigProperties.getAppcode();
            String appTaken = sysConfigProperties.getApptaken();
            String type = extResourceType;
            List<ExtResource> extResourcesList = securityService.getExtResourcesByTypeAndUmid(appCode, appTaken, type, umid);
            for (ExtResource resource : extResourcesList) {
                if (!"root".equalsIgnoreCase(resource.getResourceCode())) {
                    list.add(resource);
                }
            }
        } catch (Exception e) {
            logger.error("根据用户umid、appCode、appTaken，查询用户资源权限，异常" + e.getMessage());
        }
        return list;
    }

    /**
     * 通过项目列表查询文件下载
     *
     * @param downloadDataPage
     * @return
     */
    private List<DownloadData> queryByProjectList(DownloadDataPage downloadDataPage) {
        Integer count = dao.queryCountByprojectList(downloadDataPage);
        downloadDataPage.getPager().setRowCount(count);
        return dao.queryByprojectList(downloadDataPage);
    }

    /**
     * 获取最终项目列表
     *
     * @return
     * @throws Exception
     */
    private Map<Integer, TreeSet<Integer>> getfinalyprojectlist() throws Exception {
        HashMap<Integer, List<Integer>> hashMap = new HashMap<>();
        ProjectRelationPage projectRelationPage = new ProjectRelationPage();
        projectRelationPage.setPageEnabled(false);
        List<ProjectRelation> queryByList = projectRelationService.queryByList(projectRelationPage);
        if (queryByList != null && queryByList.size() > 0) {
            for (ProjectRelation projectRelation : queryByList) {
                String father = projectRelation.getProjectParentId();
                String son = projectRelation.getProjectId();
                Integer f = null;
                Integer s = null;
                try {
                    f = Integer.parseInt(father);
                    s = Integer.parseInt(son);
                } catch (Exception e) {
                    continue;
                }
                List<Integer> list = hashMap.get(f);
                if (list == null) {
                    list = new ArrayList<Integer>();
                }
                list.add(s);
                hashMap.put(f, list);
            }
        }
        HashMap<Integer, TreeSet<Integer>> finalymap = new HashMap<>();
        Iterator<Map.Entry<Integer, List<Integer>>> iterator = hashMap.entrySet().iterator();
        while (iterator.hasNext()) {
            Integer key = iterator.next().getKey();
            TreeSet<Integer> cheakson = cheakson(key, hashMap);
            finalymap.put(key, cheakson);
        }
        return finalymap;
    }

    /**
     * 递归查询子项目
     *
     * @param a
     * @param map
     * @return
     */
    private static TreeSet<Integer> cheakson(Integer a, HashMap<Integer, List<Integer>> map) {
        TreeSet<Integer> sonlist = new TreeSet<Integer>();
        List<Integer> list = map.get(a);
        if (list == null) {
            sonlist.add(a);
            return sonlist;
        } else {
            for (Integer integer : list) {
                TreeSet<Integer> cheakson = cheakson(integer, map);
                for (Integer integer2 : cheakson) {
                    sonlist.add(integer2);
                }
                sonlist.add(integer);
            }
            return sonlist;
        }
    }

    /**
     * 将文件写入响应
     *
     * @param response
     * @param fileName
     * @param filePath
     * @param docType
     * @throws FileNotFoundException
     * @throws UnsupportedEncodingException
     * @throws IOException
     */
    private void writeFileToResponses(HttpServletResponse response, String fileName, String filePath, String docType,HttpServletRequest request) throws IOException {
        File fileTmp = new File(filePath);
        FileInputStream fis = new FileInputStream(fileTmp);

        response.reset();
        response.setContentType(docType + ";charset=utf-8");
//        response.setHeader("Content-Disposition", "attachment;filename=" + new String((fileName).getBytes(), "iso-8859-1"));
        try {
            String agent = request.getHeader("USER-AGENT");
            String downLoadName = null;
            if (null != agent && -1 != agent.indexOf("MSIE") && agent.contains("Trident")) // IE
            {
                downLoadName = java.net.URLEncoder.encode(fileName, "UTF-8");
            } else if (null != agent && -1 != agent.indexOf("Mozilla")) // Firefox
            {
                downLoadName = new String(fileName.getBytes("UTF-8"), "iso-8859-1");
            }
            // 设置response的Header
            response.setContentType("application/octet-stream");
            response.addHeader("Content-Disposition", "attachment;filename=" + downLoadName);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        OutputStream os = response.getOutputStream();

        byte[] buffer = new byte[1024];
        int count = 0;
        while ((count = fis.read(buffer)) != -1) {
            os.write(buffer, 0, count);
            os.flush();
        }
        fis.close();
        os.close();
    }

}
