package td.enterprise.wanalytics.etl.task.custom;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.omg.CORBA.SystemException;

import td.enterprise.entity.LookalikeCrowd;
import td.enterprise.service.LookalikeCrowdService;
import td.enterprise.wanalytics.etl.bean.ServiceConf;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.task.BaseTask;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;


/**
 * wiki http://wiki.tenddata.com/pages/viewpage.action?pageId=17793309
 * 上传tdid文件，导出扩大后的tdid文件
 * @author junmin.li
 *
 */
public class LookalikeTask extends BaseTask {
	public static Logger logger = Logger.getLogger(LookalikeTask.class);
	
	private static long queryPeriod = Constant.CFG_STATUS_QUERY_PERIOD;
    private static int queryMaxNumber = Constant.CFG_STATUS_QUERY_MAX_NUMBER;
   // private static  ServiceInterfaceCallLogService logService =  null;

    //城市获取 http://36.110.238.163:8080/citys?token=oOKowNOew6GRPA&appkey=557f7a768bda20a5270f883c
    public static String CITYS = "宜昌市(420500),阿里地区(542500),四平市(220300),上海市(310200),仙桃市(429000),宜宾市(511500),廊坊市(131000),西双版纳傣族自治州(532800),阳泉市(140300),惠州市(441300),乌鲁木齐市(650100),安庆市(340800),徐州市(320300),汕尾市(441500),丹东市(210600),海北藏族自治州(632200),肇庆市(441200),鹰潭市(360600),屯昌县(469000),新余市(360500),阜阳市(341200),洛阳市(410300),湖州市(330500),和田地区(653200),萍乡市(360300),中卫市(640500),葫芦岛市(211400),丽江市(530700),成都市(510100),曲靖市(530300),漳州市(350600),潜江市(429000),巴音郭楞蒙古自治州(652800),六安市(341500),南充市(511300),鹤壁市(410600),安康市(610900),崇左市(451400),南平市(350700),玉溪市(530400),博尔塔拉蒙古自治州(652700),景德镇市(360200),北京市(110100),双鸭山市(230500),牡丹江市(231000),江门市(440700),天水市(620500),吕梁市(141100),六盘水市(520200),合肥市(340100),柳州市(450200),咸阳市(610400),宁波市(330200),包头市(150200),海东市(632100),信阳市(411500),抚顺市(210400),沧州市(130900),嘉兴市(330400),郑州市(410100),重庆市(500100),宿州市(341300),池州市(341700),普洱市(530800),石家庄市(130100),郴州市(431000),澳门特别行政区(820000),盐城市(320900),琼中黎族苗族自治县(469000),荆州市(421000),东沙群岛(440000),锦州市(210700),昭通市(530600),潮州市(445100),天门市(429000),中山市(442000),乐山市(511100),海口市(460100),阿克苏地区(652900),三亚市(460200),大连市(210200),黄山市(341000),克孜勒苏柯尔克孜自治州(653000),咸宁市(421200),抚州市(361000),九江市(360400),湘西土家族苗族自治州(433100),宣城市(341800),营口市(210800),澄迈县(469000),福州市(350100),湘潭市(430300),晋中市(140700),楚雄彝族自治州(532300),日照市(371100),宁德市(350900),梧州市(450400),山南地区(542200),白山市(220600),湛江市(440800),三明市(350400),庆阳市(621000),长治市(140400),松原市(220700),定西市(621100),株洲市(430200),辽源市(220400),东营市(370500),宝鸡市(610300),榆林市(610800),张家口市(130700),临沂市(371300),亳州市(341600),毕节市(520500),温州市(330300),淄博市(370300),鞍山市(210300),通辽市(150500),蚌埠市(340300),鄂尔多斯市(150600),遵义市(520300),陵水黎族自治县(469000),汉中市(610700),济源市(419000),百色市(451000),南京市(320100),临夏回族自治州(622900),开封市(410200),德宏傣族景颇族自治州(533100),马鞍山市(340500),保亭黎族苗族自治县(469000),兴安盟(152200),清远市(441800),厦门市(350200),白城市(220800),驻马店市(411700),嘉峪关市(620200),齐齐哈尔市(230200),图木舒克市(659000),石嘴山市(640200),台湾省(710000),七台河市(230900),潍坊市(370700),上饶市(361100),达州市(511700),固原市(640400),济南市(370100),金华市(330700),焦作市(410800),那曲地区(542400),衡阳市(430400),保定市(130600),铜陵市(340700),三门峡市(411200),贵港市(450800),定安县(469000),黄石市(420200),娄底市(431300),来宾市(451300),塔城地区(654200),玉林市(450900),金昌市(620300),阿勒泰地区(654300),呼伦贝尔市(150700),文昌市(469000),张掖市(620700),泰州市(321200),酒泉市(620900),赤峰市(150400),盘锦市(211100),承德市(130800),广州市(440100),攀枝花市(510400),怀化市(431200),阿坝藏族羌族自治州(513200),阜新市(210900),凉山彝族自治州(513400),安顺市(520400),铜仁市(520600),白沙黎族自治县(469000),黑河市(231100),茂名市(440900),怒江傈僳族自治州(533300),云浮市(445300),甘孜藏族自治州(513300),喀什地区(653100),鄂州市(420700),莱芜市(371200),资阳市(512000),内江市(511000),海西蒙古族藏族自治州(632800),泉州市(350500),襄阳市(420600),苏州市(320500),邯郸市(130400),迪庆藏族自治州(533400),岳阳市(430600),乌海市(150300),连云港市(320700),钦州市(450700),日喀则地区(542300),西宁市(630100),贵阳市(520100),鸡西市(230300),龙岩市(350800),香港特别行政区(810000),揭阳市(445200),常德市(430700),许昌市(411000),淮北市(340600),林芝地区(542600),昌都地区(542100),防城港市(450600),淮安市(320800),三沙市(460300),延安市(610600),长沙市(430100),贺州市(451100),红河哈尼族彝族自治州(532500),吉安市(360800),太原市(140100),安阳市(410500),南昌市(360100),孝感市(420900),河池市(451200),乌兰察布市(150900),果洛藏族自治州(632600),克拉玛依市(650200),伊春市(230700),东莞市(441900),汕头市(440500),滨州市(371600),泸州市(510500),深圳市(440300),阿拉尔市(659000),大同市(140200),大庆市(230600),昆明市(530100),哈尔滨市(230100),武威市(620600),晋城市(140500),常州市(320400),乐东黎族自治县(469000),忻州市(140900),铜川市(610200),玉树藏族自治州(632700),西安市(610100),北海市(450500),五指山市(469000),周口市(411600),梅州市(441400),南通市(320600),益阳市(430900),枣庄市(370400),无锡市(320200),唐山市(130200),神农架林区(429000),平顶山市(410400),巴彦淖尔市(150800),通化市(220500),大兴安岭地区(232700),吴忠市(640300),兰州市(620100),赣州市(360700),德州市(371400),五家渠市(659000),舟山市(330900),漯河市(411100),杭州市(330100),黄冈市(421100),滁州市(341100),阿拉善盟(152900),青岛市(370200),绥化市(231200),琼海市(469000),河源市(441600),黔南布依族苗族自治州(522700),台州市(331000),保山市(530500),东方市(469000),绍兴市(330600),随州市(421300),吉林市(220200),本溪市(210500),佳木斯市(230800),丽水市(331100),眉山市(511400),邵阳市(430500),武汉市(420100),渭南市(610500),扬州市(321000),宿迁市(321300),自贡市(510300),伊犁哈萨克自治州(654000),南阳市(411300),辽阳市(211000),商丘市(411400),莆田市(350300),甘南藏族自治州(623000),白银市(620400),银川市(640100),佛山市(440600),大理白族自治州(532900),雅安市(511800),十堰市(420300),儋州市(469000),聊城市(371500),荆门市(420800),临沧市(530900),遂宁市(510900),镇江市(321100),海南藏族自治州(632500),邢台市(130500),南宁市(450100),威海市(371000),新乡市(410700),吐鲁番地区(652100),广元市(510800),泰安市(370900),济宁市(370800),韶关市(440200),黔东南苗族侗族自治州(522600),芜湖市(340200),运城市(140800),张家界市(430800),永州市(431100),呼和浩特市(150100),延边朝鲜族自治州(222400),文山壮族苗族自治州(532600),临汾市(141000),鹤岗市(230400),宜春市(360900),朔州市(140600),烟台市(370600),天津市(120100),锡林郭勒盟(152500),珠海市(440400),沈阳市(210100),黔西南布依族苗族自治州(522300),商洛市(611000),哈密地区(652200),秦皇岛市(130300),衡水市(131100),万宁市(469000),广安市(511600),绵阳市(510700),菏泽市(371700),朝阳市(211300),黄南藏族自治州(632300),淮南市(340400),昌吉回族自治州(652300),濮阳市(410900),铁岭市(211200),恩施土家族苗族自治州(422800),平凉市(620800),临高县(469000),桂林市(450300),石河子市(659000),昌江黎族自治县(469000),阳江市(441700),德阳市(510600),长春市(220100),巴中市(511900),陇南市(621200),衢州市(330800),拉萨市(540100)";
    
