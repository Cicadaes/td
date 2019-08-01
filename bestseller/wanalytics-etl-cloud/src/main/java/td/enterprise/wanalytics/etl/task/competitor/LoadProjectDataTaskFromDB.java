package td.enterprise.wanalytics.etl.task.competitor;

import com.tenddata.bitmap.Bitmap;
import com.tenddata.bitmap.impl.ConciseBitmapImpl;
import com.tenddata.bitmap.util.BitmapUtil;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.entity.Project;
import td.enterprise.wanalytics.etl.bean.Sensor;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.jdbc.DbBitmapConn;
import td.enterprise.wanalytics.etl.util.*;

import java.io.*;
import java.sql.*;
import java.util.*;
import java.util.Date;

/**
 * 竞品客群，加载项目客流信息
 * @author junmin.li
 *
 */
public class LoadProjectDataTaskFromDB {

	public static Logger logger = Logger.getLogger(LoadProjectDataTaskFromDB.class);

	public static Map<String,Project> projectMap = new HashMap<String,Project> ();

	public static Map<String,Sensor> sensorMap = new HashMap<String,Sensor> ();

	public static Map<String,Integer> projectUserMap = new HashMap<String,Integer> ();

    private static Map<String,Boolean > isTableExistMap = new HashMap<String,Boolean> ();

    //项目每天cube 数据
    //key： projectId_date  value bitmap
    private static Map<String,Bitmap>  projectUsersMap = new HashMap<String,Bitmap>();
    /**
     * 竞品项目关联的房间
     */
    public static Map<String,Project> roomMap = new HashMap<String,Project> ();


	public static void execute(String projectRoomAttachId,String roomUsersAttachId,int projectId) throws Exception{
		//项目房间列表
		if(StringUtils.isNotBlank(projectRoomAttachId)){
			importProjectRoom(projectRoomAttachId,projectId);
		}
		//生成项目到访客流列表
	    if(StringUtils.isNotBlank(roomUsersAttachId) ){
		    importActiveUsers(roomUsersAttachId,projectId);
		}
	}

    /**
     * 生成竞品项目，竞品房间关联关系
     * @param file
     * @param projectId
     * @throws Exception
     */
    public static void importProjectRoomFromFile(String file, int projectId) throws Exception{
        logger.info("项目房间文件位置：" + file);
        List<String[]> list = ExcelUtil.readSheetData(file, "Sheet2", 0);
        for(int i=1;i<list.size(); i ++){
            String [] values  = list.get(i);
            if(StringUtils.isBlank(values[13])){
                logger.error("项目名称为空，忽略");
                continue;
            }
            //竞品项目名称
            String projectName = values[13] == null ? "" : values[13].trim();
            //查找竞品项目
            Project project = getCompetitorProjectById(projectId);
            if(null == project || project.getId() == -1 && project.getProjectName().equals(projectName)){
                logger.error("项目名称：" + projectName + " 未找到，需要先手动创建竞品项目！");
                continue;
            }

            String projectRoomName  = values [2];
            String shopWifiBssid = values[9]; //探针mac
            if(StringUtils.isBlank(projectRoomName)){
                logger.error("房间名称为空，忽略创建房间!");
                continue;
            }

            Project projectRoom = getProjectRoomByName(projectRoomName, project.getId());
            if(projectRoom != null &&  projectRoom.getId() == null){
                    logger.info("===============项目名称是：" + projectRoom.getProjectName());
            }

            if(null == projectRoom || projectRoom.getId() == -1){
                logger.info("房间名称=" + projectRoomName + "不存在，进行创建！");

                projectRoom = createRoom(projectRoomName,project);
            }

            if(StringUtils.isNotBlank(shopWifiBssid)){
                Sensor s = sensorMap.get(project.getId() + "_" + shopWifiBssid);
                if(null == s){
                    logger.info("房间名称=" + projectRoomName + " shopWifiBssid=" + shopWifiBssid + " 进行创建探针");
                    createSensor(values,project.getId());
                }
            }
        }
    }

