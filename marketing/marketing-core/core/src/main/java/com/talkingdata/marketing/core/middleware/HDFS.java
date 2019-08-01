package com.talkingdata.marketing.core.middleware;

import com.talkingdata.marketing.core.constant.ParamConstants;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.LocatedFileStatus;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.fs.RemoteIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * The type Hdfs.
 * @author xiaoming.kang
 */
@Component
public class HDFS {
    /**
     * The constant BUFFER_SIZE.
     * // 64KB
     */
    public static final int BUFFER_SIZE = 64 * 1024;
    private static final Logger logger = LoggerFactory.getLogger(HDFS.class);
    /**
     * The constant fs.
     */
    protected static FileSystem fs;
    private String hadoopUser;
    private String hadoopAddr;

    @Autowired
    private ConfigApi configApi;

    @PostConstruct
    private void initFileSystem() {
        getPathFromConfig();
        if (hadoopUser == null) {
            logger.error("请在config系统检查"+ ParamConstants.MARKETING_HDFS_USER+"的配置");
            return;
        }
        if (hadoopAddr == null) {
            logger.error("请在config系统检查"+ ParamConstants.MARKETING_HDFS_PATH +"的配置");
            return;
        }
        Configuration conf = new Configuration();
        System.setProperty("HADOOP_USER_NAME", hadoopUser);
        conf.set("fs.default.name", hadoopAddr);
        try {
            fs = FileSystem.get(conf);
        } catch (IOException e) {
            logger.error("初始化hdfs客户端配置失败",e);
        }
    }

    /**
     * Create output stream.
     *
     * @param path      the path
     * @param overwrite the overwrite
     * @return the output stream
     * @throws IOException the io exception
     */
    public static OutputStream create(Path path, boolean overwrite) throws IOException {
        return fs.create(path,overwrite);
    }

    /**
     * Mkdirs boolean.
     *
     * @param path the path
     * @return the boolean
     * @throws IOException the io exception
     */
    public static boolean mkdirs(Path path) throws IOException {
        return fs.mkdirs(path);
    }

    /**
     * Open input stream.
     *
     * @param path the path
     * @return the input stream
     * @throws IOException the io exception
     */
    public static InputStream open(Path path) throws IOException {
        return fs.open(path);
    }

    /**
     * Exists boolean.
     *
     * @param path the path
     * @return the boolean
     * @throws IOException the io exception
     */
    public static boolean exists(Path path) throws IOException {
        return fs.exists(path);
    }

    /**
     * Gets file status.
     *
     * @param path the path
     * @return the file status
     * @throws IOException the io exception
     */
    public static FileStatus getFileStatus(Path path) throws IOException {
        return fs.getFileStatus(path);
    }

    /**
     * Write.
     *
     * @param b            the b
     * @param outputStream the output stream
     * @throws IOException the io exception
     */
    public static void write(byte[] b, OutputStream outputStream) throws IOException {
        outputStream.write(b);
    }

    private void getPathFromConfig() {
        hadoopUser = configApi.getParam(ParamConstants.MARKETING_HDFS_USER, ParamConstants.SYSTEM_CODE);
        hadoopAddr = configApi.getParam(ParamConstants.MARKETING_HDFS_PATH, ParamConstants.SYSTEM_CODE);
    }

    /**
     * 以迭代器模式返回目录下的文件
     *
     * @param path      目录
     * @param recursive 是否递归
     * @return remote iterator
     * @throws IOException the io exception
     */
    public static RemoteIterator<LocatedFileStatus> listFiles(Path path, boolean recursive) throws IOException {
        return fs.listFiles(path, recursive);
    }

}