    public static String [] CITY_ARRAY  = null; 
    static {
    	CITY_ARRAY = CITYS.split(",");
    }
    
	public static void main(String[] args)  {
		try{
			long begin = System.currentTimeMillis();
			Options options = new Options();
			options.addOption("t", "tenantId", true, "租户ID");
			options.addOption("p", "projectId", true, "项目ID");
			options.addOption("c", "crowdId", true, "客群ID");
			options.addOption("r", "runDate", true, "执行日期");
			options.addOption("s", "startDate", true, "开始日期");
			options.addOption("e", "endDate", true, "结束日期");
			options.addOption("i", "cycle_statistics", true, "时间间隔");
			options.addOption("inputFile", "inputFile", true, "输入文件");
			options.addOption("outputFile", "outputFile", true, "输出文件");
			options.addOption("schedulerTaskLogId", "schedulerTaskLogId", true, "azkaban计算任务id");
			options.addOption("taskId", "taskId", true, "任务id");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			tenantId = line.getOptionValue("tenantId");
			projectId = Integer.parseInt(line.getOptionValue("projectId"));
			crowdId = Integer.parseInt(line.getOptionValue("crowdId"));
			runDate = line.getOptionValue("runDate");
			cycle_statistics = line.getOptionValue("cycle_statistics");
			azkabanExecId = line.getOptionValue("schedulerTaskLogId");
			startDate = line.getOptionValue("startDate");
			endDate = line.getOptionValue("endDate");
			inputFile = line.getOptionValue("inputFile");
			outputFile = line.getOptionValue("outputFile");
			int taskId = Integer.parseInt(line.getOptionValue("taskId"));

			Boolean r = execute(tenantId,projectId,crowdId,cycle_statistics,runDate,startDate,endDate,inputFile, outputFile,taskId);
			long end = System.currentTimeMillis();
			logger.info("LookalikeTask Used times :" + (end - begin)/1000 + " seconds");
		 }catch(Exception e){
			 logger.error("获取Lookalike失败： ", e);
			 System.exit(WifipixTaskConstant.SHELL_STATUS_CONTINUE);
		 }
		 System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
	}
	
