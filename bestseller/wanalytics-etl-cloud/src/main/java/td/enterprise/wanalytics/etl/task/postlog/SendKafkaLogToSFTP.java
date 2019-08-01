package td.enterprise.wanalytics.etl.task.postlog;

import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSchException;
import net.sf.json.JSONObject;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.bean.ReceiveConfig;
import td.enterprise.wanalytics.etl.task.postlog.bean.BaseReceiveConfigTask;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.ReceiveConfigUtil;
import td.enterprise.wanalytics.etl.util.SFTPUntil;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SendKafkaLogToSFTP extends BaseReceiveConfigTask {
	
	private static final Logger logger = Logger.getLogger(SendKafkaLogToSFTP.class);

	private static SFTPUntil channel;
	private static ChannelSftp chSftp;
	
	private static String localTmpName;//本地临时文件名
	private static String sftpName;//sftp文件名
	
	public static boolean execute(ReceiveConfig tenantConfig, List<String> logsList) {
		boolean succ = true;
		if(logsList!=null && logsList.size()>0){
			String uniqueId = tenantConfig.getUniqueId()==null?"":tenantConfig.getUniqueId();
			Date date=new Date();
			SimpleDateFormat monthFormater = new SimpleDateFormat("yyyy-MM");
			String month = monthFormater.format(date);
			SimpleDateFormat hourFormater = new SimpleDateFormat("yyyy-MM-dd-HH");
			String datehour = hourFormater.format(date);
			long timestamp = System.currentTimeMillis();
			String fileName =  uniqueId + "/unsent/" + month + "/" + datehour + "-" + timestamp + ".log";
			
			localTmpName = ReceiveConfigUtil.getValue("tenant.loacl.log.root.tmp.path")+ fileName;
			sftpName = ReceiveConfigUtil.getValue("tenant.sftp.log.root.path") + fileName;
			
			logger.info(uniqueId + ":------------------sftpName=" +sftpName);
			
			boolean flag1 = string2File(logsList);
			if(!flag1){
				succ = false;
			}
			boolean flag2 = login2SFTP(tenantConfig);
			if(!flag2){
				succ = false;
			}
			boolean flag3 = file2SFTP();
			if(!flag3){
				succ = false;
			}
			
			logger.info(sftpName + " ： end....");
		}else{
			logger.error("logsList------------------logsList.size()=0!!!");
			//可加报警
			succ = false;
		}
		
		return succ;
	}

	public static boolean string2File(List<String> logsList) {
		// logsList转str(与post格式一致)
		JSONObject jsonObj = new JSONObject();
		jsonObj.put(VERSION_KEY, VERSION_VALUE);
		jsonObj.put(DATATYPE_KEY, DATATYPE_VALUE);
		jsonObj.put(REQENTITY_LOG_KEY, logsList);
		String res = jsonObj.toString();

		BufferedReader bufferedReader = null;
		BufferedWriter bufferedWriter = null;
		FileWriter fileWriter = null;
		boolean flag = true;
		try {
			File distFile = new File(localTmpName);
			
			if (!distFile.getParentFile().exists())
				distFile.getParentFile().mkdirs();
			bufferedReader = new BufferedReader(new StringReader(res));
			fileWriter = new FileWriter(distFile);
			bufferedWriter = new BufferedWriter(fileWriter);
			
			char buf[] = new char[1024 * 1024]; //字符缓冲区
			int len;
			while ((len = bufferedReader.read(buf)) != -1) {
				bufferedWriter.write(buf, 0, len);
			}
			
		} catch (IOException e) {
			logger.error("IOException:"+e.getMessage());
			flag = false;
		} finally {
			if (bufferedWriter != null) {
				try {
					bufferedWriter.flush();
					bufferedWriter.close();
				} catch (IOException e) {
					flag = false;
				}
			}

			if (fileWriter != null) {
				try {
					fileWriter.close();
				} catch (IOException e) {
					flag = false;
				}
			}

			if (bufferedReader != null) {
				try {
					bufferedReader.close();
				} catch (IOException e) {
					flag = false;
				}
			}

		}
		return flag;
	}
	
	private static boolean login2SFTP(ReceiveConfig tenantConfig){
		
		Map<String, String> sftpDetails = new HashMap<String, String>();
		// 设置主机ip，端口，用户名，密码
		String uniqueId = tenantConfig.getUniqueId()==null?"":tenantConfig.getUniqueId();
		String sftpPwd = tenantConfig.getSftpPwd()==null?"":tenantConfig.getSftpPwd();
		
		//test data
//		uniqueId = (String) receiveConfig.get("sftp.req.username");
//		sftpPwd = (String) receiveConfig.get("sftp.req.password");
		
		sftpDetails.put(SFTPUntil.SFTP_REQ_HOST, ReceiveConfigUtil.getValue("sftp.req.host"));
		sftpDetails.put(SFTPUntil.SFTP_REQ_PORT, ReceiveConfigUtil.getValue("sftp.req.port"));
		sftpDetails.put(SFTPUntil.SFTP_REQ_USERNAME, uniqueId);
		sftpDetails.put(SFTPUntil.SFTP_REQ_PASSWORD, sftpPwd);

		channel = new SFTPUntil();
		boolean flag = true;
		try {
			chSftp = channel.getChannel(sftpDetails, 600000);
		} catch (JSchException e) {
			logger.error("channel.getChannel:"+e.getMessage());
			flag = false;
		}
		return flag;
	}
	
	public static boolean file2SFTP() {
		boolean flag = true;
		//直接传测试时会丢失数据！
//		JSONObject jsonObj = new JSONObject();
//		jsonObj.put(VERSION_KEY, VERSION_VALUE);
//		jsonObj.put(DATATYPE_KEY, DATATYPE_VALUE);
//		jsonObj.put(REQENTITY_LOG_KEY, logsList);
//		InputStream res = null;
//		try {
//			res = new ByteArrayInputStream(jsonObj.toString().getBytes("UTF-8"));
//		} catch (UnsupportedEncodingException e1) {
//			e1.printStackTrace();
//		}
//		
//		OutputStream out = null;
//		InputStreamReader  bufferedReader = null;
//
//		try {
//			channel.openAndMakeDir(sftpPath, chSftp);
//			out = chSftp.put(sftpName, ChannelSftp.OVERWRITE);// 使用OVERWRITE模式
//			
//			char[] buff = new char[1024 * 1024]; //缓冲区
//			int read;
//			if (out != null) {
//				bufferedReader = new InputStreamReader(res,"UTF-8");
//				do {
//					read = bufferedReader.read(buff);
//					if (read > 0) {
//						byte[] byteData = getBytes(buff);
//						out.write(byteData, 0, read);
//					}
//					out.flush();
//				} while (read >= 0);
//			}
//		
//			chSftp.quit();
//			channel.closeChannel();
//		} catch (Exception e) {
//			logger.error("Exception----"+e.getMessage());
//		}
		
		//从本地临时文件中传入
		try {
			//创建并进入sftp目录
			channel.openAndMakeDir(sftpName, chSftp);
			//将本地文件输入流上传到sftp
			chSftp.put(new FileInputStream(localTmpName), sftpName, ChannelSftp.OVERWRITE);
			//删除本地临时文件
			FileUtil.delete(localTmpName);
		} catch (Exception e) {
			logger.error("channel----"+e.getMessage());
			flag = false;
		}
		return flag;
	}

	@SuppressWarnings("unused")
	private static byte[] getBytes(char[] chars) {
		Charset cs = Charset.forName("UTF-8");
		CharBuffer cb = CharBuffer.allocate(chars.length);
		cb.put(chars);
		cb.flip();
		ByteBuffer bb = cs.encode(cb);

		return bb.array();
	}

	public static void main(String[] args) {
//		logsList = new ArrayList<String>();
//		logsList.add("111");
//		logsList.add("你好");
//		logsList.add("test");
//		logsList.add("20161012,1.0,002,1.1,1479687291555,001bc509a00e,70,1479687289674,80;81;82;83;84;85;86;87;88,24696864223c,,,,,,,,,,,,,,,,%5B%7B%22fragtype%22%3A%22PROBRP%22%2C%22dstmac%22%3A%222082c0aea97e%22%2C%22ssid%22%3A%22TP-LINK_223C%22%2C%22channel%22%3A%2211%22%7D%2C%7B%22fragtype%22%3A%22PROBRP%22%2C%22dstmac%22%3A%22b05b6774db88%22%2C%22ssid%22%3A%22TP-LINK_223C%22%2C%22channel%22%3A%2211%22%7D%2C%7B%22fragtype%22%3A%22PROBRP%22%2C%22dstmac%22%3A%22f4e3fb585774%22%2C%22ssid%22%3A%22TP-LINK_223C%22%2C%22channel%22%3A%2211%22%7D%2C%7B%22fragtype%22%3A%22BEACON%22%2C%22dstmac%22%3A%22ffffffffffff%22%2C%22ssid%22%3A%22TP-LINK_223C%22%2C%22channel%22%3A%2211%22%7D%5D,,,,4,777973,3,00:00,24:00,深圳广联测试探针,,,深圳市,,,,,,,,,");
//				
//		long secs = System.currentTimeMillis();
//		uniqueId = "testTenantId";
//		fileName = "testTenantId/unsent/20161121" +"/log-11-21-18-"+secs + ".log";
//		
//		execute();
	}

}
