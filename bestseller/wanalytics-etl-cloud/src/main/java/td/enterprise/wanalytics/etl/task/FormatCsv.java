package td.enterprise.wanalytics.etl.task;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;

/**
 * 过滤文件数据，如果数据包含指定的参数，进行输出，否则进行忽略
 *
 * @author junmin.li
 *
 */
public class FormatCsv {
    public static Logger logger = Logger.getLogger(FormatCsv.class);

    /**
     *
     * @param args
     */
    public static void main(String[] args) {
        try {
            Options options = new Options();
            options.addOption("inputFile", "inputFile", true, "输入文件");
            options.addOption("outputFile", "outputFile", true, "输出文件");
            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String inputFile = line.getOptionValue("inputFile");
            String outputFolder = line.getOptionValue("outputFile");
            logger.info("===============inputFile=" + inputFile + " outputFolder=" + outputFolder);
            long begin = System.currentTimeMillis();
            execute(inputFile, outputFolder);
            long end = System.currentTimeMillis();
            logger.info("----FormatCsv Task is over. Used Time :" + (end - begin) / 1000 + " seconds.");
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("过滤文件数据失败： ",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
        System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
    }

    public static void execute(String inputFile, String outputFile) {
        BufferedReader br = null;
        BufferedWriter bw = null;
        FileWriter fileWriter = null;
        try {
            fileWriter = new FileWriter(new File(outputFile));
            br = new BufferedReader(new FileReader(inputFile));
            File file = new File(inputFile);
            bw = new BufferedWriter(fileWriter);
            String line = null;
            //bw.append("insert into TD_DMK_IDMAPPING(mac,tdid) values");
            int c = 0;
            while (null != (line= br.readLine())) {
                  String values [] = line.split("\t");
                  String tdid = null;
                  if(values.length != 1 ){
                      tdid = values[1];
                  }
                  if(c == 0){
                      if(tdid == null){
                          bw.append("insert into TD_DMK_IDMAPPING(mac,tdid) values ('" + values[0] + "',null);").append("\n");
                      }else{
                          bw.append("insert into TD_DMK_IDMAPPING(mac,tdid) values('" + values[0] + "','" + tdid + "' );"  ).append("\n");
                      }
                  }else {
                      if(tdid == null){
                          bw.append("insert into TD_DMK_IDMAPPING(mac,tdid) values('" + values[0] + "',null);").append("\n");
                      }else{
                          bw.append("insert into TD_DMK_IDMAPPING(mac,tdid) values('" + values[0] + "','" + tdid + "' );"  ).append("\n");
                      }
                  }
                  c ++;
            }
            bw.append("\n");
            bw.flush();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (IOException e) {
                }
            }
            if (bw != null) {
                try {
                    bw.close();
                } catch (IOException e) {
                }
            }
            FileUtil.close(fileWriter);
        }
    }

}
