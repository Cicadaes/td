package td.enterprise.wanalytics.etl.util;

import com.jcraft.jsch.*;
import org.apache.commons.lang.ArrayUtils;
import org.apache.log4j.Logger;

import java.util.Map;
import java.util.Properties;

public class SFTPUntil {

	public static final String SFTP_REQ_HOST = "host";
	public static final String SFTP_REQ_PORT = "port";
	public static final String SFTP_REQ_USERNAME = "username";
	public static final String SFTP_REQ_PASSWORD = "password";
	public static final int SFTP_DEFAULT_PORT = 22;
	public static final String SFTP_REQ_LOC = "location";

	Session session = null;
	Channel channel = null;

	private static final Logger LOG = Logger.getLogger(SFTPUntil.class.getName());

	public ChannelSftp getChannel(Map<String, String> sftpDetails, int timeout) throws JSchException {

		String ftpHost = sftpDetails.get(SFTPUntil.SFTP_REQ_HOST);
		String port = sftpDetails.get(SFTPUntil.SFTP_REQ_PORT);
		String ftpUserName = sftpDetails.get(SFTPUntil.SFTP_REQ_USERNAME);
		String ftpPassword = sftpDetails.get(SFTPUntil.SFTP_REQ_PASSWORD);

		int ftpPort = SFTPUntil.SFTP_DEFAULT_PORT;
		if (port != null && !port.equals("")) {
			ftpPort = Integer.valueOf(port);
		}

		JSch jsch = new JSch(); // 创建JSch对象
		session = jsch.getSession(ftpUserName, ftpHost, ftpPort); // 根据用户名，主机ip，端口获取一个Session对象
		LOG.debug("Session created.");
		if (ftpPassword != null) {
			session.setPassword(ftpPassword); // 设置密码
		}
		Properties config = new Properties();
		config.put("StrictHostKeyChecking", "no");
		session.setConfig(config); // 为Session对象设置properties
		session.setTimeout(timeout); // 设置timeout时间
		session.connect(); // 通过Session建立链接
		LOG.debug("Session connected.");

		LOG.debug("Opening Channel.");
		channel = session.openChannel("sftp"); // 打开SFTP通道
		channel.connect(); // 建立SFTP通道的连接
		LOG.debug("Connected successfully to ftpHost = " + ftpHost + ",as ftpUserName = " + ftpUserName + ", returning: " + channel);
		return (ChannelSftp) channel;
	}

	public void closeChannel() throws Exception {
		if (channel != null) {
			channel.disconnect();
		}
		if (session != null) {
			session.disconnect();
		}
	}

	/**
	 * 创建一个文件目录
	 */
	public void createDir(String createpath, ChannelSftp sftp) {
		try {
			if (isDirExist(createpath,sftp)) {
				sftp.cd(createpath);
			}
			String pathArry[] = createpath.split("/");
			StringBuffer filePath = new StringBuffer("/");
			for (String path : pathArry) {
				if (path.equals("")) {
					continue;
				}
				filePath.append(path + "/");
				if (isDirExist(filePath.toString(),sftp)) {
					sftp.cd(filePath.toString());
				} else {
					// 建立目录
					sftp.mkdir(filePath.toString());
					// 进入并设置为当前目录
					sftp.cd(filePath.toString());
				}
			}
			sftp.cd(createpath);
		} catch (Exception e) {
			try {
				throw new Exception("创建路径错误：" + createpath);
			} catch (Exception e1) {
				e1.printStackTrace();
			}
		}
	}

	public boolean isDirExist(String directory, ChannelSftp sftp) {
		boolean isDirExistFlag = false;
		try {
			SftpATTRS sftpATTRS = sftp.lstat(directory);
			isDirExistFlag = true;
			return sftpATTRS.isDir();
		} catch (Exception e) {
			if (e.getMessage().toLowerCase().equals("no such file")) {
				isDirExistFlag = false;
			}
		}
		return isDirExistFlag;
	}
	
    public boolean openAndMakeDir(String directory, ChannelSftp sftp) {
        try {
            String now = sftp.pwd();
            if (now.equals(directory)) {
                return true;
            }
            else {
                try {
                    sftp.cd(directory);
                    return true;
                }
                catch (SftpException e) {
                    if (directory.startsWith(now)) {
                        directory = directory.replaceFirst(now, "");
                    }
                    String[] dirList = directory.split("/");
                    dirList = (String[]) ArrayUtils.removeElement(dirList, "");
                    for (int i=0; i<(dirList.length-1); i++) {//传入名称，最后的名称不要mkdir
                        try {
                            sftp.cd(dirList[i]);
                        } catch (SftpException e1) {
                            sftp.mkdir(dirList[i]);
                            sftp.cd(dirList[i]);
                        } 
                    }
                    return true;
                }
            }
        }
        catch (SftpException e) {
        	LOG.error("openDir Exception : " + directory, e);
            return false;
        }
    }
    
	/**
	* 删除文件
	*
	* @param directory
	*            要删除文件所在目录
	* @param deleteFile
	*            要删除的文件
	*           
	* @throws Exception     
	*/
	public void delete(String directory, String deleteFile, ChannelSftp sftp) throws Exception {
		sftp.cd(directory);
		LOG.debug("cd-------" + directory);
//		sftp.rmdir(deleteFile);
		sftp.rmdir(directory);
		LOG.debug("delete-------" + directory + "-------" + deleteFile);
	} 
}