	//读取项目房间Excel 列表
	public static void importProjectRoom(String projectRoomAttachId, int projectId) throws Exception{
		//找到项目ID
        String sql = "select id,attr4 from TD_ATTACHMENT where id=" + projectRoomAttachId;
        Map<String,Object> attachment = QueryUtils.querySingle(sql, QueryUtils.WIFIANALYTICS_DB);
		if(attachment == null || attachment.isEmpty()){
			throw new RuntimeException("没找到项目房间 attatchmentId=" + projectRoomAttachId + " 附件");
		}
		String file = attachment.get("attr4").toString();
        importProjectRoomFromFile(file,projectId);
	}


    /**
     * 读取客流文件，生成竞品项目客流
     * @param file
     * @param projectId
     * @throws Exception
     */
    public static void importActiveUsersFromFile(String file,int projectId) throws Exception{
        BufferedReader br = null;
        InputStreamReader isr = null;
        try {
             isr = new InputStreamReader(new FileInputStream(file), "UTF-8");
            br = new BufferedReader(isr);
            String line = null;
            int lineNumber = 0;
            while ((line = br.readLine()) != null) {
                projectLine(line,projectId);
                if(lineNumber %100 ==0 ){
                    logger.info("=========已处理行数是：" + lineNumber);
                }
                lineNumber ++;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            FileUtil.close(br,isr);
        }

        logger.info("计算完毕,开始导入到Bitmap和Counter中");
        Iterator<String> iter =  projectUsersMap.keySet().iterator();
        Connection conn =  null ;
        Statement statement = null;
        PreparedStatement pstmt = null ;
        try{
            conn = DbBitmapConn.getConnection();
            statement = conn.createStatement();
            while(iter.hasNext()){
                String key = iter.next();
                String [] values = key.split("_");
                String tenantId = values[0];
                String competorProjectId = values[1];
                String date = values[2];
                String query = "delete from active_user_day_cube where tenant_id='" + tenantId + "' AND project_id=" + competorProjectId + " AND date='" + date + "'";

                String sql = "insert into active_user_day_cube (tenant_id, project_id, date, bitmap, update_time) values(?,?,?,?,?)";
                Bitmap b = projectUsersMap.get(key);
                try {
                    logger.info("删除sql: " + query);
                    statement.execute(query);
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, tenantId );
                    pstmt.setString(2, competorProjectId);
                    pstmt.setString(3, date);
                    pstmt.setBytes(4, BitmapUtil.bitmapRequestToByteArray(b));
                    pstmt.setTimestamp(5, new Timestamp(System.currentTimeMillis()));
                    pstmt.executeUpdate();
                } catch (SQLException e) {
                    e.printStackTrace();
                }finally{
                    DbCloseUtil.closeAll(pstmt);
                }

                //添加到Counter中
                String deleteSql = "delete from offline_active_user_day_counter where project_id=" + competorProjectId + " and date='" + date + "' ";
                String insertSql  = "insert into offline_active_user_day_counter(tenant_id,project_id,date,metric_value) values('" + tenantId + "'," +  competorProjectId + ",'" + date + "'," + b.cardinary() + ")";
                QueryUtils.execute(deleteSql,QueryUtils.COUNTER_DB);
                QueryUtils.execute(insertSql,QueryUtils.COUNTER_DB);
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            DbCloseUtil.closeAll(pstmt,statement,conn);
        }

        logger.info("计算完毕,导入到Bitmap和Counter结束");
    }

	//生成项目所有客流
	public static void importActiveUsers(String roomUsersAttachId,int projectId) throws Exception{
		//生成文件offset 文件
        String sql = "select id,attr4 from TD_ATTACHMENT where id=" + roomUsersAttachId;
        Map<String,Object> attachment = QueryUtils.querySingle(sql,QueryUtils.WIFIANALYTICS_DB);
        if(attachment == null || attachment.isEmpty()){
            throw new RuntimeException("没找到客流附件 attatchmentId=" + roomUsersAttachId + " 附件");
        }
        String file = attachment.get("attr4").toString();
        importActiveUsersFromFile(file,projectId);
	}

    /**
     * 读取客流文件，生成竞品项目客流
     * mac 文件
     * @param file
     * @param projectId
     * @throws Exception
     */
    public static void importActiveUsersFromMacFile(String file,int projectId) throws Exception{
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(file));
            String line = null;
            int lineNumber = 0;
            while ((line = br.readLine()) != null) {
                projectMacLine(line,projectId);
                if(lineNumber % 100 ==0 ){
                    logger.info("=========已处理行数是：" + lineNumber);
                }
                lineNumber ++;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            FileUtil.close(br);
        }

        logger.info("计算完毕,开始导入到Bitmap和Counter中");
        Iterator<String> iter =  projectUsersMap.keySet().iterator();
        Connection conn =  null ;
        Statement statement = null;
        PreparedStatement pstmt = null ;
        try{
            conn = DbBitmapConn.getConnection();
            statement = conn.createStatement();
            while(iter.hasNext()){
                String key = iter.next();
                String [] values = key.split("_");
                String tenantId = values[0];
                String competorProjectId = values[1];
                String date = values[2];
                String query = "delete from active_user_day_cube where tenant_id='" + tenantId + "' AND project_id=" + competorProjectId + " AND date='" + date + "'";

                String sql = "insert into active_user_day_cube (tenant_id, project_id, date, bitmap, update_time) values(?,?,?,?,?)";
                Bitmap b = projectUsersMap.get(key);
                try {
                    logger.info("删除sql: " + query);
                    statement.execute(query);
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, tenantId );
                    pstmt.setString(2, competorProjectId);
                    pstmt.setString(3, date);
                    pstmt.setBytes(4, BitmapUtil.bitmapRequestToByteArray(b));
                    pstmt.setTimestamp(5, new Timestamp(System.currentTimeMillis()));
                    pstmt.executeUpdate();
                } catch (SQLException e) {
                    e.printStackTrace();
                }finally{
                    DbCloseUtil.closeAll(pstmt);
                }

                //添加到Counter中
                String deleteSql = "delete from offline_active_user_day_counter where project_id=" + competorProjectId + " and date='" + date + "' ";
                String insertSql  = "insert into offline_active_user_day_counter(tenant_id,project_id,date,metric_value) values('" + tenantId + "'," +  competorProjectId + ",'" + date + "'," + b.cardinary() + ")";
                QueryUtils.execute(deleteSql,QueryUtils.COUNTER_DB);
                QueryUtils.execute(insertSql,QueryUtils.COUNTER_DB);
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            DbCloseUtil.closeAll(pstmt,statement,conn);
        }

        logger.info("计算完毕,导入到Bitmap和Counter结束");
    }

