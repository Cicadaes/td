package td.enterprise.wanalytics.etl.task.custom;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.*;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.text.DecimalFormat;
import java.util.*;
import java.util.Map.Entry;
@Slf4j
public class FigureKMeanCounter {

    public static Logger logger = Logger.getLogger(FigureKMeanCounter.class);

    public static void main(String[] args) {
        String inputFile = null;
        String dimensionality = null;
        String classification = null;
        String tenantId = null;
        String projectId = null;
        String taskid = null;
        String exec_id = null;
        Options options = new Options();
        options.addOption("inputFile", "inputFile", true, "inputFile");
        options.addOption("dimensionality", "dimensionality", true, "dimensionality");
        options.addOption("classification", "classification", true, "classification");
        options.addOption("tenantId", "tenantId", true, "tenantId");
        options.addOption("projectId", "projectId", true, "projectId");
        options.addOption("taskid", "taskid", true, "taskid");
        options.addOption("exec_id", "exec_id", true, "exec_id");
        CommandLineParser parser = new PosixParser();
        CommandLine lines = null;
        try {
            lines = parser.parse(options, args);
            inputFile = lines.getOptionValue("inputFile");
            dimensionality = lines.getOptionValue("dimensionality");
            classification = lines.getOptionValue("classification");
            tenantId = lines.getOptionValue("tenantId");
            projectId = lines.getOptionValue("projectId");
            taskid = lines.getOptionValue("taskid");
            exec_id = lines.getOptionValue("exec_id");
        } catch (ParseException e1) {
            logger.error("参数异常 ", e1);
            log.info(args+"");
            System.exit(1);
        }

        //过滤后，取前50个进行计算
        HashMap<String, HashMap<String, String>> featureClassMap = execute(inputFile);
        //写入结果表中
        writeToMysql(featureClassMap, tenantId, projectId, taskid, dimensionality, classification, exec_id);
        logger.info("===FigureKMeanCounter over==");
    }


