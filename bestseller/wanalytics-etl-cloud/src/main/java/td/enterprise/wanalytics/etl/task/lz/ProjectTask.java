package td.enterprise.wanalytics.etl.task.lz;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.*;
import org.apache.hadoop.fs.Path;
import org.apache.parquet.example.data.Group;
import org.apache.parquet.hadoop.ParquetReader;
import org.apache.parquet.hadoop.example.GroupReadSupport;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.io.IOException;
import java.net.MalformedURLException;


@Slf4j
public class ProjectTask {

    private static Connection conn2Analytics;
    static {
        conn2Analytics = DbWifianalyticsConn.getConnection();
    }
    private final static int   RUN_SUCCESS     = 0;
    private final static int   RUN_ERROR       = 1;

    private final static String  PROJECT_SRC="TD_PROJECT_AUTO";
    private final static String  SENSOR_SRC="TD_SENSOR_AUTO";

    private final static String TD_SHOP="TD_SHOP";

    // 海外租户
    private static final Integer TENANT_HW_ID = Integer.valueOf(SysConfigUtil.getValue("tenant_hw_id"));
    // 奥莱租户
    private static final Integer TENANT_AL_ID = Integer.valueOf(SysConfigUtil.getValue("tenant_al_id"));
    // JL租户
    private static final Integer TENANT_JL_ID = Integer.valueOf(SysConfigUtil.getValue("tenant_jl_id"));
    // HAY租户
    private static final Integer TENANT_HAY_ID = Integer.valueOf(SysConfigUtil.getValue("tenant_hay_id"));
    // 四大基础租户
    private static final Integer TENANT_DEFAULT_ID = Integer.valueOf(SysConfigUtil.getValue("tenant_default_id"));

    private final static Integer PROJECT_TYPE =1;
    private final static String  OPENING_TIME="00:00";
    private final static String  CLOSING_TIME="23:59";


    private static boolean metaDataIsRight=true;

    public static void main(String[] args) throws Exception {
//        String prefixPath=null;
//
//        Options options = new Options();
////        options.addOption("p", "HdfsDirProjectTask", true, "hadoop位置目录");
//
//        CommandLineParser parser = new PosixParser();
//        CommandLine line;
//        try {
//            line = parser.parse(options, args);
////            prefixPath = line.getOptionValue("HdfsDirProjectTask");
//        } catch (ParseException e1) {
//            log.warn("params error,date:{},hour:{}", prefixPath);
//            e1.printStackTrace();
//        }

        createProjectTable();
        storeProjectData();

        conversionMetaToTdShop();

        if(metaDataIsRight){
            updateProjectWithOrganization();
            updateProjectTable();

            createSensorTable();
            createTmpShops();
            storeSensorData();
            updateSenSor();
            updateInstallInfo();
            updateProjectPlace();
            updateProjectIndex();
            updateCrowd();
            updateProjectAttribute();
            updateProjectParam();
            updateBatchConfig();

            logicalDelProject();
            logicalUpdateProject();

            insertIntoProjectWithOrganization();
            insertIntoRelation();
            updateLatAndLong();
        }


        if (null != conn2Analytics) {
            try {
                conn2Analytics.close();
            } catch (SQLException e) {
                e.printStackTrace();
                System.exit(RUN_ERROR);
            }
        }
        System.exit(RUN_SUCCESS);
    }

    /**
     * 生成 project 中间表
     */
    private static void createProjectTable(){
        String dropTableProject="DROP TABLE "+ PROJECT_SRC;
        String createTableProject="CREATE TABLE if not exists "+PROJECT_SRC+"( id BIGINT (20) NOT NULL AUTO_INCREMENT, status INT (11) DEFAULT NULL COMMENT '状态 1：生效，-1：失效', project_name VARCHAR (256) DEFAULT NULL COMMENT '项目名称', project_type INT (11) DEFAULT NULL COMMENT '项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份 11:逻辑城市  12：品牌渠道 13：渠道省份 14：渠道城市', project_position VARCHAR (1024) DEFAULT NULL COMMENT '项目位置信息', opening_time VARCHAR (64) DEFAULT NULL COMMENT '营业开始时间 HH：MM，比如，09:00', closing_time VARCHAR (64) DEFAULT NULL COMMENT '营业结束时间 HH：MM，比如，18:00', tenant_id VARCHAR (64) DEFAULT NULL COMMENT '租户', creator VARCHAR (128) DEFAULT NULL COMMENT '创建人', create_by VARCHAR (128) DEFAULT NULL COMMENT '创建人账号', create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间', updater VARCHAR (128) DEFAULT NULL COMMENT '修改人', update_by VARCHAR (128) DEFAULT NULL COMMENT '修改人账号', update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间', longitude VARCHAR (40) DEFAULT NULL COMMENT '项目坐标-经度,百度坐标', latitude VARCHAR (40) DEFAULT NULL COMMENT '项目坐标-纬度,百度坐标', city VARCHAR (255) DEFAULT NULL COMMENT '项目所在城市名称', related_id BIGINT (20) DEFAULT '0' COMMENT '竞品比较项目ID,此字段废弃,TD_PROJECT_RELATION通过关联关系', affiliation VARCHAR (128) DEFAULT NULL COMMENT '项目归属', description VARCHAR (1024) DEFAULT NULL COMMENT '项目描述', project_num VARCHAR (64) DEFAULT NULL COMMENT '店铺ID或者编码', project_remark VARCHAR (64) DEFAULT NULL COMMENT '备注', area VARCHAR (64) DEFAULT NULL COMMENT '面积', orderline INT (11) UNSIGNED ZEROFILL DEFAULT NULL COMMENT '排序字段', pic_url VARCHAR (128) DEFAULT NULL COMMENT '项目图片', default_crowd VARCHAR (64) DEFAULT NULL COMMENT '默认人群ID', category VARCHAR (255) DEFAULT NULL COMMENT '-1 竞品房间', brand VARCHAR (255) DEFAULT NULL COMMENT '品牌', type_id VARCHAR (127) DEFAULT NULL COMMENT '类型，以,分割', region VARCHAR (128) DEFAULT NULL COMMENT '大区', province VARCHAR (128) DEFAULT NULL COMMENT '省', channel VARCHAR (128) DEFAULT NULL COMMENT '渠道', mall VARCHAR (128) DEFAULT NULL COMMENT '商场', down_nums INT (11) DEFAULT NULL COMMENT '下游数量', level INT (11) DEFAULT NULL COMMENT '店组类型', logical_city VARCHAR (100) DEFAULT NULL COMMENT '逻辑城市', county VARCHAR (120) DEFAULT NULL COMMENT '县名称', city_type INT (2) DEFAULT NULL COMMENT '城市类型 1： 直辖市 2： 省份', city_level INT (2) DEFAULT NULL COMMENT '城市等级：1，一线城市；2：二线城市；3，三线城市；4：四线城市；-1：其它', c_city_cn_name VARCHAR (100) DEFAULT NULL COMMENT '不区分品牌的逻辑城市', `shop_size` varchar(20) DEFAULT NULL COMMENT '店铺大小 L-大  M-中  S-小',PRIMARY KEY (id), UNIQUE KEY project_num_auto_uniq (project_num) USING HASH ) ENGINE = INNODB DEFAULT CHARSET = utf8";
        String truncateTableProject="TRUNCATE TABLE "+PROJECT_SRC;

        executeSql(dropTableProject,createTableProject,truncateTableProject);
    }

    /**
     * 先将数据入库到中间表
     */
    private static void storeProjectData(){
        String storeProject ="INSERT INTO "+PROJECT_SRC+"(project_num,project_name,province,city,county,project_position,brand,status,create_time,update_time,creator,PROJECT_TYPE,OPENING_TIME,CLOSING_TIME,shop_size) SELECT shop_code,shop_name,province,city,area,address,brand,CASE shop_status WHEN '开店中' THEN 1 ELSE -1 END shop_status, create_time, update_time, 'initial','"+PROJECT_TYPE+"','"+OPENING_TIME+"','"+CLOSING_TIME+"' ,shop_size FROM TD_BS_SHOP WHERE CREATE_TIME=(SELECT MAX(CREATE_TIME) FROM TD_BS_SHOP) AND  ID IN ( SELECT ID FROM ( SELECT SHOP_CODE, MAX(ID) as ID FROM TD_BS_SHOP WHERE SHOP_CODE IS NOT NULL AND CREATE_TIME = ( SELECT MAX(CREATE_TIME) FROM TD_BS_SHOP ) GROUP BY SHOP_CODE ) T )";
        String storeProject_update_1="UPDATE "+PROJECT_SRC+" SET CITY=PROVINCE WHERE CITY='市辖区' OR CITY='县'";
        String storeProject_update_2="UPDATE "+PROJECT_SRC+" SET CITY=concat(city,'市') where city in ('北京','上海','天津','重庆')";

        String updateProvince = "UPDATE "+PROJECT_SRC+" T1 JOIN TD_CITY T2 ON T1.CITY=T2.CITY SET T1.PROVINCE =T2.PROVINCE";
        executeSql(storeProject,storeProject_update_1,storeProject_update_2,updateProvince);
    }


