package td.enterprise.wanalytics.etl.common.async;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;

import java.io.*;

public abstract class FtpBaseTask implements AsyncTaskInterface{

	public static Logger logger = Logger.getLogger(FtpBaseTask.class);

	private String ip = null;
	private String username = null;
	private String password = null;
	private int port = -1;

	protected FTPClient ftpClient = null;


	public FtpBaseTask() {
		setup();
	}

	private void setup() {
		ip =  HttpUtil.getParamFromConfigServer(WifipixTaskConstant.TDID_FTP_IP);
		username = HttpUtil.getParamFromConfigServer(WifipixTaskConstant.TDID_FTP_USERNAME);
		password = HttpUtil.getParamFromConfigServer(WifipixTaskConstant.TDID_FTP_PASSWORD);
		port = Integer.parseInt(HttpUtil.getParamFromConfigServer(WifipixTaskConstant.TDID_FTP_PORT));
		if (ip==null || username == null || password ==null || port==-1) {
			logger.error("=================================================================================");
			logger.error("Dmp数据库中缺少关键参数，key["+ WifipixTaskConstant.TDID_FTP_IP+"/"+ WifipixTaskConstant.TDID_FTP_PASSWORD+"/"+ WifipixTaskConstant.TDID_FTP_PASSWORD+"/"+ WifipixTaskConstant.TDID_FTP_PORT+"]");
			logger.error("=================================================================================");
			throw new RuntimeException("请检查DMP数据库");
		}

	}

	protected void closeConnect()  {
		try{
			ftpClient.logout();
			ftpClient.disconnect();
			logger.info("disconnect success");
		} catch (IOException ex){
			logger.error("not disconnect",ex);
			throw new RuntimeException("关闭链接异常");
		}
	}

	protected void connectServer(){
		try {
			ftpClient = new FTPClient();
			ftpClient.connect(ip, port);
			ftpClient.login(username,password);
			ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
			ftpClient.enterLocalPassiveMode();
		} catch (IOException e) {
			logger.error("链接FTP出现IO异常",e);
			throw new RuntimeException("IOException");
		}
		logger.info("Ftp login success!");
	}

	protected boolean createDirPath(String filepath) throws IOException{
		String[] split = filepath.split("/");
		for (String string : split) {
			ftpClient.makeDirectory(string);
			ftpClient.changeWorkingDirectory(string);
		}
		return false;
	}

	protected boolean download(FTPFile file,String local,String downloadSearchPath) throws IOException{
		//设置被动模式
		ftpClient.enterLocalPassiveMode();
		//设置以二进制方式传输
		ftpClient.setFileType(FTP.BINARY_FILE_TYPE);

		long lRemoteSize = file.getSize();
		if(lRemoteSize == 0){
			logger.info("file=" + file.getName() + " 大小为0，不用下载!");
			return true;
		}
		File f = new File(local);
		OutputStream out = null;
		InputStream in = null;
		try {
			//本地存在文件，进行断点下载
			if (f.exists()) {
				long localSize = f.length();
				//判断本地文件大小是否大于远程文件大小
				if (localSize >= lRemoteSize) {
					logger.info("本地文件大于远程文件，下载中止");
					return true;
				}

				//进行断点续传，并记录状态
				out = new FileOutputStream(f, true);
				ftpClient.setRestartOffset(localSize);
				ftpClient.enterLocalPassiveMode();
				in = ftpClient.retrieveFileStream(file.getName());
				byte[] bytes = new byte[1024];
				long step = lRemoteSize / 100;
				long process = 0;
				if(step != 0){
					step=localSize / step;
				}
				int c;
				while((c = in.read(bytes))!= -1){
					out.write(bytes,0,c);
					localSize+=c;
					if(step != 0){
						long nowProcess = localSize /step;
						if(nowProcess > process){
							process = nowProcess;
							if(process % 10 == 0)
								logger.info("下载进度："+process);
							//TODO 更新文件下载进度,值存放在process变量中
						}
					}
				}
				boolean isDo = ftpClient.completePendingCommand();
                return isDo;
			} else {
				String remote = file.getName();
				logger.info("数据下载地址：" + remote);
				out = new FileOutputStream(f);
				ftpClient.enterLocalPassiveMode();
				in = ftpClient.retrieveFileStream(remote);
				byte[] bytes = new byte[1024];
				long step = lRemoteSize / 100;
				long process = 0;
				long localSize = 0L;
				int c;
				while((c = in.read(bytes))!= -1){
					out.write(bytes, 0, c);
					localSize+=c;
					if(step != 0 ){
						long nowProcess = localSize /step;
						if(nowProcess > process){
							process = nowProcess;
							if(process % 10 == 0)
								logger.info("下载进度："+process);
							//TODO 更新文件下载进度,值存放在process变量中
						}
					}
				}
				boolean upNewStatus = ftpClient.completePendingCommand();
                return upNewStatus;
			}
		}finally {
			FileUtil.close(out, in);
		}
	}


}
