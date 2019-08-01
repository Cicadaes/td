package com.talkingdata.offline.alarm.util;

import java.io.IOException;

import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;

public class ZookeeperUtil {
	
	// 会话超时时间，设置为与系统默认时间一致
		private static final int SESSION_TIMEOUT = 30000;
		// 创建 ZooKeeper 实例
		ZooKeeper zk;
		// 创建 Watcher 实例
		Watcher wh = new Watcher() {
			public void process(org.apache.zookeeper.WatchedEvent event)
			{
				
			}
		};

		// 初始化 ZooKeeper 实例
		public void createZKInstance(String zkHost) throws IOException
		{
			zk = new ZooKeeper(zkHost, ZookeeperUtil.SESSION_TIMEOUT, this.wh);
		}
		
		public String getZK(String path){
			try {
				return zk.getData("/wifianalytics/kafkaoffsets/wifi.room.collector.test/partition_0", false, null).toString();
			
			} catch (KeeperException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return null;
		}
		
		public void ZKClose() throws InterruptedException
		{
			zk.close();
		}

}
