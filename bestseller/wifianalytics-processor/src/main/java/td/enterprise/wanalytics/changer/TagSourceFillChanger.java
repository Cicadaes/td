package td.enterprise.wanalytics.changer;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;
import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.framework.commons.util.Utils;
import td.enterprise.framework.plugin.changer.atomic.impl.SpringDictDaoChanger;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.processor.cache.CacheFactory;
import td.enterprise.wanalytics.processor.utils.FailLogger;
import td.enterprise.wanalytics.processor.utils.LineKeyConstants;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * 扩展标签信息补充 
 */
public class TagSourceFillChanger extends SpringDictDaoChanger {

	private static Cache tagSourceCache = CacheFactory.getTagSourceCache();//扩展标签信息缓存
	public static final String VALID_STATUS = "1";
	public static final String SENSORINSTALL_TABLE_NAME = "TD_INSTALL_INFO";
	public static final String SENSORINSTALL_COLUMN_NAME = "customized_info";
	public static final int ONEHOUR = 3600000;
	
    private static ReadWriteLock mylock =  new ReentrantReadWriteLock(false);  
	
	static {
		new Thread(new Runnable() {
			public void run() {
				while(true){
					synchronize();//同步缓存
					try {
						Thread.sleep(ONEHOUR);
					} catch (InterruptedException e) {
						//睡眠异常，不处理
					}
				}
			}
		}).start();
	}
	
	public static void synchronize(){
		mylock.writeLock().lock();
		try{
			tagSourceCache.removeAll();
			List<Map<String, Object>> queryForList = CacheFactory.createTagSourceBean();
			if (queryForList!=null && queryForList.size()>0) {
				for (Map<String, Object> map : queryForList) {
					String mac = (String)map.get("related_attribute");
					String starttime = (String)map.get("valid_start_time");
					String endtime = (String)map.get("valid_end_time");
					String tagSource = (String)map.get("_source");
					if (mac!=null && tagSource!=null && starttime!=null && endtime!=null) {
						Element element = tagSourceCache.get(mac);
						if (Utils.isNotEmpty(element)) {
							@SuppressWarnings("unchecked")
							Map<String,String> tagmap = (Map<String, String>)element.getObjectValue();
							tagmap.put(starttime+","+endtime,tagSource);
							tagSourceCache.put(new Element(mac, tagmap));
						}else{
							HashMap<String, String> hashMap = new HashMap<String, String>();
							hashMap.put(starttime+","+endtime,tagSource);
							tagSourceCache.put(new Element(mac, hashMap));
						}
					}
				}
			}else{
//				Offline_FailLogger.write("同步信息时，没有匹配到任何信息，可能有错误，也可能没有。Sql："+sql);
			}
		}catch(Exception e){
			logger.error("TagSourceFillChanger synchronize error !", e);
			Line line = new Line();
			line.put(Constants.ES_FAIL_CODE_KEY, Constants.ES_FAIL_CODE_SENSOR_PROP_FILL);
			FailLogger.write(line);
		}finally {
			mylock.writeLock().unlock();
		}
	}

	public Line _change(Line line) {
		if (null != line) {
			try {
				String apmac = (String) line.get(LineKeyConstants.apmac); // apmac即传感器mac地址
				if (null != apmac && !"".equals(apmac)) {
					fill(apmac, line);
				} else {
					logger.error("TagSourceFillChanger error ! apmac is empty !");
					line.fail = true;
					line.put(Constants.ES_FAIL_CODE_KEY, Constants.ES_FAIL_CODE_SENSOR_PROP_FILL);
					FailLogger.write(line);
				}
			} catch (Exception e) {
				logger.error("TagSourceFillChanger error !", e);
				line.fail = true;
				line.put(Constants.ES_FAIL_CODE_KEY, Constants.ES_FAIL_CODE_SENSOR_PROP_FILL);
				FailLogger.write(line);
			}
		}
		return line;
	}