    /**
     * 根据id 获取竞品项目
     * @param
     * @param projectId
     * @return
     * @throws Exception
     */
    public static Project getCompetitorProjectById(int projectId) throws Exception{
        String key = projectId + "";
        if(null == projectMap.get(key)){
            String sql =  "select t0.id,project_name,tenant_id from TD_PROJECT t0 where id= " + projectId + "  and project_type=-1 ";
            List<Object> valuesList = new ArrayList<Object> ();
            Map<String,Object> map = QueryUtils.querySingle(sql, QueryUtils.WIFIANALYTICS_DB,valuesList);
            if (null != map && ! map.isEmpty()){
                Project project = new Project ();
                project.setId(Integer.parseInt(map.get("id").toString()));
                project.setProjectName(map.get("project_name").toString());
                project.setTenantId(map.get("tenant_id").toString());
                projectMap.put(key, project);
            }else {
                Project project = new Project() ;
                project.setId(-1);
                projectMap.put(key,project);
            }
        }
        return projectMap.get(key);
    }


    /**
     * 获取项目下的房间（其实也是项目)
     * @param projectName
     * @param projectId
     * @return
     * @throws Exception
     */
    public static Project getProjectRoomByName(String projectName,int projectId) throws Exception{
        projectName = filterSpecialChar(projectName);
        String key = projectName  + "_" + projectId;
        if(null == roomMap.get(key) || roomMap.get(key).getId() == -1  ){
            String sql =  "select t0.id,project_name,tenant_id from TD_PROJECT t0, TD_PROJECT_RELATION t1 where t1.project_id = t0.id and t1.project_parent_id = " + projectId + " and t0.project_name =? and project_type=-1 and category=-1 and status= -1 ";
            List<Object> valuesList = new ArrayList<Object> ();
            valuesList.add(projectName);
            Map<String,Object> map = QueryUtils.querySingle(sql, QueryUtils.WIFIANALYTICS_DB,valuesList);
            if(null != map && ! map.isEmpty()){
                Project project = new Project ();
                project.setId(Integer.parseInt(map.get("id").toString()));
                project.setProjectName(map.get("project_name").toString());
                project.setTenantId(map.get("tenant_id").toString());
                roomMap.put(key, project); //竞品房间
            }else {
                Project project = new Project ();
                project.setId(-1);
                roomMap.put(key,project);
            }
        }

        return roomMap.get(key);
    }

