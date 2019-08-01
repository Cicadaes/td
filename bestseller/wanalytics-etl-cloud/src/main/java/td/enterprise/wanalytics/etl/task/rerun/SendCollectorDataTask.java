package td.enterprise.wanalytics.etl.task.rerun;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.ListUtils;
import td.enterprise.wanalytics.etl.util.ReaderLogUtils;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.LinkedBlockingQueue;

public class SendCollectorDataTask {

    private static final Logger logger = Logger.getLogger(SendCollectorDataTask.class);
    /**
     * 路径，日志文件根目录，或以逗号分隔不同文件目录
     */
    public static String DATA_PATH = "dataPath";
    /**
     * 发送路径,url
     */
    public static String URL = "url";

    public static String COLLECTOR_URL = "";


    //队列数据，待发送的数据
    public static LinkedBlockingQueue<String> dataQueue = null ;

    public static void main(String[] args){
        long start = System.currentTimeMillis();
        try{
            run(args);
        }catch (Exception e){
            logger.error("",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
        long end = System.currentTimeMillis();
        logger.info("===========成功结束,用时：" + (end - start)/1000 + "秒");
    }

    public static void run(String[] args) throws Exception {
        Options options = new Options();
        options.addOption("dataPath", DATA_PATH, true, "模板文件");
        options.addOption("url", URL, true, "url");

        CommandLineParser parser = new PosixParser();
        CommandLine line = parser.parse(options, args);
        String dataPath = line.getOptionValue(DATA_PATH);
        String url = line.getOptionValue(URL);
        if (dataPath == null || "".equals(dataPath)){
            logger.error("dataPath 模板文件不能为空");
            return;
        }
        if (url == null || "".equals(url)){
            logger.error("Collector 地址不能为空，url 为空");
            return;
        }
        COLLECTOR_URL = url;
        logger.info("文件路径: "+dataPath+"  发送路径: "+url);

        SendCollectorDataTask createData = new SendCollectorDataTask();
        boolean valid = createData.checkFQueue();
        if(!valid){
           logger.error("FQueue没有配置");
           throw new Exception("FQueue没有配置");
        }
        createData.SendData(dataPath,url);
        //清理目录，防止下次重发的时候，冲突
        createData.cleanFQueue();

        System.exit(0);
    }

    /**
     * 向URL地址发送，日志文件
     * @param dataPath  路径，日志文件根目录，或以逗号分隔不同文件目录
     * @param url 发送路径,url
     */
    public void SendData(String dataPath, String url) {
        String[] str = dataPath.split(",");
        List<String> list = new ArrayList<String>();
        if (str.length > 1){
            for(int i = 0 ; i < str.length ; i++){
                FileUtil.getFileLog(str[i],list);
            }
        }else {
                FileUtil.getFileLog(str[0],list);
        }
        Map<String,List<String>> treeMap = ListUtils.getListToMap(list);
        Set<String> set = treeMap.keySet();

        for (String key : set) {
            logger.info("发送日志文件名：" +key);
            List<String> dataList = new ArrayList<String>();
            //TODO 文件待并发读取
            try {
                dataList = ReaderLogUtils.getLogBySort(treeMap.get(key));
            } catch (IOException e) {
                e.printStackTrace();
            }
            logger.info("日志文件：" +key+" 条数："+dataList.size());
            try{
                for (String body : dataList){
                    FSQueueManager.getInstance().in(body);
                }
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        logger.info("-----------发送到队列完毕!");
        boolean isEmpty = FSQueueManager.getInstance().getWiFiReceiveFQueue().isEmpty();
        while(!isEmpty){
            logger.info("-----------队列不为空，等待结束!");
            try{
                isEmpty = FSQueueManager.getInstance().getWiFiReceiveFQueue().isEmpty();
                Thread.sleep(10000);
            }catch (Exception e){
               e.printStackTrace();
            }
        }
        logger.info("-----------队列为空，发数完毕！");
        AsyncProcesser.getInstance().shutdown();
        //清理队列文件，防止重复发送
    }

    /**
     * 检查fq队列配置是否为空，如果为空，返回失败，
     * @return
     */
   private boolean checkFQueue(){
       logger.info("FQueue 配置开始");
       String  fqueuePath = SysConfigUtil.getValue(WifipixTaskConstant.FQUEUE_PATH);
       String  fqueueSize =  SysConfigUtil.getValue(WifipixTaskConstant.FQUEUE_SIZE);
       logger.info("FQueue 配置结束");
       logger.info("==========fqueuePath=" + fqueuePath);
       logger.info("==========fqueueSize=" + fqueueSize);

       return !(StringUtils.isBlank(fqueuePath) || StringUtils.isBlank(fqueueSize));
   }

    //**清空目录,删除队列文件
    private void cleanFQueue(){
        String  fqueuePath = SysConfigUtil.getValue(WifipixTaskConstant.FQUEUE_PATH);

        List<String> fileList = FileUtil.getFileList(fqueuePath);
        if(null != fileList){
            for(String file : fileList){
                 if(file.endsWith(".idb")){
                     boolean  r = new File(file).delete();
                     logger.info("清理文件=" + file + " 结果：" + r);
                 }else  if(file.endsWith(".db")){
                     boolean  r = new File(file).delete();
                     logger.info("清理文件=" + file + " 结果：" + r);
                 }
            }
        }

    }

}
