package com.talkingdata.datacloud.constant;

public class FTPConstant {
	
	/**
     * 服务器文件路径分割符 "/"
     */
    public static final String SERVER_PATH_SEPARATOR = "/";
	
	/**
     * 0，未完成
     */
    public static final int FILE_STATU_NO_FINISH = 0;
    
    /**
     * 1，已完成
     */
    public static final int FILE_STATU_FINISH = 1;
    
    /**
     * -1，出错
     */
    public static final int FILE_STATU_EXCEPTION = -1;
    
    /**
     * ftpdownload_search_servers
     * ftpdownd job 需要搜索的ftp 服务器,可配置多个，以逗号分隔。例如：SM_DC_SERVER,HIVE_SERVER
     */
    public static final String FTPDOWNLOAD_SEARCH_SERVERS_KEY = "ftpdownload_search_servers";
    
    /**
     * 完成后的文件的后缀名
     */
    public static final String DEFAULT_FILE_FIN_FLAG = "fin";
    
    /**
     * systemparam 配置pkey
     * 说明：ftpdownload job下载指定ftp服务器路径下的文件，需要与FtpServerConfig表中的rootPath配合，组成完整的路径
     */
    public static final String FTPDOWNLOAD_FTP_SERVER_SUB_DIR_KEY = "ftpdownload_ftp_server_sub_dir";
    
    /**
     * ftpupload job 上传到指定ftp服务器目录
     * 说明：ftpupload job 上传到指定ftp服务器目录，需要与FtpServerConfig表中的rootPath配合，组成完整的路径
     */
    public static final String FTP_UPLOAD_FTP_SERVER_SUB_DIR_KEY = "ftpupload_ftp_server_sub_dir";
    
    /**
     * ftp客户端的code，对应FtpClientConfig表的code
     */
    public static final String CLIENT_INPUT_DIR_KEY = "client_input_dir";
    
    /**
     * ftp动作：下载download
     */
    public static final String FILE_DOWNLOAD_FLAG = "download";
    
    /**
     * ftp动作：上传upload
     */
    public static final String FILE_UPLOAD_FLAG = "upload";
    
    /**
	 * sftp连接超时时
	 */
	public static final String SFTP_TIMEOUT = "SFTP_TIMEOUT";
}
