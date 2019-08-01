package td.enterprise.wanalytics.processor;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

import org.apache.commons.lang.SerializationUtils;
import org.apache.storm.kafka.bolt.mapper.FieldNameBasedTupleToKafkaMapper;
import org.apache.storm.task.OutputCollector;
import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseRichBolt;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.framework.plugin.changer.Changer;
import td.enterprise.wanalytics.changer.*;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.processor.bean.FilterMacBean;
import td.enterprise.wanalytics.processor.bean.FilterTypeEnum;
import td.enterprise.wanalytics.processor.cache.CacheFactory;
import td.enterprise.wanalytics.processor.utils.*;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * wifi bolt 处理标签的两类数据格式
 *
 * @author yangtao
 */
public class WiFiBolt extends BaseRichBolt {

		  private static final long serialVersionUID = 1L;

		  /**
		   * 日志
		   */
		  public static Logger logger = LoggerFactory.getLogger(WiFiBolt.class);

		  private OutputCollector outputCollector;


		  /** 探针属性补充 */
		  private static Changer sensorPropFillChanger = new SensorPropFillChanger();

		  /** 设备属性补充 */
		  private static Changer devicePropFillChanger = new DevicePropFillChanger();

		  /** 设备黑名单过滤 */
		  private static Changer deviceBlackListFilterChanger = new DeviceBlackListFilterChanger();

		  /** 时间过滤 */
		  private static Changer validTimeFilterChanger = new ValidTimeFilterChanger();

		  /** 移动mac校验  */
		  private static Changer macCompanyChanger = new MacCompanyFilterChanger();

		  /** 伪mac过滤 */
		  private static Changer fakeMacFilterChanger = new FakeMacFilterChanger();

		  private static Cache sessionCache = CacheFactory.getSessionCache();

		  private static Cache cubeCache = CacheFactory.getCubeCache();

		  private static Cache sensorAllMacCache = CacheFactory.getSensorAllMacCache();

		  private static long RECEIVE_COUNT = 0; //每5分钟接收的数据量
		  private static long BEGIN_TIME = 0;      //开始计数时间
		  private static final int TIME_INTERVAL = 5 * 60 * 1000;//5分钟

		  private static int MINUTES = 60000;//分钟

		  public static final String EXSIT = "1";
		  public static final String dayFormat = "yyyy-MM-dd";


		  public void prepare(@SuppressWarnings("rawtypes") Map stormConf, TopologyContext context, OutputCollector collector) {
					this.outputCollector = collector;
		  }

		  public void execute(Tuple input) {
					logReceiveDataCount();
					Line line = null;
					try {
							  line = (Line) input.getValueByField("data");
							  handleLine(line);
					} catch (Exception e) {
							  logger.error("====== 获取WIFI Log数据错误：", e);
							  if (line != null) {
										FailLogger.write(line);
							  }
					}
					outputCollector.ack(input);
		  }

		  private void logReceiveDataCount() {
					if (BEGIN_TIME == 0) {
							  BEGIN_TIME = System.currentTimeMillis();
							  RECEIVE_COUNT = 0;
					} else if (System.currentTimeMillis() - BEGIN_TIME >= TIME_INTERVAL) {
							  logger.info("During " + TIME_INTERVAL / 1000 + " seconds receive data count is :" + RECEIVE_COUNT);
							  RECEIVE_COUNT = 0;
							  BEGIN_TIME = System.currentTimeMillis();
					}
					RECEIVE_COUNT++;
		  }

