package td.enterprise.common.ftp;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.net.ftp.FTPClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import td.enterprise.common.redis.BaseRedis;
import td.enterprise.common.redis.RedisClientUtil;
import td.enterprise.common.redis.RedisKey;
import td.enterprise.common.util.LogUtils;
import td.enterprise.common.util.StringUtil;
import td.enterprise.config.prop.RedisProps;
import td.enterprise.constants.FTPConstants;

@Component
@Slf4j
public class FtpUtil {
    @Autowired
    private FTPClientPool   pool;
    @Autowired
    private RedisClientUtil redisClientUtil;
    @Autowired
    private RedisProps      prop;
    /**
     * 文件锁redis key 前缀
     */
    public String           FTP_LOCK_KEY;
    /**
     * 文件夹统计数据
     */
    public String           FTP_DIRECTORY_LOCK_KEY;

    @PostConstruct
    private void init() {
        FTP_LOCK_KEY = prop.getFtpLockKey() + ":%s";
        FTP_DIRECTORY_LOCK_KEY = prop.getFtpDirectoryLockKey() + ":%s";
        LogUtils.log4Ftp.info("FTP_LOCK_KEY:{}, FTP_DIRECTORY_LOCK_KEY:{}", FTP_LOCK_KEY, FTP_DIRECTORY_LOCK_KEY);
    }

    /**
     * @param localPath
     * @param ftpRemotePath
     * @param downFileNum 一次下载文件数量
     * @return
     * @throws Exception
     */
    public List<File> downloads(String localPath, String ftpRemotePath, int downFileNum) {
        int successNum = 0;
        List<File> fileList = new ArrayList<File>(downFileNum);
        FTPClient ftpClient = null;
        if (StringUtil.isEmpty(localPath) || StringUtil.isEmpty(ftpRemotePath) || ftpRemotePath.length() < 18) {
            LogUtils.log4Ftp.error("localPath:{},ftpRemotePath:{}", localPath, ftpRemotePath);
            return fileList;
        }
        try {
            ftpClient = pool.borrowObject();

            LogUtils.log4Ftp.info("WorkingDirectory:{}", ftpRemotePath);

            boolean changeFlag = ftpClient.changeWorkingDirectory(ftpRemotePath);
            if (!changeFlag) {
                LogUtils.log4Ftp.warn("changeFlag:{}", changeFlag);
                return fileList;
            }
            ftpClient.enterLocalPassiveMode();
            //FTPFile[] files = ftpClient.listFiles();
            String[] fileNames = ftpClient.listNames();

            if (null == fileNames || fileNames.length == 0) {
                LogUtils.log4Ftp.warn("remotePath:{} is null", ftpRemotePath);
                return fileList;
            }

            LogUtils.log4Ftp.info("changeWorkingDirectory:{},allFileNum:{}", changeFlag, fileNames.length);
            int pathLength = ftpRemotePath.length();
            String fileDirectory = ftpRemotePath.substring(pathLength - 11, pathLength - 1);
            String fileDirectoryKey = String.format(FTP_DIRECTORY_LOCK_KEY, fileDirectory);
            int fileDirectoryNum = redisClientUtil.getInt(fileDirectoryKey);
            if (fileDirectoryNum >= fileNames.length) {
                LogUtils.log4Ftp.info("allFile is down,ftpRemotePath:{},fileDirectoryNum:{}", ftpRemotePath, fileDirectoryNum - 1);
                return fileList;
            }
            for (String fName : fileNames) {
                if (!fName.endsWith(FTPConstants.FTP_FILE_SUFFIX)) {
                    LogUtils.log4Ftp.warn("file {} is bak", fName);
                    continue;
                }
                if (successNum >= downFileNum) {
                    break;
                }
                //如果没有获得锁，跳过
                String ftpLockKey = String.format(FTP_LOCK_KEY, fName);
                if (!redisClientUtil.getLock(ftpLockKey, RedisKey.FTP_LOCK_VALUE, RedisKey.FTP_FILE_LOCK_EXPIRE_TIME)) {
                    continue;
                }
                try {
                    //下载未读取的文件
                    File downPath = new File(localPath);
                    if (!downPath.exists()) {
                        downPath.mkdirs();
                    }
                    File downFile = new File(localPath + "/" + fName);
                    //如果文件已经下载，备份原有文件
                    if (downFile.exists()) {
                        downFile.renameTo(new File(downFile.getPath() + "_" + System.currentTimeMillis() + ".bak"));
                    }
                    String fileDir = ftpRemotePath + "/" + fName;
                    OutputStream os = new FileOutputStream(downFile);
                    ftpClient.retrieveFile(new String(fileDir.getBytes("UTF-8"), "ISO-8859-1"), os);
                    os.close();
                    if (null == downFile || downFile.length() == 0) {
                        redisClientUtil.unLock(ftpLockKey);
                        LogUtils.log4Ftp.warn("downFileEmpty:{}", fName);
                        continue;
                    }
                    LogUtils.log4Ftp.info("downFileOver:{}", downFile.getAbsolutePath());
                    fileList.add(downFile);

                    successNum++;
                    //读完一个文件，+1
                    redisClientUtil.incr(fileDirectoryKey, BaseRedis.EXPIRE_SECONDS_MONTH);
                } catch (Exception e) {
                    redisClientUtil.unLock(ftpLockKey);
                    pool.returnObject(ftpClient);
                    ftpClient = pool.borrowObject();
                    LogUtils.log4Ftp.error("downFileError:{}", fName);
                }

            }
            LogUtils.log4Ftp.info("downFileNum:{}", fileList.size());
        } catch (Exception e) {
            LogUtils.log4Ftp.error("FtpPoolError:", e);
        } finally {
            try {
                pool.returnObject(ftpClient);
            } catch (Exception e) {
                LogUtils.log4Ftp.error("FTPClientPool returnObject:", e);
            }
        }
        return fileList;
    }
}
