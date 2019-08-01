package td.enterprise.wanalytics.etl.task.filterblackmac;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.*;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import td.enterprise.entity.MacCompany;
import td.enterprise.service.MacCompanyService;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.HttpDownload;
import td.enterprise.wanalytics.etl.util.ListUtils;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.io.File;
import java.util.*;

/**
 * Created by yanghao on 2017/6/21.
 * 读取更新mac地址段
 */
@Slf4j
public class ReadMacTask {

    /**
     * 读取路径,url
     */
    public static String URL = "url";

    public static final String fileName = "oui.txt";
  public static void main(String[] args){
        long start = System.currentTimeMillis();
        try{
            run(args);

        }catch (Exception e){
            e.printStackTrace();
            log.error("",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
        long end = System.currentTimeMillis();
        log.info("===========成功结束,用时：" + (end - start)/1000 + "秒");
    }

    private static void run(String[] args) throws Exception {
        Options options = new Options();
        options.addOption("url", URL, true, "url");

        CommandLineParser parser = new PosixParser();
        CommandLine line = parser.parse(options, args);
        String url = line.getOptionValue(URL);
        if (url == null || "".equals(url)){
            log.error("url 地址不能为空，url 为空");
            return;
        }
        log.info("  读取路径: "+url);
        readMacByUrl(url);
    }
    static SqlSession sqlSession = null;
    public static void  readMacByUrl(String url) throws Exception {
        List<String> list = new ArrayList<String>();
        log.info("下载url="+url);
        if (url.startsWith("http://")){
            // 网址内容
            File file = new File(System.getProperty("java.io.tmpdir"),fileName);

            String path = file.getAbsolutePath();
            log.info("临时文件位置："+path);
            boolean fate = HttpDownload.download(url,path);
            if (fate){
                list = FileUtil.readFileAsList(path);
                file.delete();
                log.info("成功删除临时文件位置："+path);
            }
        }else {
            //文件内容
            list = FileUtil.readFileAsList(url);
        }
        try {
            Map<String,String> macMap = ListUtils.getMacListToMap(list);
            SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
            sqlSession = sqlSessionFactory.openSession();
            MacCompany p = new MacCompany();
            List<MacCompany> sqlList = MacCompanyService.queryByList(sqlSession,p);
            Map<String,String> sqlMap = new HashMap<>();
            for (MacCompany macCompany : sqlList){
                sqlMap.put(macCompany.getMac().trim()+"_"+macCompany.getCompany().trim(),macCompany.getIsMobile()+"");
            }
            Set<String> macSet = macMap.keySet();
            int temp = 0;
            for (String key : macSet){
                if (!sqlMap.containsKey(key)){
                    String[] macStr = key.split("_");
                    MacCompany macCompany = new MacCompany();
                    macCompany.setMac(macStr[0]);
                    macCompany.setCompany(macStr[1]);
                    macCompany.setIsMobile(1);
                    MacCompanyService.insert(sqlSession,macCompany);
                    temp++;
                    log.info("更新mac段："+key+" 插入条数："+temp);
                }

            }
        }catch (Exception e){
            log.error(""+e.getMessage());
            throw e;
        }finally {
            sqlSession.commit();
            sqlSession.close();
        }



    }


}