    public static void conversionMetaToTdShop() throws Exception {
        // 如果不存在 建表 TD_SHOP  并清空数据
        String DropTable = "DROP TABLE IF EXISTS TD_SHOP";
        String TD_SHOP_CREATE = "CREATE TABLE IF NOT EXISTS `TD_SHOP` ( `ID` INT (11) NOT NULL AUTO_INCREMENT, `BRAND_NAME` VARCHAR (256) DEFAULT NULL, `BRAND_ALIASNAME` VARCHAR (256) DEFAULT NULL, `C_SHOP_CN_NAME` VARCHAR (256) DEFAULT NULL, `C_SHOP_CODE` VARCHAR (256) DEFAULT NULL, `ISOWNERSHOP` VARCHAR (256) DEFAULT NULL, `PHY_PRO_ID` VARCHAR (256) DEFAULT NULL, `PHY_PRO_NAME` VARCHAR (256) DEFAULT NULL, `PHY_CITY_ID` VARCHAR (256) DEFAULT NULL, `PHY_CITY_NAME` VARCHAR (256) DEFAULT NULL, `PHY_DIS_ID` VARCHAR (256) DEFAULT NULL, `PHY_DIS_NAME` VARCHAR (256) DEFAULT NULL, `C_ADDRESS` VARCHAR (256) DEFAULT NULL, `C_LONGITUDE` VARCHAR (256) DEFAULT NULL, `C_LATITUDE` VARCHAR (256) DEFAULT NULL, `C_CITY_ID` VARCHAR (256) DEFAULT NULL, `C_CITY_NAME` VARCHAR (256) DEFAULT NULL, `C_AREA_CN_NAME` VARCHAR (256) DEFAULT NULL, `C_STORE_ID` VARCHAR (256) DEFAULT NULL, `STORE_CN_NAME` VARCHAR (256) DEFAULT NULL, `GROUP_NAME` VARCHAR (256) DEFAULT NULL, `C_STORE_NAME` VARCHAR (256) DEFAULT NULL,`COUNTRY` VARCHAR (256) DEFAULT NULL,`CITY_ID` VARCHAR (256) DEFAULT NULL,TENANT_ID varchar(64) DEFAULT NULL COMMENT '租户',DATE_ID varchar(255) DEFAULT NULL COMMENT '日期', PRIMARY KEY (`ID`), INDEX (`C_SHOP_CODE`)) ENGINE = INNODB DEFAULT CHARSET = utf8";
        executeSql(DropTable,TD_SHOP_CREATE);

        String transSql="INSERT INTO TD_SHOP ( BRAND_NAME, BRAND_ALIASNAME, C_SHOP_CN_NAME, C_SHOP_CODE, ISOWNERSHOP, PHY_PRO_NAME, PHY_CITY_NAME, PHY_DIS_NAME, C_ADDRESS, C_LATITUDE, C_LONGITUDE, C_CITY_NAME, C_AREA_CN_NAME, GROUP_NAME, C_STORE_NAME, COUNTRY, CITY_ID ) SELECT brand_name, brand_short_name, shop_name, shop_code, is_owner_shop, phy_pro_name, phy_city_name, phy_dis_name, address, lat, lng, city_name, area_name, group_name, store_name, country, city_id FROM BS_SHOP_META";
        executeSql(transSql);

        Statement statement = conn2Analytics.createStatement();
        ResultSet res = statement.executeQuery("select count(*) from TD_SHOP");

        if (res.next()) {
            int totalCnt = res.getInt(1);
            if(totalCnt<5000){
                metaDataIsRight =false;
                return;
            }
        }

        // 下面的执行语句从别的方法迁移到此处，以防万一
        String deleteSql = "DELETE FROM TD_SHOP WHERE C_SHOP_CODE  NOT IN (SELECT PROJECT_NUM FROM "+PROJECT_SRC+" WHERE  STATUS=1)";
        String logicDeleteSql = "UPDATE "+PROJECT_SRC+" SET STATUS=-1 WHERE PROJECT_NUM NOT IN (SELECT C_SHOP_CODE FROM TD_SHOP)  AND `STATUS` = 1";
        executeSql(deleteSql,logicDeleteSql);
    }

    /**
     * 采用inner 方式关联 project_num
     * 补充TD_PROJECT 表中 类型为店铺(PROJECT_TYPE=1) 的相关字段
     */
    private static void updateProjectWithOrganization() {

        String updateProvince="UPDATE TD_SHOP SET PHY_PRO_NAME = 'UNKNOWN' WHERE PHY_PRO_NAME IN ( SELECT PHY_PRO_NAME FROM ( SELECT DISTINCT PHY_PRO_NAME FROM TD_SHOP WHERE PHY_PRO_NAME NOT IN (SELECT DISTINCT province FROM TD_CITY)) T )";
        String updateCity="UPDATE TD_SHOP SET PHY_CITY_NAME = 'UNKNOWN' WHERE PHY_CITY_NAME IN ( SELECT PHY_CITY_NAME FROM ( SELECT DISTINCT PHY_CITY_NAME FROM TD_SHOP WHERE PHY_CITY_NAME NOT IN (SELECT city FROM TD_CITY)) T )";
        executeSql(updateProvince,updateCity);

        // 处理租户
        String updateTenantId_1 = "update TD_SHOP set tenant_id="+ TENANT_HAY_ID +" where BRAND_ALIASNAME ='HAY'";
        String updateTenantId_2 = "update TD_SHOP set tenant_id="+ TENANT_JL_ID +" where BRAND_ALIASNAME ='JL'";
        String updateTenantId_3 = "update TD_SHOP set tenant_id="+ TENANT_DEFAULT_ID +" where BRAND_ALIASNAME in('ONLY', 'JJ', 'VM', 'SLT')";
        String updateTenantId_4 = "update TD_SHOP set tenant_id="+ TENANT_AL_ID +" where CITY_ID='0202'";
        String updateTenantId_5 = "update TD_SHOP set tenant_id="+ TENANT_HW_ID +" where COUNTRY!='CN'";      //HK TW MY CN MO

        String updateTenantId_error = "UPDATE TD_SHOP SET TENANT_ID=-1 WHERE TENANT_ID IS NULL";      // 便于排查问题
        executeSql(updateTenantId_1,updateTenantId_2,updateTenantId_3,updateTenantId_4,updateTenantId_5,updateTenantId_error);

        // update
        String updateSql_2="update "+TD_SHOP+" set GROUP_NAME='自营' WHERE GROUP_NAME='无'";
        String updateSql = " update "+PROJECT_SRC+" T1 join "+TD_SHOP+" T2 ON T1.project_num= T2.C_SHOP_CODE set T1.TENANT_ID= T2.TENANT_ID,T1.BRAND= T2.BRAND_NAME,T1.PROJECT_POSITION= T2.C_ADDRESS,T1.REGION=concat(T2.C_AREA_CN_NAME,'_',T2.BRAND_ALIASNAME),T1.CHANNEL=T2.GROUP_NAME,T1.MALL=T2.C_STORE_NAME,T1.logical_city=concat('lgc_',T2.C_CITY_NAME,'_',T2.BRAND_ALIASNAME),T1.C_CITY_CN_NAME=T2.C_CITY_NAME,T1.CITY =T2.PHY_CITY_NAME, T1.PROVINCE=T2.PHY_PRO_NAME where T1.PROJECT_TYPE=1 AND T1.PROJECT_NUM IS NOT NULL";
        executeSql(updateSql_2,updateSql);
    }


    /**
     * 再将数据入库到TD_PROJECT 表
     */
    private static void updateProjectTable(){
        String delProject = " update TD_PROJECT SET STATUS=-1 WHERE PROJECT_NUM NOT IN(SELECT PROJECT_NUM FROM "+PROJECT_SRC+" WHERE PROJECT_NUM IS NOT NULL) AND creator='initial' AND PROJECT_TYPE="+PROJECT_TYPE;
//        String updateProject1 = "update TD_PROJECT T1 JOIN "+PROJECT_SRC+" T2 ON T1.PROJECT_NUM=T2.PROJECT_NUM SET T1.project_name=T2.project_name,T1.status=T2.status,T1.creator=T2.creator,T1.TENANT_ID=T2.TENANT_ID,T1.PROJECT_TYPE=T2.PROJECT_TYPE,T1.OPENING_TIME=T2.OPENING_TIME,T1.CLOSING_TIME=T2.CLOSING_TIME,T1.type_id=8848";
//        String insertProject1 = "insert into TD_PROJECT(project_num,project_name,status,creator,type_id,TENANT_ID,PROJECT_TYPE,OPENING_TIME,CLOSING_TIME) select project_num,project_name,status,creator,8848,TENANT_ID,PROJECT_TYPE,OPENING_TIME,CLOSING_TIME from "+PROJECT_SRC+" where "+PROJECT_SRC+".project_num not in(select project_num from TD_PROJECT WHERE project_num IS NOT NULL)";

        String updateProject =  "UPDATE TD_PROJECT T1 JOIN "+PROJECT_SRC+" T2 ON T1.PROJECT_NUM = T2.PROJECT_NUM SET T1.project_name = T2.project_name, T1. STATUS = T2. STATUS, T1.creator = T2.creator, T1.PROJECT_TYPE = T2.PROJECT_TYPE, T1.OPENING_TIME = T2.OPENING_TIME, T1.CLOSING_TIME = T2.CLOSING_TIME, T1.TENANT_ID = T2.TENANT_ID, T1.BRAND = T2.BRAND, T1.PROJECT_POSITION = T2.PROJECT_POSITION, T1.REGION = T2.REGION, T1.CHANNEL = T2.CHANNEL, T1.MALL = T2.MALL, T1.logical_city = T2.logical_city, T1.C_CITY_CN_NAME = T2.C_CITY_CN_NAME, T1.CITY = T2.CITY, T1.PROVINCE = T2.PROVINCE,T1.shop_size = T2.shop_size, T1.type_id = 8848";
        String insertProject ="INSERT INTO TD_PROJECT ( project_num, project_name, STATUS, county,creator, type_id, PROJECT_TYPE, OPENING_TIME, CLOSING_TIME, TENANT_ID, BRAND, PROJECT_POSITION, REGION, CHANNEL, MALL, logical_city, C_CITY_CN_NAME, CITY, PROVINCE,shop_size) SELECT project_num, project_name, STATUS,county,creator, 8848, PROJECT_TYPE, OPENING_TIME, CLOSING_TIME, TENANT_ID, BRAND, PROJECT_POSITION, REGION, CHANNEL, MALL, logical_city, C_CITY_CN_NAME, CITY, PROVINCE,shop_size FROM "+PROJECT_SRC+" WHERE "+PROJECT_SRC+".project_num NOT IN ( SELECT project_num FROM TD_PROJECT WHERE project_num IS NOT NULL )";

        executeSql(delProject,updateProject,insertProject);

        String updateSize_1 = "UPDATE TD_PROJECT set shop_size='L'where shop_size='大'";
        String updateSize_2 = "UPDATE TD_PROJECT set shop_size='M'where shop_size='中'";
        String updateSize_3 = "UPDATE TD_PROJECT set shop_size='S'where shop_size='小'";
        executeSql(updateSize_1,updateSize_2,updateSize_3);
    }

    /**
     * 生成 sensor 中间表
     */
    private static void createSensorTable(){
        String createTableSensor="CREATE TABLE if not exists "+SENSOR_SRC+" (  id int(11) NOT NULL AUTO_INCREMENT,  sensor_code varchar(255) DEFAULT NULL COMMENT '探针ID，自由输入，不可重复',  sensor_name varchar(256) DEFAULT NULL COMMENT '传感器别名',  sensor_mac varchar(64) DEFAULT NULL COMMENT '传感器mac地址',  status int(11) DEFAULT NULL COMMENT '1:生效，-1：失效',  description varchar(1024) DEFAULT NULL COMMENT '描述',  tenant_id varchar(64) DEFAULT NULL,  creator varchar(128) DEFAULT NULL COMMENT '创建人',  create_by varchar(128) DEFAULT NULL COMMENT '创建人账号',  create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',  updater varchar(128) DEFAULT NULL COMMENT '修改人',  update_by varchar(128) DEFAULT NULL COMMENT '修改人账号',  update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',  project_id bigint(20) DEFAULT NULL,  min_rssi varchar(128) DEFAULT NULL,  room_id int(11) DEFAULT NULL,  room_name varchar(256) DEFAULT NULL,  position_description varchar(255) DEFAULT NULL COMMENT '位置描述',  is_outside varchar(256) DEFAULT NULL,  distance varchar(256) DEFAULT NULL,  sum_hours varchar(15) DEFAULT NULL COMMENT '三小时数据量',  raw_data_quantity varchar(15) DEFAULT NULL COMMENT '上小时原始数据量',  processed_data varchar(15) DEFAULT NULL COMMENT '上小时有效数据量',  compared varchar(15) DEFAULT NULL COMMENT '日数据量同比',  normal int(11) DEFAULT NULL COMMENT '是否健康',  no_log_duration double(4,0) DEFAULT NULL COMMENT '无日志时长',  log_hours varchar(15) DEFAULT NULL COMMENT '3小时日志数',  sensor_version varchar(60) DEFAULT NULL COMMENT '探针型号',  sensor_type varchar(60) DEFAULT NULL COMMENT '探针类型',  PRIMARY KEY (id),  UNIQUE KEY sensor_AUTO_unique_name (sensor_mac,status),  KEY IDX_AUTO_QUERY (sensor_mac)) ENGINE=InnoDB  DEFAULT CHARSET=utf8";
        String truncateTableSensor="truncate table "+SENSOR_SRC;

        executeSql(createTableSensor,truncateTableSensor);
    }