    private static boolean writeToMysql(HashMap<String, HashMap<String, String>> featureClassMap, String tenantId,
                                        String projectId, String taskId, String dimensionality, String classification, String exec_id) {
        try {
            String tableName = "";
            String selectColumn = "name";
            String id = "id";
            if (dimensionality.equals("0")) { //业态
                tableName = "TD_ROOM_CATEGORY";
            } else if (dimensionality.equals("1")) { //品牌
                tableName   = "TD_PROJECT";
                selectColumn = "brand";
            }

            if ("0".equals(classification)) {
                classification = "10";
            }

            int parseInt = Integer.parseInt(classification);
            Iterator<Entry<String, HashMap<String, String>>> featureClassIter = featureClassMap.entrySet().iterator();
            while (featureClassIter.hasNext()) {
                Entry<String, HashMap<String, String>> next = featureClassIter.next();
                String featureId = next.getKey();
                String sql = "select " + selectColumn + " from " + tableName + " where " + id + "=" + featureId;
                List<Map<String, Object>> queryForList = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);
                String data_name = "未命名";
                if (queryForList != null && !queryForList.isEmpty()) {
                    data_name = (String) queryForList.get(0).get(selectColumn);
                }
                HashMap<String, String> value = next.getValue();
                for (int i = 1; i <= parseInt; i++) {
                    String classification_name = "" + i;
                    String classification_value = value.get(classification_name);
                    if (classification_value == null) {
                        classification_value = "0";
                    }
                    sql = "insert into TD_KMEANS_CROWD_RESULT "
                            + "(kmeans_crowd_id,classification_name,classification_value,data_name,project_id,tenant_id,exec_id,creator) "
                            + "values(" + taskId + ",'" + classification_name + "_" + "','" + classification_value + "','" + data_name + "'," + projectId + "," + tenantId + "," + exec_id + ",'System')";
                    QueryUtils.execute(sql, QueryUtils.WIFIANALYTICS_DB);
                }
            }
        } catch (Exception exception) {
            logger.error("写入数据库失败", exception);
            return false;
        }
        return true;
    }

    private static int count = 0;

    /**
     * 处理kmeans 返回的结果文件
     * mac tab  feature  class
     * @param inputFile
     * @return
     */
    public static HashMap<String, HashMap<String, String>> execute(String inputFile) {
        //========================================================[读文件]=======================
        HashMap<String, List<String>> featureClassMap = new HashMap<String, List<String>>();
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(new File(inputFile)));
            String line = null;
            while ((line = br.readLine()) != null) {
                String[] values = line.split("\t");
                if (values.length != 3) {
                    continue;
                }
                String feature = values[1]; //feature值
                String[] featureValues = feature.split(",");
                for (String featureValue : featureValues) {
                    List<String> list = featureClassMap.get(featureValue);
                    if (list == null) {
                        list = new ArrayList<String>();
                    }
                    list.add(values[2]);
                    featureClassMap.put(featureValue, list);
                }
            }
            br.close();
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            FileUtil.close(br);
        }
        featureClassMap = filterTopFeature(featureClassMap);
        showMap(featureClassMap);
        log.info("=======读取Kmeans 文件结束===================");
        //============================================================[批量计算]==================

        Iterator<Entry<String, List<String>>> featureClassIter = featureClassMap.entrySet().iterator();

        HashMap<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
        while (featureClassIter.hasNext()) {
            Entry<String, List<String>> next = featureClassIter.next();
            String featureId = next.getKey();
            List<String> classList = next.getValue();
            //分类所占比例
            HashMap<String, Integer> classificationMap = new HashMap<String,Integer>();
            for (String classification : classList) {
                Integer integer = classificationMap.get(classification);
                if (integer == null) {
                    integer = 0;
                }
                integer += 1;
                classificationMap.put(classification, integer);
            }

            //对应特征，对应分类Iterator
            Iterator<Entry<String, Integer>> classificationIter = classificationMap.entrySet().iterator();

            while (classificationIter.hasNext()) {
                Entry<String, Integer> classificationItem = classificationIter.next();
                String classification = classificationItem.getKey();
                Integer classificationCount = classificationItem.getValue();
                double classificationDoubleCount = classificationCount * 1d;
                double d = classificationDoubleCount / count;
                int parseInt = Integer.parseInt(classification);
                parseInt  ++;
                classification = "" + parseInt;
                DecimalFormat df = new DecimalFormat("#.####");
                String classificationRate = df.format(d);
                HashMap<String, String> classficationResultMap = resultMap.get(featureId);
                if (classficationResultMap == null) {
                    classficationResultMap = new HashMap<String, String>();
                }
                classficationResultMap.put(classification, classificationRate);
                resultMap.put(featureId, classficationResultMap);
            }
        }

        showMap(resultMap);
        log.info("=====2=====================");
        return resultMap;
    }


    /**
     * 显示map 中的值
     * @param hashMap
     */
    public static void showMap(@SuppressWarnings("rawtypes") HashMap hashMap) {
        @SuppressWarnings("unchecked")
        Iterator<Entry<Object, Object>> iterator = hashMap.entrySet().iterator();
        while (iterator.hasNext()) {
            Entry<Object, Object> next = iterator.next();
            log.info("key=" + next.getKey() + "\tvalue=" + next.getValue());
        }
    }

    /**
     * 取前50个feature 进行计算，过滤后的结果
     * key feature
     * value class List
     * @param featureClassMap
     * @return
     */
    public static HashMap<String, List<String>> filterTopFeature(HashMap<String, List<String>> featureClassMap) {
        ArrayList<String> arrayList = new ArrayList<>();
        HashMap<String, List<String>> resultMap = new HashMap<>();
        Iterator<Entry<String, List<String>>> featureIter = featureClassMap.entrySet().iterator();
        while (featureIter.hasNext()) {
            Entry<String, List<String>> next = featureIter.next();
            arrayList.add(next.getKey() + "," + next.getValue().size());
        }

        /**
         * 跟进class 结果值进行降序排序？
         *
         */
        Collections.sort(arrayList, new Comparator<String>() {
            @Override
            public int compare(String one, String two) {

                String[] splitone = one.split(",");
                String[] splittwo = two.split(",");
                int n1 = Integer.parseInt(splitone[1]);
                int n2 = Integer.parseInt(splittwo[1]);
                return n2 - n1;
            }
        });

        for (int i = 0; i < arrayList.size() && i < 50; i++) {
            String featureStr = arrayList.get(i);
            String[] split = featureStr.split(",");
            String feature = split[0];
            count += Integer.parseInt(split[1]); //对应feature 长度
            List<String> list = featureClassMap.get(feature);
            resultMap.put(feature, list);
        }
        return resultMap;
    }
}