	/**
	 * 
	 * @param tenantId
	 * @param projectId
	 * @param crowdId
	 * @param cycle_statistics
	 * @param runDate
	 * @param beginDate
	 * @param endDate
	 * @param inputFilePath
	 * @param outputFilePath
	 * @param taskId
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("rawtypes")
	public static Boolean execute(String tenantId,Integer projectId,Integer crowdId,String cycle_statistics,String runDate,String beginDate,String endDate,String inputFilePath, String outputFilePath,int taskId) throws Exception {
		   try{
		    File infile = new File(inputFilePath);
		    File outFile = new File(outputFilePath);
		    LookalikeCrowd lookalikeCrowd = LookalikeCrowdService.selectByPrimaryKey(taskId);
		    int top = lookalikeCrowd.getSeedCrowdNum() * lookalikeCrowd.getPredictNum();
		    String cityName = lookalikeCrowd.getProjectCityName();
		    ServiceConf conf =  SysConfigUtil.getServiceConfig(WifipixTaskConstant.LOOKALIKE_BETCH_TASK_SUBMIT);
		    String appKey = conf.getAppkey();
		    String token = conf.getToken();
		    String serviceUrl = conf.getService();
        	Map<String,String> param = new HashMap<String,String> ();
        	
        	param.put(WifipixTaskConstant.TASK_NAME,"1" );//lookalike
        	param.put(WifipixTaskConstant.PLATFORM, "2");//Android
        	param.put(WifipixTaskConstant.ID_TYPE, "5");//TDID
        	param.put(WifipixTaskConstant.OUTPUT_TYPE,"1" );//输出扩大后的tdid 
        	param.put(WifipixTaskConstant.ID_OUT_TYPE, "5" );//输出tdid
        	param.put(WifipixTaskConstant.IS_OUTPUT_ALL, "true" );//true:扩大正样本和负样本合并后的结果 
        	param.put(WifipixTaskConstant.TOP, "" + top );
        	param.put(WifipixTaskConstant.POSDATA, inputFilePath);
        	param.put(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_ETOKEN_KEY,token);
        	param.put(WifipixTaskConstant.BETCH_INTERFACE_FE_BETCH_APPKEY_KEY,appKey );
//        	ServiceInterfaceCallLog serviceInterfaceCallLog = logService.createServiceInterfaceCallLog(WifipixTaskConstant.LOOKALIKE_BETCH_TASK_SUBMIT, runDate, tenantId, projectId, crowdId, param, azkabanExecId,WifipixTaskConstant.TASK_TYPE_LOOKALIKE);
//        	serviceCallLogId = serviceInterfaceCallLog.getId();
        	String city = getCityNameAndCode(cityName);
        	if(StringUtils.isBlank(city)){
        		throw new Exception("没有找到城市代码：" + cityName);
        	}
            String taskid = submitTask(infile,top,appKey,token,serviceUrl,city);
            String service = "Lookalike接口,城市：" + city;
            Integer macCount = FileUtil.getFileRowCount(inputFilePath);
            Boolean isSuccessed = queryTaskStatus(taskid,service,macCount);
           // logService.invokeServiceSuccess(serviceCallLogId, taskid,WifipixTaskConstant.TASK_STATUS_FINISH);
            if (isSuccessed) {
                logger.info("taskid : " + taskid + "  outputFilePath : " + outFile.getAbsolutePath());
                try{
                	 Boolean downloadSuccessed = downloadTaskFile(taskid, outFile.getAbsolutePath());
                     if (downloadSuccessed) {
                     	//logService.invokeServiceSuccess(serviceCallLogId, taskid,WifipixTaskConstant.TASK_STATUS_DOWNLOAD);
                         logger.info(" download sucessed ! taskid : " + taskid + "  outputFilePath : " + outFile.getAbsolutePath());
                     }else{
                    	 throw new Exception("文件下载失败  taskid=" + taskid);
                     } 
                }catch(Exception e){
                	logger.error("下载文件异常：", e);
                	//logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_DOWNLOAD,taskid,e);
                }
            } else {
            	//logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_DOWNLOAD,taskid,new Exception("任务执行异常"));
                logger.error("query status not successed !");
            }
		   }catch(Exception e){
			   logger.error("任务执行失败:", e);
			  // logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_RUN_FAILURE,null, e);
			   throw e;
		   }

	    return false;
	}
	
	/**
	 * 上传文件
	 * @return
	 * @throws UnsupportedEncodingException
	 * @throws SystemException
	 */
	public static String submitTask(File inputFile,int top,String appkey,String token,String serviceUrl,String city) throws Exception {
		Map  rsp = HttpUtil.SubmitPost(serviceUrl,
	                HttpUtil.getLookalikeReqEntry(inputFile.getAbsolutePath(),token,appkey,top,city));
	        return checkHttpResponse(rsp);
	}
	
