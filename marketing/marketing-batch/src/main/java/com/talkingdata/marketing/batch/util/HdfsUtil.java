package com.talkingdata.marketing.batch.util;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;
import java.util.List;

/**
 * @author sheng.hong
 */
@Component
public class HdfsUtil {
    private static final Logger logger = LoggerFactory.getLogger(HdfsUtil.class);

    @Value("${hdfs.uri}")
    private String hdfsUri;

    /**
     * 批量写入hdfs文件
     *
     * @param filePath 文件
     * @param offsets  内容
     */
    public void writeOffsetToHdfs(String filePath, List<Integer> offsets) {

        Configuration conf = new Configuration();
        FileSystem fs = null;
        try {
            fs = FileSystem.get(URI.create(hdfsUri), conf);
            Path path = new Path(filePath);
            if(fs.exists(path)) {
                fs.delete(path, false);
            }
            OutputStream out = fs.create(path);
            for (Integer offset : offsets) {
                out.write(offset.toString().getBytes("UTF-8"));
                out.flush();
            }
            out.close();
        } catch (IOException e) {
            logger.error("content size: {} to file: {} error, exception: ", offsets.size(), filePath, e);
        } finally {
            if (fs != null) {
                try {
                    fs.close();
                } catch (IOException e) {
                    logger.error("close hdfs FileSystem failed, exception: ", e);
                }
            }
        }
    }

    /**
     * 向指定的文件中追加一条记录，如果文件不存在会自动新建
     * 注意，如果追加的记录需要换行，需要自己加换行符，此处不做任何处理
     *
     * @param filePath 追加的文件
     * @param content  追加的内容
     */
    public void appendHdfsFile(String filePath, String content) {
        Configuration conf = new Configuration();
        conf.setBoolean("dfs.support.append", true);
        FileSystem fs = null;
        try {
            fs = FileSystem.get(URI.create(hdfsUri), conf);
            Path path = new Path(filePath);
            if (!fs.exists(path)) {
                fs.create(path);
                fs.close();
                fs = FileSystem.get(URI.create(hdfsUri), conf);
            }
            OutputStream out = fs.append(path);
            IOUtils.copyBytes(new ByteArrayInputStream(content.getBytes()), out, 4096);
            out.close();
        } catch (IOException e) {
            logger.error("append content: {} to file: {} error, exception: ", content, filePath, e);
        } finally {
            if (fs != null) {
                try {
                    fs.close();
                } catch (IOException e) {
                    logger.error("close hdfs FileSystem failed, exception: ", e);
                }
            }
        }
    }
}
