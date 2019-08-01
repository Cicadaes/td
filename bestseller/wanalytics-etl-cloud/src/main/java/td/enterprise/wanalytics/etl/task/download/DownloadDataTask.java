package td.enterprise.wanalytics.etl.task.download;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import td.enterprise.entity.DownloadData;
import td.enterprise.entity.Project;
import td.enterprise.entity.ProjectRelation;
import td.enterprise.service.DownloadDataService;
import td.enterprise.service.ProjectRelationService;
import td.enterprise.service.ProjectService;
import td.enterprise.wanalytics.etl.bean.DownLoadExcelBean;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class DownloadDataTask {

	public static Logger logger = Logger.getLogger(DownloadDataTask.class);
    public static final String outputFolder = HttpUtil.getParamFromConfigServer("download.folder");
//	public static final String outputFolder = "/Users/Yan/Downloads";


	static SqlSession sqlSession = null;

	public static void main(String[] args) {

		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		sqlSession = sqlSessionFactory.openSession();
		try {
			Options options = new Options();
			options.addOption("runDate", "runDate", true, "执行日期");
			CommandLineParser parser = new PosixParser();
			CommandLine lines = parser.parse(options, args);
			String runDate = lines.getOptionValue("runDate");

//          //test data
//            String runDate = "2017-05-19";

			execute(runDate);
		} catch (Exception e) {
			logger.error("任务异常 ",e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		}finally {
            sqlSession.commit();
			sqlSession.close();
		}
		System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
	}



	private static void execute(String runDate) throws Exception {

		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

		//查询所有可能需要计算的条目
        DownloadData query = new DownloadData();
        query.setStatus(0);  //所有需要计算的任务
		List<DownloadData> DownloadDataList = DownloadDataService.queryNeedRun(sqlSession, query);
		for (DownloadData downloadData : DownloadDataList) {

			Date now = simpleDateFormat.parse(runDate);

            //计算是否需要运算
			List<DownloadTask> list = needToRun(downloadData, now);

            ArrayList<Project> projects = null;
            if (list != null && list.size() > 0) {
				projects = getAllProject(sqlSession, downloadData);
			}

            for (DownloadTask d: list) {
                DownLoadWriteXlsx downLoadWriteXlsx = new DownLoadWriteXlsx();
                String outputFile = outputFolder + File.separator + downloadData.getId() + "_" + d.getStartDate() + "_" + d.getEndDate() + "_" + System.currentTimeMillis() + ".xlsx";
                if(projects != null && projects.size() > 0) {
                    int line = 2;
                    for (Project project : projects) {
                        DownLoadExcelBean bean = DownloadTaskCalculation.calculate(project, d.getStartDate(), d.getEndDate(), downloadData.getDuration());
                        downLoadWriteXlsx.addLine(bean, line);
                        line++;
                    }
                    downLoadWriteXlsx.writeDown(outputFile);
                    updateStatus(downloadData, d, outputFile);
                }
            }

		}
	}

	/**
	 * 查看是否需要计算
	 * 计算规则：
	 * case1：任务为非周期任务，执行日期是否在 结束日期之后
	 * case2：任务为周期任务，判断 结束日期加上周期，是否在执行日期之前
	 * @param now	本次执行任务日期
	 * @return 需要运行 true-  不需要运行false-
	 */
	public static List<DownloadTask> needToRun(DownloadData downloadData, Date now) throws ParseException {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

		List<DownloadTask> list = new ArrayList<>();

        Integer status = downloadData.getStatus();
        String startDateStr = downloadData.getStartDate();
        String endDateStr = downloadData.getEndDate();
        Integer duration = downloadData.getDuration();

        Date startDate = simpleDateFormat.parse(startDateStr);
        Date endDate = simpleDateFormat.parse(endDateStr);

        //可以跑了
		if (endDate.before(now)) {

            DownloadTask d = new DownloadTask();
            d.setStartDate(startDateStr);
            d.setEndDate(endDateStr);
            list.add(d);

            //周期日湖
            if(downloadData.getIsRecurring() == 1){

                Calendar calendar=Calendar.getInstance();
                calendar.setTime(startDate);
                calendar.add(Calendar.DAY_OF_YEAR, duration);
                Date start = calendar.getTime();
                calendar.setTime(endDate);
                calendar.add(Calendar.DAY_OF_YEAR, duration);
                Date end = calendar.getTime();

                //看是否还有之前的任务可以跑
                while (end.before(now)){
                    d = new DownloadTask();
                    d.setStartDate(simpleDateFormat.format(start));
                    d.setEndDate(simpleDateFormat.format(end));
                    list.add(d);
                    calendar.setTime(start);
                    calendar.add(Calendar.DAY_OF_YEAR, duration);
                    start = calendar.getTime();
                    calendar.setTime(end);
                    calendar.add(Calendar.DAY_OF_YEAR, duration);
                    end = calendar.getTime();
                }
            }
		}

		return list;
	}

	/**
	 * 如果项目id=-1，代表所有项目，反之代表单个项目
	 * @param downloadData
	 * @return 返回项目list，异常返回空
	 */
	public static ArrayList<Project> getAllProject(SqlSession sqlSession, DownloadData downloadData) {

		Integer projectId = downloadData.getProjectId();
		ArrayList<Project> arrayList = new ArrayList<>();
		Project p = new Project();
		p.setId(projectId);
		List<Project> queryByList = ProjectService.queryByList(sqlSession, p);
		if (queryByList==null || queryByList.size()==0) {
			logger.error("没有查到项目ID="+projectId+"的项目,准备更改词条记录状态");
            DownloadDataService.deleteByPrimaryKey(sqlSession, downloadData.getId() + "");
			return arrayList;
		}

		Project project = queryByList.get(0);
		Set<String> list = new HashSet<>();

        //店铺
        if(project.getProjectType() == 2){
            arrayList.add(project);

        //店组
        }else if(project.getProjectType() == 1){

            list = queryChildrenByParam(sqlSession,  project.getId() + "", list);

            logger.info("项目【"+projectId+"】下面的子项目列表为："+list);
            for (String id : list) {
                p = new Project();
                p.setId(Integer.parseInt(id));
                p.setProjectType(2);//店铺值为2
                List<Project> queryByList3 = ProjectService.queryByList(sqlSession, p);
                if (queryByList3!=null && queryByList3.size()>0) {
                    Project project2 = queryByList3.get(0);
                    arrayList.add(project2);
                }
            }
        }
        return arrayList;
    }

	/**
	 * 递归获取所有去重子项目id
	 * @return
	 * @throws Exception
	 */
	public static Set<String> queryChildrenByParam(SqlSession sqlSession, String id, Set<String> projectsSet) {
		ProjectRelation projectRelation = new ProjectRelation();
		projectRelation.setProjectParentId(id);
		List <ProjectRelation> result = ProjectRelationService.getAllProjectRelations(sqlSession, projectRelation);
		if (result != null && result.size() > 0) {
			for (ProjectRelation pr : result) {
				projectsSet.add(pr.getProjectId());
				queryChildrenByParam(sqlSession, pr.getProjectId(), projectsSet);
			}
		}
		return projectsSet;
	}

	/**
	 * 如果是周期任务，另外重新生成一条新的记录，新的记录set status=1
	 * 运算结果填充，set status=2
	 * @param downloadData
	 * @throws Exception
	 */
	private static void updateStatus(DownloadData downloadData, DownloadTask d, String filepath) throws Exception {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

		Integer isRecurring = downloadData.getIsRecurring();
		//单次任务
        if (isRecurring==0) {
			downloadData.setStatus(2);
			downloadData.setFilePath(filepath);
            DownloadDataService.updateByPrimaryKey(sqlSession, downloadData);
        }else if (isRecurring==1) {  //周期任务

            DownloadData newdata = new DownloadData();
            newdata.setName(downloadData.getName());
            newdata.setCode(downloadData.getCode());
            newdata.setType(downloadData.getType());
            newdata.setStartDate(d.getStartDate());
            newdata.setEndDate(d.getEndDate());
            newdata.setSequence(downloadData.getSequence());
            newdata.setIsRecurring(isRecurring);
            newdata.setDuration(downloadData.getDuration());
            newdata.setStatus(2);
            newdata.setFilePath(filepath);
            newdata.setProjectId(downloadData.getProjectId());
            newdata.setTenantId(downloadData.getTenantId());
            newdata.setCreateBy(downloadData.getCreateBy());
            newdata.setCreateTime(downloadData.getCreateTime());
            newdata.setUpdateBy("System_Update");
            newdata.setUpdater("System");
            DownloadDataService.insert(sqlSession, newdata);

            Date endDate = simpleDateFormat.parse(d.getEndDate());
            Calendar calendar=Calendar.getInstance();
            calendar.setTime(endDate);
            calendar.add(Calendar.DAY_OF_YEAR, 1);
            String startDateStr = simpleDateFormat.format(calendar.getTime());
            calendar.setTime(endDate);
            calendar.add(Calendar.DAY_OF_YEAR, downloadData.getDuration());
            String endDateStr = simpleDateFormat.format(calendar.getTime());
            downloadData.setStartDate(startDateStr);
            downloadData.setEndDate(endDateStr);
            DownloadDataService.updateByPrimaryKey(sqlSession, downloadData);
        }
	}

}

class DownloadTask {
    private String startDate;
    private String endDate;

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
}