    private static void createTmpShops(){
        String TD_BS_DEV_AP_TMP ="CREATE TABLE IF NOT EXISTS `TD_BS_DEV_AP_TMP` ( `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT, `ap_sn` VARCHAR (100) NOT NULL COMMENT 'AP序列号', `ap_ip` VARCHAR (100) DEFAULT NULL COMMENT 'AP设备IP', `ap_name` VARCHAR (100) NOT NULL COMMENT 'AP名称', `ap_model` VARCHAR (100) DEFAULT NULL COMMENT 'AP型号', `ap_version` VARCHAR (100) DEFAULT NULL COMMENT 'AP软件版本号', `ap_status` INT (11) NOT NULL COMMENT 'AP 状态：1-在线，2-不在线，3-版本下载', `ap_online_time` INT (11) DEFAULT NULL COMMENT 'AP 在线时长(单位秒)', `ap_mac` VARCHAR (100) NOT NULL COMMENT 'AP MAC', `ac_sn` VARCHAR (100) NOT NULL COMMENT 'AC序列号', `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间', `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间', PRIMARY KEY (`id`), INDEX (`ac_sn`)) ENGINE = INNODB DEFAULT CHARSET = utf8 COMMENT = '绫致店铺AP设备'";
        String TD_BS_DEVICE_TMP ="CREATE TABLE IF NOT EXISTS `TD_BS_DEVICE_TMP` ( `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT, `dev_sn` VARCHAR (100) NOT NULL COMMENT '设备序列号', `dev_name` VARCHAR (100) NOT NULL COMMENT '设备名称', `dev_hard_version` VARCHAR (100) DEFAULT NULL COMMENT '设备当前硬件版本信息', `dev_soft_version` VARCHAR (100) DEFAULT NULL COMMENT '设备当前软件版本信息', `dev_mode` VARCHAR (100) DEFAULT NULL COMMENT '设备型号', `dev_type` VARCHAR (20) NOT NULL COMMENT '设备类型', `dev_online_time` INT (11) DEFAULT NULL COMMENT '设备运行时长', `dev_location_province` VARCHAR (100) DEFAULT NULL COMMENT '设备位置-省', `dev_location_city` VARCHAR (20) DEFAULT NULL COMMENT '设备位置-市', `dev_location_country` VARCHAR (20) DEFAULT NULL COMMENT '设备位置-国家', `dev_address` VARCHAR (100) DEFAULT NULL COMMENT '设备出口IP', `dev_mac` VARCHAR (100) DEFAULT NULL COMMENT '小贝设备MAC', `memory_total_size` INT (11) DEFAULT NULL COMMENT '设备内存', `disk_total_size` INT (11) DEFAULT NULL COMMENT '设备FLASH大小', `dev_status` VARCHAR (20) NOT NULL COMMENT '设备状态ONLINE/ OFFLINE', `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间', `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间', PRIMARY KEY (`id`), INDEX (`dev_sn`)) ENGINE = INNODB DEFAULT CHARSET = utf8 COMMENT = '绫致店铺设备（AC、小贝）'";
        String TD_BS_DEVICE_RLT_TMP ="CREATE TABLE IF NOT EXISTS `TD_BS_DEVICE_RLT_TMP` ( `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT, `dev_sn` VARCHAR (100) NOT NULL COMMENT '设备序列号', `dev_model` VARCHAR (100) NOT NULL COMMENT '设备型号', `shop_id` VARCHAR (100) NOT NULL COMMENT '店铺ID', `dev_type` VARCHAR (20) NOT NULL COMMENT '设备类型', `aliasname` VARCHAR (100) DEFAULT NULL COMMENT '设备别名', `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间', `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间', PRIMARY KEY (`id`), INDEX (`shop_id`), INDEX (`dev_sn`)) ENGINE = INNODB DEFAULT CHARSET = utf8 COMMENT = '绫致店铺与设备关系(AP、小贝)'";
        String TD_BS_SHOP_TMP ="CREATE TABLE IF NOT EXISTS `TD_BS_SHOP_TMP` ( `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT, `shop_id` VARCHAR (100) NOT NULL COMMENT '店铺ID', `shop_code` VARCHAR (100) NOT NULL COMMENT '绫致店铺四位编码', `shop_name` VARCHAR (100) NOT NULL COMMENT '绫致店铺名称', `province` VARCHAR (100) DEFAULT NULL COMMENT '省', `city` VARCHAR (100) DEFAULT NULL COMMENT '市', `area` VARCHAR (100) DEFAULT NULL COMMENT '区', `address` VARCHAR (200) DEFAULT NULL COMMENT '街道等其他详细地址信息', `phone` VARCHAR (20) DEFAULT NULL COMMENT '电话', `scenario_name` VARCHAR (100) DEFAULT NULL COMMENT '场景名称', `brand` VARCHAR (20) DEFAULT NULL COMMENT '品牌', `shop_status` VARCHAR (20) NOT NULL COMMENT '店铺状态 1-开店中  2-已闭店  3-装修中', `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间', `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间', PRIMARY KEY (`id`), INDEX (`shop_id`), INDEX (`shop_code`)) ENGINE = INNODB DEFAULT CHARSET = utf8 COMMENT = '绫致店铺'";

        executeSql(TD_BS_DEV_AP_TMP,TD_BS_DEVICE_TMP,TD_BS_DEVICE_RLT_TMP,TD_BS_SHOP_TMP);

        String truncateTable_1=" truncate table  TD_BS_DEV_AP_TMP ";
        String truncateTable_2=" truncate table  TD_BS_DEVICE_TMP ";
        String truncateTable_3=" truncate table  TD_BS_DEVICE_RLT_TMP ";
        String truncateTable_4=" truncate table  TD_BS_SHOP_TMP ";

        executeSql(truncateTable_1,truncateTable_2,truncateTable_3,truncateTable_4);

        String insertSql_1=" INSERT INTO  TD_BS_DEV_AP_TMP SELECT id,ap_sn,ap_ip,ap_name,ap_model,ap_version,ap_status,ap_online_time,ap_mac,ac_sn,create_time,update_time FROM TD_BS_DEV_AP WHERE ( ap_mac IS NOT NULL AND ap_mac != '' AND ap_mac != '0000-0000-0000' ) AND CREATE_TIME = ( SELECT MAX(CREATE_TIME) FROM TD_BS_DEV_AP )";
        String insertSql_2=" INSERT INTO  TD_BS_DEVICE_TMP SELECT id,dev_sn,dev_name,dev_hard_version,dev_soft_version,dev_mode,dev_type,dev_online_time,dev_location_province,dev_location_city,dev_location_country,dev_address,dev_mac,memory_total_size,disk_total_size,dev_status,create_time,update_time FROM TD_BS_DEVICE WHERE  CREATE_TIME = ( SELECT MAX(CREATE_TIME) FROM TD_BS_DEVICE )";
        String insertSql_3=" INSERT INTO  TD_BS_DEVICE_RLT_TMP SELECT id,dev_sn,dev_model,shop_id,dev_type,aliasname,create_time,update_time FROM TD_BS_DEVICE_RLT WHERE CREATE_TIME = ( SELECT MAX(CREATE_TIME) FROM TD_BS_DEVICE_RLT )";
        String insertSql_4=" INSERT INTO  TD_BS_SHOP_TMP SELECT id,shop_id,shop_code,shop_name,province,city,area,address,phone,scenario_name,brand,shop_status,create_time,update_time FROM TD_BS_SHOP WHERE CREATE_TIME = ( SELECT MAX(CREATE_TIME) FROM TD_BS_SHOP )";

        executeSql(insertSql_1,insertSql_2,insertSql_3,insertSql_4);
    }
    private static void storeSensorData(){
        String clearSql_1="DELETE FROM TD_BS_DEVICE_TMP WHERE DEV_MAC IN(  SELECT DEV_MAC FROM (SELECT DEV_MAC FROM TD_BS_DEVICE_TMP WHERE (DEV_MAC IS NOT NULL AND DEV_MAC !='') AND CREATE_TIME=(SELECT MAX(CREATE_TIME) FROM TD_BS_DEVICE_TMP) GROUP BY dev_mac HAVING COUNT(*)>1)O)";
        String clearSql_2="DELETE FROM TD_BS_DEV_AP_TMP WHERE ID IN( SELECT ID FROM(SELECT ID FROM TD_BS_DEV_AP_TMP WHERE ID NOT IN (SELECT ID FROM( SELECT AP_MAC, max(ID) AS ID FROM TD_BS_DEV_AP_TMP WHERE(AP_MAC IS NOT NULL AND AP_MAC != '')AND CREATE_TIME = (SELECT MAX(CREATE_TIME)FROM TD_BS_DEV_AP_TMP)GROUP BY AP_MAC) O)AND CREATE_TIME = ( SELECT MAX(CREATE_TIME) FROM TD_BS_DEV_AP_TMP))T1)";

        String storeSensor_1="INSERT INTO "+SENSOR_SRC+"(PROJECT_ID,sensor_code,sensor_name,sensor_version,sensor_type,sensor_mac,status,description,create_time,update_time,TENANT_ID,creator) SELECT O.ID,T3.dev_sn,T2.aliasname,T3.dev_mode,T3.dev_type,dev_mac,1,CONCAT('硬件信息',T3.dev_hard_version,'软件信息',T3.dev_soft_version,'内存信息',T3.memory_total_size,'flash信息',T3.disk_total_size) tmp_name,T3.create_time, T3.update_time,O.TENANT_ID,'initial' FROM TD_BS_SHOP_TMP T1 JOIN ( SELECT * FROM TD_PROJECT WHERE STATUS = 1 ) O ON T1.shop_code = O.PROJECT_NUM JOIN TD_BS_DEVICE_RLT_TMP T2 ON T1.SHOP_ID = T2.SHOP_ID JOIN ( SELECT * FROM TD_BS_DEVICE_TMP WHERE dev_type = 'XIAOBEIROUTER' AND ( DEV_MAC IS NOT NULL AND DEV_MAC != '' )) T3 ON T2.dev_sn = T3.dev_sn";
        String storeSensor_2="INSERT INTO "+SENSOR_SRC+"(PROJECT_ID,sensor_code,sensor_name,sensor_version,sensor_type,sensor_mac,status,description,create_time,update_time,TENANT_ID,creator) SELECT O.ID,T4.ap_sn,T4.ap_name,T4.ap_model,T3.dev_type,T4.ap_mac,1,CONCAT('硬件信息',T3.dev_hard_version,'软件信息',T3.dev_soft_version,'内存信息',T3.memory_total_size,'flash信息',T3.disk_total_size) tmp_name,T3.create_time, T3.update_time,O.TENANT_ID,'initial' FROM TD_BS_SHOP_TMP T1 JOIN ( SELECT * FROM TD_PROJECT WHERE STATUS = 1 ) O ON T1.shop_code = O.PROJECT_NUM JOIN TD_BS_DEVICE_RLT_TMP T2 ON T1.SHOP_ID = T2.SHOP_ID JOIN ( SELECT * FROM TD_BS_DEVICE_TMP WHERE dev_type = 'AC' ) T3 ON T2.dev_sn = T3.dev_sn JOIN TD_BS_DEV_AP_TMP T4 ON T3.DEV_SN = T4.AC_SN";

        String storeSensor_update="UPDATE "+SENSOR_SRC+" set sensor_mac=lower(REPLACE(concat(substring(sensor_mac,1,2),':',substring(sensor_mac,3,5),':',substring(sensor_mac,8,5),':',substring(sensor_mac,13,2)), '-', ':'))";

        executeSql(clearSql_1,clearSql_2,storeSensor_1,storeSensor_2,storeSensor_update);
    }

