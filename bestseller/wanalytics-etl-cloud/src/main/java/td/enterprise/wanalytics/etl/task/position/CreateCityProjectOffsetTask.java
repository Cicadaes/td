package td.enterprise.wanalytics.etl.task.position;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.*;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.*;

/**
 * 生成城市月份offset，地理画像按照月份进行调用
 * 文件格式如下
 * 类型,城市名称,城市文件名称
 * city,cityName,cityId,cicityName_runDate_month_offset
 * crowd,cityId,projectId,crowdId,runDate,startDate,endDate,project_crowdId_month_offset
 * ...
 * city,cityName,cityId,cityName_runDate_month_offset
 * crowd,cityId,projectId,crowdId,runDate,startDate,endDate,project_crowdId_month_offset
 * ...
 * @author junmin.li
 *
 */
public class CreateCityProjectOffsetTask {

	public static Logger logger = Logger.getLogger(CreateCityProjectOffsetTask.class);

	public static void main(String[] args) {
        try{

            long begin = System.currentTimeMillis();
            Options options = new Options();
            options.addOption("outputFile", "outputFile", true, "输出文件");
            options.addOption("cityNames", "cityNames", true, "需要跑的城市名称");//空值表示所有
            options.addOption("projectIds", "projectIds", true, "需要跑的项目ID");//空值表示所有
            options.addOption("runDate", "runDate", true, "运行日期");//运行日期
            options.addOption("startDate", "startDate", true, "开始日期");//开始日期
            options.addOption("endDate", "endDate", true, "结束日期");//结束日期
            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String outputFile = line.getOptionValue("outputFile");
            String cityNames = line.getOptionValue("cityNames");
            String projectIds = line.getOptionValue("projectIds");
            String runDate = line.getOptionValue("runDate");
            String startDate = line.getOptionValue("startDate");
            String endDate = line.getOptionValue("endDate");
            execute(outputFile,cityNames,projectIds,runDate, startDate, endDate);
//            execute("/Users/kayc/wanalytics/datafile/tmp/position_offset_2017-10-20/position_offset_2017-10-20","-1","-1","2017-10-20", "2017-09-01", "2017-09-30");
            long end = System.currentTimeMillis();
            logger.info("生成城市项目Offset完成.用时：" + (end - begin)/1000 + " 秒 ");
        }catch (Exception e){
            logger.error("",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

	public static Boolean execute(String outputFile, String cityNames ,String projectIds, String runDate,String startDate,String endDate) throws Exception{
		BufferedWriter bw = null;
        FileWriter writer = null;
        try {
            List<String> cityList = getNeedRunCityList(cityNames);
            logger.info("需要计算的城市个数是:" + cityList.size());
            //输出文件夹
            File outputFolder = new File(outputFile);
            writer = new FileWriter(outputFile);
            bw = new BufferedWriter(writer);

            for(String cityName : cityList){
                logger.info("开始生成城市" + cityName + "配置");
                Set<String> cityOffsetSet = new LinkedHashSet<> ();//城市级别offset
                String sql = "select id ,tenant_id, status, project_type from TD_PROJECT where city='" + cityName + "' ";
                if(StringUtils.isNotBlank(projectIds) && !"-1".equals(projectIds) ){
                    sql += "  and id in (" + projectIds +")";
                }else {
                    sql+= "  and status=1 "; //正常项目,排除掉竞品项目
                }

                List<Map<String,Object>> list = QueryUtils.query(sql,QueryUtils.WIFIANALYTICS_DB);
                int cityHashCode = Math.abs(cityName.hashCode());
                //根据周期进行计算
                String  cycle = "30";
                //生成城市offset
                generateCityOffset(runDate,startDate,endDate, bw, outputFolder ,Integer.parseInt(cycle),  cityName, cityOffsetSet, list, cityHashCode,projectIds);

                if( ! cityOffsetSet.isEmpty() ) {
                    //写出城市offset
                    File cityOffsetFile  = new File(outputFolder.getParentFile(),cityHashCode + "_" + cycle +  "_mac");
                    writeOffset(cityOffsetFile,cityOffsetSet);
                }
                cityOffsetSet.clear();
                logger.info("结束生成城市" + cityName + "配置");
            }
        }catch(Exception e){
        	logger.error("写到文件失败：", e);
        }finally{
        	FileUtil.close(bw);
            FileUtil.close(writer);
        }
		return true;
	}

    /**
     *
     * @param runDate
     * @param bw
     * @param outputFolder
     * @param cycle
     * @param cityName
     * @param cityOffsetSet
     * @param list
     * @param cityHashCode
     * @throws Exception
     */
    private static void generateCityOffset(String runDate,String startDate,String endDate, BufferedWriter bw, File outputFolder,int cycle, String cityName, Set<String> cityOffsetSet, List<Map<String, Object>> list, int cityHashCode,String projectIds) throws Exception {
        String sql = "";

        //开始日期
        String lastMonthStartDate = DateUtil.getStartDate(runDate);
        //结束日期
        String lastMonthEndDate = DateUtil.getEndDate(runDate);

        Map<String,Integer> projectUserMap = null ;

        if( StringUtils.isNotBlank(startDate) && !"-1".equals(startDate)
            && StringUtils.isNotBlank(endDate) && !"-1".equals(endDate)
                ){
            logger.info("根据指定时间段跑职住来源：startDate=" + startDate + "  endDate=" + endDate );
            projectUserMap = CubeUtils.queryProjectUserMap(startDate,endDate,projectIds);
        }else{
            projectUserMap = CubeUtils.queryProjectUserMap(lastMonthStartDate,lastMonthEndDate,projectIds);
        }

        //写入城市信息
        bw.append("city").append(Constant.SEPARATER).append(cityHashCode  + "").append(Constant.SEPARATER).append(cityName ).append(Constant.SEPARATER).append(cityHashCode + "_" + cycle + "_offset").append(Constant.SEPARATER).append(cycle + "").append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);

        logger.info(cityName + "城市下项目个数是:" + list.size());

        for(Map<String,Object> projectMap : list){
            int projectId = Integer.parseInt(projectMap.get("id") + "");
            String tenantId = projectMap.get("tenant_id") + "";
            int projectType = Integer.parseInt(projectMap.get("project_type") + "");
            logger.info( "开始计算项目id 是："  + projectId );

            Integer projectUserCount =  projectUserMap.get(projectId + "");

            if( ( projectUserCount == null || projectUserCount == 0 ) && projectType != -1){
                logger.info( "项目ID="  + projectId  + "在startDate=" + lastMonthStartDate + " endDate=" + lastMonthEndDate + " 无客流，忽略执行！");
                continue;
            }

            logger.info( "项目ID="  + projectId  + "在startDate=" + lastMonthStartDate + " endDate=" + lastMonthEndDate + " 有客流，或者是竞品项目，继续执行！");

            //获取人群列表
            sql = "select id,type,name from TD_CROWD where attr1=" + projectId ;

            List<Map<String,Object>> crowdList = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);

            for(Map<String,Object> map : crowdList ){
                 int crowdId = Integer.parseInt(map.get("id") + "");
                 String crowdType = (String)map.get("type");
                 String crowdName = (String)map.get("name");

                List<Integer>  crowdOffsetList = null ;
                if( StringUtils.isNotBlank(startDate) && !"-1".equals(startDate)
                        && StringUtils.isNotBlank(endDate) && !"-1".equals(endDate)
                        ){
                    crowdOffsetList = CubeUtils.queryOffsetList(projectId + "", crowdType, startDate, endDate);
                }else{
                    crowdOffsetList = CubeUtils.queryOffsetList(projectId + "", crowdType, lastMonthStartDate, lastMonthEndDate);
                }


                if(null == crowdOffsetList || crowdOffsetList.isEmpty()){
                     logger.info("项目Id=" + projectId + " 人群Id="+ crowdId + " crowdType=" + crowdType + " 在startDate=" + lastMonthStartDate + " endDate="  + lastMonthEndDate + " 没有数据,忽略执行！");
                     continue;
                 }

                 logger.info("文件：" + projectId + "_" + crowdId + "_" + cycle + "_offset");
                 File projectCrowdOffsetFile = new File(outputFolder.getParentFile(),projectId + "_" + crowdId + "_" + cycle +  "_mac" );

                 List<String> macList = CubeUtils.queryMacList(tenantId,crowdOffsetList);

                 writeOffset(projectCrowdOffsetFile,macList);

                 //添加到城市offset中
                 cityOffsetSet.addAll(macList);

                //竞品客群，写入对应项目ID 和 到访人群Id
                if("TU".equals(crowdType.toUpperCase() )){
                    String competitorSql = "select t0.id,t0.default_crowd from TD_PROJECT t0 ,TD_PROJECT_RELATION t1 where t0.id=t1.project_parent_id and project_id = "+ projectId;
                    //竞品项目关联的项目
                    List<Map<String,Object>> competitorRelatProjects = QueryUtils.query(competitorSql,QueryUtils.WIFIANALYTICS_DB);
                    //竞品关联项目ID

                    for(Map<String,Object> competitorMap :competitorRelatProjects ){

                        String tempProjectId = "";
                        String tempCrowdId =  "" ;

                        //写入群数据
                        bw.append("crowd").append(Constant.SEPARATER).append(cityHashCode + "").append(Constant.SEPARATER).
                                append(tenantId).append(Constant.SEPARATER).append(projectId + "").append(Constant.SEPARATER).append(crowdId + "").
                                append(Constant.SEPARATER).append(cycle  + "").append(Constant.SEPARATER).append(runDate).append(Constant.SEPARATER).
                                append(lastMonthStartDate).append(Constant.SEPARATER).append(lastMonthEndDate).append(Constant.SEPARATER).append(crowdType.toUpperCase()).
                                append(Constant.SEPARATER).append(cityName);
                        bw.append(Constant.SEPARATER).append(competitorMap.get("default_crowd") + "").append(Constant.SEPARATER).append(competitorMap.get("id") + "");
                        bw.append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
                        tempCrowdId = competitorMap.get("default_crowd") + "";
                        tempProjectId =  competitorMap.get("id") + "";

                        //查询本项目人群数据
                        List<Integer>  tempCrowdOffList;
                        if( StringUtils.isNotBlank(startDate) && !"-1".equals(startDate)
                                && StringUtils.isNotBlank(endDate) && !"-1".equals(endDate)
                                ){
                            //获取和竞品项目相同日期的offset
                            tempCrowdOffList = CubeUtils.queryOffsetList(tempProjectId , "AU", startDate, endDate);
                        }else{
                            tempCrowdOffList = CubeUtils.queryOffsetList(tempProjectId, "AU", lastMonthStartDate, lastMonthEndDate);
                        }

                        File tempProjectFile = new File(outputFolder.getParentFile(),tempProjectId + "_" + tempCrowdId + "_" + cycle +  "_mac" );

                        List<String> tempMacList = CubeUtils.queryMacList(tenantId,tempCrowdOffList);

                        writeOffset(tempProjectFile,tempMacList);

                        if(null != tempMacList){
                            //添加到城市offset中
                            cityOffsetSet.addAll(tempMacList);
                        }
                    }

                 }else{
                    //写入群数据
                    bw.append("crowd").append(Constant.SEPARATER).append(cityHashCode + "").append(Constant.SEPARATER).
                            append(tenantId).append(Constant.SEPARATER).append(projectId + "").append(Constant.SEPARATER).append(crowdId + "").
                            append(Constant.SEPARATER).append(cycle  + "").append(Constant.SEPARATER).append(runDate).append(Constant.SEPARATER).
                            append(lastMonthStartDate).append(Constant.SEPARATER).append(lastMonthEndDate).append(Constant.SEPARATER).append(crowdType.toUpperCase()).
                            append(Constant.SEPARATER).append(cityName).append(Constant.SEPARATER).append(crowdName).append(Constant.SEPARATER).append(crowdOffsetList.size() + "").append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
                }
                crowdOffsetList.clear();
            }
        }
    }

    /**
     * 把offset 写到文件
     * @param file
     */
    public static void writeOffset(File file, Collection<String> macCollection) throws Exception {
        BufferedWriter bw = null;
        FileWriter writer = null;
        try {
            writer = new FileWriter(file);
            bw = new BufferedWriter(writer);
            if(null != macCollection){
                Iterator<String> iter = macCollection.iterator();
                while(iter.hasNext()){
                    bw.append(iter.next() + "").append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
                }
            }
        }finally {
            FileUtil.close(bw,writer);
        }
    }

    public static List<String> getNeedRunCityList(String cityNames){
         List<String>  cityList = getAllCityList();
         //获取交集
         if(StringUtils.isNotEmpty(cityNames) && !"-1".equals(cityNames)){
             String [] names = cityNames.split(",");
             List<String> tempList = new ArrayList<String>();
             for(String name : names ){
                 tempList.add(name);
             }
             cityList.retainAll(tempList);//求出来交集：cityList
         }
         List <String> resultList = cityList;
         logger.info("需要计算的城市列表是：" + Arrays.toString(resultList.toArray()));
         return resultList;
    }

	/**
	 * 获取所有城市列表
	 * @return
	 */
	public static List<String>  getAllCityList(){
		String sql = "select distinct city from TD_PROJECT  where city is not null and length(city) > 0";
		List<Map<String,Object>> list =  QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);
        List<String> resultList = new ArrayList<String> ();
        if(null != list ){
            for(Map<String,Object> map : list){
                String cityName = (String)map.get("city");
                resultList.add(cityName) ;
            }
        }
        return resultList;
	}

}
