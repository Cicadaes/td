package td.enterprise.wanalytics.etl.task;

import java.io.File;
import java.util.Date;

import org.apache.log4j.Logger;

import td.enterprise.wanalytics.etl.util.FileUtil;

public abstract class BaseTask {
   public static Logger logger = Logger.getLogger(BaseTask.class);
   public static String tenantId;
   public static Integer projectId;
   public static Integer crowdId;
   public static String runDate;
   public static String type;
   public static String cycle_statistics;
   
   public static String startDate;
   public static String endDate;
   
   public static String inputFile;
   public static String outputFile;
   
   public static String azkabanExecId ;//schedulerTaskLogId
   
   public static Integer serviceCallLogId ;//添加后的id

//   public static ServiceInterfaceCallLog createLog(){
//	   ServiceInterfaceCallLog serviceLog = new ServiceInterfaceCallLog();
//	   serviceLog.setAzkabanExecId(azkabanExecId);
//	   serviceLog.setCrowdId(crowdId);
//	   serviceLog.setCreateTime(new Date());
//	   serviceLog.setProjectId(projectId);
//	   serviceLog.setTenantId(tenantId);
//	   return serviceLog;
//   }

   public static String unzipGzFile(String gzFilePath) throws Exception {
       String unZipGzFilePath = FileUtil.unZipGzFilePath(gzFilePath);
       File gzFile = new File(gzFilePath);
       if (!gzFile.exists()) {
           throw new Exception("gzFile not exists! " + gzFilePath);
       }
       File unZipGzFile = new File(unZipGzFilePath);
       if (unZipGzFile.exists()) {
       	unZipGzFile.delete();
       }
       FileUtil.unzipGz(gzFile, unZipGzFile);
       return unZipGzFilePath;

}
   
}
