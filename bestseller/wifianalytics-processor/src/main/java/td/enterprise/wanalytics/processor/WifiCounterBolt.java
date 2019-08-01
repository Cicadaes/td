package td.enterprise.wanalytics.processor;

import org.apache.storm.task.OutputCollector;
import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.base.BaseRichBolt;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;
import td.enterprise.wanalytics.processor.utils.JDBC_Counter;
import td.enterprise.wanalytics.processor.utils.KafkaCubeData;
import td.enterprise.wanalytics.processor.utils.SqlMaker;
import td.enterprise.wanalytics.processor.utils.TimeUtil;

import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class WifiCounterBolt extends BaseRichBolt {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	//===========配置======================================
	private static long lasttime = 0L;		//上一次入库时间
	private static int timestmp = 5; 		//5分钟入库一次
	private static int count = 0 ;			//记录的次数
	private static int maxcount =2000;		//最多记录次数
	//TODO--写到配置文件中，从配置文件中读取=========================
	
	private static ConcurrentLinkedQueue<KafkaCubeData> queue = new ConcurrentLinkedQueue<KafkaCubeData>(); // 消息队列
	
	private static ExecutorService threadpool = Executors.newFixedThreadPool(2); //长度为2的线程池，为了保证在处理数据的同时，数据还可以被接收

	@SuppressWarnings("rawtypes")
	Map stormConf;
	TopologyContext context;
	OutputCollector collector;

	@Override
	public void execute(Tuple tuple) {
		collector.ack(tuple);
		KafkaCubeData msg = (KafkaCubeData) tuple.getValueByField("data");
		if (msg!=null) {
			plus();
			queue.add(msg);
			needsave(false);
		}
		return;
	}

	@Override
	public void prepare(@SuppressWarnings("rawtypes") Map stormConf, TopologyContext context, OutputCollector collector) {
		
		this.collector=collector;
		this.context=context;
		this.stormConf=stormConf;
		
		new Thread(new Runnable() {
			public void run() {
				while(true){
					needsave(true);//true 代表检查时间 的逻辑
					try {
						Thread.sleep(30000);//休息30秒再检查
					} catch (InterruptedException e) {
						//睡眠异常，不处理
					}
				}
			}
		}).start();
	}
	
	private static synchronized void needsave(boolean timeup){
		if (timeup) {//时间检查逻辑=========================================================
			long now = System.currentTimeMillis();		//获取当前时间
			if (now-lasttime > timestmp * 60000) {      //如果当前时间和上次入库时间超过设置时间（5分钟）
				if (count!=0) {							//如果条数不为0
					putinmysql(count);					//启动一个线程，把当前拥有的条数写到数据库
					count=0;							//立刻清零
					lasttime=System.currentTimeMillis();//记录最后一次入库时间
				}
			}
		}else{//计数器检查逻辑===============================================================
			if (count>=maxcount) {   					//如果超过了2000条
				putinmysql(count);						//启动一个线程 把这两千条放到数据库
				count=0;								//立刻清零
				lasttime=System.currentTimeMillis();	//记录最后一次入库时间
			}
		}
	}
	
	private static synchronized void plus() {
		count++;  // 多线程操作同一个变量需要做同步。
	}
	
	private static void putinmysql(int counts){
		 threadpool.execute(new Save(counts));//创建下面的runnable并且执行。
	}
	
	public static class Save implements Runnable{
		int x;
		
		public Save(int counts) {
			x=counts;
		}
		
		HashMap<String, Integer> apmacCounter = new HashMap<String,Integer>();
		
		@Override
		public void run() {
			
			for (int i = 0; i < x; i++) {
				KafkaCubeData poll = queue.poll();
				Values values = poll.getValues();
				String apmac = (String)values.get(0);
				String ts =(String) values.get(1);
				long parseLong = Long.parseLong(ts);
				Date date = new Date(parseLong);
				String gethour = TimeUtil.gethour(date);
				String gettime = TimeUtil.gettime(date);
				String key = apmac+","+gettime+","+gethour;
				Integer integer = apmacCounter.get(key);
				if (integer==null) {
					integer=0;
				}
				integer++;
				apmacCounter.put(key, integer);
			}
			
			Iterator<Entry<String, Integer>> iterator = apmacCounter.entrySet().iterator();
			while(iterator.hasNext()){
				Entry<String, Integer> next = iterator.next();
				String key = next.getKey();
				String[] split = key.split(",");
				Integer value = next.getValue();
				String apmac = split[0];
				apmac = apmac.replaceAll(":", "");
				String day = split[1];
				String hour = split[2];
				
				SqlMaker sqlMaker = new SqlMaker();
				sqlMaker.setTablename("offline_sensor_effective_hour_counter");
				sqlMaker.setWherekey(new String[]{"sensor_mac","date","hour"});
				sqlMaker.setWherevalue(new String[]{apmac,day,hour});
				sqlMaker.setCount(value);
				
				JDBC_Counter.savecount(sqlMaker);
			}
		}
	}

	@Override
	public void declareOutputFields(OutputFieldsDeclarer arg0) {
		// TODO Auto-generated method stub
		
	}

}