    private static void updateSenSor(){
        String realDelSenSor = " delete from  TD_SENSOR WHERE STATUS=-1 AND  TENANT_ID IS NULL";
        String updateSenSor = "update TD_SENSOR T1 JOIN "+SENSOR_SRC+" T2 ON T1.sensor_mac=T2.sensor_mac SET T1.project_id=T2.project_id,T1.sensor_code=T2.sensor_code,T1.sensor_name=T2.sensor_name,T1.sensor_version=T2.sensor_version,T1.sensor_type=T2.sensor_type,T1.status=T2.status,T1.description=T2.description,T1.create_time=T2.create_time,T1.update_time=T2.update_time,T1.TENANT_ID=T2.TENANT_ID";
        String insertSenSor = "insert into TD_SENSOR(project_id,sensor_code,sensor_name,sensor_version,sensor_type,sensor_mac,status,description,create_time,update_time,TENANT_ID,creator) select project_id,sensor_code,sensor_name,sensor_version,sensor_type,sensor_mac,status,description,create_time,update_time,TENANT_ID,creator from "+SENSOR_SRC+" where "+SENSOR_SRC+".sensor_mac not in(select sensor_mac from TD_SENSOR WHERE sensor_mac IS NOT NULL)";

        executeSql(realDelSenSor,updateSenSor,insertSenSor);
    }

    private static void updateInstallInfo(){
        String delInstallInfo = " update TD_INSTALL_INFO SET STATUS=-1 WHERE related_id NOT IN(SELECT id FROM TD_SENSOR)";
        String updateInstallInfo = "update TD_INSTALL_INFO T1 JOIN (SELECT PROJECT_ID,id,status,TENANT_ID from TD_SENSOR) T2 ON T1.related_id=T2.id SET T1.project_id=T2.project_id,T1.STATUS=T2.STATUS,T1.TENANT_ID=T2.TENANT_ID";
        String insertInstallInfo = "insert into TD_INSTALL_INFO(PROJECT_ID,related_id,STATUS,TENANT_ID,related_type,related_attribute) select PROJECT_ID,id,status,TENANT_ID,1,SENSOR_MAC from TD_SENSOR where TD_SENSOR.id not in(select related_id from TD_INSTALL_INFO WHERE related_type=1 and related_id IS NOT NULL)";

        String updateSize = "UPDATE TD_INSTALL_INFO T1 join TD_PROJECT T2 ON T1.PROJECT_ID=T2.ID set T1.shop_size=T2.SHOP_SIZE;";
        executeSql(delInstallInfo,updateInstallInfo,insertInstallInfo,updateSize);
    }

    private static void updateProjectPlace(){
        String delSql = " update TD_PROJECT_PLACE SET STATUS=-1 WHERE PROJECT_ID NOT IN(SELECT id FROM TD_PROJECT)";
        String updateSql = "update TD_PROJECT_PLACE T1 JOIN (SELECT ID,CONCAT(PROJECT_NAME,'_场地') PLACE_NAME, STATUS,TENANT_ID FROM TD_PROJECT) T2 ON T1.PROJECT_id=T2.id SET T1.PLACE_NAME=T2.PLACE_NAME,T1.STATUS=T2.STATUS,T1.TENANT_ID=T2.TENANT_ID";
        String insertSql = "insert into TD_PROJECT_PLACE(PROJECT_ID,PLACE_NAME,STATUS,TENANT_ID) select ID,CONCAT(PROJECT_NAME,'_场地'), STATUS,TENANT_ID FROM TD_PROJECT where TD_PROJECT.id not in(select PROJECT_id from TD_PROJECT_PLACE WHERE PROJECT_id IS NOT NULL)";

        executeSql(delSql,updateSql,insertSql);
    }

    private static void updateProjectIndex(){
        String delSql = " update TD_PROJECT_INDEX SET STATUS=-1 WHERE PROJECT_ID NOT IN(SELECT id FROM TD_PROJECT)";
        String insertSql = "insert into TD_PROJECT_INDEX(project_id,project_name,project_type,project_num,status,tenant_id) select id,project_name,project_type,project_num,status,tenant_id FROM TD_PROJECT where TD_PROJECT.id not in(select PROJECT_id from TD_PROJECT_INDEX WHERE PROJECT_id IS NOT NULL)";

        executeSql(delSql,insertSql);
    }

    /**
     * 针对每条新的TD_CROWD,创建三种人群，并把au的id 更新到项目表中的默认人群
     *
     * AU 入店客流
     * NU 入店新客
     * OU 入店老客
     *
     * SU 停留客流
     * JU 跳出客流
     * HU 高活跃客流
     * MU 中活跃客流
     * LU 低活跃客流
     * SLU 沉睡客流
     */

    private static void updateCrowd(){
        String updateSql = "update TD_CROWD set creator = 'updateInitial' where creator = 'initial' ";
        String insertSql_AU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '入店客流',5,1,'bestseller@163.com','initial','AU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='AU' AND attr1 IS NOT NULL)AND PROJECT_TYPE=1";
        String insertSql_OU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '入店老客',5,1,'bestseller@163.com','initial','OU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='OU' AND attr1 IS NOT NULL)AND PROJECT_TYPE=1";
        String insertSql_NU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '入店新客',5,1,'bestseller@163.com','initial','NU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='NU' AND attr1 IS NOT NULL) AND PROJECT_TYPE=1";

        String updateProject="update TD_PROJECT T1 join (select id,attr1 from TD_CROWD where type='AU') T2 ON T1.ID=T2.ATTR1 SET T1.default_crowd=T2.id";

        executeSql(updateSql,insertSql_AU,insertSql_OU,insertSql_NU,updateProject);

        String insertSql_SU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '停留客流',5,1,'bestseller@163.com','initial','SU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='SU' AND attr1 IS NOT NULL)AND PROJECT_TYPE=1";
        String insertSql_JU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '跳出客流',5,1,'bestseller@163.com','initial','JU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='JU' AND attr1 IS NOT NULL)AND PROJECT_TYPE=1";
        String insertSql_HU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '高活跃客流',5,1,'bestseller@163.com','initial','HU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='HU' AND attr1 IS NOT NULL) AND PROJECT_TYPE=1";

        String insertSql_MU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '中活跃客流',5,1,'bestseller@163.com','initial','MU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='MU' AND attr1 IS NOT NULL)AND PROJECT_TYPE=1";
        String insertSql_LU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '低活跃客流',5,1,'bestseller@163.com','initial','LU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='LU' AND attr1 IS NOT NULL)AND PROJECT_TYPE=1";
        String insertSql_SLU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '沉睡客流',5,1,'bestseller@163.com','initial','SLU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='SLU' AND attr1 IS NOT NULL) AND PROJECT_TYPE=1";

        executeSql(insertSql_SU,insertSql_JU,insertSql_HU,insertSql_MU,insertSql_LU,insertSql_SLU);
    }

    private static void updateProjectAttribute(){
        String insertSql = "insert into TD_PROJECT_ATTRIBUTE(project_id,status,creator) select id,1,'initial' FROM TD_PROJECT where TD_PROJECT.id not in(select PROJECT_id from TD_PROJECT_ATTRIBUTE WHERE PROJECT_id IS NOT NULL)";

        executeSql(insertSql);
    }

    private static void updateProjectParam(){
        String insertSql = "insert into TD_PROJECT_PARAM(project_id,`key`,`value`,CREATOR) select id,'PROJECT.THEME','blue','initial' FROM TD_PROJECT where TD_PROJECT.id not in(select distinct PROJECT_id from TD_PROJECT_PARAM WHERE PROJECT_id IS NOT NULL)";
        executeSql(insertSql);
    }

    private static void updateBatchConfig(){
        String insertSql = "insert into TD_PROJECT_BATCH_CONFIG(project_id,project_name,project_num,city,status,creator) select id,project_name,project_num,city,status,creator FROM TD_PROJECT where TD_PROJECT.id not in(select distinct PROJECT_id from TD_PROJECT_BATCH_CONFIG WHERE PROJECT_id IS NOT NULL)";
        executeSql(insertSql);
    }