		  /**
		   * 单条用户信息
		   *
		   * @param line
		   */
		  private void handleLine(Line line) {
					long t1 = System.currentTimeMillis();

        /*String apMac = (String) line.get(LineKeyConstants.apmac);
        String mac = (String) line.get(LineKeyConstants.mac);
        String rssi = (String) line.get(LineKeyConstants.rssi);

        if(ReadRedisConfig.SENSOR_SET.contains(apMac)){
            ReadRedisConfig.addSensorLog(apMac,mac,rssi);
        }*/
					long t11 = System.currentTimeMillis();
					if (t11 - t1 > 100) {
							  logger.info("-------SensorSignalCheck time :" + (t11 - t1));
					}
					//移动mac 校验
					long t2 = System.currentTimeMillis();
					sensorPropFillChanger.change(line); // 传感器属性填充
					long t3 = System.currentTimeMillis();
					if (t3 - t2 > 100) {
							  logger.info("-------sensorPropFillChanger  time :" + (t3 - t2));
					}
					macCompanyChanger.change(line);
					long t4 = System.currentTimeMillis();
					if (t4 - t3 > 100) {
							  logger.info("-------macCompanyChanger time :" + (t4 - t3));
					}

					long t5 = System.currentTimeMillis();
					if (t5 - t4 > 100) {
							  logger.info("-------tagSourceFillChanger time :" + (t5 - t4));
					}
					//如果找到项目
					if (null != line && needChange(line)) {

							  computeProjectData(line);
							  //记录探针成功处理数量，第一个是店铺级别，其它店组的不用计算，如果计算了，这个值会偏大，不合理
							  if (null != line && needChange(line)) {
										String apmac = line.getStringValue(LineKeyConstants.apmac);
										String ts = line.getStringValue(LineKeyConstants.tsreceive);
										KafkaCubeData kafkaCubeData = new KafkaCubeData("counter", new Values(apmac, ts));
										kafkaCubeData.setCubeName("counter");
										outputCollector.emit("bitmap", new Values("bitmap", SerializationUtils.serialize(kafkaCubeData)));
							  }
							  long t6 = System.currentTimeMillis();
							  if (t6 - t5 > 100) {
										logger.info("-------computeLineList time :" + (t6 - t5));
							  }
					}
					if(FrontUtils.checkLineFront(line)) {
							  computeProjectFrontData(line);
					}
					//同步所有mac
//        syncMacCache(line);
		  }

		  private void computeProjectData(Line line) {
					String mac = (String) line.get(LineKeyConstants.mac);

					long t3 = System.currentTimeMillis();
					//黑名单判断
					deviceBlackListFilterChanger.change(line); // 设备黑名单判断
					long t4 = System.currentTimeMillis();
					if (t4 - t3 > 100) {
							  logger.info("-------deviceBlockListFilterChanger time :" + (t4 - t3));
					}
					//营业时间判断
					validTimeFilterChanger.change(line); // 设备出现时间是否为案场营业时间
					long t5 = System.currentTimeMillis();
					if (t5 - t4 > 100) {
							  logger.info("-------validateTimeFilterChanger time :" + (t5 - t4));
					}

					//是否是到访用户
					boolean isVisitorUser = false;

					if (null != line && needChange(line)) {
							  //生成session 数据
							  long begin = System.currentTimeMillis();
							  String tenantId = line.getStringValue(LineKeyConstants.tenantid);
							  int projectId = line.getIntValue(LineKeyConstants.projectid);
							  Long tsrecive = line.getLongValue(LineKeyConstants.tsreceive);
							  int sessionTimeoutSeconds = Integer.parseInt(line.getStringValue(LineKeyConstants.sessionTimeoutSeconds));
							  String session = createOrUpdateSession(tenantId, projectId, mac, tsrecive, sessionTimeoutSeconds);
							  String[] values = session.split("_");
							  line.put(LineKeyConstants.sessionId, values[0]);
							  line.put(LineKeyConstants.sessionDuration, values[1]);
							  long end = System.currentTimeMillis();
							  if (end - begin > 100) {
										logger.info("-------session cache time :" + (end - begin));
							  }

							  //所有CUBE必须满足有效客流
							  //有效客流进行时间限制
							  Integer visitMinutes = line.getIntValue(LineKeyConstants.visitMinutes);
							  Integer projectDuration = line.getIntValue(LineKeyConstants.sessionDuration);

							  //判断是否是到访用户
							  isVisitorUser = (null != visitMinutes && projectDuration != null && projectDuration >= visitMinutes);

							  //判断用户时长是否超过了 过滤时长
							  boolean isFilterDuration = false;
							  int maxDuration = line.getIntValue(LineKeyConstants.maxDuration);
							  isFilterDuration = (0 != maxDuration && projectDuration != 0 && maxDuration <= projectDuration);
							  if (isFilterDuration) {
										//logger.info("-------添加过滤黑名单mac,时长超过了配置时长:过滤时长为：" + maxDuration + " 目前时长：" + projectDuration + " 项目id:" + projectId  + " mac" + mac);
										FilterMacBean bean = new FilterMacBean();
										bean.setFilterType(FilterTypeEnum.DURATION);
										bean.setTenantId(tenantId);
										bean.setProjectId(projectId);
										bean.setMac(mac);
										bean.setCreateTime(DateTimeUtil.formatLongDate(new Date(tsrecive)));
										bean.setFilterReason("停留是过滤，停留时长为:" + projectDuration);
										FilterMacUtils.add(bean);
							  }
					}

					//验证是否满足是否是有效客流
					if (!isVisitorUser && null != line && needChange(line)) {
							  line.discard = true;
							  line.put(LineKeyConstants.discard, Constants.ES_DISCARD_CODE_VISIT_MINUTES_FILTER);
							  DiscardLogger.write(line);
					}

					if (isVisitorUser) {
							  devicePropFillChanger.change(line); //生成项目offset，租户offset
							  //deviceBlackListFilterChanger.change(null);

							  long t6 = System.currentTimeMillis();
							  if (t6 - t5 > 100) {
										logger.info("-------devicePropFillChanger time :" + (t6 - t5));
							  }
							  if (null != line && needChange(line)) {
										//写到Bitmap topic中,店铺项目
										emitCubeData(line);
							  }
					}

		  }
		  /**
		   * 计算店前客流
		   * @param line
		   */
		  private void computeProjectFrontData(Line line) {
					long t3 = System.currentTimeMillis();
					//黑名单判断
					deviceBlackListFilterChanger.change(line); // 设备黑名单判断
					long t4 = System.currentTimeMillis();
					if (t4 - t3 > 100) {
							  logger.info("front-------deviceBlockListFilterChanger time :" + (t4 - t3));
					}
					//营业时间判断
					validTimeFilterChanger.change(line); // 设备出现时间是否为案场营业时间
					long t5 = System.currentTimeMillis();
					if (t5 - t4 > 100) {
							  logger.info("front-------validateTimeFilterChanger time :" + (t5 - t4));
					}

					//伪mac过滤
					fakeMacFilterChanger.change(line);

					devicePropFillChanger.change(line);

					long t6 = System.currentTimeMillis();
					if (t6 - t5 > 100) {
							  logger.info("front-------devicePropFillChanger time :" + (t6 - t5));
					}

//        if(line.discard && Constants.ES_DISCARD_CODE_RSSI_FILTER.equals(line.getStringValue(LineKeyConstants.discard))){
					//记录店前mac的日志数据
					if(FrontUtils.writeFrontLogger(line)){
							  FrontLogger.write(line);
					}

					// 发送店前客流
					if (FrontUtils.checkLineFront(line)) {

							  emitFrontCubeData(line);
					}
		  }

