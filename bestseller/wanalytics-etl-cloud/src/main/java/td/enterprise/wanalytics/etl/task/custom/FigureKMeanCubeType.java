package td.enterprise.wanalytics.etl.task.custom;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;
import td.enterprise.entity.ProjectTypeEnum;
import td.enterprise.wanalytics.etl.util.CubeUtils;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;
import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.runscript.bean.ResultBean;
import td.olap.query.utils.QueryServiceUtils;

import java.io.*;
import java.util.*;
import java.util.Map.Entry;
@Slf4j
public class FigureKMeanCubeType {

    public static Logger logger = Logger.getLogger(FigureKMeanCubeType.class);
    private static String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";

    public static void main(String[] args) {
        String confFile = null;
        String inputFile = null;
        String outputFile = null;
        Options options = new Options();
        options.addOption("confFile", "confFile", true, "confFile");
        options.addOption("inputFile", "inputFile", true, "inputFile");
        options.addOption("outputFile", "outputFile", true, "outputFile");
        CommandLineParser parser = new PosixParser();
        CommandLine lines = null;
        try {
            lines = parser.parse(options, args);
            confFile = lines.getOptionValue("confFile");
            inputFile = lines.getOptionValue("inputFile");
            outputFile = lines.getOptionValue("outputFile");

            logger.info("========================FigureKMeanCubeType 开始执行，获取参数============================");
            execute(confFile, inputFile, outputFile);
            logger.info("========================FigureKMeanCubeType 执行完毕============================");
        } catch (Exception e1) {
            logger.error("参数异常了， FigureKMeanCubeType", e1);
            log.info(""+args);
            System.exit(1);
        }

    }

    public static boolean execute(String confFile, String inputFile, String outputFile) throws Exception {
        logger.info("========================加载配置文件============================");
        String tenantId = null;
        String projectId = null;
        String startDate = null;
        String endDate = null;
        String dimensionality = null;
        String line = FileUtil.readFileAsString(confFile);
        String[] split = line.split(",");
        tenantId = split[0];
        projectId = split[1];
        startDate = split[2];
        endDate = split[3];
        dimensionality = split[4];
        logger.info("========================加载成功============================");

        //========================================[业态：0，                  品牌：1：                  应用：2]==================================

        //key 是分类id  value 是offset 列表
        HashMap<String, List<Integer>> catagroyOffsetMap = new HashMap<String, List<Integer>>();

        String projectIds = projectId + "";

        String projectSql = "select project_type from TD_PROJECT where id=" + projectId;
        Map<String, Object> projectMap = QueryUtils.querySingle(projectSql, QueryUtils.WIFIANALYTICS_DB);
        int projectType = (Integer) projectMap.get("project_type");
        if (projectType == ProjectTypeEnum.PROJECT_GROUP.getCode()) {
            List<String> childProjectList = new ArrayList<String> ();
            childProjectList = CustomGroup.queryChildrenByParam(projectId + "",childProjectList);
            projectIds = "";
            int size = childProjectList.size();
            int i=0;
            for(String tempId : childProjectList){
                projectIds +=  tempId  ;
                if(i < size - 1){
                    projectIds += ",";
                }
                i ++;
            }
        }

        logger.info("============检查是否有访问记录开始=================");
        String sql = "select * from bitmap.active_user_day_cube where tenant_id=" + tenantId + " and project_id in (" + projectIds + " ) and (date between " + startDate + " and " + endDate + ") group by project_id;";
        QueryEngineResult invoke = QueryServiceUtils.invoke("post", queryUrl, sql);
        ArrayList<String> arrayList = new ArrayList<String>();
        if (invoke != null) {
            List<ResultBean> results = invoke.getResults();
            if (results != null && !results.isEmpty()) {
                for (ResultBean resultBean : results) {
                    arrayList.add(resultBean.getKey());
                }
            }
        }
        String roomids = "";
        for (int i = 0; i < arrayList.size(); i++) {
            roomids += arrayList.get(i);
            if (i != arrayList.size() - 1) {
                roomids += ",";
            }
        }
        logger.info("============检查是否有访问记录结束=================");

        if ("".equals(roomids)) {
            logger.info("=========所选人群中，没有对应的访问记录，无法计算。=========================计算结束。结果为空");
            System.exit(2);
        } else {
            logger.info("roomid = [" + roomids + "]");
        }

        //获取项目信息，店组还是店铺

        if ("0".equals(dimensionality)) {
            logger.info("==============业态计算===============");
            //业态计算是根据项目分类进行计算的

            //key 是id，name
            //value 具有此业态的项目id
            HashMap<String, String> catagroyMap = new HashMap<String, String>();

            sql = "select a.roomid  ,b.id,b.name from TD_ROOM_CATEGORY b, TD_ROOM_CATEGORY_REL a where a.categoryid=b.id and a.roomid in (" + projectIds + ")";
            List<Map<String, Object>> queryForList = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);
            if (queryForList != null && !queryForList.isEmpty()) {
                for (Map<String, Object> map : queryForList) {
                    Integer roomId = (Integer) map.get("roomid");
                    Integer id = (Integer) map.get("id");//分类id
                    String name = (String) map.get("name");
                    String key = id + "," + name;
                    String roomIds = catagroyMap.get(key);
                    if (roomIds == null) {
                        roomIds = roomId + "";
                    } else {
                        roomIds += "," + roomId;
                    }
                    catagroyMap.put(key, roomIds);
                }
                Iterator<Entry<String, String>> catagroyIter = catagroyMap.entrySet().iterator();
//                int c = 2;
                while (catagroyIter.hasNext()) {
                    Entry<String, String> next = catagroyIter.next();
                    //id,name
                    String[] keys = next.getKey().split(",");
                    //projects
                    String[] values = next.getValue().split(",");

                    //具有某分类的项目id
                    String projectWhere = " and (";
                    for (int i = 0; i < values.length; i++) {
                        projectWhere += " project_id =" + values[i] + "";
                        if (i != values.length - 1) {
                            projectWhere += " or ";
                        }
                    }
                    projectWhere += ") ";
                    sql = "r30223=select * from bitmap.active_user_day_cube where tenant_id=" + tenantId + " and project_id in (" + projectIds + " ) " + projectWhere + " and (date between " + startDate + " and " + endDate + "); r30223.results[0].value.toArray();";
                    List<Integer> invokeForOffset = QueryServiceUtils.invokeForOffset("post", queryUrl, sql);
//                    if (catagroyOffsetMap.get(keys[0]) != null) {
//                        keys[0] += c + "";// 为啥添加 c ？？ TODO
//                        c++;
//                    }
                    //可以理解为具有某分类的 用户offset
                    catagroyOffsetMap.put(keys[0], invokeForOffset);
                }
            }

        } else if ("1".equals(dimensionality)) {
            logger.info("==============品牌计算===============");
            HashMap<String, String> tempBrandMap = new HashMap<String, String>();
            sql = "select * from TD_PROJECT where id in (" + projectIds + ")";
            List<Map<String, Object>> queryForList = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);
            for (Map<String, Object> map : queryForList) {
                String brand = (String) map.get("brand");
                if (brand == null || brand.equals("")) {
                    continue;
                }
                Long object = (Long) map.get("id");
                String value = object + "";
                if (tempBrandMap.get(brand) != null) {
                    value += "," + tempBrandMap.get(brand);
                }
                tempBrandMap.put(brand, value);
            }