    public static void logicalDelProject() {

        String update_7 ="update TD_PROJECT set status=-1  WHERE PROJECT_TYPE=7        AND (TENANT_ID,PROJECT_NAME) NOT IN(SELECT TENANT_ID,C_STORE_NAME FROM TD_SHOP WHERE C_STORE_NAME IS NOT NULL)";
        String update_8 ="update TD_PROJECT set status=-1  WHERE PROJECT_TYPE=8        AND (TENANT_ID,PROJECT_NAME) NOT IN(SELECT TENANT_ID,GROUP_NAME FROM TD_SHOP WHERE GROUP_NAME IS NOT NULL)";
        String update_3 ="update TD_PROJECT set status=-1  WHERE PROJECT_TYPE=3        AND (TENANT_ID,PROJECT_NAME) NOT IN(SELECT TENANT_ID,PHY_CITY_NAME FROM TD_SHOP WHERE PHY_CITY_NAME IS NOT NULL)";
        String update_4 ="update TD_PROJECT set status=-1  WHERE PROJECT_TYPE=4        AND (TENANT_ID,PROJECT_NAME) NOT IN(SELECT TENANT_ID,concat(PHY_CITY_NAME,'_',BRAND_ALIASNAME) FROM TD_SHOP WHERE concat(PHY_CITY_NAME,'_',BRAND_ALIASNAME) IS NOT NULL)";

        String update_9 ="update TD_PROJECT set status=-1  WHERE PROJECT_TYPE=9        AND (TENANT_ID,PROJECT_NAME) NOT IN(SELECT TENANT_ID,PHY_PRO_NAME FROM TD_SHOP WHERE PHY_PRO_NAME IS NOT NULL)";
        String update_10 ="update TD_PROJECT set status=-1  WHERE PROJECT_TYPE=10       AND (TENANT_ID,PROJECT_NAME) NOT IN(SELECT TENANT_ID,concat(PHY_PRO_NAME,'_',BRAND_ALIASNAME) FROM TD_SHOP WHERE concat(PHY_PRO_NAME,'_',BRAND_ALIASNAME) IS NOT NULL)";
        String update_5 ="update TD_PROJECT set status=-1  WHERE PROJECT_TYPE=5        AND (TENANT_ID,PROJECT_NAME) NOT IN(SELECT TENANT_ID,concat(C_AREA_CN_NAME,'_',BRAND_ALIASNAME) FROM TD_SHOP WHERE concat(C_AREA_CN_NAME,'_',BRAND_ALIASNAME) IS NOT NULL)";
        String update_6 ="update TD_PROJECT set status=-1  WHERE PROJECT_TYPE=6        AND (TENANT_ID,PROJECT_NAME) NOT IN(SELECT TENANT_ID,BRAND_NAME FROM TD_SHOP WHERE BRAND_NAME IS NOT NULL)";

        String update_11 ="update TD_PROJECT set status=-1  WHERE PROJECT_TYPE=11        AND (TENANT_ID,PROJECT_NAME) NOT IN(SELECT TENANT_ID,concat('lgc_',C_CITY_NAME,'_',BRAND_ALIASNAME) FROM TD_SHOP WHERE concat('lgc_',C_CITY_NAME,'_',BRAND_ALIASNAME) IS NOT NULL)";
        String update_12 ="update TD_PROJECT set status=-1  WHERE PROJECT_TYPE=12        AND (TENANT_ID,PROJECT_NAME) NOT IN(SELECT TENANT_ID,concat(BRAND_ALIASNAME,'_',GROUP_NAME) FROM TD_SHOP WHERE concat(BRAND_ALIASNAME,'_',GROUP_NAME) IS NOT NULL)";
        String update_13 ="update TD_PROJECT set status=-1  WHERE PROJECT_TYPE=13        AND (TENANT_ID,PROJECT_NAME) NOT IN(SELECT TENANT_ID,concat(PHY_PRO_NAME,'_',GROUP_NAME) FROM TD_SHOP WHERE concat(PHY_PRO_NAME,'_',GROUP_NAME) IS NOT NULL)";
        String update_14 ="update TD_PROJECT set status=-1  WHERE PROJECT_TYPE=14        AND (TENANT_ID,PROJECT_NAME) NOT IN(SELECT TENANT_ID,concat(PHY_CITY_NAME,'_',GROUP_NAME) FROM TD_SHOP WHERE concat(PHY_CITY_NAME,'_',GROUP_NAME) IS NOT NULL)";

        executeSql(update_7,update_8,update_3,update_4,update_9,update_10,update_5,update_6,update_11,update_12,update_13,update_14);
    }

    public static void logicalUpdateProject() {

        String update_7 ="UPDATE TD_PROJECT O JOIN ( SELECT DISTINCT C_STORE_ID, C_STORE_NAME AS project_name, 1, 'initial', 8848, TENANT_ID, 7, NULL AS BRAND, NULL AS region, PHY_PRO_NAME, PHY_CITY_NAME, GROUP_NAME, C_STORE_NAME, NULL AS logical_city FROM TD_SHOP WHERE BRAND_ALIASNAME IS NOT NULL ) T2 ON O.PROJECT_NAME = T2.C_STORE_NAME AND O.TENANT_ID=T2.TENANT_ID AND O.project_type = 7 SET O. STATUS = 1, O.type_id = 8848, O.TENANT_ID = T2.TENANT_ID, O.BRAND = NULL, O.region = NULL, O.province = T2.PHY_PRO_NAME, O.city = T2.PHY_CITY_NAME, O.channel = T2.GROUP_NAME, O.mall = T2.C_STORE_NAME, O.logical_city = NULL";
        String update_8 ="UPDATE TD_PROJECT O JOIN ( SELECT DISTINCT NULL AS PROJECT_NUM, GROUP_NAME AS PROJECT_NAME, 1, 'INITIAL', 8848, TENANT_ID, 8, NULL BRAND, NULL REGION, NULL PROVINCE, NULL CITY, GROUP_NAME CHANNEL, NULL MALL, NULL LOGICAL_CITY FROM TD_SHOP WHERE BRAND_ALIASNAME IS NOT NULL ) T2 ON O.PROJECT_NAME = T2.PROJECT_NAME AND O.TENANT_ID = T2.TENANT_ID AND O.PROJECT_TYPE = 8 SET O. STATUS = 1, O.TYPE_ID = 8848, O.TENANT_ID = T2.TENANT_ID, O.BRAND = T2.BRAND, O.REGION = T2.REGION, O.PROVINCE = T2.PROVINCE, O.CITY = T2.CITY, O.CHANNEL = T2.CHANNEL, O.MALL = T2.MALL, O.LOGICAL_CITY = T2.LOGICAL_CITY";
        String update_3 ="UPDATE TD_PROJECT O JOIN ( SELECT DISTINCT NULL AS PROJECT_NUM, PHY_CITY_NAME AS PROJECT_NAME, 1, 'INITIAL', 8848, TENANT_ID, 3, NULL BRAND, NULL REGION, PHY_PRO_NAME PROVINCE, PHY_CITY_NAME CITY, NULL CHANNEL, NULL MALL, NULL LOGICAL_CITY FROM TD_SHOP WHERE BRAND_ALIASNAME IS NOT NULL ) T2 ON O.PROJECT_NAME = T2.PROJECT_NAME AND O.TENANT_ID = T2.TENANT_ID AND O.PROJECT_TYPE = 3 SET O. STATUS = 1, O.TYPE_ID = 8848, O.TENANT_ID = T2.TENANT_ID, O.BRAND = T2.BRAND, O.REGION = T2.REGION, O.PROVINCE = T2.PROVINCE, O.CITY = T2.CITY, O.CHANNEL = T2.CHANNEL, O.MALL = T2.MALL, O.LOGICAL_CITY = T2.LOGICAL_CITY";
        String update_4 ="UPDATE TD_PROJECT O JOIN ( SELECT DISTINCT NULL AS PROJECT_NUM, concat( PHY_CITY_NAME, '_', BRAND_ALIASNAME ) AS PROJECT_NAME, 1, 'INITIAL', 8848, TENANT_ID, 4, BRAND_NAME BRAND, NULL REGION, PHY_PRO_NAME PROVINCE, PHY_CITY_NAME CITY, NULL CHANNEL, NULL MALL, NULL LOGICAL_CITY FROM TD_SHOP WHERE BRAND_ALIASNAME IS NOT NULL ) T2 ON O.PROJECT_NAME = T2.PROJECT_NAME AND O.TENANT_ID = T2.TENANT_ID AND O.PROJECT_TYPE = 4 SET O. STATUS = 1, O.TYPE_ID = 8848, O.TENANT_ID = T2.TENANT_ID, O.BRAND = T2.BRAND, O.REGION = T2.REGION, O.PROVINCE = T2.PROVINCE, O.CITY = T2.CITY, O.CHANNEL = T2.CHANNEL, O.MALL = T2.MALL, O.LOGICAL_CITY = T2.LOGICAL_CITY";

        String update_9 ="UPDATE TD_PROJECT O JOIN ( SELECT DISTINCT NULL AS PROJECT_NUM, PHY_PRO_NAME AS PROJECT_NAME, 1, 'INITIAL', 8848, TENANT_ID, 9, NULL BRAND, NULL REGION, PHY_PRO_NAME PROVINCE, NULL CITY, NULL CHANNEL, NULL MALL, NULL LOGICAL_CITY FROM TD_SHOP WHERE BRAND_ALIASNAME IS NOT NULL ) T2 ON O.PROJECT_NAME = T2.PROJECT_NAME AND O.TENANT_ID = T2.TENANT_ID AND O.PROJECT_TYPE = 9 SET O. STATUS = 1, O.TYPE_ID = 8848, O.TENANT_ID = T2.TENANT_ID, O.BRAND = T2.BRAND, O.REGION = T2.REGION, O.PROVINCE = T2.PROVINCE, O.CITY = T2.CITY, O.CHANNEL = T2.CHANNEL, O.MALL = T2.MALL, O.LOGICAL_CITY = T2.LOGICAL_CITY";
        String update_10 ="UPDATE TD_PROJECT O JOIN ( SELECT DISTINCT NULL AS PROJECT_NUM, concat( PHY_PRO_NAME, '_', BRAND_ALIASNAME ) AS PROJECT_NAME, 1, 'INITIAL', 8848, TENANT_ID, 10, BRAND_NAME BRAND, NULL REGION, PHY_PRO_NAME PROVINCE, NULL CITY, NULL CHANNEL, NULL MALL, NULL LOGICAL_CITY FROM TD_SHOP WHERE BRAND_ALIASNAME IS NOT NULL ) T2 ON O.PROJECT_NAME = T2.PROJECT_NAME AND O.TENANT_ID = T2.TENANT_ID AND O.PROJECT_TYPE = 10 SET O. STATUS = 1, O.TYPE_ID = 8848, O.TENANT_ID = T2.TENANT_ID, O.BRAND = T2.BRAND, O.REGION = T2.REGION, O.PROVINCE = T2.PROVINCE, O.CITY = T2.CITY, O.CHANNEL = T2.CHANNEL, O.MALL = T2.MALL, O.LOGICAL_CITY = T2.LOGICAL_CITY";
        String update_5 ="UPDATE TD_PROJECT O JOIN ( SELECT DISTINCT NULL AS PROJECT_NUM, concat( C_AREA_CN_NAME, '_', BRAND_ALIASNAME ) AS PROJECT_NAME, 1, 'INITIAL', 8848, TENANT_ID, 5, BRAND_NAME BRAND, concat( C_AREA_CN_NAME, '_', BRAND_ALIASNAME ) REGION, NULL PROVINCE, NULL CITY, NULL CHANNEL, NULL MALL, NULL LOGICAL_CITY FROM TD_SHOP WHERE BRAND_ALIASNAME IS NOT NULL ) T2 ON O.PROJECT_NAME = T2.PROJECT_NAME AND O.TENANT_ID = T2.TENANT_ID AND O.PROJECT_TYPE = 5 SET O. STATUS = 1, O.TYPE_ID = 8848, O.TENANT_ID = T2.TENANT_ID, O.BRAND = T2.BRAND, O.REGION = T2.REGION, O.PROVINCE = T2.PROVINCE, O.CITY = T2.CITY, O.CHANNEL = T2.CHANNEL, O.MALL = T2.MALL, O.LOGICAL_CITY = T2.LOGICAL_CITY";
        String update_6 ="UPDATE TD_PROJECT O JOIN ( SELECT DISTINCT NULL AS PROJECT_NUM, BRAND_NAME AS PROJECT_NAME, 1, 'INITIAL', 8848, TENANT_ID, 6, BRAND_NAME BRAND, NULL REGION, NULL PROVINCE, NULL CITY, NULL CHANNEL, NULL MALL, NULL LOGICAL_CITY FROM TD_SHOP WHERE BRAND_ALIASNAME IS NOT NULL ) T2 ON O.PROJECT_NAME = T2.PROJECT_NAME AND O.TENANT_ID = T2.TENANT_ID AND O.PROJECT_TYPE = 6 SET O. STATUS = 1, O.TYPE_ID = 8848, O.TENANT_ID = T2.TENANT_ID, O.BRAND = T2.BRAND, O.REGION = T2.REGION, O.PROVINCE = T2.PROVINCE, O.CITY = T2.CITY, O.CHANNEL = T2.CHANNEL, O.MALL = T2.MALL, O.LOGICAL_CITY = T2.LOGICAL_CITY";

        String update_11 ="UPDATE TD_PROJECT O JOIN ( SELECT DISTINCT NULL AS PROJECT_NUM, concat( 'lgc_', C_CITY_NAME, '_', BRAND_ALIASNAME ) AS PROJECT_NAME, 1, 'INITIAL', 8848, TENANT_ID, 11, BRAND_NAME BRAND, concat( C_AREA_CN_NAME, '_', BRAND_ALIASNAME ) REGION, NULL PROVINCE, NULL CITY, NULL CHANNEL, NULL MALL, concat( 'lgc_', C_CITY_NAME, '_', BRAND_ALIASNAME ) LOGICAL_CITY, C_CITY_NAME C_CITY_NAME FROM TD_SHOP WHERE BRAND_ALIASNAME IS NOT NULL ) T2 ON O.PROJECT_NAME = T2.PROJECT_NAME AND O.TENANT_ID = T2.TENANT_ID AND O.PROJECT_TYPE = 11 SET O. STATUS = 1, O.TYPE_ID = 8848, O.TENANT_ID = T2.TENANT_ID, O.BRAND = T2.BRAND, O.REGION = T2.REGION, O.PROVINCE = T2.PROVINCE, O.CITY = T2.CITY, O.CHANNEL = T2.CHANNEL, O.MALL = T2.MALL, O.LOGICAL_CITY = T2.LOGICAL_CITY, O.c_city_cn_name = T2.C_CITY_NAME";
        String update_12 ="UPDATE TD_PROJECT O JOIN ( SELECT DISTINCT NULL AS PROJECT_NUM, concat( BRAND_ALIASNAME, '_', GROUP_NAME ) AS PROJECT_NAME, 1, 'INITIAL', 8848, TENANT_ID, 12, BRAND_NAME BRAND, NULL REGION, NULL PROVINCE, NULL CITY, GROUP_NAME CHANNEL, NULL MALL, NULL LOGICAL_CITY FROM TD_SHOP WHERE BRAND_ALIASNAME IS NOT NULL ) T2 ON O.PROJECT_NAME = T2.PROJECT_NAME AND O.TENANT_ID = T2.TENANT_ID AND O.PROJECT_TYPE = 12 SET O. STATUS = 1, O.TYPE_ID = 8848, O.TENANT_ID = T2.TENANT_ID, O.BRAND = T2.BRAND, O.REGION = T2.REGION, O.PROVINCE = T2.PROVINCE, O.CITY = T2.CITY, O.CHANNEL = T2.CHANNEL, O.MALL = T2.MALL, O.LOGICAL_CITY = T2.LOGICAL_CITY";

        String update_13 ="UPDATE TD_PROJECT O JOIN ( SELECT DISTINCT NULL AS PROJECT_NUM, concat( PHY_PRO_NAME, '_', GROUP_NAME ) AS PROJECT_NAME, 1, 'INITIAL', 8848, TENANT_ID, 13, NULL BRAND, NULL REGION, PHY_PRO_NAME PROVINCE, NULL CITY, GROUP_NAME CHANNEL, NULL MALL, NULL LOGICAL_CITY FROM TD_SHOP WHERE BRAND_ALIASNAME IS NOT NULL ) T2 ON O.PROJECT_NAME = T2.PROJECT_NAME AND O.TENANT_ID = T2.TENANT_ID AND O.PROJECT_TYPE = 13 SET O. STATUS = 1, O.TYPE_ID = 8848, O.TENANT_ID = T2.TENANT_ID, O.BRAND = T2.BRAND, O.REGION = T2.REGION, O.PROVINCE = T2.PROVINCE, O.CITY = T2.CITY, O.CHANNEL = T2.CHANNEL, O.MALL = T2.MALL, O.LOGICAL_CITY = T2.LOGICAL_CITY";
        String update_14 ="UPDATE TD_PROJECT O JOIN ( SELECT DISTINCT NULL AS PROJECT_NUM, concat( PHY_CITY_NAME, '_', GROUP_NAME ) AS PROJECT_NAME, 1, 'INITIAL', 8848, TENANT_ID, 14, NULL BRAND, NULL REGION, PHY_PRO_NAME PROVINCE, PHY_CITY_NAME CITY, GROUP_NAME CHANNEL, NULL MALL, NULL LOGICAL_CITY FROM TD_SHOP WHERE BRAND_ALIASNAME IS NOT NULL ) T2 ON O.PROJECT_NAME = T2.PROJECT_NAME AND O.TENANT_ID = T2.TENANT_ID AND O.PROJECT_TYPE = 14 SET O. STATUS = 1, O.TYPE_ID = 8848, O.TENANT_ID = T2.TENANT_ID, O.BRAND = T2.BRAND, O.REGION = T2.REGION, O.PROVINCE = T2.PROVINCE, O.CITY = T2.CITY, O.CHANNEL = T2.CHANNEL, O.MALL = T2.MALL, O.LOGICAL_CITY = T2.LOGICAL_CITY";

        executeSql(update_7,update_8,update_3,update_4,update_9,update_10,update_5,update_6,update_11,update_12,update_13,update_14);
    }