	/**
	 * 创建竞品房间信息，通过关联关系进行查询
	 * @param projectRoomName
	 * @throws Exception
	 */
	public static Project createRoom(String projectRoomName,Project project) throws Exception{
        //竞品房间信息
        projectRoomName = filterSpecialChar(projectRoomName);
        Integer projectId = project.getId();
        String sql =  "select t0.id,project_name from TD_PROJECT t0, TD_PROJECT_RELATION t1 where t1.project_id = t0.id and t1.project_parent_id = " + projectId + " and t0.project_name =? and project_type=-1 and category=-1 ";
        List<Object> valuesList = new ArrayList<Object> ();
        valuesList.add(projectRoomName);
        Map<String,Object> map = QueryUtils.querySingle(sql, QueryUtils.WIFIANALYTICS_DB,valuesList);
		Project projectRoom = null;
        if( map == null || map.isEmpty()){
            //创建项目房间
            projectRoom = new Project();
            projectRoom.setProjectName(projectRoomName);
            projectRoom.setProjectType(-1); //竞品项目
            projectRoom.setCategory("-1");//竞品房间
            int projectRoomId  = 0 ;
            String insertSql = "insert into TD_PROJECT (tenant_id,status,project_name,project_type,category,create_by,update_by) values ("  + project.getTenantId() + ",-1,'" + projectRoomName + "',-1,-1,'system_import','system_import') "  ;
            projectRoomId = QueryUtils.getInsertId(insertSql,QueryUtils.WIFIANALYTICS_DB);
            projectRoom.setId(projectRoomId);
            if(projectRoomId == -1){
                logger.error("获取id失败了！");
            }
            if(projectRoomId > 0 ){
                String insertRelationSql = "insert into TD_PROJECT_RELATION (project_parent_id,project_id) values (" + project.getId() + "," + projectRoomId + ") ";
                QueryUtils.execute(insertRelationSql,QueryUtils.WIFIANALYTICS_DB);
            }else {
                logger.error("获取Id失败了:" + projectRoomName);
            }
		}else{
            projectRoom = new Project();
            projectRoom.setId(Integer.parseInt(map.get("id").toString()));
            projectRoom.setProjectName(projectRoomName);
        }
		roomMap.put(projectRoomName + "_" + project.getId(), projectRoom);
		return projectRoom;
	}

