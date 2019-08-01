package td.enterprise.wanalytics.etl.common.tdid;

import org.apache.commons.net.ftp.FTPFile;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.common.Response;
import td.enterprise.wanalytics.etl.common.SyncFileExchangeInterface;
import td.enterprise.wanalytics.etl.common.async.FtpBaseTask;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.GZipUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

public class TdidFtpAsyncImpl extends FtpBaseTask implements SyncFileExchangeInterface {
	public static Logger logger = Logger.getLogger(TdidFtpAsyncImpl.class);
	private String tenantId = null;
	private String runDate = null;
    
    private String downloadPath = null;
    private String uploadPath = null;
    
	public TdidFtpAsyncImpl(String tenantId,String runDate) {
		super();
		this.tenantId = tenantId;
		this.runDate = runDate.replaceAll("-", "");
		
		 downloadPath = HttpUtil.getParamFromConfigServer(WifipixTaskConstant.TDID_DOWNLOADPATH);
		 uploadPath = HttpUtil.getParamFromConfigServer(WifipixTaskConstant.TDID_UPLOADPATH) ;
		if (downloadPath == null) {
			logger.error("========================================================================");
			logger.error("DMP数据库中，Key="+ WifipixTaskConstant.TDID_DOWNLOADPATH+"[这条配置没有找到/没有匹配到]");
			logger.error("========================================================================");
			throw new RuntimeException("初始化失败！缺少必要配置");
		}
		if (uploadPath == null) {
			logger.error("========================================================================");
			logger.error("DMP数据库中，Key="+ WifipixTaskConstant.TDID_UPLOADPATH+"[这条配置没有找到/没有匹配到]");
			logger.error("========================================================================");
			throw new RuntimeException("上传文件失败！缺少必要配置");
		}
        downloadPath +=  "mac/match_tdid/";
		uploadPath   +=  "mac/match_tdid/";
		logger.info("download路径："+ downloadPath);
		logger.info("uploadpath路径："+ uploadPath);
	}

	/**
	 * 上传mac文本文件,和文件名 +【.finish】文件
	 * @param gzipFile 文件路径
	 * @return
	 * @throws Exception
	 */
	@Override
	public String uploadTaskFile(String gzipFile) throws Exception {
        boolean isGzip  = FileUtil.isGzip(new File(gzipFile));
		String macFile = gzipFile;
		if(isGzip){
			macFile = gzipFile.replaceAll(".gz","");
			GZipUtil.ungzip(gzipFile, macFile);
		}
		String finishFile = macFile + ".finish";
		String taskId = runDate + "/" + tenantId + "_mac_" + System.currentTimeMillis();
		String uploadFolderPath =  uploadPath + taskId;
		connectServer();
		FileInputStream macInput = null;
		FileInputStream finishInput =null;
		try{
			createDirPath(uploadFolderPath);
			macInput = new FileInputStream(new File(macFile));
			ftpClient.storeFile(FileUtil.getFileName(macFile),macInput);
			File tempFinishFile = new File(finishFile);
			tempFinishFile.createNewFile();
			finishInput = new FileInputStream(finishFile);
			ftpClient.storeFile(FileUtil.getFileName(finishFile),finishInput);
		}catch(Exception e){
			logger.error("发生了异常",e);
			throw new RuntimeException("上传文件失败");
		}finally {
			FileUtil.close(macInput,finishInput);
			closeConnect();
			new File(finishFile).delete();//删除临时文件
		}

		return taskId;
	}

	public Boolean queryTaskStatus(String taskid, String service, Integer macCount, Integer projectId,Integer crowdId){
		String downloadSearchPath = downloadPath +taskid;
		long from = System.currentTimeMillis();
		try{
			while(true){
				connectServer();
				try {
					boolean have = ftpClient.changeWorkingDirectory(downloadSearchPath);
					logger.info(downloadSearchPath);
					if (have) {
						String[] listNames = ftpClient.listNames();
						for (int i = 0; i < listNames.length; i++) {
							if (listNames[i].toLowerCase().endsWith(".finish")) {
								logger.info("发现finish文件，文件处理成功，准备下载");
								return true;
							}
						}
					}
				} catch (IOException e) {
					logger.error("发生了异常",e);
					throw new RuntimeException("查询失败");
				} finally{
					closeConnect();
				}
				
				long now =System.currentTimeMillis();
				long useTime = (now-from)/60000;
				
				logger.info("调用接口处理中,已等待时间" + useTime + "分钟");
				Thread.sleep(60000);
				
			}
		}catch (Exception e) {
			logger.error("查询失败",e);
			return false;
		}
	}

