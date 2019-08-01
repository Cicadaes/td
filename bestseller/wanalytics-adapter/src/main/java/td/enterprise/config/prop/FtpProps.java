package td.enterprise.config.prop;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 
 * 接收application.yml中的ftp下面的属性
 * @description 
 * @author sxk
 * @date 2017年10月10日
 */
@Data
@Component
@ConfigurationProperties(prefix = "ftp")
public class FtpProps {
    private String  host;
    private int     port;
    private String  username;
    private String  password;
    /**FTP 被动模式*/
    private boolean passiveMode;
    /**FTP 编码方式*/
    private int     timeout;
    /**FTP 客户端超时*/
    private String  encoding;
    /**
     * 多长时间执行一次
     */
    private String  fixedDelay;
    /**
     * FTP远程目录
     */
    private String  remotePath;
    /**
     * 本地存储目录
     */
    private String  localPath;

    //private String  fileSuffix;
    /**
     * 一次下载的文件数量
     */
    private int     downFileNum;
    /**
     * data fix minute
     */
    private int     fixMinute;

}