	@SuppressWarnings("unchecked")
	public void fill(String sensorMac, Line line) {
		//补充扩展标签信息
		String tagSource = "";
		Long time = (Long) line.get(LineKeyConstants.tssend);
		if(Utils.isNotEmpty(sensorMac) && time!=null){
			long parseLong=time/1000l;//转换为秒
			mylock.readLock().lock(); 
			Element element = tagSourceCache.get(sensorMac);
			mylock.readLock().unlock(); 
			if (element!=null) {
				HashMap<String, String> valuemap = (HashMap<String, String>)element.getObjectValue();
				if (valuemap!=null) {
					Iterator<Entry<String, String>> iterator = valuemap.entrySet().iterator();
					while(iterator.hasNext()){
						Entry<String, String> next = iterator.next();
						String[] split = next.getKey().split(",");
						long start = Long.parseLong(split[0]);
						long end = Long.parseLong(split[1]);
						if (parseLong>=start && parseLong<=end) {//大于开始时间，小于结束时间
							tagSource=next.getValue();
							break;
						}
					}
				}
			}
		}
		line.put(LineKeyConstants.tagSource, tagSource);
	}

	//通过探针得到扩展标签信息
//	public String getFilmPlanInfoByMac(String sensorMac){
//		String tagSource = "";
//		long nowTime = System.currentTimeMillis()/1000l;
//		long cacheStampKey = nowTime/600l;	//缓存内容需要根据时间进行动态更新，更新间隔为10分钟
//		if (Utils.isNotEmpty(sensorMac) && Utils.isNotEmpty(nowTime)) { 
//			String tag_key = sensorMac + cacheStampKey;
//			Element element = tagSourceCache.get(tag_key);
//			if (Utils.isNotEmpty(element)) {
//				long a =System.currentTimeMillis();
//				tagSource= (String) element.getObjectValue();
//				if (tagSource.equals("-1")) {
//					tagSource="";
//				}
//				long b =System.currentTimeMillis();
//				Offline_FailLogger.write("读取缓存："+(b-a));
//			}else{
//				String sql = "select distinct match_data._source "
//						+ " from ( "
//						+ "   select min(rc.action) as action,min(rc.table_name) as table_name,min(rc.column_name) as column_name, "
//						+ "   md._source,md.valid_start_time,md.valid_end_time,md.customized_info,md.status "
//						+ "   from TD_CUSTOMIZED_RULE_CONFIG rc,TD_CUSTOMIZED_MATCH_DATA md "
//						+ "   where rc.business_id = md.business_id "
//						+ "   group by md._source,md.valid_start_time,md.valid_end_time "
//						+ " ) match_data "
//						+ " join TD_SENSOR_INSTALL_INFO sensor_info "
//						+ " on "
//						+ " case "
//						+ "   when table_name = '" + SENSORINSTALL_TABLE_NAME + "' and column_name = '" + SENSORINSTALL_COLUMN_NAME + "' "
//						+ "      and sensor_info.customized_info is not null and sensor_info.customized_info <> '' "
//						+ "      and match_data.customized_info is not null and match_data.customized_info <> '' "
//						+ "   then "
//						+ "   case "
//						+ "     when match_data.action= '==' "
//						+ "     then sensor_info.customized_info = match_data.customized_info "
//						+ "     when match_data.action= '>=' "
//						+ "     then sensor_info.customized_info >= match_data.customized_info "
//						+ "     when match_data.action= '<=' "
//						+ "     then sensor_info.customized_info <= match_data.customized_info "
//						+ "     when match_data.action= '!=' "
//						+ "     then sensor_info.customized_info <> match_data.customized_info "
//						+ "     when match_data.action= '>' "
//						+ "     then sensor_info.customized_info > match_data.customized_info "
//						+ "     when match_data.action= '<' "
//						+ "     then sensor_info.customized_info < match_data.customized_info "
//						+ "     else 1=0 "
//						+ "   end "
//						+ "   else 1=0 "
//						+ " end "
//						+ " where sensor_info.sensor_mac = '" + sensorMac + "'"
//						+ " and match_data.status = '" + VALID_STATUS + "'"
//						+ " and match_data.valid_start_time <= " + nowTime
//						+ " and match_data.valid_end_time >= " + nowTime;
//				long a =System.currentTimeMillis();
//				List<String> tags = JDBC_Template.queryForTagList(sql);
//				long b =System.currentTimeMillis();
//				Offline_FailLogger.write("用时："+(b-a));
//				if(tags != null && tags.size() > 0){
//					tagSource = tags.get(0);
//					tagSourceCache.put(new Element(tag_key, tagSource));
//				}else{
//					tagSourceCache.put(new Element(tag_key, "-1"));
//				}
//			}
//		}
//		return tagSource;
//	}

}
