package td.enterprise.wanalytics.etl.task.competitor;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.tools.ant.util.FileUtils;
import td.enterprise.wanalytics.etl.bean.AttachmentTypeEnum;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.*;
import td.enterprise.wanalytics.etl.util.azkaban.AzkabanRestUtil;
import td.enterprise.wanalytics.etl.util.azkaban.entity.AzkabanExecuteFlowRequest;
import td.enterprise.wanalytics.etl.util.azkaban.entity.AzkabanExecuteFlowResponse;

import java.io.File;
import java.util.*;

/**
 * 导入竞品数据，
 * 支持wifi来来格式文件导入（项目房间excel，项目房间客流文本文件）
 * mac tab 日期（yyyy-MM-dd)
 */
public class ImportCompeteProjectDataTask {

    public static final Logger logger = Logger.getLogger(ImportCompeteProjectDataTask.class);

    public static void main(String[] args){
        try{
            long begin = System.currentTimeMillis();
            Options options = new Options();
            options.addOption("attachId", "attachId", true, "附件id");
            options.addOption("projectId", "projectId", true, "竞品项目ID");//竞品项目id
            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String attachId =  line.getOptionValue("attachId");
            String projectId =  line.getOptionValue("projectId");
            logger.info("Params: attachId=" +  attachId );
            logger.info("Params: projectId=" +  projectId );
            long end = System.currentTimeMillis();
            execute(Integer.parseInt(attachId),Integer.parseInt(projectId));
            logger.info("ImportCompeteProjectDataTask Used times :" + (end - begin)/1000 + " seconds");
        }catch (Exception e){
            logger.error("",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

    /**
     * 附件id
     * 竞品项目id
     * @param attachId
     * @param projectId
     */
    public static void execute(int attachId,int projectId) throws  Exception{
          String sql = "select type,attr4 from TD_ATTACHMENT where id=" + attachId;
          Map<String,Object> attchmentMap = QueryUtils.querySingle(sql,QueryUtils.WIFIANALYTICS_DB);
          if(null == attchmentMap ){
              throw new Exception("附件id=" + attachId + " 没找到，处理失败!");
          }

          int type = -1;
          if(attchmentMap.get("type") != null){
              type = Integer.parseInt(attchmentMap.get("type").toString());
          }

          if(type == -1){
              throw new Exception("附件id=" + attachId  + " 附件类型不对！");
          }

          String filePath = null;
          if(attchmentMap.get("attr4") != null){
             filePath = attchmentMap.get("attr4").toString();
          }

          File testFile = new File(filePath);
          if(filePath == null || !testFile.exists() || !testFile.isFile()){
              throw new Exception("附件id=" + attachId  + " 文件 " + filePath  +"不存在！");
          }

          logger.info("检查通过，开始进行处理------------------------");

          AttachmentTypeEnum attachmentTypeEnum = AttachmentTypeEnum.getInstance(type);

          if(null != attachmentTypeEnum){
              if(AttachmentTypeEnum.WIFILAILAI.getCode() == attachmentTypeEnum.getCode()){
                  dealZipForWifi(filePath,projectId);
              }else if(AttachmentTypeEnum.MAC.getCode() == attachmentTypeEnum.getCode()){
                  dealMacFile(filePath,projectId);
              }else{
                  throw new Exception("暂时不支持的类型：" + type);
              }
          }else{
              throw new Exception(type + "附件类型没找到！"  );
          }

          //callAzkabanTask(projectId);
    }

    private static void callAzkabanTask(int projectId) throws  Exception{
        //调用azkaban 任务，跑一下人群画像和职住来源
        String lastDataDate = CubeUtils.findLastDataDate(projectId);
        if(StringUtils.isEmpty(lastDataDate)){
            logger.info("竞品项目Id=" + projectId + " 没有客流，不用调用任务执行!");
            return;
        }
        logger.info("竞品项目Id=" + projectId + " 有客流，日期是：" + lastDataDate );
        String startDate = DateUtil.getFirstdDayOfMonth(lastDataDate);
        String endDate = DateUtil.getLastdDayOfMonth(lastDataDate);
        logger.info("自动触发竞品项目任务，日期范围是：startDate=" + startDate + " endDate=" + endDate);

         String sql = "select tenant_id from TD_PROJECT where id = " + projectId;
         Map<String,Object> projectMap = QueryUtils.querySingle(sql,QueryUtils.WIFIANALYTICS_DB);


        Map<String, Object> params = new HashMap<>();
        params.put("tenantId",projectMap.get("tenant_id") + "");
        params.put("projectIds",projectId);
        params.put("startDate",startDate);
        params.put("endDate",endDate);
        String project= "WifiAnalyticsTagTask";
        String flow = "WifiAnalyticsTagTask";

        try{
            new AzkabanRestUtil().callAzkabanRestAPI(params,project,flow);
            logger.info("调用竞品画像成功！");
        }catch (Exception e){
            logger.info("调用竞品画像任务失败：" ,e);
            throw e;
        }

        project= "PositionTask";
        flow = "PositionTask";
        try{
            new AzkabanRestUtil().callAzkabanRestAPI(params,project,flow);
            logger.info("调用竞品职住来源成功！");
        }catch (Exception e){
            logger.info("调用竞品职住来源失败：" ,e);
            throw e;
        }
    }

    //处理竞品wifi 来来数据
    private static void dealZipForWifi(String zipFile,int competeProjectId) throws  Exception{
          //判断文件类型是否是zip 文件
          FileType  fileType  = FileTypeJudge.getType(zipFile);
          if(null == fileType || !fileType.getValue().equals(FileType.ZIP.getValue())){
                  throw new Exception("==zipFile" + zipFile + " 不是zip 文件！");
          }
          //解压到目录中
          String uuid = UUID.randomUUID().toString();
          File file = new File(zipFile);
          String folder =  file.getParent() + "/" + competeProjectId  + "_" + uuid;
          FileUtil.unzip(zipFile,folder);
          String suffix = "xlsx";
          String excelFile = getFile(folder,suffix);
          //获取Excel 文件和 普通文件
          if(excelFile == null){
              throw new Exception("Wifi 来来Excel 附件 没找到!" + folder);
          }

          suffix = "csv";
          String csvFile = getFile(folder,suffix);
          //客流附件
          if(csvFile == null){
            throw new Exception("Wifi 来来客流csv 附件 没找到!" + folder);
          }

          logger.info("文件全部找到: excelFile=" + excelFile + " csvFile=" + csvFile );

          LoadProjectDataTaskFromDB.importProjectRoomFromFile(excelFile,competeProjectId);

          LoadProjectDataTaskFromDB.importActiveUsersFromFile(csvFile,competeProjectId);

          //删除解压目录
          FileUtil.deleteFolder(folder);

          //更新竞品项目房间数量，和SSID 数量
           updateProjectIndex(competeProjectId);
    }

    /**
     * 更新探针数量，房间数量
     *
     */
    private static void updateProjectIndex(int projectId){
        String roomCountSql = "select count(1) as c from TD_PROJECT_RELATION where project_parent_id=" + projectId;

        String sensorCountSql = "select count(1) as c from TD_SENSOR where project_id=" + projectId;

        Map <String, Object> roomCountMap = QueryUtils.querySingle(roomCountSql,QueryUtils.WIFIANALYTICS_DB);

        Map <String, Object> sensorCountMap = QueryUtils.querySingle(sensorCountSql,QueryUtils.WIFIANALYTICS_DB);

        int ssidCount = sensorCountMap.get("c") == null ? 0 : Integer.parseInt(sensorCountMap.get("c") + "");

        int roomCount = roomCountMap.get("c") == null ? 0 : Integer.parseInt(roomCountMap.get("c") + "");

        String sql = "select project_id from TD_PROJECT_INDEX where project_id=" + projectId;

        Map <String, Object> tempMap = QueryUtils.querySingle(sql,QueryUtils.WIFIANALYTICS_DB);

        if(tempMap== null || tempMap.isEmpty()){
            logger.info("项目Id=" + projectId + " 指标不存在，添加进去");
            sql = "insert into TD_PROJECT_INDEX(project_id,ssid_count,room_count) values(" + projectId + "," + ssidCount + "," + roomCount +")";
        }else{
            logger.info("项目Id=" + projectId + " 指标存在，进行更新 ");
            sql = "update TD_PROJECT_INDEX set ssid_count=" + ssidCount + ",room_count=" + roomCount + " where project_id=" + projectId;
        }

        QueryUtils.execute(sql,QueryUtils.WIFIANALYTICS_DB);

    }

    //处理普通文本文件mac tab 日期
    private static void dealMacFile(String macFile,int competeProjectId) throws  Exception{
        LoadProjectDataTaskFromDB.importActiveUsersFromMacFile(macFile,competeProjectId);
    }

    private static String getFile(String folder, String suffix){
        List<String> fileList = FileUtil.getFileList(folder);
        if(null != fileList){
           for(String file : fileList){
               if(file.toLowerCase().endsWith(suffix)){
                   return file;
               }
           }
        }
        return null;
    }

}
