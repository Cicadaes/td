package td.enterprise.wanalytics.etl.task;


import org.apache.commons.cli.*;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import td.enterprise.entity.CrowdBlackEnum;
import td.enterprise.entity.CrowdBlackList;
import td.enterprise.entity.Project;
import td.enterprise.service.CrowdBlackListService;
import td.enterprise.wanalytics.etl.bean.MacPredict;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.JsonUtils;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.*;

/**
 * mac 智能算法过滤，
 * 对每次到访mac进行检查是否是非移动设备,如果不是，添加到项目黑名单中
 */
public class MacPredictTask {

    private static final Logger logger = Logger.getLogger(MacPredictTask.class);

    /**
     * 存储mac 项目列表，如果一个mac 校验出来属于非移动mac地址，全部项目添加进去黑名单
     */
    private static Map<String,Set<Project>> MAC_PROJECT_MAP = new HashMap<>();


    //保存被过滤出来非移动设备Mac地址
    private static Set<String> NO_MOBILE_DEVICE_SET = new HashSet<>();

    //只能算法url 地址
    private static  String macPredictUrl = HttpUtil.getParamFromConfigServer(Constant.MAC_PREDICT_URL) ;

    static SqlSession sqlSession = null;

    public static void main(String[] args)  {
        try {
            Options options = new Options();
            options.addOption("inputFile", "inputFile", true, "输入文件");
            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String inputFile = line.getOptionValue("inputFile");
            long begin = System.currentTimeMillis();
            execute(inputFile);
            long end = System.currentTimeMillis();
            logger.info("----MacPredictTask Task is over. Used Time :" + (end - begin) / 1000 + " seconds.");
        }catch (Exception e){
            logger.error("查询出来mac地址导入到黑名单中：",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }finally {
            sqlSession.close();
        }
    }

    /**
     *   t.project_name, 0
         u.mac 1,
         enterTime 2,
         leavetime 3,
         u.session_duration 4,
         t.rssi 5,
         t.project_id 6,
         t.tenant_id 7
     * @param inputFile
     */
    public static void execute(String inputFile){
         bathCall (inputFile);
         int   size =  NO_MOBILE_DEVICE_SET.size();
         logger.info("过滤结果大小："  + size);
         if(size != 0){
             saveToDB();
         }
    }

    private static void bathCall(String inputFile){
        File file = new File(inputFile);
        if(! file.exists() ){
            logger.error("inputFile=" + inputFile + "不存在,忽略执行");
            return ;
        }
        BufferedReader br = null;
        FileReader reader = null;
        try {
            reader = new FileReader(inputFile) ;
            br = new BufferedReader(reader);
            String line = null;
            TreeSet<Integer> treeSet = new TreeSet<>();
            while (StringUtils.isNotBlank(line = br.readLine())) {
                String  [] values = line.split(Constant.BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR);
                String starttime = values[2];
                String endtime = values [3];
                int station = Integer.parseInt(values[4]);
                String rssi = values[5];//多个信号强度用分号进行分割
                for(String t : rssi.split(Constant.SEMICOLON)){
                    treeSet.add(Integer.parseInt(t));
                }
                MacPredict  mp = new MacPredict();
                mp.setStarttime(starttime);
                mp.setEndtime(endtime);
                mp.setStation(station);
                int strongsignal = treeSet.last();
                int weaksignal = treeSet.first();
                mp.setStrongsignal(strongsignal);
                mp.setWeaksignal(weaksignal);
                mp.setDiff(strongsignal - weaksignal);
                mp.setTimes(treeSet.size() - 1);

                String mac = values[1];

                boolean md = isMobileDevice(mp);

                if(md == false){
                    NO_MOBILE_DEVICE_SET.add(mac);
                    logger.info("mac 非移动设备：mac=" + mac + " Params:" + mp);
                }

                int projectId = Integer.parseInt(values[6]);
                String tenantId = values[7];

                //保留mac 对应项目信息，
                Set<Project>  setProject = MAC_PROJECT_MAP.get(mac);
                if(null == setProject){
                    setProject = new HashSet<>();
                }
                Project project = new Project();
                project.setId(projectId);
                project.setTenantId(tenantId);

                setProject.add(project);
                MAC_PROJECT_MAP.put(mac,setProject);
                treeSet.clear();
            }
        } catch (Exception e) {
            logger.error("MacPredictTask failed!",e);
        } finally {
            FileUtil.close(br,reader);
        }
    }


    /**
     * 把黑名单数据更新到黑名单表中
     */
    private static void saveToDB(){
        SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
        sqlSession = sqlSessionFactory.openSession();

        for(String mac : NO_MOBILE_DEVICE_SET){

            Set<Project>  projectSet  = MAC_PROJECT_MAP.get(mac);
            if(null != projectSet){
               for(Project project : projectSet){
                   CrowdBlackList t = new CrowdBlackList();
                   t.setTenantId(project.getTenantId());
                   t.setProjectId(project.getId());
                   t.setDeviceMac(mac);
                   t.setSource(CrowdBlackEnum.MAC_PREDICT.getCode());
                   t.setStatus(1);
                   t.setFilterReason(CrowdBlackEnum.MAC_PREDICT.getValue());
                   t.setCreateBy("system");
                   t.setCreator("system");
                   t.setUpdateBy("system");
                   t.setUpdater("system");
                   CrowdBlackListService.insert(sqlSession, t);
               }
            }
        }
    }

    /**
     * 是否是移动mac，Y 表示是
     * @return
     */

    public static boolean isMobileDevice(MacPredict mp) throws  Exception{
        String json = null;
        json = JsonUtils.objectToJsonStr(mp);
        Map map = HttpUtil.postBody(macPredictUrl, json ,HashMap.class);
        if(map == null ){
            return true;
        }
        return !"N".equalsIgnoreCase(map.get("result") + "");
    }


}
