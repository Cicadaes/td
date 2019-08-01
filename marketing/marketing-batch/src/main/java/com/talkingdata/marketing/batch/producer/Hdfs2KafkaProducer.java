package com.talkingdata.marketing.batch.producer;

import com.talkingdata.marketing.batch.message.KafkaProducer;
import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

/**
 * 将HDFS中的文件内容输出到kafka中
 *
 * @author Created by tend on 2017/11/3.
 */
@Component
public class Hdfs2KafkaProducer {
    private static final Logger logger = LoggerFactory.getLogger(Hdfs2KafkaProducer.class);
    private static final Integer BUFFER_SIZE = 100;

    @Autowired
    private KafkaProducer kafkaProducer;

    @Value("${hdfs.uri}")
    private String hdfsUri;

    /**
     * 将HDFS中的文件内容输出到kafka中
     *
     * @param hdfsPath HDFS文件路径
     * @return 写入成功true，否则false
     */
    public boolean producer(String hdfsPath) {
        Configuration conf = new Configuration();
        FileSystem fs = null;
        try {
            fs = FileSystem.get(URI.create(hdfsUri), conf);
            validateHdfsPath(fs, hdfsPath);
            Path path = new Path(hdfsPath);
            FSDataInputStream inputStream = fs.open(path);
            Charset charset = Charset.defaultCharset();
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream, charset));
            String line = bufferedReader.readLine();
            List<String> bufferMessages = new ArrayList<>();
            while (StringUtils.isNotEmpty(line)) {
                bufferMessages.add(line);
                if (bufferMessages.size() >= BUFFER_SIZE) {
                    List<String> messages = new ArrayList<>();
                    messages.addAll(bufferMessages);
                    kafkaProducer.sendMessage(messages);
                    bufferMessages.clear();
                }
                line = bufferedReader.readLine();
            }
            if (bufferMessages.size() > 0) {
                kafkaProducer.sendMessage(bufferMessages);
            }
            bufferedReader.close();
            inputStream.close();
        } catch (IOException e) {
            logger.error("read hdfs error, path: {}, exception: ", hdfsPath, e);
            return false;
        } finally {
            if (fs != null) {
                try {
                    fs.close();
                } catch (IOException e) {
                    logger.error("close hdfs FileSystem failed, exception: ", e);
                }
            }
        }
        return true;
    }

    private void validateHdfsPath(FileSystem fs, String hdfsPath) throws IOException {
        if (StringUtils.isEmpty(hdfsPath)) {
            logger.error("hdfs path is empty");
            System.exit(1);
        }
        if (!fs.exists(new Path(hdfsPath))) {
            logger.error("hdfs path: {}, not exists", hdfsPath);
            System.exit(1);
        }
    }

}