	@Override
	public Boolean downloadTaskFile(String taskid, String outputFilePath){
		String downloadSearchPath = downloadPath +taskid;
		File file = new File(outputFilePath);
		//==============创建本地临时目录========
		String parent = file.getParent() + "/" + "tdidDownloadtmp/";
		File tmpfolder = new File(parent);
		if (!tmpfolder.exists()) {
			tmpfolder.mkdirs();
		}
		
		connectServer();
		
		//==============下载文件到本地临时目录========
		try {
			boolean changeWorkingDirectory = ftpClient.changeWorkingDirectory(downloadSearchPath);
			if (!changeWorkingDirectory) {
				logger.error("切换到文件目录失败，目录为："+downloadSearchPath);
			}
			FTPFile[] listFiles = ftpClient.listFiles();
			if (listFiles!=null && listFiles.length>0) {
				for (FTPFile ftpFile : listFiles) {
					boolean finish = false;
					int time = 1;
					while(!finish && time<= 3 ){
						finish = download(ftpFile,parent + ftpFile.getName(),downloadSearchPath);
						if (!finish) {
							logger.error("从ftp下载文件失败("+time+"次)，文件名为："+ ftpFile.getName()+",文件路径为："+downloadSearchPath);
							time ++;
						}else{
							logger.info(ftpFile.getName()+"文件下载成功");
						}
					}
				}
				logger.info("======================================");
				logger.info("===========所有文件已下载成功！==============");
				logger.info("======================================");
			}
		} catch (IOException e) {
			logger.error("下载过程中出现异常",e);
			throw new RuntimeException("IOException");
		}finally{
			closeConnect();
		}
		
		//=========合并文件压缩==============
		File[] listFiles = tmpfolder.listFiles();
		ArrayList<File> fileList = new ArrayList<>();
		if (listFiles.length > 0) {
			for (File f : listFiles) {
				if (f.getName().endsWith(".finish")) {
					continue;
				}else{
					try {
						FileUtil.replaceFileContent(f, ",", "\t");
						fileList.add(f);
					} catch (Exception e) {
						logger.error("文件转换分隔符失败",e);
						throw new RuntimeException("文件转换分隔符失败",e);
					}
				}
			}
		}
		try {
			String tempFile = parent + "mac_ftp_tdid";
			FileUtil.combineFiles(fileList, tempFile);
			logger.info("filepath= "+parent + "mac_ftp_tdid");
			logger.info("filename= "+file.getName());
            new File(tempFile).renameTo(file);
			//GZipUtil.gzip(parent + "mac_ftp_tdid", file.getParent(),file.getName());
		} catch (IOException e) {
			logger.error("压缩过程中出现异常",e);
			throw new RuntimeException("IOException");
		} catch (Exception e) {
			logger.error("压缩过程中出现异常",e);
			throw new RuntimeException("Exception");
		}
		
		//=========删除临时文件夹==============
		try{
			listFiles = tmpfolder.listFiles();
			if (listFiles.length > 0) {
				for (File file2 : listFiles) {
					file2.delete();
				}
			}
			tmpfolder.delete();
		}catch(Exception e){
			logger.error("临时文件夹未能删除成功",e);
		}
		
		return true;
	}


	@Override
	public Response exchangeFile(File macFile, File outputFile, boolean isGzip, @SuppressWarnings("rawtypes") Map map) {
		Response response = new Response();
		try{
			String taskId = uploadTaskFile(macFile.getAbsolutePath());
			Integer projectId = (Integer)map.get("projectId");
			Integer macCount = (Integer)map.get("macCount");
			boolean status = queryTaskStatus(taskId, "MACTDID", macCount, projectId,0);
			if(status ){
				boolean d = downloadTaskFile(taskId,outputFile.getPath());
				if(d){
					response.setCode(Response.Status.SUCCESS);
				}else {
					response.setCode(Response.Status.ERROR);
				}
			}else{
				response.setCode(Response.Status.ERROR);
			}
		}catch(Exception e){
			logger.error("MACTDID异常：", e);
			response.setMsg(e.getMessage());
			response.setCode(Response.Status.ERROR);
		}
		return response;
	}

}
