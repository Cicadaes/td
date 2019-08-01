package td.enterprise.wanalytics.etl.task.tag;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.*;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

import java.io.*;
import java.sql.SQLException;
import java.util.*;

import static td.enterprise.wanalytics.etl.constant.Constant.TAG_INDEX;

/**
 * Created by Yan on 2017/4/18.
 */
@Slf4j
public class TagsConvertorTask {

    public static void main(String[] args) {
        try{

            Options options = new Options();
            options.addOption("tenantId", true, "租户id");
            options.addOption("date", true, "时间");
            options.addOption("inputFile", "inputFile", true, "输入文件位置");
            options.addOption("offsetMacFile", "offsetMacFile", true, "offset mac 文件位置");
            options.addOption("outputFile", "outputFile", true, "输出文件位置");

            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);

            log.info("tenantId=" + line.getOptionValue("tenantId"));
            log.info("date=" + line.getOptionValue("date"));
            log.info("inputFile=" + line.getOptionValue("inputFile"));
            log.info("offsetMacFile=" + line.getOptionValue("offsetMacFile"));
            log.info("outputFile=" + line.getOptionValue("outputFile"));

            int tenantId = Integer.parseInt(line.getOptionValue("tenantId"));
            String date = line.getOptionValue("date");
            String inputFile = line.getOptionValue("inputFile");
            String offsetMacFile = line.getOptionValue("offsetMacFile");
            String outputFile = line.getOptionValue("outputFile");

            execute(tenantId, date, inputFile, offsetMacFile, outputFile);
        }catch (Exception e){
            log.error("",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }


    public static void execute(int tenantId, String date, String inputFile, String offsetMacFile, String outputFile) throws SQLException {

        log.info("开始执行 tenantId=" + tenantId + ", date=" + date + ", inputFile=" + inputFile + ", offsetMacFile=" + offsetMacFile + ", outputFile=" + outputFile);

        //1. 读取offset, mac 表 all.tdid， tdidMap以tdid为主键
        Map<String, String> macMap = new HashMap<>();

        File tdidFile = new File(offsetMacFile);
        BufferedReader macOffsetReader = null;
        try {
            macOffsetReader = new BufferedReader(new FileReader(tdidFile));
            String tempString = null;
            while ((tempString = macOffsetReader.readLine()) != null) {
                String[] tempList = tempString.split(WifipixTaskConstant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
                if(tempList.length != 2){
                    log.error(tempString + " 有错!");
                }else{
                    macMap.putIfAbsent(tempList[1], tempString);
                }
            }
            macOffsetReader.close();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
           FileUtil.close(macOffsetReader);
        }

        //2. 解析tags文件，转化为宽表 tagMap是以mac为key
        String tagIndexString = SysConfigUtil.getValue(TAG_INDEX);
        List<String> tagIndexList = Arrays.asList(tagIndexString.split(";"));

        Map<String, Map<String, String>> tagsMap = new HashMap<>();  //key, code, value

        File file = new File(inputFile);
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(file));
            String tempString;
            while ((tempString = reader.readLine()) != null) {
               String[] tempList = tempString.split(WifipixTaskConstant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
               if(tempList.length != 3){
                   log.error("tempString=" + tempString + ",文件格式不对，跳过");
               } else {
                   String mac = tempList[0];
                   String key = tempList[1];
                   String value = tempList[2];
                   tagsMap.putIfAbsent(mac, new HashMap<>());

                   //对于兴趣标签特殊处理，只需要表示有没有
                   if(key.startsWith("0201")){
                       if(key.length() >= 6){
                           key = key.substring(0, 6);
                           tagsMap.get(mac).putIfAbsent(key, "1");
                       }
                   }
                   tagsMap.get(mac).putIfAbsent(key, value);
               }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
           FileUtil.close(reader);
        }

        //转化为宽表
        BufferedWriter bw = null;
        FileWriter fileWriter = null;
        try {
            fileWriter = new FileWriter(outputFile);
            bw = new BufferedWriter(fileWriter);
            Iterator iter = tagsMap.entrySet().iterator();
            while (iter.hasNext()) {
                Map.Entry entry = (Map.Entry) iter.next();
                String key = (String)entry.getKey();
                Map<String, String> val = (Map)entry.getValue();
                String tagString = "";

                for (String index: tagIndexList) {
                    tagString += WifipixTaskConstant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR + (val.get(index) != null ? val.get(index) : -1);
                }
                bw.write(tenantId + WifipixTaskConstant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR
                        + macMap.get(key) + WifipixTaskConstant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR + ""
                        + tagString +  WifipixTaskConstant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR
                        + date);
                bw.write(WifipixTaskConstant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
            }
            bw.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            FileUtil.close(fileWriter,bw);
        }
    }
}