    //    项目类型 1：店铺 2：自定义 3：物理城市 4：品牌城市 5：品牌大区 6：品牌 7: 商场 8：渠道 9：物理省份 10：品牌省份 11:逻辑城市  12：品牌渠道 13：渠道省份 14：渠道城市
    private static void insertIntoProjectWithOrganization() {
//        (1)商场：
        String insertMall = "insert into TD_PROJECT(project_num,project_name,status,creator,type_id,TENANT_ID,PROJECT_TYPE,BRAND,region,province,city,channel,mall,logical_city) SELECT distinct C_STORE_ID,C_STORE_NAME,1,'initial',8848,TENANT_ID,7,null,null,PHY_PRO_NAME,PHY_CITY_NAME,GROUP_NAME,C_STORE_NAME,null from "+ TD_SHOP +" WHERE (C_STORE_NAME,TENANT_ID) NOT IN(SELECT PROJECT_NAME,TENANT_ID FROM TD_PROJECT WHERE STATUS=1 and PROJECT_TYPE=7 and PROJECT_NAME is not null and TENANT_ID is not null) and BRAND_ALIASNAME is not null";
        executeSql(insertMall);

//        (2)渠道：
        String insertChannel = "insert into TD_PROJECT(project_num,project_name,status,creator,type_id,TENANT_ID,PROJECT_TYPE,BRAND,region,province,city,channel,mall,logical_city) SELECT distinct null,GROUP_NAME,1,'initial',8848,TENANT_ID,8,null,null,null,null,GROUP_NAME,null,null from "+ TD_SHOP +" WHERE (GROUP_NAME,TENANT_ID) NOT IN(SELECT PROJECT_NAME,TENANT_ID FROM TD_PROJECT WHERE STATUS=1 and PROJECT_TYPE=8 and PROJECT_NAME is not null and TENANT_ID is not null)and BRAND_ALIASNAME is not null";
        executeSql(insertChannel);


//        (3)物理城市：
        String insertPhyCity = "insert into TD_PROJECT(project_num,project_name,status,creator,type_id,TENANT_ID,PROJECT_TYPE,BRAND,region,province,city,channel,mall,logical_city)SELECT distinct null,PHY_CITY_NAME,1,'initial',8848,TENANT_ID,3,null,null,PHY_PRO_NAME,PHY_CITY_NAME,null,null,null from "+ TD_SHOP +" WHERE (PHY_CITY_NAME,TENANT_ID) NOT IN(SELECT PROJECT_NAME,TENANT_ID FROM TD_PROJECT WHERE STATUS=1 and PROJECT_TYPE=3 and PROJECT_NAME is not null and TENANT_ID is not null)and BRAND_ALIASNAME is not null";
        executeSql(insertPhyCity);

//        (4)品牌城市：
        String insertBrandCity = "insert into TD_PROJECT(project_num,project_name,status,creator,type_id,TENANT_ID,PROJECT_TYPE,BRAND,region,province,city,channel,mall,logical_city)SELECT distinct null,concat(PHY_CITY_NAME,'_',BRAND_ALIASNAME),1,'initial',8848,TENANT_ID,4,BRAND_NAME,null,PHY_PRO_NAME,PHY_CITY_NAME,null,null,null from "+ TD_SHOP +" WHERE (concat(PHY_CITY_NAME,'_',BRAND_ALIASNAME),TENANT_ID) NOT IN(SELECT PROJECT_NAME,TENANT_ID FROM TD_PROJECT WHERE STATUS=1 and PROJECT_TYPE=4 and PROJECT_NAME is not null and TENANT_ID is not null)and BRAND_ALIASNAME is not null";
        executeSql(insertBrandCity);

//        (5)物理省份：
        String insertPhyPro = "insert into TD_PROJECT(project_num,project_name,status,creator,type_id,TENANT_ID,PROJECT_TYPE,BRAND,region,province,city,channel,mall,logical_city)SELECT distinct null,PHY_PRO_NAME,1,'initial',8848,TENANT_ID,9,null,null,PHY_PRO_NAME,null,null,null,null from "+ TD_SHOP +" WHERE (PHY_PRO_NAME,TENANT_ID) NOT IN(SELECT PROJECT_NAME,TENANT_ID FROM TD_PROJECT WHERE STATUS=1 and PROJECT_TYPE=9 and PROJECT_NAME is not null and TENANT_ID is not null)and BRAND_ALIASNAME is not null";
        executeSql(insertPhyPro);

//        (6)品牌省份：
        String insertBrandPro = "insert into TD_PROJECT(project_num,project_name,status,creator,type_id,TENANT_ID,PROJECT_TYPE,BRAND,region,province,city,channel,mall,logical_city)SELECT distinct null,concat(PHY_PRO_NAME,'_',BRAND_ALIASNAME),1,'initial',8848,TENANT_ID,10,BRAND_NAME,null,PHY_PRO_NAME,null,null,null,null from "+ TD_SHOP +" WHERE (concat(PHY_PRO_NAME,'_',BRAND_ALIASNAME),TENANT_ID) NOT IN(SELECT PROJECT_NAME,TENANT_ID FROM TD_PROJECT WHERE STATUS=1 and PROJECT_TYPE=10 and PROJECT_NAME is not null and TENANT_ID is not null)and BRAND_ALIASNAME is not null";
        executeSql(insertBrandPro);

//        (7)品牌大区
        String insertBrandRegion = "insert into TD_PROJECT(project_num,project_name,status,creator,type_id,TENANT_ID,PROJECT_TYPE,BRAND,region,province,city,channel,mall,logical_city,C_CITY_CN_NAME)SELECT distinct null,concat(C_AREA_CN_NAME,'_',BRAND_ALIASNAME),1,'initial',8848,TENANT_ID,5,BRAND_NAME,concat(C_AREA_CN_NAME,'_',BRAND_ALIASNAME),null,null,null,null,null,null from "+ TD_SHOP +" WHERE (concat(C_AREA_CN_NAME,'_',BRAND_ALIASNAME),TENANT_ID) NOT IN(SELECT PROJECT_NAME,TENANT_ID FROM TD_PROJECT WHERE STATUS=1 and PROJECT_TYPE=5 and PROJECT_NAME is not null and TENANT_ID is not null)and BRAND_ALIASNAME is not null";
        executeSql(insertBrandRegion);

//        (8)品牌
        String insertBrand = "insert into TD_PROJECT(project_num,project_name,status,creator,type_id,TENANT_ID,PROJECT_TYPE,BRAND,region,province,city,channel,mall,logical_city)SELECT distinct null,BRAND_NAME,1,'initial',8848,TENANT_ID,6,BRAND_NAME,null,null,null,null,null,null from "+ TD_SHOP +" WHERE (BRAND_NAME,TENANT_ID) NOT IN(SELECT PROJECT_NAME,TENANT_ID FROM TD_PROJECT WHERE STATUS=1 and PROJECT_TYPE=6 and PROJECT_NAME is not null and TENANT_ID is not null)and BRAND_ALIASNAME is not null";
        executeSql(insertBrand);

//      (9)逻辑城市
        String insertLogicCity = "insert into TD_PROJECT(project_num,project_name,status,creator,type_id,TENANT_ID,PROJECT_TYPE,BRAND,region,province,city,channel,mall,logical_city,C_CITY_CN_NAME)SELECT distinct null,concat('lgc_',C_CITY_NAME,'_',BRAND_ALIASNAME),1,'initial',8848,TENANT_ID,11,BRAND_NAME,concat(C_AREA_CN_NAME,'_',BRAND_ALIASNAME),null,null,null,null,concat('lgc_',C_CITY_NAME,'_',BRAND_ALIASNAME),C_CITY_NAME from "+ TD_SHOP +" WHERE (concat('lgc_',C_CITY_NAME,'_',BRAND_ALIASNAME),TENANT_ID) NOT IN(SELECT PROJECT_NAME,TENANT_ID FROM TD_PROJECT WHERE STATUS=1 and PROJECT_TYPE=11 and PROJECT_NAME is not null and TENANT_ID is not null)and BRAND_ALIASNAME is not null";
        executeSql(insertLogicCity);


//      (12) 品牌渠道
        String brandChannel = "insert into TD_PROJECT(project_num,project_name,status,creator,type_id,TENANT_ID,PROJECT_TYPE,BRAND,region,province,city,channel,mall,logical_city)SELECT distinct null,concat(BRAND_ALIASNAME,'_',GROUP_NAME),1,'initial',8848,TENANT_ID,12,BRAND_NAME,null,null,null,GROUP_NAME,null,null from "+ TD_SHOP +" WHERE (concat(BRAND_ALIASNAME,'_',GROUP_NAME),TENANT_ID) NOT IN(SELECT PROJECT_NAME,TENANT_ID FROM TD_PROJECT WHERE STATUS=1 and PROJECT_TYPE=12 and PROJECT_NAME is not null and TENANT_ID is not null)and BRAND_ALIASNAME is not null";
        executeSql(brandChannel);

//      (13) 渠道省份
        String provinceChannel = "insert into TD_PROJECT(project_num,project_name,status,creator,type_id,TENANT_ID,PROJECT_TYPE,BRAND,region,province,city,channel,mall,logical_city)SELECT distinct null,concat(PHY_PRO_NAME,'_',GROUP_NAME),1,'initial',8848,TENANT_ID,13,null,null,PHY_PRO_NAME,null,GROUP_NAME,null,null from "+ TD_SHOP +" WHERE (concat(PHY_PRO_NAME,'_',GROUP_NAME),TENANT_ID) NOT IN(SELECT PROJECT_NAME,TENANT_ID FROM TD_PROJECT WHERE STATUS=1 and PROJECT_TYPE=13 and PROJECT_NAME is not null and TENANT_ID is not null)and BRAND_ALIASNAME is not null";
        executeSql(provinceChannel);

//      (14) 渠道城市
        String cityChannel = "insert into TD_PROJECT(project_num,project_name,status,creator,type_id,TENANT_ID,PROJECT_TYPE,BRAND,region,province,city,channel,mall,logical_city)SELECT distinct null,concat(PHY_CITY_NAME,'_',GROUP_NAME),1,'initial',8848,TENANT_ID,14,null,null,PHY_PRO_NAME,PHY_CITY_NAME,GROUP_NAME,null,null from "+ TD_SHOP +" WHERE (concat(PHY_CITY_NAME,'_',GROUP_NAME),TENANT_ID) NOT IN(SELECT PROJECT_NAME,TENANT_ID FROM TD_PROJECT WHERE STATUS=1 and PROJECT_TYPE=14 and PROJECT_NAME is not null and TENANT_ID is not null)and BRAND_ALIASNAME is not null";
        executeSql(cityChannel);

        // 组织关系的人群（//项目类型 1：店铺 5：品牌大区 6：品牌 11:逻辑城市）
        updateCrowd4Organization(5);
        updateCrowd4Organization(6);
        updateCrowd4Organization(11);
    }

