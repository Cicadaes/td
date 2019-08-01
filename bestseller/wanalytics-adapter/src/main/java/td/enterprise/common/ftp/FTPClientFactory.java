package td.enterprise.common.ftp;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.apache.commons.pool.PoolableObjectFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import td.enterprise.config.prop.FtpProps;

/**
 * 连接池工厂类
 * @author liyinglei
 *
 */
@Component
@Slf4j
public class FTPClientFactory implements PoolableObjectFactory<FTPClient> {

    @Autowired
    private FtpProps config;

    @Override
    public FTPClient makeObject() {
        FTPClient ftpClient = new FTPClient();
        ftpClient.setConnectTimeout(config.getTimeout());
        try {
            ftpClient.connect(config.getHost(), config.getPort());
            int reply = ftpClient.getReplyCode();
            if (!FTPReply.isPositiveCompletion(reply)) {
                ftpClient.disconnect();
                log.warn("FTPServer refused connection");
                return null;
            }
            boolean result = ftpClient.login(config.getUsername(), config.getPassword());
            if (!result) {
                log.warn("ftpClient login failed... username is {}", config.getUsername());
            }
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
            ftpClient.setBufferSize(1024);
            ftpClient.setControlEncoding(config.getEncoding());
            if (config.isPassiveMode()) {
                ftpClient.enterLocalPassiveMode();
            }
        } catch (Exception e) {
            log.error("create ftp connection failed...{}", e);
            //throw e;
        }

        return ftpClient;
    }

    @Override
    public void destroyObject(FTPClient ftpClient) throws Exception {
        try {
            if (ftpClient != null && ftpClient.isConnected()) {
                ftpClient.logout();
            }
        } catch (Exception e) {
            log.error("ftp client logout failed...{}", e);
            throw e;
        } finally {
            if (ftpClient != null) {
                ftpClient.disconnect();
            }
        }

    }

    @Override
    public boolean validateObject(FTPClient ftpClient) {
        try {
            return ftpClient.sendNoOp();
        } catch (Exception e) {
            log.error("Failed to validate client: {}", e);
        }
        return false;
    }

    @Override
    public void activateObject(FTPClient obj) throws Exception {
        //Do nothing

    }

    @Override
    public void passivateObject(FTPClient obj) throws Exception {
        //Do nothing

    }

}
