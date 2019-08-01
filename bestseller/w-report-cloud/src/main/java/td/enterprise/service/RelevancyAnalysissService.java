package td.enterprise.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import td.enterprise.common.azkaban.AzkabanRestUtil;
import td.enterprise.common.constant.ParamConstants;
import td.enterprise.common.constant.ReportConstants;
import td.enterprise.dao.CustomCrowdDao;
import td.enterprise.dao.ProjectDao;
import td.enterprise.dao.RelevancyAnalysissDao;
import td.enterprise.entity.CustomCrowd;
import td.enterprise.entity.Project;
import td.enterprise.entity.ProjectTracks;
import td.enterprise.entity.RelevancyAnalysiss;
import td.enterprise.page.ProjectPage;
import td.enterprise.service.manager.ParamService;
import td.olap.query.WiFiAnalyticsQuerService;

import javax.inject.Inject;
import java.text.DecimalFormat;
import java.util.*;

/**
 * <br>
 * <b>功能：</b>路径分析表 RelevancyAnalysissService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-07-24 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("relevancyAnalysissService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class RelevancyAnalysissService extends BaseService<RelevancyAnalysiss> {
	public final static Logger logger = Logger.getLogger(RelevancyAnalysissService.class);
	
	@Autowired
	private RelevancyAnalysissDao dao;

	public RelevancyAnalysissDao getDao() {
		return dao;
	}

	@Autowired
	private ParamService paramService;

	@Autowired
	private ProjectDao projectDao;

	@Autowired
	private CustomCrowdDao customCrowdDao;

	@Inject
	private AzkabanRestUtil azkabanRestUtil;

	DecimalFormat df=new DecimalFormat(".##");

	/**
	 * 创建路径分析后调用Azkaban任务计算上下游
	 *
	 * @param analysissId
	 * @return
	 */
	public void projectTracksTaskSchedule(int analysissId){
		Map<String, Object> paramMap =  new HashMap<>();
		RelevancyAnalysiss relevancyAnalysiss = dao.selectByPrimaryKey(analysissId);
		CustomCrowd customCrowd = customCrowdDao.selectByPrimaryKey(relevancyAnalysiss.getAnalysissCrowdId());
		String startDate = customCrowd.getStartDate();
		String endDate = customCrowd.getEndDate();
		paramMap.put("analysissId", analysissId+"");
		paramMap.put("startDate", startDate);
		paramMap.put("endDate", endDate);
		try {
			azkabanRestUtil.callAzkabanRestAPI(paramMap, "ProjectTracksTask", "ProjectTracksTask");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 得到项目上下游
	 *
	 * @param analysissId
	 * @return
	 */
	public Map getProjectTracksList(String analysissId,String tenantId,String projectId,String type){

		//得到项目ID与项目名称的对应关系
		Map<String,String> projectMap = getProjectMap(tenantId);

		List<ProjectTracks>  list = new ArrayList<ProjectTracks>();
		Map<String,Integer> map = WiFiAnalyticsQuerService.getInstance(paramService.queryByParamKey(ParamConstants.QUERY_ENGINE_URL).getParamValue()).queryProjectTracks(analysissId,tenantId,projectId,type);
		Iterator<String> keySet = map.keySet().iterator();
		double sum = 0;
		while(keySet.hasNext()){
			String key = keySet.next();
			ProjectTracks projectTracks= new ProjectTracks();
			projectTracks.setProjectId(key);
			projectTracks.setProjectName(projectMap.get(key));
			projectTracks.setTimes(map.get(key));
			projectTracks.setFlag(true);
			sum += map.get(key);
			list.add(projectTracks);
		}

		//将list排序
		Collections.sort(list, new Comparator<ProjectTracks>() {
			@Override
			public int compare(ProjectTracks o1, ProjectTracks o2) {
				return (int)(o1.getTimes()-o2.getTimes());
			}
		});

		List<ProjectTracks>  resultList = new ArrayList<ProjectTracks>();
		double sumTimes = 0 ;
		for(int i=0;i<list.size();i++){
			ProjectTracks bean = list.get(i);
			bean.setPercent(sum == 0 ? "0":df.format( bean.getTimes()/sum * 100));
			sumTimes += bean.getTimes();
			resultList.add(bean);
			//只显示5个上下游店铺
			if(i==5){
				ProjectTracks vo  = new ProjectTracks();
				vo.setProjectName("其它");
				vo.setPercent(sum == 0 ? "0":df.format( (sum - sumTimes)/sum * 100));
				resultList.add(vo);
				break;
			}
		}
		Map relultMap = new HashMap();
		relultMap.put("projectId",projectId);
		relultMap.put("projectName",projectMap.get(projectId));
		relultMap.put("updownList",resultList);

		return relultMap;

	}

	public  Map<String,String> getProjectMap(String tenantId){
		ProjectPage paramObj = new ProjectPage();
		paramObj.setPageEnabled(false);
		paramObj.setTenantId(tenantId);
		paramObj.setStatus(ReportConstants.ProjectStatus.AVALIABLE);
		List<Project> projectList = projectDao.findAll(paramObj);
		Map<String,String> projectMap = new HashMap<String,String>();
		for(Project project : projectList){
			projectMap.put(project.getId()+"",project.getProjectName());
		}
		return projectMap;
	}

}