    private static void insertIntoRelation(){
//      (1)店铺 商场的父子关系
        String sql_1 = "insert into TD_PROJECT_RELATION(PROJECT_ID,PROJECT_PARENT_ID) select T1.ID,T2.ID from (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=1) T1 JOIN (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=7)T2 ON T1.MALL=T2.PROJECT_NAME AND T1.TENANT_ID=T2.TENANT_ID";
        executeSql(sql_1);

//      (2)商场 渠道的父子关系
        String sql_2 = "insert into TD_PROJECT_RELATION(PROJECT_ID,PROJECT_PARENT_ID) select T1.ID,T2.ID from (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=7) T1 JOIN (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=8)T2 ON T1.channel=T2.PROJECT_NAME AND T1.TENANT_ID=T2.TENANT_ID";
        executeSql(sql_2);

//      (3)店铺 品牌城市的父子关系
        String sql_3 = "insert into TD_PROJECT_RELATION(PROJECT_ID,PROJECT_PARENT_ID) select T1.ID,T2.ID from (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=1) T1 JOIN (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=4)T2 ON concat(T1.city,'_',T1.brand)=concat(T2.city,'_',T2.brand) AND T1.TENANT_ID=T2.TENANT_ID";
        executeSql(sql_3);

//     (4)品牌城市 品牌省份的父子关系
        String sql_4 = "insert into TD_PROJECT_RELATION(PROJECT_ID,PROJECT_PARENT_ID) select T1.ID,T2.ID from (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=4) T1 JOIN (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=10)T2 ON concat(T1.province,'_',T1.brand)=concat(T2.province,'_',T2.brand) AND T1.TENANT_ID=T2.TENANT_ID";
        executeSql(sql_4);

//     (7)物理城市 与物理省份的父子关系
        String sql_7 = "insert into TD_PROJECT_RELATION(PROJECT_ID,PROJECT_PARENT_ID) select T1.ID,T2.ID from (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=3) T1 JOIN (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=9)T2 ON T1.province=T2.PROJECT_NAME AND T1.TENANT_ID=T2.TENANT_ID";
        executeSql(sql_7);

//     (8)店铺 与 物理城市的父子关系
        String sql_8 = "insert into TD_PROJECT_RELATION(PROJECT_ID,PROJECT_PARENT_ID) select T1.ID,T2.ID from (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=1) T1 JOIN (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=3)T2 ON T1.city=T2.PROJECT_NAME AND T1.TENANT_ID=T2.TENANT_ID";
        executeSql(sql_8);

//     (9)店铺 与 逻辑城市的父子关系
        String sql_9 = "insert into TD_PROJECT_RELATION(PROJECT_ID,PROJECT_PARENT_ID) select T1.ID,T2.ID from (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=1) T1 JOIN (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=11)T2 ON T1.logical_city=T2.PROJECT_NAME AND T1.TENANT_ID=T2.TENANT_ID";
        executeSql(sql_9);

//     (10)逻辑城市 和 品牌大区的父子关系
        String sql_10 = "insert into TD_PROJECT_RELATION(PROJECT_ID,PROJECT_PARENT_ID) select T1.ID,T2.ID from (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=11) T1 JOIN (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=5)T2 ON T1.region=T2.PROJECT_NAME AND T1.TENANT_ID=T2.TENANT_ID";
        executeSql(sql_10);

//     (11)品牌大区 和 品牌的父子关系
        String sql_11 = "insert into TD_PROJECT_RELATION(PROJECT_ID,PROJECT_PARENT_ID) select T1.ID,T2.ID from (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=5) T1 JOIN (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=6)T2 ON T1.brand=T2.PROJECT_NAME AND T1.TENANT_ID=T2.TENANT_ID";
        executeSql(sql_11);

//     (12)品牌渠道 和 店铺 的父子关系
        String sql_12 = "insert into TD_PROJECT_RELATION(PROJECT_ID,PROJECT_PARENT_ID) select T1.ID,T2.ID from (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=1) T1 JOIN (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=12)T2 ON T1.brand=T2.BRAND AND T1.CHANNEL = T2.CHANNEL AND T1.TENANT_ID=T2.TENANT_ID";
        executeSql(sql_12);

//     (13)渠道城市 和 店铺 的父子关系
        String sql_13 = "insert into TD_PROJECT_RELATION(PROJECT_ID,PROJECT_PARENT_ID) select T1.ID,T2.ID from (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=1) T1 JOIN (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=14)T2 ON concat(T1.city,'_',T1.channel)=T2.PROJECT_NAME AND T1.TENANT_ID=T2.TENANT_ID";
        executeSql(sql_13);

//     (14)渠道省份 和 渠道城市 的父子关系
        String sql_14 = "insert into TD_PROJECT_RELATION(PROJECT_ID,PROJECT_PARENT_ID) select T1.ID,T2.ID from (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=14) T1 JOIN (SELECT * FROM TD_PROJECT WHERE STATUS=1 AND PROJECT_TYPE=13)T2 ON concat(T1.province,'_',T1.channel)=T2.PROJECT_NAME AND T1.TENANT_ID=T2.TENANT_ID";
        executeSql(sql_14);


//      删除重复数据
        String delSql = "DELETE FROM TD_PROJECT_RELATION WHERE (PROJECT_ID,PROJECT_PARENT_ID) IN ( SELECT PROJECT_ID,PROJECT_PARENT_ID FROM( SELECT PROJECT_ID,PROJECT_PARENT_ID FROM TD_PROJECT_RELATION GROUP BY PROJECT_ID,PROJECT_PARENT_ID HAVING count(*) > 1 )T1) AND ID NOT IN ( SELECT ID FROM( SELECT min(ID) ID FROM TD_PROJECT_RELATION GROUP BY PROJECT_ID,PROJECT_PARENT_ID HAVING count(*) > 1 )T2)";
        executeSql(delSql);

        String delsql_1 ="delete from TD_PROJECT_RELATION where project_id not in (select id from TD_PROJECT where status=1)";
        String delSql_2 ="delete from TD_PROJECT_RELATION where project_parent_id not in (select id from TD_PROJECT where status=1)";
        executeSql(delsql_1,delSql_2);

//      生成下游数量
        String updateSql = "UPDATE TD_PROJECT T1 SET DOWN_NUMS=(SELECT COUNT(1) FROM TD_PROJECT_RELATION T2 WHERE T1.ID=T2.PROJECT_PARENT_ID) WHERE T1.PROJECT_TYPE IN(5,6,11)";
        executeSql(updateSql);

//      修改城市等级
        String updateLevel = "UPDATE TD_PROJECT  T1 JOIN TD_CITY T2 ON T1.CITY=T2.CITY SET T1.city_level=T2.`level`,T1.latitude=T2.latitude_bd ,T1.longitude=T2.longitude_bd WHERE PROJECT_TYPE=3 or PROJECT_TYPE=4 or PROJECT_TYPE=14";
        executeSql(updateLevel);
    }

