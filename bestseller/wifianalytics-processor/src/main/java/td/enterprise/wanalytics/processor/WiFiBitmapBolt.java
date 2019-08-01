package td.enterprise.wanalytics.processor;

import com.tenddata.bitmap.Bitmap;
import com.tenddata.bitmap.impl.ConciseBitmapImpl;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

import org.apache.storm.task.OutputCollector;
import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseRichBolt;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import td.enterprise.dmp.common.ApplicationContextManager;
import td.enterprise.dmp.meta.entity.cube.Cube;
import td.enterprise.dmp.meta.entity.cube.Dimension;
import td.enterprise.dmp.meta.service.cube.CubeService;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.processor.cache.CacheFactory;
import td.enterprise.wanalytics.processor.utils.KafkaCubeData;
import td.enterprise.wanalytics.processor.utils.ProcessorConfigs;
import td.enterprise.wanalytics.processor.utils.Utils;
import td.olap.bitmap.operation.BitmapOp;
import td.olap.bitmap.operation.Criteria;
import td.olap.bitmap.operation.OpQuery;
import td.olap.bitmap.service.BitmapService;
import td.olap.bitmap.service.ServiceHelper;
import it.uniroma3.mat.extendedset.rev157.intset.ConciseSet;

import java.util.*;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicLong;
/**
 * 写到Kafka中时,使用cubeName+维度做为bolt的fieldGroup
 * 
 * @author yangtao
 */
public class WiFiBitmapBolt extends BaseRichBolt {

	/**
	 * 序列化ID
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 日志
	 */
	private static Logger logger = LoggerFactory.getLogger(WiFiBitmapBolt.class);

	/**
	 * 先使用mysql存储bitmap
	 */
	private static BitmapService bitmapService;

	private OutputCollector outputCollector;

	private String lock = "lock";

	private Map<String, ConcurrentLinkedQueue<Tuple>> cubeDataMap;

	//缓存Cube 配置
	private static Cache CUBE_CACHE = CacheFactory.getCubeCache();
	
	//MetaCache缓存 
	private static Cache META_CACHE = CacheFactory.getMetaCache();

	private AtomicLong counter = new AtomicLong(0);

	private static int minSubmitInterval = 60;// unit:seconds

	private static int minSubmitSize = 2000;

	private long lastSubmitTime = 0;// unit:seconds

