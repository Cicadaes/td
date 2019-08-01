package com.talkingdata.marketing.streaming.util;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.IOException;

/**
 * 需要配置HBase集群的host至集群
 *
 * @author Created by tend on 2017/10/11.
 */
@Lazy
@Component
public class HbaseUtils {
    private static final Logger logger = LoggerFactory.getLogger(HbaseUtils.class);
    private volatile Connection con;

    @Value("${hbase.zookeeper.quorum}")
    private String zkQuorum;

    @Value("${hbase.zookeeper.property.clientPort}")
    private String zkPort;

    /**
     * 获取HBase连接,需要配置HBase集群的host至访问机
     * 否则会java.net.UnknownHostException
     *
     * @return Connection
     */
    @PostConstruct
    public Connection getConnection() throws IOException {
        if (con == null || con.isClosed()) {
            synchronized (this) {
                Configuration conf = HBaseConfiguration.create();
                conf.set("hbase.zookeeper.quorum", zkQuorum);
                conf.set("hbase.zookeeper.property.clientPort", zkPort);
                // HBase客户端发起一次数据操作直至得到响应之间总的超时时间
                conf.set("hbase.client.operation.timeout", "3000");
                // 一次RPC请求的超时时间。如果某次RPC时间超过该值，客户端就会主动关闭socket
                conf.set("hbase.rpc.timeout", "3000");
                // 客户端重试最大次数。所有操作所使用的最大次数
                conf.set("hbase.client.retries.number", "3");
                con = ConnectionFactory.createConnection(conf);
            }
        }
        return con;
        // conf.set("hbase.master", "hadoopMaster01.tdTest.com:60000");
        // conf.set("hbase.client.operation.timeout", "300");
        // conf.set("hbase.rpc.timeout", "3000");
        // conf.set("hbase.client.scanner.timeout.period", "3"); // hbase.regionserver.lease.period
    }

    public byte[] getByRowKey(String tableName, String rowKey, String family, String qualifier) {
        Table table = null;
        try {
            table = con.getTable(TableName.valueOf(tableName));
            Get get = new Get(Bytes.toBytes(rowKey));
            get.addColumn(family.getBytes(), qualifier.getBytes());
            Result result = table.get(get);
            return result.value();
        } catch (IOException e) {
            logger.error("tableName:{},rowKey:{},family:{},qualifier:{}, IOException: ", tableName, rowKey, family, qualifier, e);
        } finally {
            if (table != null) {
                try {
                    table.close();
                } catch (IOException e) {
                    logger.error("close hbase table failed, exception: {}", e);
                }
            }
        }
        return null;
    }

    /**
     * 关闭HBase连接
     */
    @PreDestroy
    public void close() throws IOException {
        if (con != null) {
            con.close();
        }
    }

}
