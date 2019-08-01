package td.enterprise.wanalytics.etl.task.azkaban;

import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import td.enterprise.entity.AzkabanJobConfig;
import td.enterprise.service.AzkabanJobConfigService;
import td.enterprise.wanalytics.etl.util.HttpClient;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;
import td.enterprise.wanalytics.etl.util.azkaban.AzkabanRestUtil;
import td.enterprise.wanalytics.etl.util.azkaban.entity.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class AzkabanJobTask {
	
	public static Logger logger = Logger.getLogger(AzkabanJobTask.class);
	private static String successStatus = "success";
	private static final String PROJECTID_START = "var projectId = ";
	private static final String PROJECTID_END = ";";
	private static AzkabanRestUtil azkabanRestUtil;
	static SqlSession sqlSession = null;

	public static void main(String[] args) {
		azkabanRestUtil = new AzkabanRestUtil();
		try {
			long start = System.currentTimeMillis();

			SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
			sqlSession = sqlSessionFactory.openSession();
			long end = System.currentTimeMillis();

			execute();
			logger.info("生成azkaban任务结束：" + (end - start) / 1000 + " 秒");

		}catch(Exception e){
			logger.error("生成azkaban任务出错： ", e);
		}finally{
			sqlSession.close();
		}

	}
	
	public static void execute(){
		//login
		AzkabanLoginResponse azkabanLoginResponse = login();
		String sessionId = azkabanLoginResponse.getSessionId();
		if(sessionId!=null){
			//deleteallprojects
				//Fetch Flows of a Project
				//Fetch Running Executions of a Flow 
				//Cancel a Flow Execution 
				//unflow???
				//deleteproject
			//以上已用直接删除表内容代替
			
			//allvalidprojects
			List<AzkabanJobConfig> jobConfigs = getAzkabanJobConfigs(1);
			for(AzkabanJobConfig job : jobConfigs){
				//create
				createPrject(job,sessionId);
				
				//upload
				uploadZip(job,sessionId);
				
				//fetchFlowsofProject
				//aready signed in db
				
				//schedule
				scheduleJob(job,sessionId);
			}
		}
	}
	
	private static List<AzkabanJobConfig> getAzkabanJobConfigs(int status){
		AzkabanJobConfig azkabanJobConfig = new AzkabanJobConfig();
		if(status!=0){
			azkabanJobConfig.setStatus(status);
		}
		List<AzkabanJobConfig> jobConfigs = new ArrayList<AzkabanJobConfig>();
		try {
			jobConfigs = AzkabanJobConfigService.queryByValidList(sqlSession, azkabanJobConfig);
		} catch (Exception e) {
			e.printStackTrace();
		}
	    return jobConfigs;
	}
	
	public static AzkabanLoginResponse login(){
		AzkabanLoginResponse loginResponse = new AzkabanLoginResponse();
        try{
			loginResponse = azkabanRestUtil.login();
			if(!loginResponse.getStatus().equals(successStatus)){
				throw new Exception(" 登录失败，successStatus : " + successStatus);
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return loginResponse;
	}
	
	public static AzkabanCreateProjectResponse createPrject(AzkabanJobConfig job, String sessionId){
		AzkabanCreateProjectResponse azkabanCreateProjectResponse = new AzkabanCreateProjectResponse();
		try{
			AzkabanCreateProjectRequest azkabanCreateProjectRequest = new AzkabanCreateProjectRequest();
			azkabanCreateProjectRequest.setSessionId(sessionId);
			azkabanCreateProjectRequest.setName(job.getProjectName());
			azkabanCreateProjectRequest.setDescription(job.getProjectDesc());
			
			azkabanCreateProjectResponse = azkabanRestUtil.createProject(azkabanCreateProjectRequest);
			if (azkabanCreateProjectResponse.failure()) {
				throw new Exception(" 创建项目失败，error : " + azkabanCreateProjectResponse.getError() + " message : " + azkabanCreateProjectResponse.getMessage());
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return azkabanCreateProjectResponse;
	}

	public static AzkabanUploadProjectZipResponse uploadZip(AzkabanJobConfig job, String sessionId) {
		AzkabanUploadProjectZipResponse azkabanUploadProjectZipResponse = new AzkabanUploadProjectZipResponse();
		try {
			String filePath = job.getJobFilePath();
			String zipPath = "";
			boolean needDelete = false;
			if (filePath.lastIndexOf(".job") > 0) {
				zipPath = filePath.substring(0, filePath.lastIndexOf(".job")) + ".zip";
				zipFile(filePath, zipPath);
				needDelete = true;
			} else if (filePath.lastIndexOf(".zip") > 0) {
				zipPath = filePath;
			} else {
				throw new Exception(" 未找到.zip或.job文件，路径及文件名 : " + filePath);
			}

			File file = new File(zipPath);

			AzkabanUploadProjectZipRequest azkabanUploadProjectZipRequest = new AzkabanUploadProjectZipRequest();
			azkabanUploadProjectZipRequest.setSessionId(sessionId);
			azkabanUploadProjectZipRequest.setProject(job.getProjectName());
			azkabanUploadProjectZipRequest.setFile(file);
			azkabanUploadProjectZipResponse = azkabanRestUtil.uploadJobZip(azkabanUploadProjectZipRequest);
			if (azkabanUploadProjectZipResponse.failure()) {
				throw new Exception(" 上传zip文件失败，error : " + azkabanUploadProjectZipResponse.getError() + " message : " + azkabanUploadProjectZipResponse.getMessage());
			}

			job.setFlowName(file.getName().substring(0, file.getName().indexOf('.')));

			if (needDelete) {
				deleteFile(zipPath);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return azkabanUploadProjectZipResponse;
	}
	
	public static AzkabanScheduleFlowResponse scheduleJob(AzkabanJobConfig job,String sessionId){
		AzkabanScheduleFlowResponse azkabanResponse = new AzkabanScheduleFlowResponse();
        try{
			String htmlStr = HttpClient.getHTML(azkabanRestUtil.getAzkabanUrl(), projectParse(job.getProjectName(),sessionId));
			Document doc = Jsoup.parse(htmlStr);
			String scriptStr = doc.head().child(32).toString();
			String scriptStrTmp = scriptStr.substring(scriptStr.indexOf(PROJECTID_START),scriptStr.length());
			String projectId = scriptStrTmp.substring(PROJECTID_START.length(),scriptStrTmp.indexOf(PROJECTID_END));
			AzkabanScheduleFlowRequest azkabanScheduleFlowRequest = new AzkabanScheduleFlowRequest();
			azkabanScheduleFlowRequest.setSessionId(sessionId);
			azkabanScheduleFlowRequest.setFlowName(job.getFlowName());
			azkabanScheduleFlowRequest.setProjectName(job.getProjectName());
			azkabanScheduleFlowRequest.setProjectId(projectId);
			azkabanScheduleFlowRequest.setScheduleTime(job.getScheduleTime());
			azkabanScheduleFlowRequest.setScheduleDate(job.getScheduleDate());
			azkabanScheduleFlowRequest.setIs_recurring(job.getIsRecurring());
			azkabanScheduleFlowRequest.setPeriod(job.getRecurringPeriod());
			
			azkabanResponse = azkabanRestUtil.scheduleJob(azkabanScheduleFlowRequest);
			if (azkabanResponse.failure()) {
				throw new Exception(" 设置任务调度失败，error : " + azkabanResponse.getError() + " message : " + azkabanResponse.getMessage());
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return azkabanResponse;
	}
	
	
	public static String projectParse(String projectName,String sessionId) {
		List<BasicNameValuePair> pairs = new ArrayList<BasicNameValuePair>();
		pairs.add(new BasicNameValuePair("project", projectName));
		pairs.add(new BasicNameValuePair("session.id", sessionId));
		try {
			String url = "/manager?" + EntityUtils.toString(new UrlEncodedFormEntity(pairs, "UTF-8"));
			return url;
		} catch (Throwable th) {
			if (th instanceof Error) {
				throw ((Error) th);
			}
			if (th instanceof RuntimeException) {
				throw ((RuntimeException) th);
			}
			throw new RuntimeException(th);
		}
	}

	/**
	 * 压缩单个文件
	 */
	public static void zipFile(String filepath, String zippath) {
		try {
			File file = new File(filepath);
			File zipFile = new File(zippath);
			InputStream input = new FileInputStream(file);
			ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(zipFile));
			zipOut.putNextEntry(new ZipEntry(file.getName()));
			int temp = 0;
			while ((temp = input.read()) != -1) {
				zipOut.write(temp);
			}
			input.close();
			zipOut.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

    /** 删除单个文件 */
	public static boolean deleteFile(String sPath) {
		Boolean flag = false;
		File file = new File(sPath);
		// 路径为文件且不为空则进行删除
		if (file.isFile() && file.exists()) {
			file.delete();
			flag = true;
		}
		return flag;
	}

}
