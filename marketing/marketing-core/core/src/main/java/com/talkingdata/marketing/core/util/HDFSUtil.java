package com.talkingdata.marketing.core.util;

import com.talkingdata.marketing.core.middleware.HDFS;
import org.apache.commons.io.IOUtils;
import org.apache.hadoop.fs.LocatedFileStatus;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.fs.RemoteIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 *  HDFS 操作工具类
 *
 * @author hongsheng
 * @create 2017-11-28-下午2:06
 * @since JDK 1.8
 */
public class HDFSUtil {

    private static final Logger logger = LoggerFactory.getLogger(HDFSUtil.class);

    /**
     * 将通知结果报告明细文件复制到本地并压缩
     *
     * @param hdfsFolderPath 需要复制的HDFS目录绝对路径
     * @param localPath 复制后压缩文件绝对路径
     * @param fileNamePattern 指定需要复制的文件名的匹配模式
     */
    public static void copyNoticeReport2Local(Set<String> hdfsFolderPath, String localPath, String fileNamePattern, String encoding) throws IOException {
        File file = new File(localPath);
        File parentFile = new File(file.getParent());
        if (!parentFile.exists()) { parentFile.mkdirs(); }
        boolean isEmpty = true;
        try(
            FileOutputStream fos = new FileOutputStream(localPath);
            ZipOutputStream zos = new ZipOutputStream(fos)
         ){
            for (String path : hdfsFolderPath){
                RemoteIterator<LocatedFileStatus> iterator = null;
                try {
                    iterator = HDFS.listFiles(new Path(path), true);
                } catch (IOException ioe) {
                    logger.warn("当前路径[{}]不存在", path, ioe);
                    continue;
                }
                while (iterator.hasNext()) {
                    LocatedFileStatus next = iterator.next();
                    if (next.getPath().getName().contains(fileNamePattern)) {
                        isEmpty = false;
                        zos.putNextEntry(new ZipEntry(next.getPath().getParent().getParent().getName() + File.separator + next.getPath().getParent().getName() + ".csv"));
                        IOUtils.copy(new BufferedReader(new InputStreamReader(HDFS.open(next.getPath()))), zos, encoding);
                    }
                }
            }
        } catch(Exception ex) {
            logger.error("将通知结果报告明细文件复制到本地并压缩发生错误", ex);
        }
        final String errorFileNotExist = "文件不存在";
        if (isEmpty) { throw new FileNotFoundException(errorFileNotExist); }
    }

    /**
     * 读取短信通知中指定状态的结果
     *
     * @param path 结果存放的目录
     * @param status 结果状态。
     * @throws IOException
     */
    public static void readSMSNoticeReport(String path, String status) throws IOException {
        List<String> report = new ArrayList<>();
        RemoteIterator<LocatedFileStatus> iterator = HDFS.listFiles(new Path(path), true);
        while (iterator.hasNext()) {
            LocatedFileStatus next = iterator.next();
            if (next.getPath().getName().contains("report-details.csv")){
                try(
                        InputStream inputStream = HDFS.open(next.getPath());
                        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"))
                ){
                    String result = null;
                    while ((result = reader.readLine()) != null) {
                        String[] parts = result.split(",");
                        if (status.equals(parts[1])) {
                            report.add(new StringBuilder().append(parts[0]).append(",").append(parts[1]).toString());
                        }
                    }
                } catch(Exception e) {
                    logger.error("读取HDFS中通知报告数据发生错误", e);
                }
            }
        }
    }
}
