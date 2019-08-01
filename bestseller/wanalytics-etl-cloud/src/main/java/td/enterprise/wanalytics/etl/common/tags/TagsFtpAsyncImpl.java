package td.enterprise.wanalytics.etl.common.tags;

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

public class TagsFtpAsyncImpl extends FtpBaseTask implements SyncFileExchangeInterface {
	public static Logger logger = Logger.getLogger(TagsFtpAsyncImpl.class);
	private String tenantId = null;
	private String runDate = null;

    private String downloadPath = null;
    private String uploadPath = null;

	public TagsFtpAsyncImpl(String tenantId, String runDate) {
		super();
		this.tenantId = tenantId;
		this.runDate = runDate.replaceAll("-", "");
		downloadPath = HttpUtil.getParamFromConfigServer(WifipixTaskConstant.Tags_DOWNLOADPATH)  ;
		uploadPath = HttpUtil.getParamFromConfigServer(WifipixTaskConstant.Tags_UPLOADPATH) ;
		if (downloadPath ==null) {
			logger.error("========================================================================");
			logger.error("DMP数据库中，Key="+ WifipixTaskConstant.Tags_DOWNLOADPATH+"[这条配置没有找到/没有匹配到]");
			logger.error("========================================================================");
			throw new RuntimeException("初始化失败！缺少必要配置");
		}
//		downloadPath += "mac/match_tdid/";
		downloadPath += "mac/match_tag/";

		if (uploadPath ==null) {
			logger.error("========================================================================");
			logger.error("DMP数据库中，Key="+ WifipixTaskConstant.Tags_UPLOADPATH+"[这条配置没有找到/没有匹配到]");
			logger.error("========================================================================");

			throw new RuntimeException("上传文件失败！缺少必要配置");
		}
//		uploadPath += "mac/match_tdid/";
		uploadPath += "mac/match_tag/";

		logger.info("download路径：" + downloadPath);
		logger.info("uploadpath路径："+ uploadPath);
	}



	/**
	 * 兼容 tdidfile 为gzip格式，和普通文档格式
	 * @param tdidFile
	 * @return
	 * @throws Exception
	 */
	@Override
	public String uploadTaskFile(String tdidFile) throws Exception {
		boolean isGzip  = FileUtil.isGzip(new File(tdidFile));
		String regularTDIDFile = tdidFile;//普通文本格式
		if(isGzip){
			regularTDIDFile = tdidFile.replaceAll(".gz","");
			GZipUtil.ungzip(tdidFile, regularTDIDFile);
		}
		String finishFile = regularTDIDFile + ".finish";
		String taskId = runDate + "/" + tenantId + "_mac_" + System.currentTimeMillis();
		String uploadFolderPath = uploadPath + taskId;
		connectServer();
		FileInputStream tdidFileInput = null;
		FileInputStream finishInput =null;
		try{
			createDirPath(uploadFolderPath);
			tdidFileInput = new FileInputStream(new File(regularTDIDFile));
			ftpClient.storeFile(FileUtil.getFileName(tdidFile),tdidFileInput);
			File file = new File(finishFile);
			file.createNewFile();
			finishInput = new FileInputStream(finishFile);
			ftpClient.storeFile(FileUtil.getFileName(finishFile),finishInput);
		}catch(Exception e){
			logger.error("发生了异常",e);
			throw new RuntimeException("上传文件失败");
		}finally {
			FileUtil.close(tdidFileInput,finishInput);
			closeConnect();
			new File(finishFile).delete();//删除临时文件
		}
		return taskId;
	}

	public Boolean queryTaskStatus(String taskId, String service, Integer macCount, Integer projectId, Integer crowdId){
		String downloadSearchPath = downloadPath + taskId;
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
				
				long now = System.currentTimeMillis();
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
	public Boolean downloadTaskFile(String taskid, String outputFilePath) throws Exception {
		String downloadSearchPath = downloadPath +taskid;
		File file = new File(outputFilePath);
		//==============创建本地临时目录========
		String parent = file.getParent() + "/" + "tagsDownloadtmp/" ;
		File tmpFolder = new File(parent);
		if (!tmpFolder.exists()) {
			tmpFolder.mkdirs();
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
					while( !finish && time <= 3){
						finish = download(ftpFile,parent+ftpFile.getName(),downloadSearchPath);
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

		File[] listFiles = tmpFolder.listFiles();

		ArrayList<File> fileList = new ArrayList<>();
		if (listFiles.length > 0 ) {
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
			FileUtil.combineFiles(fileList, parent + "tags_key_value");
			new File(parent + "tags_key_value").renameTo(file);
//			GZipUtil.gzip(, file.getParent(),file.getName());
		} catch (IOException e) {
			logger.error("下载过程中出现异常",e);
			throw new RuntimeException("IOException");
		} catch (Exception e) {
			logger.error("压缩过程中出现异常",e);
			throw new RuntimeException("Exception");
		}

		//=========删除临时文件夹==============
		try{
			listFiles = tmpFolder.listFiles();
			if (listFiles.length > 0) {
				for (File file2 : listFiles) {
					file2.delete();
				}
			}
			tmpFolder.delete();
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
			boolean status = queryTaskStatus(taskId, "TagsGet", macCount, projectId,0);
			if(status ){
				boolean d = downloadTaskFile(taskId,outputFile.getPath());
				if(d){
					//对文件进行转化
					String tempFile = outputFile.getPath() + "_" + System.currentTimeMillis();
					boolean f = TagsFtpConvert.convertTags(outputFile.getPath(),tempFile);
					logger.info("文件转化结果:"  + f  );
					boolean r = outputFile.renameTo(new File(outputFile.getParent(),outputFile.getName() + "_source" ));
					logger.info("临时文件重命名结果：" + r);
					File resultFile = new File(tempFile);
					r = resultFile.renameTo(outputFile);
					logger.info("结果文件重命名结果：" + r);
					response.setCode(Response.Status.SUCCESS);
				}else {
					response.setCode(Response.Status.ERROR);
				}
			}else{
				response.setCode(Response.Status.ERROR);
			}
		}catch(Exception e){
			logger.error("Tags Ftp AsyncImpl 异常：", e);
			response.setMsg(e.getMessage());
			response.setCode(Response.Status.ERROR);
		}
		return response;
	}

}