	/**
	 * 创建房间探针信息
	 * @param values
	 * @param projectId
	 * @throws Exception
	 */
	public static Sensor createSensor(String [] values,int projectId) throws Exception{
        String sql = "select id,sensor_mac from TD_SENSOR where project_id=" + projectId + " and sensor_mac='" + values[9]  + "'";
        Map<String,Object> map = QueryUtils.querySingle(sql, QueryUtils.WIFIANALYTICS_DB);
        Sensor sensor = null;
        if( map == null || map.isEmpty()){
            sensor = new Sensor();
			sensor.setSensorMac(values[9]);
			sensor.setId(projectId);
			sensor.setStatus(1); //竞品项目

            String insertSql = "insert into TD_SENSOR (sensor_mac,project_id,status) values('" + values[9] + "'," + projectId + ",1 )" ;
            int id =  QueryUtils.getInsertId(insertSql,QueryUtils.WIFIANALYTICS_DB);
            sensor.setId(id);
		}else{
            sensor = new Sensor();
            sensor.setId(Integer.parseInt(map.get("id")  + ""));
            sensor.setSensorMac(values[9]);
        }
		sensorMap.put(projectId + "_"  + values[9], sensor);
		return sensor;
	}

    /**
     * projectId 是竞品项目id
     * @param line
     * @param projectId
     * @throws Exception
     */
	public static void projectLine(String line,int projectId) throws Exception {
		if(StringUtils.isNotBlank(line)){
			String values [] = line.split(",");
			if(values.length >= 5){
				String mac = values[0];//改为了mac
				String roomName = values[1];
				String projectName = values[2];
				String date = values[3];
				String hour = values [4];
				long t0 = System.currentTimeMillis();
				Project project = getCompetitorProjectById(projectId);
				long t1 = System.currentTimeMillis();
				if(t1 - t0 > 100){
					logger.info("t1- t0=" + (t1- t0));
				}
				if(project != null && project.getId() != -1 && project.getProjectName().equals(projectName)){
                    //用租户的offset
				   Integer tenantUserOffset =  projectUserMap.get( mac.toLowerCase());
				   if(null == tenantUserOffset){
					  tenantUserOffset = createOffset(project.getTenantId(),project.getId(),mac,date,hour);
				   }
				   if(null == project.getTenantId() || date == null || project.getId() == null) {
				       logger.error("发现不合理的值：tenantId=" + project.getTenantId() + "  project.id=" + project.getId() + " date=" + date);
				       return ;
                   }
                    String key= project.getTenantId() + "_" +  project.getId() + "_" + date ;
                    Bitmap bitmap =  projectUsersMap.get(key) ;
                    if(null == bitmap) {
                         bitmap = new ConciseBitmapImpl();
                    }
                    bitmap.set(tenantUserOffset);
                    projectUsersMap.put(key,bitmap);

				   long t2 = System.currentTimeMillis();
				   if(t2 - t1 > 100){
						logger.info("t2- t1=" + (t2- t1));
				   }
				  long t3 = System.currentTimeMillis();
				  Project projectRoom =  getProjectRoomByName(roomName, project.getId());
				  long t4 = System.currentTimeMillis();
				  if(t4 - t3 > 100){
						logger.info("t4 - t3=" + (t4 - t3));
				  }
				  if(null != projectRoom && projectRoom.getId() != -1) {
                      //添加到竞品房间客流中
                      String projectRoomKey= projectRoom.getTenantId() + "_" + projectRoom.getId() + "_" + date ;
                      Bitmap projectRoomBitmap =  projectUsersMap.get(projectRoomKey) ;
                      if(null == projectRoomBitmap) {
                          projectRoomBitmap = new ConciseBitmapImpl();
                      }
                      projectRoomBitmap.set(tenantUserOffset);
                      projectUsersMap.put(projectRoomKey,projectRoomBitmap);
				  }else{
					 logger.error("房间名称=" + roomName + " projectId=" + project.getId() + " 未找到!");
				  }
				}else{
					logger.error("项目名称=" + projectName + " 未创建！请先创建项目！");
				}
			}
		}
	}


