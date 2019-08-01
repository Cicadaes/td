package com.talkingdata.analytics.wifi.collector.counter;

import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ApmacHeartCounter {

	private ApmacHeartCounter(){};	//私有化构造函数，不能new
	
	private static ExecutorService threadpool = Executors.newFixedThreadPool(1); //长度为1的线程池，为了保证在处理数据的同时，数据还可以被接收
	
	private static ConcurrentLinkedQueue<String> queue = new ConcurrentLinkedQueue<String>(); // 消息队列
	
	private static long lasttime = 0L;		//上一次入库时间
	private static int timestmp = 2; 		//2分钟入库一次
	private static int count = 0 ;			//记录的次数
	
	static{ //加载类的时候 初始化 执行一次，创建一个监控时间的线程
		new Thread(new Runnable() {
			public void run() {
				while(true){
					needsave();//true 代表检查时间 的逻辑
					try {
						Thread.sleep(30000);//休息30秒再检查
					} catch (InterruptedException e) {
						//睡眠异常，不处理
					}
				}
			}
		}).start();
	}
	
	public static void collector(String apmac){
		queue.add(apmac);   //接收数据添加到队列中（线程安全的）
		plus();																   //计数器加一（线程安全的）
	}
	
	private static synchronized void needsave(){
		long now = System.currentTimeMillis();		//获取当前时间
		if (now-lasttime > timestmp * 60000) {      //如果当前时间和上次入库时间超过设置时间（5分钟）
			if (count!=0) {							//如果条数不为0
				putinmysql(count);					//启动一个线程，把当前拥有的条数写到数据库
				count=0;							//立刻清零
				lasttime=System.currentTimeMillis();//记录最后一次入库时间
			}
		}else{
			if (count>2000) {
				putinmysql(count);					//启动一个线程，把当前拥有的条数写到数据库
				count=0;							//立刻清零
				lasttime=System.currentTimeMillis();//记录最后一次入库时间
			}
		}
	}
	
	private static void putinmysql(int counts){
		threadpool.execute(new Save(counts));//创建下面的runnable并且执行。
	}
	
	
	public static class Save implements Runnable{
		int x;
		
		HashMap<String, Integer> hashMap = new HashMap<String,Integer>();
		public Save(int counts) {
			x=counts;
		}
		@Override
		public void run() {
			 for (int i = 0; i < x; i++) {
				String mac = queue.poll();
				String[] split = mac.split(",");
				String ts = split[2];
				long parseLong = Long.parseLong(ts);
				Date date = new Date(parseLong);
				String day = TimeUtil.gettime(date);
				String gethour = TimeUtil.gethour(date);
				String key = split[0]+","+day+","+gethour;
				Integer integer = hashMap.get(key);
				if (integer==null) {
					integer=0;
				}
				integer+=Integer.parseInt(split[1]);
				hashMap.put(key, integer);
				
			 }
			 
			 Iterator<Entry<String, Integer>> iterator = hashMap.entrySet().iterator();
			 while(iterator.hasNext()){
				 Entry<String, Integer> next = iterator.next();
				 String key = next.getKey();
				 Integer value = next.getValue();
				 JDBC_Counter.savecount(key,value);
			 }
		}
	}
	
	private static synchronized void plus() {
		count++;  // 多线程操作同一个变量需要做同步。
	}
	
}
