package td.enterprise.wanalytics.etl.task.customizedtags.interfaces;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import td.enterprise.entity.CustomizedMatchData;
import td.enterprise.service.CustomizedMatchDataService;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.task.customizedtags.bean.BBTResponse;
import td.enterprise.wanalytics.etl.task.customizedtags.bean.FilmPlanInfo;
import td.enterprise.wanalytics.etl.util.*;

import java.nio.charset.Charset;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class BBTFilmListRunByDay {

	public static Logger logger = Logger.getLogger(BBTFilmListRunByDay.class);

	public static String url;
	public static String key;
	public static int pageSize;
	public static String appkey;
	public static String recipients;
	public static String businessId;
	public static String tenantId;
	public static String uniqueId;

	public static final String VALID_STATUS = "1";
	public static final String INVALID_STATUS = "-1";
	
	public static final String CINEMACODE_KEY = "cinemacode";
	public static final String AUDITORIUM_ID_KEY = "auditorium_id";

	static SqlSession sqlSession = null;

	public static void main(String[] args) {
		try {
			long begin = System.currentTimeMillis();
			Options options = new Options();
			options.addOption("d", "date", true, "运行日期");
			CommandLineParser parser = new PosixParser();
			CommandLine line = parser.parse(options, args);
			String date = line.getOptionValue("date");

			// date = "2016-08-28"; //start date'
			//test date
			// date = "2017-02-07";

			SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
			sqlSession = sqlSessionFactory.openSession();

			businessId = "1";
			date = date.replace("-", "");

			readConfig();
			List <FilmPlanInfo> filmPlanInfoList = execute(date);

			long end = System.currentTimeMillis();
			logger.info("saveResult end... total spend=" + (end - begin) / 1000 + "s, count=" + filmPlanInfoList.size());

		} catch (Exception e) {
			logger.error("获取抱抱堂电影列表失败：", e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		} finally {
			sqlSession.commit();
			sqlSession.close();
		}

	}

	// 读取配置文件信息
	public static void readConfig() {
		url = SysConfigUtil.getValue("bbt.url");
		key = SysConfigUtil.getValue("bbt.key");
		pageSize = Integer.parseInt(SysConfigUtil.getValue("bbt.pagesize"));
		appkey = SysConfigUtil.getValue("bbt.appkey");
		recipients = SysConfigUtil.getValue("bbt.alarm.recipients");
	}

	public static List<FilmPlanInfo> execute(String date) throws Exception {
		//防止冗余，删除所有原始数据
		deleteOld(date);
		
		int page = 1;
		int totalCount = 0;
		List<FilmPlanInfo> allList = new ArrayList<FilmPlanInfo>();
		while (true) {
			List<FilmPlanInfo> list = getList(url, key, appkey, date, page, pageSize, date);
			allList.addAll(list);

			if (null != list) {
				//批量保存至数据库
				saveResult(list);
				totalCount += list.size();
			}
			if (list == null || list.isEmpty() || list.size() < pageSize) {
				break;
			}
			page++;
		}
		if (totalCount == 0) {
			String context = "导出日期为" + date + "的电影排期时：BBTFilmList接口无返回任何数据";
			String[] recipientArr = recipients.split(",");
			MailUtil.sendMail("BBTFilmList无返回数据！", context, recipientArr);
		}
		return allList;
	}

	public static List<FilmPlanInfo> getList(String url, String key, String appkey, String ymd, int page, int pageSize, String date) throws Exception {
		String sign = getSign(appkey, page, pageSize, ymd);
		String jsonResult = "";
		String[] recipientArr = recipients.split(",");

		try {
			jsonResult = queryBBTFilmList(url, sign, appkey, ymd, page, pageSize);
		} catch (Exception e) {
			String context = "导出日期为" + date + "的电影排期时报错\n" + "Message为：" + "\n" + e.getMessage() + ",\n" + "StackTrace为：" + "\n" + e.getStackTrace();
			MailUtil.sendMail("BBTFilmList接口查询报错！", context, recipientArr);
			e.printStackTrace();
		}

		logger.info("jsonResult===" + jsonResult);
		BBTResponse result = JsonUtils.jsonToObject(jsonResult, BBTResponse.class);
		if (result.getCode() != 0) {
			String context = "导出日期为" + date + "的电影排期时错误\n" + "Code为：" + "\n" + result.getCode() + ",\n" + "Message为：" + "\n" + result.getMessage();
			MailUtil.sendMail("BBTFilmList接口返回错误！", context, recipientArr);
		}

		return result.getResult();
	}
	
	@SuppressWarnings("resource")
	public static String queryBBTFilmList(String url,String sign,String appkey,String ymd,int page, int pagesize) throws Exception{
		DefaultHttpClient client = new DefaultHttpClient();
		
		MultipartEntity multipartEntity = new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE,"----------ThIs_Is_tHe_bouNdaRY_$", Charset.defaultCharset()); 
		multipartEntity.addPart("page",new StringBody("" + page) );
		multipartEntity.addPart("pagesize",new StringBody("" + pagesize) );
		multipartEntity.addPart("partner",new StringBody(appkey) );
		multipartEntity.addPart("ymd",new StringBody(ymd) );
		multipartEntity.addPart("sign",new StringBody(sign) );
		
		url += "?page=" + page + "&pagesize=" + pagesize + "&appkey=" + appkey + "&ymd=" + ymd + "&sign=" + sign;
		logger.info("----------------url=" + url);
        HttpPost post = new HttpPost(url );
        post.setEntity(multipartEntity);
        post.addHeader("Content-Type","multipart/form-data; boundary=----------ThIs_Is_tHe_bouNdaRY_$");
        HttpResponse response = client.execute(post);
        int statusCode = response.getStatusLine().getStatusCode();
        if(statusCode == HttpStatus.SC_OK){
        	 String result = EntityUtils.toString(response.getEntity());
        	 return result;
        }else{
        	throw new Exception("call url=" + url + "error " + response.getStatusLine());
        }
	}
	
	public static void deleteOld(String runDate) throws ParseException{
		CustomizedMatchData oldCustomizedMatchData = new CustomizedMatchData();
		SimpleDateFormat sdf = new SimpleDateFormat( "yyyyMMdd" );
		Date date = sdf.parse(runDate);
		SimpleDateFormat dbsdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		//删除30天前的数据
		String strdb = dbsdf.format(new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000));
		Date datedb = dbsdf.parse(strdb);
		oldCustomizedMatchData.setBusinessId(businessId);
		oldCustomizedMatchData.setUpdateTime(datedb);
		try {
			CustomizedMatchDataService.batchDeleteByBusinessId(sqlSession, oldCustomizedMatchData);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	public static void saveResult(List<FilmPlanInfo> filmPlanInfoList) {
		List<CustomizedMatchData> list = new ArrayList<CustomizedMatchData>();
		for (FilmPlanInfo filmPlanInfo : filmPlanInfoList) {
			
			String jsonSource = "";
			try {
				jsonSource = JsonUtils.objectToJsonStr(filmPlanInfo);//电影信息转成json后，进行url编码
			} catch (Exception e) {
				e.printStackTrace();
			}
			
			//格式按照TD_CUSTOMIZED_RULE_CONFIG中对应的{"auditorium_id":value1,"cinemacode":value2}转换
			String jsonInfo = "";
			Map<String, String> infos = new HashMap<String, String>();
			infos.put(CINEMACODE_KEY, filmPlanInfo.getCinemacode());
			infos.put(AUDITORIUM_ID_KEY, filmPlanInfo.getAuditorium_id());
			try {
				jsonInfo = JsonUtils.objectToJsonStr(infos);
			} catch (Exception e) {
				e.printStackTrace();
			}
			
			// logger.debug(jsonSource.toString());
			
			CustomizedMatchData customizedMatchData = new CustomizedMatchData();
			customizedMatchData.setBusinessId(businessId);
			customizedMatchData.setSource(jsonSource);
			customizedMatchData.setValidStartTime(filmPlanInfo.getStart_date());
			customizedMatchData.setValidEndTime(filmPlanInfo.getEnd_date());
			customizedMatchData.setCustomizedInfo(jsonInfo);
			customizedMatchData.setStatus(VALID_STATUS);
			customizedMatchData.setCreator(BBTFilmListRunByDay.class.getSimpleName());
			customizedMatchData.setCreateBy(BBTFilmListRunByDay.class.getSimpleName());
			list.add(customizedMatchData);
		}
		if(list.size()>0){
			try {
				CustomizedMatchDataService.batchInsert(sqlSession, list);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public static String getSign(String appkey, int page, int pageSize, String ymd) {
		String s = "page=" + page + "&pagesize=" + pageSize + "&partner=" + appkey + "&ymd=" + ymd;
		String value = s + key;
		String sign = MD5Util.MD5(value).toLowerCase();
		return sign;
	}

}
