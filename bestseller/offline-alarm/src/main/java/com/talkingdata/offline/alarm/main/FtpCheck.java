package com.talkingdata.offline.alarm.main;

import java.io.File;
import java.util.Date;

import org.apache.commons.net.ftp.FTPClient;

import td.enterprise.dmp.common.util.DateUtil;

import com.talkingdata.offline.alarm.util.FtpUtils;
import com.talkingdata.offline.alarm.util.MailUtil;

/**
 * FTP告警发送邮件任务<br>
 * 
 * @Author liyinglei
 * @Create 2017-11-17 12:31:29
 */
public class FtpCheck {
	
	private static final String FTP_PATTERN = "yyyyMMdd";
	
	private static final String FTP_PATTERN_HOUR = "yyyyMMddHH";
	
	private static String FTP_REMOTE_PATH = "/bestseller/"; // FTP远程目录
	
	private static String LOCAL_PATH; // 本地获取FTP文件目录
	
	private static String RECIPIENTS; // 接收告警邮箱
	
	private static final String ftpAddress = "h3crd-wlan1.chinacloudapp.cn";
	
	private static final String ftpPort = "21";
	
	private static final String ftpUserName = "bestseller";
	
	private static final String ftpPassword = "bestsellersecurity";
	
	private static final String subject = "【DMP-FTP告警提醒】";
	
	public static void main(String[] args) {
		if(args.length < 2) {
			System.out.println("Usage : Params is wrong!");
			System.exit(-1);
		}
		LOCAL_PATH = args[0];
		RECIPIENTS = args[1];
//		LOCAL_PATH = "/attachment/wifianalytics/bestseller/";
//		RECIPIENTS = "yinglei.li@tendcloud.com";
		execFixedTask();
	}
	
    public static void execFixedTask() {
    	
    	String[] recipientArr = RECIPIENTS.split(",");
    	
        System.out.println("alarm task start...");
        
        String fileDirectory = DateUtil.format(new Date(),FTP_PATTERN) + "/" + DateUtil.format(new Date(),FTP_PATTERN_HOUR) + "/";
        
        String ftpRemotePath = FTP_REMOTE_PATH + fileDirectory;
        
        String localPath = LOCAL_PATH + fileDirectory;
        
        FTPClient ftpClient = null;
        
        boolean ftpFlag = false;
        
        try {
			System.out.println("WorkingDirectory:"+ftpRemotePath);

			ftpClient = FtpUtils.getFTPClient(ftpAddress, ftpPort, ftpUserName, ftpPassword);
			
			if (ftpClient != null) {
				boolean changeFlag = ftpClient.changeWorkingDirectory(ftpRemotePath);
	            ftpClient.enterLocalPassiveMode();
	            String[] fileNames = ftpClient.listNames();

	            System.out.println("changeWorkingDirectory:"+changeFlag+",allFileNum:"+fileNames.length);

	            if (fileNames.length <= 1) {
	                System.out.println("remotePath:"+ftpRemotePath+" is null");
	                String context = "FTP远程目录【"+ftpRemotePath+"】延迟更新数据，请及时处理！";
	                System.out.println("send alarm mail:"+subject+" to:"+context+ "\t" + RECIPIENTS);
	                MailUtil.sendMail(subject, context, recipientArr);
	                ftpFlag = true;
	            }
			} else {
				System.out.println("无法连接FTP服务器");
                String context = "无法连接FTP服务器，请及时处理！";
                System.out.println("send alarm mail:"+subject+" to:"+context+ "\t" + RECIPIENTS);
                MailUtil.sendMail(subject, context, recipientArr);
                ftpFlag = true;
			}
			
			// 本地文件路径判断：
			if (!ftpFlag) {
				File file = new File(localPath);
				String context = "本地目录【"+localPath+"】延迟获取FTP数据，请及时处理！";
				if (file == null || !file.exists()) {
					System.out.println("send alarm mail:"+subject+" to:"+context+ "\t" + RECIPIENTS);
					System.out.println("本地文件夹"+localPath+"不存在");
					MailUtil.sendMail(subject, context, recipientArr);
				} else if (file.exists() && file.isDirectory()) {
					if (file.listFiles().length < 1) {
						System.out.println("send alarm mail:"+subject+" to:"+context+ "\t" + RECIPIENTS);
						System.out.println("本地目录【"+localPath+"】延迟获取FTP数据，请及时处理！");
						MailUtil.sendMail(subject, context, recipientArr);
					}
				}
			}
            
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
            try {
            	if (ftpClient != null && ftpClient.isConnected()) {
            		ftpClient.disconnect();
            	}
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
