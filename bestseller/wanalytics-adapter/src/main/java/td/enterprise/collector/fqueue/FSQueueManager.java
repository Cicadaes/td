package td.enterprise.collector.fqueue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import td.enterprise.collector.config.Configuration;

import com.google.code.fqueue.FQueue;

/**
 * Created by loong on 4/13/16
 */
public class FSQueueManager {

    private FSQueueManager() {
        init(initReceiveQ);
    }

    private static FSQueueManager instance = null;

    private static Logger         logger   = LoggerFactory.getLogger(FSQueueManager.class);

    public static FSQueueManager getInstance() {
        if (instance == null) {
            synchronized (FSQueueManager.class) {
                if (instance == null) {
                    instance = new FSQueueManager();
                }
            }
        }
        return instance;
    }

    // 接收queue
    private FQueue           receiveq;

    private static final int initReceiveQ = 1;

    public void init(int flag) {
        try {
            if ((flag & initReceiveQ) == initReceiveQ && receiveq == null) {
                logger.info("wifi fqueue path : " + Configuration.get("receivefq.wifi"));
                logger.info("fqueue size : " + Configuration.get("fqueue.size"));
                receiveq = new FQueue(Configuration.get("receivefq.wifi"), Configuration.getInt("fqueue.size"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public FQueue getWiFiReceiveFQueue() {
        if (receiveq == null) {
            synchronized (FSQueueManager.class) {
                if (receiveq == null) {
                    init(initReceiveQ);
                }
            }
        }
        return receiveq;
    }

    public long getWiFiReceiveFQueueSize() {
        return receiveq.size();
    }

}
