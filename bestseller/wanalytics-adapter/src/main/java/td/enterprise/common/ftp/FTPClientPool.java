package td.enterprise.common.ftp;

import java.util.NoSuchElementException;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.pool2.ObjectPool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 自定义实现ftp连接池
 * @author liyinglei
 */
@Component
@Slf4j
public class FTPClientPool implements ObjectPool<FTPClient> {

    private static final int         DEFAULT_POOL_SIZE = 10;

    private BlockingQueue<FTPClient> pool;

    @Autowired
    private FTPClientFactory         factory;

    /**
     * 初始化连接池
     * @param maxPoolSize
     * 					最大连接数
     * @throws Exception
     */
    @PostConstruct
    private void initPool() throws Exception {
        this.pool = new ArrayBlockingQueue<FTPClient>(DEFAULT_POOL_SIZE);
        int count = 0;
        while (count < DEFAULT_POOL_SIZE) {
            this.addObject();
            count++;
        }
    }

    /**
     * 从连接池中获取对象
     */
    @Override
    public FTPClient borrowObject() throws Exception, NoSuchElementException, IllegalStateException {
        FTPClient client = pool.take();
        if (client == null) {
            client = factory.makeObject();
            addObject();
        } else if (!factory.validateObject(client)) {
            invalidateObject(client);
            client = factory.makeObject();
            addObject();
        }

        return client;
    }

    /**
     * 返还一个对象(链接)
     */
    @Override
    public void returnObject(FTPClient client) throws Exception {
        if ((client != null) && !pool.offer(client, 3, TimeUnit.SECONDS)) {
            try {
                factory.destroyObject(client);
            } catch (Exception e) {
                throw e;
            }
        }
    }

    /**
     * 移除无效的对象(FTP客户端)
     */
    @Override
    public void invalidateObject(FTPClient client) throws Exception {
        pool.remove(client);
    }

    /**
     * 增加一个新的链接，超时失效
     */
    @Override
    public void addObject() throws Exception, IllegalStateException, UnsupportedOperationException {
        pool.offer(factory.makeObject(), 3, TimeUnit.SECONDS);
    }

    /**
     * 获取空闲链接数(这里暂不实现)
     */
    @Override
    public int getNumIdle() {
        return 0;
    }

    /**
     * 获取正在被使用的链接数
     */
    @Override
    public int getNumActive() {
        return 0;
    }

    @Override
    public void clear() throws Exception, UnsupportedOperationException {

    }

    /**
     * 关闭连接池
     */
    @Override
    public void close() {
        try {
            while (pool.iterator().hasNext()) {
                FTPClient client = pool.take();
                factory.destroyObject(client);
            }
        } catch (Exception e) {
            log.error("close ftp client pool failed...{}", e);
        }

    }

}