    /**
     * 更新店铺的经纬度
     * 捎带更新逻辑城市和品牌大区的经纬度
     */
    private static void updateLatAndLong()throws SQLException {
        // 第一步：利用TD_SHOP 更新为0的值()  注释掉一下的内容，不再从绫致读取，全部用程序访问网络获取
//        String updateSql_0 = "UPDATE TD_PROJECT T1 join TD_SHOP T2 on T1.project_num=T2.c_shop_code SET T1.latitude=T2.C_LATITUDE,T1.longitude=T2.C_LONGITUDE WHERE T1.PROJECT_TYPE=1 AND T1.latitude=0.0";
//        executeSql(updateSql_0);

        // 第二步：利用百度 更新为0的值
        String sql = "select id,project_position from TD_PROJECT WHERE (LATITUDE=0.0 OR LONGITUDE=0.0 or LATITUDE is null OR LONGITUDE is null) AND PROJECT_TYPE=1 and status=1";
        PreparedStatement pstat = conn2Analytics.prepareStatement(sql);
        ResultSet rs = pstat.executeQuery();
        List<SmallProject> projectList = new ArrayList<SmallProject>();
        while(rs.next()){
            SmallProject smallProject =new SmallProject();
            smallProject.setId(rs.getLong(1));
            smallProject.setProject_position(rs.getString(2));

            projectList.add(smallProject);

        }
        pstat.close();

        String url = "http://api.map.baidu.com/geocoder/v2/?address=保安&output=json&ak=VifdHexZT4WOMrFYCQUZGorpRNjiRHer&callback=showLocation";

        String prefix ="http://api.map.baidu.com/geocoder/v2/?address=";
        String suffix ="&output=json&ak=VifdHexZT4WOMrFYCQUZGorpRNjiRHer&callback=showLocation";

        String updateSql = "update TD_PROJECT SET LATITUDE=?,LONGITUDE=? WHERE ID=?";
        pstat= conn2Analytics.prepareStatement(updateSql);

        for(int k=0;k<projectList.size();k++){
            String projectPositin=projectList.get(k).getProject_position().trim().replace("（", "").replace("）", "").replace(" ", "").replace("一", "").replace("#", "").replace("\t", "");
            if(projectPositin.length()>34){
                projectPositin=projectPositin.substring(0,34);
            }
            url=prefix+projectPositin+suffix;

            String json = loadJSON(url);
//            showLocation&&showLocation({"status":1,"msg":"Internal Service Error:无相关结果","results":[]})
            if(json.indexOf("location\":{\"lng\":")>0){
                try {
                    projectList.get(k).setLongitude(Double.valueOf(json.substring(json.indexOf("location\":{\"lng\":") + 17,json.indexOf(",\"lat\":"))));
                    projectList.get(k).setLatitude(Double.valueOf(json.substring(json.indexOf(",\"lat\":") + 7,json.indexOf("},\"precise"))));

                    pstat.setDouble(1, projectList.get(k).getLatitude());
                    pstat.setDouble(2, projectList.get(k).getLongitude());
                    pstat.setLong(3, projectList.get(k).getId());

                    pstat.addBatch();

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        pstat.executeBatch();
        pstat.close();
        log.info("需要处理为空的记录"+projectList.size());

        // 第三步：利用逻辑城市和品牌大区的经纬度
//        UPDATE TD_PROJECT O JOIN ( SELECT T3.PROJECT_PARENT_ID, T4.* FROM ( SELECT T1.PROJECT_PARENT_ID, MIN(T1.PROJECT_ID) PROJECT_ID FROM TD_PROJECT_RELATION T1 JOIN ( SELECT * FROM TD_PROJECT WHERE project_type = 1 AND STATUS = 1 ) T2 ON T1.PROJECT_ID = T2.ID GROUP BY T1.PROJECT_PARENT_ID ) T3 JOIN TD_PROJECT T4 ON T3.PROJECT_ID = T4.ID ) T5 ON O.ID = T5.PROJECT_PARENT_ID SET O.latitude = T5.latitude, O.longitude = T5.longitude WHERE O.PROJECT_TYPE = 11 AND O. STATUS = 1;
        String updateLogicCitySql = "UPDATE TD_PROJECT O JOIN ( SELECT T3.PROJECT_PARENT_ID, T4.* FROM ( SELECT T1.PROJECT_PARENT_ID, MIN(T1.PROJECT_ID) PROJECT_ID FROM TD_PROJECT_RELATION T1 JOIN ( SELECT * FROM TD_PROJECT WHERE project_type = 1 AND STATUS = 1 ) T2 ON T1.PROJECT_ID = T2.ID GROUP BY T1.PROJECT_PARENT_ID ) T3 JOIN TD_PROJECT T4 ON T3.PROJECT_ID = T4.ID ) T5 ON O.ID = T5.PROJECT_PARENT_ID SET O.latitude = T5.latitude, O.longitude = T5.longitude WHERE O.PROJECT_TYPE = 11 AND O. STATUS = 1";
        String updateBrandSql = "UPDATE TD_PROJECT O JOIN ( SELECT T3.PROJECT_PARENT_ID, T4.* FROM ( SELECT T1.PROJECT_PARENT_ID, MIN(T1.PROJECT_ID) PROJECT_ID FROM TD_PROJECT_RELATION T1 JOIN ( SELECT * FROM TD_PROJECT WHERE project_type = 11 AND STATUS = 1 ) T2 ON T1.PROJECT_ID = T2.ID GROUP BY T1.PROJECT_PARENT_ID ) T3 JOIN TD_PROJECT T4 ON T3.PROJECT_ID = T4.ID ) T5 ON O.ID = T5.PROJECT_PARENT_ID SET O.latitude = T5.latitude, O.longitude = T5.longitude WHERE O.PROJECT_TYPE = 5 AND O. STATUS = 1";
        executeSql(updateLogicCitySql,updateBrandSql);
    }

    private static void updateCrowd4Organization(int project_type){
        String insertSql_AU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '入店客流',5,1,'bestseller@163.com','initial','AU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='AU' AND attr1 IS NOT NULL)AND PROJECT_TYPE="+project_type;
        String insertSql_OU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '入店老客',5,1,'bestseller@163.com','initial','OU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='OU' AND attr1 IS NOT NULL)AND PROJECT_TYPE="+project_type;
        String insertSql_NU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '入店新客',5,1,'bestseller@163.com','initial','NU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='NU' AND attr1 IS NOT NULL) AND PROJECT_TYPE="+project_type;

        executeSql(insertSql_AU,insertSql_OU,insertSql_NU);

        String insertSql_SU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '停留客流',5,1,'bestseller@163.com','initial','SU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='SU' AND attr1 IS NOT NULL)AND PROJECT_TYPE="+project_type;
        String insertSql_JU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '跳出客流',5,1,'bestseller@163.com','initial','JU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='JU' AND attr1 IS NOT NULL)AND PROJECT_TYPE="+project_type;
        String insertSql_HU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '高活跃客流',5,1,'bestseller@163.com','initial','HU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='HU' AND attr1 IS NOT NULL) AND PROJECT_TYPE="+project_type;

        String insertSql_MU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '中活跃客流',5,1,'bestseller@163.com','initial','MU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='MU' AND attr1 IS NOT NULL)AND PROJECT_TYPE="+project_type;
        String insertSql_LU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '低活跃客流',5,1,'bestseller@163.com','initial','LU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='LU' AND attr1 IS NOT NULL)AND PROJECT_TYPE="+project_type;
        String insertSql_SLU = "insert into TD_CROWD(name,source,status,create_by,creator,type,tenant_id,attr1) select '沉睡客流',5,1,'bestseller@163.com','initial','SLU',TENANT_ID,id FROM TD_PROJECT where TD_PROJECT.id not in(select attr1 from TD_CROWD where type='SLU' AND attr1 IS NOT NULL) AND PROJECT_TYPE="+project_type;

        executeSql(insertSql_SU,insertSql_JU,insertSql_HU,insertSql_MU,insertSql_LU,insertSql_SLU);
    }

    private static void executeSql(String... strSqls) {
        String wrong ="";
        try {
            for(int k=0;k<strSqls.length;k++){
                log.info(strSqls[k]);
                wrong =strSqls[k];
                PreparedStatement pstat= conn2Analytics.prepareStatement(strSqls[k]);
                pstat.execute();
                pstat.close();
            }
        } catch (SQLException e) {
            log.info("wrong:============="+wrong);
            e.printStackTrace();
        }
    }

    public static String loadJSON(String url) {
        StringBuilder json = new StringBuilder();
        try {
            URL oracle = new URL(url);
            URLConnection conn = oracle.openConnection();
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));// 防止乱码

            String inputLine = null;
            while ((inputLine = in.readLine()) != null) {
                json.append(inputLine);
            }
            in.close();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return json.toString();
    }
}
class SmallProject {
    private long id;
    private String project_position;
    private double latitude;
    private double longitude;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getProject_position() {
        return project_position;
    }

    public void setProject_position(String project_position) {
        this.project_position = project_position;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

}