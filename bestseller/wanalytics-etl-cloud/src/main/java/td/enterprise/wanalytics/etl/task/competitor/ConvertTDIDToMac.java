package td.enterprise.wanalytics.etl.task.competitor;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.HashMap;
import java.util.List;

/**
 * 把TDID 转化为mac
 */
public class ConvertTDIDToMac {

    public static Logger logger = Logger.getLogger(ConvertTDIDToMac.class);


    public static void main(String[] args) {
        try{

            long begin = System.currentTimeMillis();
            Options options = new Options();
            options.addOption("macTDIDFile", "macTDIDFile", true, "macTDIDFile");
            options.addOption("tdidFile", "tdidFile", true, "tdid文件,客流文件");
            options.addOption("newFile", "newFile", true, "新的结果文件");
            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String macTDIDFile =  line.getOptionValue("macTDIDFile");
            String tdidFile =  line.getOptionValue("tdidFile");
            String newFile =  line.getOptionValue("newFile");
            logger.info("Params: macTDIDFile=" +  macTDIDFile );
            logger.info("Params: tdidFile=" +  tdidFile );
            logger.info("Params: newFile=" +  newFile );
            long end = System.currentTimeMillis();
            execute(macTDIDFile,tdidFile,newFile);
            logger.info("ConvertTDIDToMac Used times :" + (end - begin)/1000 + " seconds");
        }catch (Exception e){
            logger.error("",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

    /***
     * 转化tdid到mac
     * @param macTDIDFile
     * @param tdidFile
     * @param newFile
     * @throws Exception
     */
    public static void execute(String macTDIDFile,String tdidFile,String  newFile) throws Exception{
           List<String> macTDIDList = FileUtil.readFileAsList(macTDIDFile);
           HashMap<String,String> tdidMacMap = new HashMap<String,String>();
           for(String line: macTDIDList){
               String [] values = line.split("\t");
               if(values[1].length() == 17){
                   tdidMacMap.put(values[0],values[1]);
               }
           }

        BufferedReader br = null;
        BufferedWriter bw = null;
        FileReader fr = null;
        FileWriter fw = null;
        try {
            String line = null;
            fr = new FileReader(tdidFile);
            fw = new FileWriter(newFile);
            br = new BufferedReader(fr);
            bw = new BufferedWriter(fw);
            while ( StringUtils.isNotBlank( line = br.readLine() ) ) {
                  String [] values = line.split(",");
                  String mac = tdidMacMap.get(values[0]);
                  if(mac == null ){
                      logger.info("tdid=" + values[0] + " 没找到mac，忽略!");
                      continue;
                  }
                 bw.append(line.replaceAll(values[0],mac)).append("\n");
            }
            bw.flush();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            FileUtil.close(br,bw,fr,fw);
        }

    }


}