            Iterator<Entry<String, String>> ite = tempBrandMap.entrySet().iterator();
            while (ite.hasNext()) {
                Entry<String, String> next = ite.next();
                String key = next.getKey();
                //TODO 要限制下关系
                sql = "select * from TD_PROJECT where brand ='" + key + "' and id in (" + projectIds + ")";
                List<Map<String, Object>> projectBrandList = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);
                //使用第一个具有此分类的项目id
                Long object = (Long) projectBrandList.get(0).get("id");
                String brandId = object + "";

                //projects
                String[] values = next.getValue().split(",");

                //具有某分类的项目id
                String projectWhere = " and (";
                for (int i = 0; i < values.length; i++) {
                    projectWhere += " project_id =" + values[i] + "";
                    if (i != values.length - 1) {
                        projectWhere += " or ";
                    }
                }

                projectWhere += ") ";

                sql = "r30223=select * from bitmap.active_user_day_cube where  project_id in ( " + projectIds + ") " + projectWhere + " and (date between " + startDate + " and " + endDate + "); r30223.results[0].value.toArray();";
                List<Integer> invokeForOffset = QueryServiceUtils.invokeForOffset("post", queryUrl, sql);
                catagroyOffsetMap.put(brandId, invokeForOffset);
            }
            log.info("===========================" + catagroyOffsetMap.size());

        }
        //=========================[获取offset对应的mac地址]==================================================================================
        logger.info("==============[获取offset对应的mac地址]===============");
        HashMap<String, List<String>> catagroyMacMap = new HashMap<String, List<String>>();

        Iterator<Entry<String, List<Integer>>> offsetIter = catagroyOffsetMap.entrySet().iterator();

        while (offsetIter.hasNext()) {
            Entry<String, List<Integer>> next = offsetIter.next();
            String catagroyId = next.getKey();
            List<Integer> offsetList = next.getValue();
            List<String> macList = CubeUtils.getMacFromOffset(tenantId, offsetList);
            catagroyMacMap.put(catagroyId, macList);
        }

        //==========================[整合MAC地址，累加房间名]=====================================================================================
        logger.info("==============[整合MAC地址，累加房间名]===============");
        //key 是map， value 是 特征值，分类id，或者品牌id 列表
        HashMap<String, String> macFeatureMap = new HashMap<String, String>();

        Iterator<Entry<String, List<String>>> macIter = catagroyMacMap.entrySet().iterator();
        while (macIter.hasNext()) {
            Entry<String, List<String>> next = macIter.next();
            String catagroyId = next.getKey(); //分类id
            List<String> macList = next.getValue();
            for (String mac : macList) {
                String feature = macFeatureMap.get(mac);
                if (feature != null) {
                    feature += ",";
                } else {
                    feature = "";
                }
                macFeatureMap.put(mac, feature + catagroyId);
            }
        }

        //写出来每个mac 对应的feature
        logger.info("==============[匹配mac ，添加标签]===============");
        BufferedReader br = null;
        BufferedWriter bw = null;
        FileReader fr = null;
        FileWriter fw = null;
        try {
            fr = new FileReader(new File(inputFile));
            fw = new FileWriter(new File(outputFile));
            br = new BufferedReader(fr);
            bw = new BufferedWriter(fw);
            String mac = null;
            while ((mac = br.readLine()) != null) {
                String feature = macFeatureMap.get(mac);
                if (feature != null) {
                    bw.write(mac + "\t");
                    bw.write(feature);
                    bw.newLine();
                }
            }
            bw.flush();
        } catch (Exception e) {
            logger.error("读取mac文件失败", e);
            System.exit(1);
        } finally {
            FileUtil.close(bw, br,fr,fw);
        }
        logger.info("==============[标签添加成功]path：" + outputFile + "===============");
        return true;
    }


}
