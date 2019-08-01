package td.enterprise.wanalytics.changer;

import com.tenddata.bitmap.Bitmap;
import com.tenddata.bitmap.impl.ConciseBitmapImpl;
import org.apache.storm.tuple.Values;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import td.enterprise.dmp.common.ApplicationContextManager;
import td.enterprise.dmp.meta.entity.cube.Cube;
import td.enterprise.dmp.meta.entity.cube.Dimension;
import td.enterprise.dmp.meta.service.cube.CubeService;
import td.enterprise.framework.commons.plugin.line.Line;
import td.enterprise.framework.plugin.changer.atomic.impl.SpringDictDaoChanger;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.processor.utils.BitmapCubeDataUtils;
import td.enterprise.wanalytics.processor.utils.ProcessorConfigs;
import td.olap.bitmap.operation.BitmapOp;
import td.olap.bitmap.operation.Criteria;
import td.olap.bitmap.operation.OpQuery;
import td.olap.bitmap.service.BitmapService;
import td.olap.bitmap.service.ServiceHelper;

import java.util.*;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicLong;

/**
 * bitmap changer
 * 
 * @author yangtao
 */
public class BitmapChanger extends SpringDictDaoChanger {

	private static Logger logger = LoggerFactory.getLogger(BitmapChanger.class);

	/**
	 * 先使用mysql存储bitmap
	 */
	private static BitmapService bitmapService;
	
	/**
	 * bitmap元数据
	 */
	//private static MetaDataService metaDataService = MetaDataService.getMetaDataService();

	private String lock = "lock";

	private Map<String, ConcurrentLinkedQueue<Values>> cubeDataMap;
	private AtomicLong counter = new AtomicLong(0);
	private static int minSubmitInterval = 60;// unit:seconds
	private static int minSubmitSize = 2000;
	private long lastSubmitTime = 0;// unit:seconds

	static {
		Properties configs = ProcessorConfigs.getprocessWiFiConfigProperties();
		minSubmitInterval = Integer.valueOf(configs.getProperty("storm.wifianalytics.bitmap.cube2db.submit.mininterval", "60"));
		minSubmitSize = Integer.valueOf(configs.getProperty("storm.wifianalytics.bitmap.cube2db.submit.minsize", "2000"));
		logger.info("================================================== minSubmitInterval: {} minSubmitSize : {}", minSubmitInterval, minSubmitSize);
	}

	public BitmapChanger() {
		this.cubeDataMap = new ConcurrentHashMap<String, ConcurrentLinkedQueue<Values>>();
		ApplicationContext bitmapApplicationContext = new ClassPathXmlApplicationContext(new String[]{"meta-applicationContext.xml", "computer-applicationContext.xml"});
		ApplicationContextManager.setAppContext(bitmapApplicationContext);
		bitmapService = ServiceHelper.getServiceImpl(1);
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
	 * @see
	 * ETLAtomicChanger#_change(td.framework.
	 * commons.plugin.line.Line)
	 */
	protected Line _change(Line line) {
		if (null != line && needChange(line)) {
			Map<String, Values> cubeData = BitmapCubeDataUtils.createBitmapCubeData(line);
			for (Entry<String, Values> entry : cubeData.entrySet()) {
				String cubeName = entry.getKey();
				if (!this.cubeDataMap.containsKey(cubeName)) {
					this.cubeDataMap.put(cubeName, new ConcurrentLinkedQueue<Values>());
				}
				this.cubeDataMap.get(cubeName).add(entry.getValue());
				long insize = counter.addAndGet(1);
				if (insize >= minSubmitSize) {
					synchronized (lock) {
						submitData();
						counter.set(0);
						lastSubmitTime = System.currentTimeMillis() / 1000;
					}
				}
			}
			// outputCollector.ack(tuple);
		}
		return line;
	}

	private void submitData() {
		Iterator<Entry<String, ConcurrentLinkedQueue<Values>>> it = this.cubeDataMap.entrySet().iterator();
		// TimespendLogger tl = new TimespendLogger(0);
		// tl.logReset("do bitmap data");
		while (it.hasNext()) {
			Entry<String, ConcurrentLinkedQueue<Values>> entry = it.next();
			String cubeName = entry.getKey();
			ConcurrentLinkedQueue<Values> queue = entry.getValue();
			int queueSize = queue.size();
			if (queueSize > 0) {
				List<Values> tuples = new ArrayList<Values>();
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
					logger.error("********************** error {}写数据到DB：{}, tuples size:{}:{}", this.getClass().getSimpleName(), cubeName, tuples.size(), e);
				}
			}
		}
		// tl.logStep("");
	}

	private void doBitmap(String cubeName, final List<Values> valuesList) throws Exception {
		// 获取基本Cube信息
		CubeService cubeService = ApplicationContextManager.getBean(CubeService.class);
		Cube cube = cubeService.getCubeByCubeName(cubeName, Constants.DOMAIN_ID);
		if(null == cube ){
			logger.warn(cubeName + "---------cubeName is not configed.Ignore it.---------");
			return;
		}
		cube = cubeService.buildByCubeName(cubeName, Constants.DOMAIN_ID);
		List<Dimension> dms = cube.getDimensions();
		// 根据Key（相当于表的维度值的集合）聚合数据
		Map<String, List<Integer>> offsetMap = new HashMap<String, List<Integer>>();
		for (Values values : valuesList) {
			// HashMap<String, Object> msg = (HashMap<String, Object>)
			// tuple.getValueByField("data");
			Values cubeData = values;
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
			String[] columnValues = key.split(Constants.TB_KEY_SEPERATER);
			columnValues = Arrays.copyOfRange(columnValues, 1, columnValues.length);
			// 组装新的bitmap
			bitmapNew = new ConciseBitmapImpl();
			for (int i = 0, t = offsets.size(); i < t; i++) {
				bitmapNew.set(offsets.get(i));
			}
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
			Criteria ca = new Criteria("bitmap", cube.getName());
			ca.setCols(cols);
			ca.setVals(vals);
			String params = where.substring(0, where.length() - 5);
			ca.where(params);
			BitmapOp<Criteria> bo = new OpQuery(ca);
			if (bitmapService == null){
				logger.error("bitmapService is null ===================================================================================");
			}
			Bitmap bitmapOld = null;
			if (null != bitmapService)
			bitmapOld = bitmapService.getBitmap(bo);
			if (bitmapOld == null) {
				batch.put(ca, bitmapNew);
			} else {
				batch.put(ca, bitmapNew.or(bitmapOld));
			}
		}
		logger.info("======================" + Thread.currentThread().getName() + " {}写数据到DB成功：batch size is " + batch.size(), cubeName);
		// 批量更新
		if (null != bitmapService)
		bitmapService.batchSave("bitmap", batch);
	}

}
