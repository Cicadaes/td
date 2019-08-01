package td.enterprise.wanalytics.etl.task;

import org.apache.commons.cli.*;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 导入到mysql 中
 */
public class MysqlLoaderTask {

    private static final Logger logger = LoggerFactory.getLogger(MysqlLoaderTask.class);

    public static void main(String [] args ) throws Exception {
    	Options options = new Options();
		options.addOption("i", "inputFilePath", true, "导入文件路径");
		CommandLineParser parser = new PosixParser();
		CommandLine line = parser.parse(options, args);
		String inputFilePath = line.getOptionValue("inputFilePath");
		logger.info("------inputFilePath is " + inputFilePath);
		String separatorValue = "\t";//默认分隔符
		long t0 = System.currentTimeMillis();
		Boolean r = execute(inputFilePath,separatorValue);
		long t1 = System.currentTimeMillis();
		logger.info("MysqlLoaderTask------Used " + (t1-t0)/1000 + " seconds.");
    }

    public Boolean prepare(String inputFilePath) throws Exception {
        logger.info("inputFilePath : " + inputFilePath);
        File  inputFile = new File(inputFilePath);
        if (!inputFile.exists()) {
            logger.error(inputFile + "  not exists!");
            return false;
        }
        return true;
    }

    public static Boolean execute(String inputFilePath,String separator) throws Exception{
    	 File inputFile = new File(inputFilePath);
	     BufferedReader br = null;
         try {
             Map<String, List<Object[]>> tableAndArgs = new HashMap<>();
             AtomicInteger batchSize = new AtomicInteger();
             br = new BufferedReader(new FileReader(inputFile));
             String line = null;
             long lineNumber =  1;
             while ( StringUtils.isNotBlank((line = br.readLine())) ){
                 String[] lineColums = line.split("\\|");
                 List<String> columValues = new ArrayList<>();
                 columValues.add(null);//第一列主键
                 String tableName = lineColums[0];
                 String values [] = lineColums[1].replaceAll("\t", "\t ").split(separator);//分割符合
                 List<Object[]>  valueList = tableAndArgs.get(tableName);
                 if(null == valueList){
                	 valueList  = new ArrayList<Object[]> ();
                 }
                 for(String value : values){
                	 if("".equals(value.trim()) || "null".equalsIgnoreCase(value.trim()) ){
                		 columValues.add(null);
                	 }else{
                		 columValues.add(value.trim());
                	 }
                 }

                 valueList.add(columValues.toArray());

                 tableAndArgs.put(tableName, valueList);
                 //批量提交
                 if( batchSize.incrementAndGet() >= 1000){
                	 logger.info("------------更新1000条开始  更新记录数：" + lineNumber);
                	 batchSave(tableAndArgs);
                	 logger.info("------------更新1000条结束" + lineNumber);
                	 tableAndArgs.clear();
                	 batchSize.set(0);
                 }
                 lineNumber ++ ;
             }
             batchSave(tableAndArgs);
             logger.info("-----------inputFilePath=" + inputFilePath + " import [" + (lineNumber -1) + "] record");
         } catch (Exception e) {
             throw e;
         }finally{
             FileUtil.close(br);
         }
         return true;
    }

    public static void batchSave( Map<String, List<Object[]>> tableAndArgs) {
    	Iterator<String> iterator = tableAndArgs.keySet().iterator();
    	while(iterator.hasNext()){
    		String tableName = iterator.next();
    		List<Object[]> values = tableAndArgs.get(tableName);
            String valuesStr= buildMark(values);
            String  sql = "insert into " + tableName +" values " + valuesStr;
            QueryUtils.execute(sql,QueryUtils.WIFIANALYTICS_DB);
    	}
    }

    public static String buildMark(List<Object[]> values) {
        StringBuffer buffer = new StringBuffer( "");
        int size = values.size();
        for (int i = 0; i < values.size(); i++){
            Object [] obj = values.get(i);
            String tmp  = "";
            for(int j = 0;j < obj.length; j ++){
                 if(j != obj.length -1 ){
                     tmp += format (obj[j]) + ",";
                 }else {
                     tmp += format (obj[j]);
                 }
            }
            if(size -1 != i ){
                buffer.append("(" + tmp + "),");
            }else{
                buffer.append("(" + tmp + ")");
            }
        }
        return buffer.toString();
    }

    public static String format(Object value){
        if(value == null ){
            return null;
        }else{
            return "'" + value + "'" ;
        }
    }
}