	static {

		Properties configs = ProcessorConfigs.getprocessWiFiConfigProperties();
		minSubmitInterval = Integer.valueOf(configs.getProperty("storm.wifianalytics.bitmap.cube2db.submit.mininterval", "60"));
		minSubmitSize = Integer.valueOf(configs.getProperty("storm.wifianalytics.bitmap.cube2db.submit.minsize", "2000"));
		logger.info("================================================== minSubmitInterval: {} minSubmitSize : {}", minSubmitInterval, minSubmitSize);
		
		ApplicationContext bitmapApplicationContext = new ClassPathXmlApplicationContext(new String[] { "meta-applicationContext.xml",
        "computer-applicationContext.xml" });
        ApplicationContextManager.setAppContext(bitmapApplicationContext);
        bitmapService = ServiceHelper.getServiceImpl(1);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see backtype.storm.task.IBolt#prepare(java.util.Map,
	 * backtype.storm.task.TopologyContext, backtype.storm.task.OutputCollector)
	 */
	public void prepare(@SuppressWarnings("rawtypes") Map stormConf, TopologyContext context, OutputCollector outputCollector) {
		this.outputCollector = outputCollector;
		this.cubeDataMap = new ConcurrentHashMap<String, ConcurrentLinkedQueue<Tuple>>();

		/*ApplicationContext bitmapApplicationContext = new ClassPathXmlApplicationContext(new String[] { "meta-applicationContext.xml",
				"computer-applicationContext.xml" });
		ApplicationContextManager.setAppContext(bitmapApplicationContext);
		bitmapService = ServiceHelper.getServiceImpl(1);*/
		
		// Check and write to db.
		new Thread(new Runnable() {
			public void run() {
				while (true) {
					try {
						if ((System.currentTimeMillis() / 1000 - lastSubmitTime) >= minSubmitInterval) {
							synchronized (lock) {
								long currTime = System.currentTimeMillis() / 1000;
								if ((currTime - lastSubmitTime) >= minSubmitInterval) {// 再判断一次
									submitData();
								}
								lastSubmitTime = currTime;
							}
						}
					} catch (Exception e) {
						logger.warn("============ error:" + e.getMessage(), e);
					}
					try {
						Thread.sleep(1000l);
					} catch (InterruptedException e) {
						// do nothing
					}
				}
			}
		}).start();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see backtype.storm.task.IBolt#execute(backtype.storm.tuple.Tuple)
	 */
	public void execute(Tuple tuple) {
		try {
			String cubeName = tuple.getStringByField("cubeName");
			if (!this.cubeDataMap.containsKey(cubeName)) {
				this.cubeDataMap.put(cubeName, new ConcurrentLinkedQueue<Tuple>());
			}
			this.cubeDataMap.get(cubeName).add(tuple);
			long insize = counter.addAndGet(1);
			if (insize >= minSubmitSize) {
				synchronized (lock) {
					submitData();
					counter.set(0);
					lastSubmitTime = System.currentTimeMillis() / 1000;
				}
			}
			outputCollector.ack(tuple);
		} catch (Exception e) {
			logger.error("====== 获取（或处理）Cube 数据错误：" + e.getMessage(), e);
			outputCollector.fail(tuple);
		}
	}

	private void submitData() {
		Iterator<Entry<String, ConcurrentLinkedQueue<Tuple>>> it = this.cubeDataMap.entrySet().iterator();
		while (it.hasNext()) {
			Entry<String, ConcurrentLinkedQueue<Tuple>> entry = it.next();
			String cubeName = entry.getKey();
			ConcurrentLinkedQueue<Tuple> queue = entry.getValue();
			int queueSize = queue.size();
			if (queueSize > 0) {
				List<Tuple> tuples = new ArrayList<Tuple>();
				for (int c = 0; c < queueSize; c++) {
					tuples.add(queue.poll());
				}
				try {
					long start = System.currentTimeMillis();
					doBitmap(cubeName, tuples);
					logger.info("======================" + Thread.currentThread().getName() + " {}写数据到DB成功：{},size:{},spend time:{}", this.getClass()
							.getSimpleName(), cubeName, tuples.size(), System.currentTimeMillis() - start);
				} catch (Exception e) {
					logger.error("********************** error ", e);
					logger.error("********************** error {}写数据到DB：{}, tuples size:{}:{}", this.getClass().getSimpleName(), cubeName,
							tuples.size(), e);
				}
			}
		}
		// tl.logStep("");
	}

	private   void doBitmap(String cubeName, final List<Tuple> tuples) throws Exception {
		Element element  = META_CACHE.get(cubeName);
		Cube cube = null;
		try{
			if (Utils.isEmpty(element)) {
				// 获取基本Cube信息
				CubeService cubeService = ApplicationContextManager.getBean(CubeService.class);
//			cube = cubeService.getCubeByCubeName(cubeName, Constants.DOMAIN_ID);
				cube = cubeService.buildByCubeName(cubeName, Constants.DOMAIN_ID);
				element = new Element(cubeName, cube);
				META_CACHE.put(element);
			}else {
				cube = (Cube)element.getObjectValue();
			}
		}catch (Exception e){
			logger.error("查询Cube异常" +  cubeName,e);
		}


		if (null == cube) {
			logger.warn(cubeName + "---------cubeName is not configed.Ignore it.---------");
			return;
		}

		List<Dimension> dms = cube.getDimensions();
		// 根据Key（相当于表的维度值的集合）聚合数据
		Map<String, List<Integer>> offsetMap = new HashMap<String, List<Integer>>();
		for (Tuple tuple : tuples) {
			KafkaCubeData msg = (KafkaCubeData) tuple.getValueByField("data");
			Values cubeData = (Values) msg.getValues();

			StringBuffer keyBuffer = new StringBuffer();
			int offset = -1;
			for (int i = 0, n = cubeData.size(); i < n; i++) {
				if (i != n - 1) {
					keyBuffer.append(Constants.TB_KEY_SEPERATER).append(cubeData.get(i));
				} else {
					offset = Integer.valueOf(cubeData.get(i).toString());
				}
			}
			if (offsetMap.get(keyBuffer.toString()) != null) {
				offsetMap.get(keyBuffer.toString()).add(offset);
			} else {
				List<Integer> offsets = new ArrayList<Integer>();
				offsets.add(offset);
				offsetMap.put(keyBuffer.toString(), offsets);
			}
		}
		// 准备批量插入数据
		Map<Criteria, Bitmap> batch = new HashMap<Criteria, Bitmap>();
		Iterator<Entry<String, List<Integer>>> it = offsetMap.entrySet().iterator();
		Bitmap bitmapNew = null;
		while (it.hasNext()) {
			Entry<String, List<Integer>> entry = it.next();
			String key = entry.getKey();
			List<Integer> offsets = entry.getValue();
			// 对offsetMap的List排序（升序）
			Collections.sort(offsets);
			String[] columnValues = key.split(Constants.TB_KEY_SEPERATER);
			columnValues = Arrays.copyOfRange(columnValues, 1, columnValues.length);
			// 组装新的bitmap
//			bitmapNew = new ConciseBitmapImpl();
//			for (int i = 0, t = offsets.size(); i < t; i++) {
//				bitmapNew.set(offsets.get(i));
//			}
			// 组装新的bitmap：一次放入集合
			bitmapNew = new ConciseBitmapImpl(new ConciseSet ().convert(offsets));
			// 查询原有Bitmap，与新的合并
			List<String> cols = new ArrayList<String>();
			StringBuffer where = new StringBuffer();
			Map<String, Object> vals = new HashMap<String, Object>();
			for (int i = 0, t = dms.size(); i < t; i++) {
				Dimension d = dms.get(i);
				cols.add(d.getColumn().getName());
				vals.put(d.getColumn().getName(), columnValues[i]);
				where.append(String.format(" %s = '%s'", d.getColumn().getName(), columnValues[i]));
				where.append(" and ");
			}
			Criteria ca = new Criteria("", cube.getName());
			ca.setCols(cols);
			ca.setVals(vals);
			String params = where.substring(0, where.length() - 5);
			ca.where(params);
//			logger.info("============= where {} cubeName {}", where, cube.getName());
			BitmapOp<Criteria> bo = new OpQuery(ca);
			Bitmap bitmapOld = bitmapService.getBitmap(bo);
			if (bitmapOld == null) {
				batch.put(ca, bitmapNew);
			} else {
				batch.put(ca, bitmapNew.or(bitmapOld));
			}
		}
		logger.info("======================" + Thread.currentThread().getName() + " {}写数据到DB成功：batch size is " + batch.size(), cubeName);
		// 批量更新
		bitmapService.batchSave("", batch);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * backtype.storm.topology.IComponent#declareOutputFields(backtype.storm
	 * .topology.OutputFieldsDeclarer)
	 */
	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		// do nothing
	}
}