		  private void emitCubeData(Line line) {
					// 将bitmap维度数据,发送到
					Map <String, KafkaCubeData> cubeDataMap = BitmapCubeDataUtils_V2.createBitmapCubeData(line);
					for (Map.Entry <String, KafkaCubeData> entry : cubeDataMap.entrySet()) {
							  String key = entry.getKey();
							  KafkaCubeData cubeData = entry.getValue();
							  Values values = cubeData.getValues();
							  String cubeValue = cubeData.getCubeName();//表名，一定需要这个
							  for (Object v : values) {
										cubeValue += "_" + v;
							  }
							  //检查是否已经存在了，如果已经存在，不进行emit
							  if (cubeCache.get(cubeValue) == null) {
										outputCollector.emit("bitmap", new Values(key, SerializationUtils.serialize(cubeData)));
										Element e = new Element(cubeValue, EXSIT);
										cubeCache.put(e);
							  }
					}
					//记录成功日志
					writeToFile(line);
		  }

		  private void emitFrontCubeData(Line line) {
					// 将bitmap维度数据,发送到
					Map <String, KafkaCubeData> cubeDataMap = BitmapCubeDataUtils_V2.createFrontBitmapCubeData(line);
					for (Map.Entry <String, KafkaCubeData> entry : cubeDataMap.entrySet()) {
							  String key = entry.getKey();
							  KafkaCubeData cubeData = entry.getValue();
							  Values values = cubeData.getValues();
							  String cubeValue = cubeData.getCubeName();//表名，一定需要这个
							  for (Object v : values) {
										cubeValue += "_" + v;
							  }
							  //检查是否已经存在了，如果已经存在，不进行emit
							  if (cubeCache.get(cubeValue) == null) {
										outputCollector.emit("bitmap", new Values(key, SerializationUtils.serialize(cubeData)));
										Element e = new Element(cubeValue, EXSIT);
										cubeCache.put(e);
							  }
					}
		  }

