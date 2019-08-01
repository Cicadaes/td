package td.enterprise.common.ftp;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FtpUtils {

	private static final Logger logger = LoggerFactory.getLogger(FtpUtils.class);

	
	private static FTPClient ftpClient = new FTPClient();
	
	/**
     *  建立FTP链接，FTP服务器地址、端口、登陆用户信息都在配置里配置即可。
     * @throws IOException
     */
    public static boolean connectFtp(String ftpAddress, String ftpPort, String ftpUserName, String ftpPassword) throws IOException{
        logger.info("*****连接FTP服务器...*****");
        try{
            ftpClient.connect(ftpAddress, Integer.valueOf(ftpPort).intValue());
            ftpClient.setControlEncoding("UTF-8");
            int reply = ftpClient.getReplyCode();
            if(FTPReply.isPositiveCompletion(reply)){
                if(ftpClient.login(ftpUserName,ftpPassword)){
                    logger.info("*****连接FTP服务器成功！*****");
                    return true;
                }
            }else{
            	logger.error("*****连接失败!响应代码为【"+ reply+"】*****");
            }
            disconnect();
        }catch (Exception e) {
        	logger.error("*****连接失败：" + e.getMessage());
        }
        return false;
    }
    
    /**
     *  设置FTP客户端 被动模式、数据模式为二进制、字符编码GBK
     */
    public static void setConnectType(){
        try {
            ftpClient.enterLocalPassiveMode();
            ftpClient.setDefaultTimeout(1000 * 120);//120秒
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
            ftpClient.setControlEncoding("UTF-8");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    
    /**
     * 断开与远程服务器的连接
     * @throws IOException
     */
    public static void disconnect() {
        if(ftpClient.isConnected()){
            try {
                ftpClient.disconnect();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    
    /**
     * 过滤不符合的文件并批量下载   
     * @param remoteFileReg 文件前缀的正则表达式
     * @param localPath  本地路径 .property 文件配置
     * @param ftpRemotePath ftp文件路径
     * @return  List 下载到本地的文件路径 集合
     * @throws IOException
     */
    @SuppressWarnings("unused")
	public static List<File> downloads(String remoteFileReg,String localPath,String ftpRemotePath) throws IOException{
        List<File> fileList = new ArrayList<File>();
        logger.info("*****转移到服务器目录：" + ftpRemotePath);
        setConnectType();
        boolean changeFlag = ftpClient.changeWorkingDirectory(ftpRemotePath);
        ftpClient.enterLocalPassiveMode();
        FTPFile[] files = ftpClient.listFiles();
        //String[] names = ftpClient.listNames();
        logger.info("*****改变目录是否成功：" + changeFlag);
        logger.info("*****服务器上report目录下所有校验报告的文件数为：【" +files.length + "】" );
        if(files.length == 0){
            logger.info("*****未在服务器上找到文件！*****");
            return null;
        }else{//目录下有文件
            //把 bak文件的前缀找出来   ，区分读取和未读取的xls 和 xlsx ,只下载 未读取的文件 
            List<String> bakList = new ArrayList<String>();
            List<String> list = new ArrayList<String>();
            
            for (int i = 0; i < files.length; i++) {
            	
            	// 每次处理10个文件
            	if (i == 10) {
            		break;
            	}
            	
                FTPFile ftpFile = files[i];
                String fileName = ftpFile.getName();
                
                if(!fileName.endsWith(".bak") && ftpFile == null){
                    logger.info("*******  "+ fileName + "文件无数据!");
                    continue;
                }
                //匹配指定的文件前缀 和后缀 为    .bak 格式的文件
                //bak 文件是文件读取完毕后生成的标记文件
                Pattern bak = Pattern.compile("\\.bak"); 
                Matcher m = bak.matcher(fileName); 
                if (m.find()) {
                    //取.bak文件的 前缀
                    //System.out.println(fileName);
                    //System.out.println(fileName.split("\\.")[0]);
                    bakList.add(fileName.split("\\.")[0]);
                    continue;
                }
                
                //匹配指定的文件前缀 和后缀 为    gz 格式的文件
                //以后遇到其他的格式文件 需要把后缀抽出来作为参数传入
                Pattern gz = Pattern.compile("\\.zip$");
                Matcher mm = gz.matcher(fileName);
                if(mm.find()){
                    list.add(fileName);
                    continue;
                }
            }
        
            Iterator<String> it = list.iterator();
            while (it.hasNext()) {
                String xls = it.next();
                for (int i = 0; i < bakList.size(); i++) {
                    String bak = bakList.get(i);
                    //bak文件存在 , 去掉此文件
                    if (xls.indexOf(bak) !=-1) {
                        it.remove();
                        bakList.remove(i);
                    }
                }    
            }

    
            for (String fFile : list) {
                //下载未读取的文件
                File downFile = new File(localPath + "//" + fFile); 
                File downPath = new File(localPath);
                if(!downPath.exists()){
                    downPath.mkdirs();
                }
                String fileDir = ftpRemotePath + "//" + fFile;
                OutputStream os = new FileOutputStream(downFile);
                ftpClient.retrieveFile(new String(fileDir.getBytes("UTF-8"),"ISO-8859-1"), os);
                logger.info("*****文件已下载到：" + downFile.getAbsolutePath() + "******" + Thread.currentThread().getName());
                fileList.add(downFile);
                os.close();
//                String name = fileDir.replaceAll(".gz", ".bak");
//                rename(name, fileDir);
            }
            logger.info("**** 此次共下载了【"+list.size()+"】个文件! *****");
        }
        return fileList;
    }
    
    /**
	 * 重命名远程FTP文件
	 * @param name 新远程文件名称(路径-必须保证在同一路径下)
	 * @param remote 远程文件路径
	 * @return 是否成功
	 * @throws IOException
	 */
	public static FTPStatus rename(String name, String remote) throws IOException {
		ftpClient.enterLocalPassiveMode();

		ftpClient.setFileType(FTP.BINARY_FILE_TYPE);

		FTPStatus result = null;

		FTPFile[] files = ftpClient.listFiles(remote);
		if (files.length == 1) {
			boolean status = ftpClient.rename(remote, name);
			result = status ? FTPStatus.Remote_Rename_Success
					: FTPStatus.Remote_Rename_Faild;
		} else {
			result = FTPStatus.Not_Exist_File;
		}
		logger.info("FTP服务器文件名更新标识：" + result);
		return result;
	}
	
	public enum FTPStatus {
		File_Exits(0), Create_Directory_Success(1), Create_Directory_Fail(2), Upload_From_Break_Success(
				3), Upload_From_Break_Faild(4), Download_From_Break_Success(5), Download_From_Break_Faild(
				6), Upload_New_File_Success(7), Upload_New_File_Failed(8), Delete_Remote_Success(
				9), Delete_Remote_Faild(10), Remote_Bigger_Local(11), Remote_smaller_local(
				12), Not_Exist_File(13), Remote_Rename_Success(14), Remote_Rename_Faild(
				15), File_Not_Unique(16);

		private int status;

		public int getStatus() {
			return status;
		}

		public void setStatus(int status) {
			this.status = status;
		}

		FTPStatus(int status) {
			this.status = status;
		}
	}
    
}