    /**
     * projectId 是竞品项目id
     * @param line
     * @param projectId
     * @throws Exception
     */
    public static void projectMacLine(String line,int projectId) throws Exception {
        if(StringUtils.isNotBlank(line)){
            String values [] = line.split("\t");
            if(values.length >= 1) {
                String mac = values[0];
                String date = null;
                if (values.length >= 2) {
                    date = values[1];
                }
                if(date == null){
                    date = DateUtil.getCurrentDate();
                }
                String hour = "00";
                Project project = getCompetitorProjectById(projectId);
                long t1 = System.currentTimeMillis();
                if(project != null && project.getId() != -1 ){
                    //用租户的offset
                    Integer tenantUserOffset =  projectUserMap.get( mac.toLowerCase());
                    if(null == tenantUserOffset){
                        tenantUserOffset = createOffset(project.getTenantId(),project.getId(),mac,date,hour);
                    }
                    if(null == project.getTenantId() || date == null || project.getId() == null) {
                        logger.error("发现不合理的值：tenantId=" + project.getTenantId() + "  project.id=" + project.getId() + " date=" + date);
                        return ;
                    }
                    String key= project.getTenantId() + "_" +  project.getId() + "_" + date ;
                    Bitmap bitmap =  projectUsersMap.get(key) ;
                    if(null == bitmap) {
                        bitmap = new ConciseBitmapImpl();
                    }
                    bitmap.set(tenantUserOffset);
                    projectUsersMap.put(key,bitmap);
                }else{
                    logger.error("项目Id=" + projectId + " 未创建！请先创建项目！");
                }
            }

        }
    }

	/**
     * 返回租户offset
	 * @return
	 */
	public static Integer createOffset(String tenantId,int projectId,String mac,String date, String hour){
		long begin = System.currentTimeMillis();
		Integer offset = null;
		String key =   mac.toLowerCase();
		offset = projectUserMap.get(key);
        String tenantUserTable  = "tenant_" + tenantId;
        Map<String,Object>  userMap = null;
		//从数据库中获取
		String sql = "select offset,`value` from " + tenantUserTable + " where `value`= '" + mac + "'";
		if(null == offset){
			if(isTableExistMap.get(tenantUserTable) != null ||  tableIsExist(tenantUserTable) ||  createTable(tenantUserTable)){
                userMap = QueryUtils.querySingle(sql,QueryUtils.USER_DB);
				if(null == userMap || userMap.isEmpty()){
					String time = DateUtil.format(new Date(), DateUtil.PATTERN );
					String insertSql = "insert ignore into " +  tenantUserTable  + "(`value`,`time`) values ('" + mac + "','" + time + "')";
                    QueryUtils.execute(insertSql,QueryUtils.USER_DB);
                    userMap = QueryUtils.querySingle(sql, QueryUtils.USER_DB);
				}
				offset = Integer.parseInt(userMap.get("offset").toString());
				projectUserMap.put(key, offset);
				return offset;
			}
		}else{
			return offset;
		}

		long end = System.currentTimeMillis();
		if(end - begin > 500){
			logger.info("insert into offset use time "  + (end -begin));
		}
		return offset;
	}

	public static boolean createTable(String tableName)  {
		String sql = " CREATE TABLE  if not exists  `" + tableName
				+ "` ( `offset` bigint(20) NOT NULL AUTO_INCREMENT,  `value` varchar(255) NOT NULL,  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,  PRIMARY KEY (`offset`),  UNIQUE KEY `" + tableName
				+ "_unique` (`value`) ) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ";
		try {
            QueryUtils.execute(sql,QueryUtils.USER_DB);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public static boolean tableIsExist( String tableName) {
		String sql = " select  1  from information_schema.`TABLES` where TABLE_NAME='" + tableName + "' and  TABLE_SCHEMA='wifianalytics_user'";
		List<String> tableNames = new ArrayList<String>();
		try {
            List<Map<String,Object>>  list = QueryUtils.query(sql,QueryUtils.USER_DB);
            if(null != list && !list.isEmpty()){
                tableNames.add(tableName);
            }
		} catch (Exception e) {
			logger.error(e);
		}
		if(null == tableNames || tableNames.isEmpty()){
			return false;
		}
		isTableExistMap.put(tableName, true);
		return true;
	}

    /**
     * 转义特殊字符，单引号
     *
     * @param str
     * @return
     */
	private static String filterSpecialChar(String str){
        if(str != null ){
            str = str.replaceAll("'","");
            str = str.replaceAll("‘","");
        }
        return str;
    }

}