	 public static String checkHttpResponse(Map rsp) throws  Exception {
	        if (null == rsp) {
	        	//logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_DOWNLOAD,null,new Exception("respone map is null!"));
	            throw new Exception("respone map is null!");
	        }
	        String msg = (String) rsp.get("msg");
	        String taskid = rsp.get("task_id") + "";
	        logger.info("msg : " + msg + "  taskid : " + taskid);
	        if ((msg != null && !"success".equals(msg)) || "".equals(taskid)) {
	        	//logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_DOWNLOAD, null, new Exception("submit task failed !"));
	            throw new Exception("submit task failed !");
	        }
	        return taskid;
	 }
	 
	 /**
	  * 查询Task 状态 
	  * @param taskid
	  * @return
	  * @throws Exception
	  * @throws UnsupportedEncodingException
	  */
	 public static Boolean queryTaskStatus(String taskid,String service,Integer macCount) throws Exception {
	        Boolean isSuccessed = false;
	        Boolean queryContinue = true;
	        int queryNum = 0;
		    ServiceConf serviceConf =  SysConfigUtil.getServiceConfig(WifipixTaskConstant.LOOKALIKE_BETCH_TASK_STATUS);
//	        Date submitTime = new Date();
//	        boolean isSendEmail = false;
	        String url = HttpUtil.getLookalikeTaskStatusReqUrl(serviceConf.getService(),taskid,serviceConf.getAppkey(),serviceConf.getToken());
	        logger.info("===============url=" + url);
	        while (queryContinue) {
	            try {
	                Thread.sleep(queryPeriod);
	            } catch (InterruptedException e) {
	                logger.info("thread sleep interrupted ! ", e);
	            }
//	            if(isSendEmail == false){
//	            	isSendEmail = AlarmEmailUtil.sendEmail(taskid, service, projectId,crowdId,submitTime,macCount);
//	            }
	            Map rsp = HttpUtil.SubmitGet(url);
	            if (null == rsp) {
	            	//logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_RUN_FAILURE,taskid,new Exception("respone map is null!"));
	                throw new Exception("respone map is null!");
	            }
	            Integer msg = Integer.parseInt(rsp.get("msg") + "");
	            logger.debug("msg : " + msg);
	            if (-1 == msg) {
	            	//logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_RUN_FAILURE,taskid, new Exception("task not exist !" + " taskid : " + taskid));
	                throw new Exception("task not exist !" + " taskid : " + taskid);
	            } else if (1 == msg) {
	                logger.info("task is running !" + " taskid : " + taskid);
	                if (queryNum >= queryMaxNumber) {
	                    queryContinue = false;
	                    logger.info("task is running ,but  queryMaxNumber reach!");
	                }
	            } else if (3 == msg) {
	                logger.info("task successed !" + " taskid : " + taskid);
	                queryContinue = false;
	                isSuccessed = true;
	            } else if (4 == msg) {
	            	//logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_RUN_FAILURE, taskid, new Exception("task failed !" + " taskid : " + taskid));
	                logger.info("task failed !" + " taskid : " + taskid);
	                queryContinue = false;
	                isSuccessed = false;
	            } else {
	            	//logService.invokeServiceException(serviceCallLogId, WifipixTaskConstant.TASK_STATUS_RUN_FAILURE, taskid, new Exception(" query task status msg is error ! msg=" + msg));
	                throw new Exception(" query task status msg is error ! msg=" + msg);
	            }
	            queryNum++;

	        }
	        return isSuccessed;
	    }

	 public static Boolean downloadTaskFile(String taskid, String fileSaveAsPath) throws IOException {
		    ServiceConf conf =  SysConfigUtil.getServiceConfig(WifipixTaskConstant.LOOKALIKE_BETCH_TASK_DOWNLOAD);
//		    ServiceConf conf = WifipixTaskConstant.getService(WifipixTaskConstant.LOOKALIKE_BETCH_TASK_DOWNLOAD);
		    String appkeyValue = conf.getAppkey();
		    String tokenValue = conf.getToken();
		    String serviceUrl = conf.getService();
	        return HttpUtil.downloadLookalikeResultFile(taskid, fileSaveAsPath,tokenValue,appkeyValue,serviceUrl);
	 }
	 
	 public static String  getCityNameAndCode(String cityName){
		 for(int i=0;i<CITY_ARRAY.length;i ++){
			 if(CITY_ARRAY[i].indexOf(cityName) != -1){
				 return CITY_ARRAY[i];
			 }
		 }
		 return null;
	 }
	 
}
