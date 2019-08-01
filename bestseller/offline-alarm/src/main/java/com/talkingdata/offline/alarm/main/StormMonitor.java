package com.talkingdata.offline.alarm.main;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

import com.talkingdata.offline.alarm.bean.TopologyBean;
import com.talkingdata.offline.alarm.util.JsonUtil;
import com.talkingdata.offline.alarm.util.MailUtil;


public class StormMonitor {
	public static void main(String[] args) throws Exception {
		
		if(args.length<2){
			System.out.println("Usage : Params is wrong!");
			System.exit(-1);
		}
		//storm ui服务地址(192.168.239.181:8080)
		String host = args[0];
		//邮件告警人邮件地址,多个用逗号连接(tao.yang@tendcloud.com,weiguang.liu@tendcloud.com,yunlong.wang@tendcloud.com)
		String recipients = args[1];
		String[] recipientArr = recipients.split(",");

		while (true) {
			String message = "";
			//此URL可以获取storm管理界面所有的Topology信息
			String stormUrl = "http://"+host+"/api/v1/topology/summary";
			String topologUrl = null;
			String stormJson = getHtmlConentByUrl(stormUrl);
			String topologJson = null;
			stormJson = stormJson.substring(14, stormJson.length() - 1);
			System.out.println(stormJson);
			List<TopologyBean> stormList = (List<TopologyBean>) JsonUtil
					.jsonToList(stormJson, TopologyBean.class);
			
			if(stormList.size()<2){
				message +="目前有【"+stormList.size()+"】个Topology在运行;\r\n";
//				MessageSender.mainto("Product Storm Monitor Mail", "目前有【"+stormList.size()+"】个Topology在运行!");
			}
			for (TopologyBean storm : stormList) {
				
				String status = storm.getStatus();
				if(!"ACTIVE".equals(status)){
					
					message +=storm.getName()+"的运行状态是：【"+status+"】;\r\n";
//					MessageSender.mainto("Product Storm Monitor Mail", storm.getName()+"的运行状态是：【"+status+"】");
				}
				//些URL可以获取指定Topology的详细信息
				topologUrl = "http://"+host+"/api/v1/topology/"
						+ storm.getId();
				topologJson = getHtmlConentByUrl(topologUrl);

				topologJson = topologJson.substring(
						topologJson.indexOf("topologyStats") + 15,
						topologJson.indexOf("]",
								topologJson.indexOf("topologyStats")) + 1);
				System.out.println(topologJson);
				List<TopologyBean> topologList = (List<TopologyBean>) JsonUtil
						.jsonToList(topologJson, TopologyBean.class);
				int ack = Integer.valueOf(topologList.get(0).getAcked());
				String failedStr = topologList.get(0).getFailed();
				int failed = 0;
				if(failedStr!=null&&!"".equals(failedStr)){
					failed = Integer.valueOf(failedStr);
				}
				if (ack < 200) {
					message +=storm.getName()+" 10分钟Acked：【"+ack+"】;\r\n";
//					MessageSender.mainto("Product Storm Monitor Mail", storm.getName()+" 10分钟Acked：【"+ack+"】");
				}
				if(failed>0){
					message +=storm.getName()+" 10分钟Failed：【"+failed+"】;\r\n";
//					MessageSender.mainto("Product Storm Monitor Mail", storm.getName()+" 10分钟Failed：【"+failed+"】");
				}

			}
			if(!"".equals(message)&&message!=null&&message.length()>0){
				boolean bl = MailUtil.sendMail("Product Storm Monitor Mail",message,recipientArr);
				if(!bl){
					System.out.println("ERROR : Send mail is wrong !");
				}
			}
			//10分钟循环一次获取storm任务信息
			Thread.sleep(1000*60*10);;
		}
	}
	
	//通过URL得到返回的JSON信息
	public static String getHtmlConentByUrl(String ssourl) {
		try {
			URL url = new URL(ssourl);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();

			con.setInstanceFollowRedirects(false);
			con.setUseCaches(false);
			con.setAllowUserInteraction(false);
			con.connect();
			StringBuffer sb = new StringBuffer();
			String line = "";
			BufferedReader URLinput = new BufferedReader(new InputStreamReader(
					con.getInputStream()));
			while ((line = URLinput.readLine()) != null) {
				sb.append(line);
			}
			con.disconnect();

			return sb.toString();
		} catch (Exception e) {

			return null;
		}
	}
}