		  /**
		   * 创建项目session
		   * sessionId_minutes
		   *
		   * @param
		   */
		  public String createOrUpdateSession(String tenantId, Integer projectId, String mac, Long tsrecive, int sessionTimeoutSeconds) {
					//更新session 信息
					String projectSessionKey = tenantId + "_" + projectId + "_" + mac;
					String projectSessionValue = getSessionValue(projectSessionKey);
					if (null == projectSessionValue) {
							  projectSessionValue = tsrecive + "_" + tsrecive + "_" + tsrecive;
							  updateSessionValue(projectSessionKey, projectSessionValue);
					} else {//判断session 是否超时
							  long sessionDuration = Math.abs(tsrecive - Long.parseLong(projectSessionValue.split("_")[1]));
							  if (sessionDuration > sessionTimeoutSeconds) {
										projectSessionValue = tsrecive + "_" + tsrecive + "_" + tsrecive;
										updateSessionValue(projectSessionKey, projectSessionValue);
							  } else {
										String[] values = projectSessionValue.split("_");
										//更新lastActiveTime
										projectSessionValue = values[0] + "_" + tsrecive + "_" + values[2];
										updateSessionValue(projectSessionKey, projectSessionValue);
							  }
					}
					String projectValues[] = projectSessionValue.split("_");
					return projectValues[0] + "_" + Math.abs((Long.parseLong(projectValues[1]) - Long.parseLong(projectValues[2])) / MINUTES);
		  }


		  public String getSessionValue(String sessionKey) {
					String value = null;
					Element element = sessionCache.get(sessionKey);
					if (null != element) {
							  value = (String) element.getValue();
					} else {
							  value = RedisClient.get(sessionKey, Constants.BLACK_LIST_MAC_DB_INDEX);
							  if (null != value) {
										//再更新到ehcache中
										Element ele = new Element(sessionKey, value);
										sessionCache.put(ele);
							  }
					}
					return value;
		  }

		  public synchronized void updateSessionValue(String sessionKey, String sessionValue) {
					Element ele = new Element(sessionKey, sessionValue);
					sessionCache.put(ele);
					//RedisClient.put(sessionKey, sessionValue, RedisClient.cacheSessionTimeoutSeconds);
		  }

		  protected boolean needChange(Line line) {
					return Utils.isNotEmpty(line) && !line.getBoolValue("discard") && !line.getBoolValue("fail") && !line.discard; // TODO
					// 增加了这断
		  }

		  protected boolean needSyncMac(Line line) {
					return Utils.isNotEmpty(line)
							&& Utils.isNotEmpty(line.getStringValue(LineKeyConstants.projectid))
							&& Utils.isNotEmpty(line.getStringValue(LineKeyConstants.sensorid))
							&& Utils.isNotEmpty(line.getStringValue(LineKeyConstants.mac));
		  }


		  private String writeToFile(Line line) {
					String info = LineUtils.getLogInfo(line);
					SuccessLogger.write(line);
					return info;
		  }

		  private void syncMacCache(Line line) {
					if (null != line && needSyncMac(line)) {
							  String projectId = line.getStringValue(LineKeyConstants.projectid);
							  String sensorId = line.getStringValue(LineKeyConstants.sensorid);
							  String mac = line.getStringValue(LineKeyConstants.mac);
							  Long tsreceive = line.getLongValue(LineKeyConstants.tsreceive);
							  SimpleDateFormat sdf = new SimpleDateFormat(dayFormat);
							  Date tsreceiveDate = new Date(tsreceive);

							  //保存mac
							  String sensorAllMacDayKey = RedisClient.ALL_SENSOR_PREFIX + projectId + "_" + sensorId + "_" + sdf.format(tsreceiveDate);
							  setSensorAllMacCacheSet(sensorAllMacDayKey, mac);
							  //保存key
							  setSensorAllMacCacheSet(RedisClient.ALL_SENSOR_KEY, sensorAllMacDayKey);
					}
		  }

		  public void setSensorAllMacCacheSet(String key, String value) {
					Element sensorsKeyElement = sensorAllMacCache.get(key);
					if (Utils.isNotEmpty(sensorsKeyElement)) {
							  Set <String> sensorsKeySet = (Set <String>) sensorsKeyElement.getObjectValue();
							  if (Utils.isEmpty(sensorsKeySet)) {
										sensorsKeySet = Collections.synchronizedSet(new HashSet());
							  }
							  sensorsKeySet.add(value);//更新Set
							  Element e = new Element(key, sensorsKeySet);
							  sensorAllMacCache.putWithWriter(e);
					} else {
							  Set <String> sensorsKeySet = Collections.synchronizedSet(new HashSet());
							  sensorsKeySet.add(value);//添加Set
							  Element e = new Element(key, sensorsKeySet);
							  sensorAllMacCache.putWithWriter(e);
					}
		  }
		  public void declareOutputFields(OutputFieldsDeclarer declarer) {
					Fields fields = new Fields(FieldNameBasedTupleToKafkaMapper.BOLT_KEY, FieldNameBasedTupleToKafkaMapper.BOLT_MESSAGE);
					declarer.declareStream("bitmap", fields);
		  }

}
