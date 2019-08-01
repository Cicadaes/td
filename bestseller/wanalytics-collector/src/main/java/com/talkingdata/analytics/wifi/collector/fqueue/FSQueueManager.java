package com.talkingdata.analytics.wifi.collector.fqueue;

import com.google.code.fqueue.FQueue;
import com.talkingdata.analytics.wifi.collector.config.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by loong on 4/13/16
 */
public class FSQueueManager {

    private FSQueueManager() {
        init(initReceiveQ);
    }

    private static FSQueueManager instance = null;

    private static Logger logger = LoggerFactory.getLogger(FSQueueManager.class);

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
    private FQueue receiveq;

    // 解析后的事件queue
    private FQueue eventq;
    // 失败重发queue
    private FQueue resendQ;

    private static final int initReceiveQ = 1;
    private static final int initEventQ = 2;
    private static final int initResendQ = 4;

    public void init(int flag) {
        try {
            if ((flag & initReceiveQ) == initReceiveQ && receiveq == null) {
                logger.info("wifi fqueue path : " + Configuration.get("receivefq.wifi"));
                logger.info("fqueue size : " + Configuration.get("fqueue.size"));
                receiveq = new FQueue(Configuration.get("receivefq.wifi"), Configuration.getInt("fqueue.size"));
            }
//            if ((flag & initEventQ) == initEventQ && eventq == null) {
//                eventq = new FQueue(Configuration.get("eventfq"), Configuration.getInt("fqueue.size"));
//            }
//            if ((flag & initResendQ) == initResendQ && resendQ == null) {
//                resendQ = new FQueue(Configuration.get("resendfq"), Configuration.getInt("fqueue.size"));
//            }

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


    public FQueue getEventFQueue() {
        if (eventq == null) {
            synchronized (FSQueueManager.class) {
                if (eventq == null) {
                    init(initEventQ);
                }
            }
        }
        return eventq;
    }

    public FQueue getResendFQueue() {
        if (resendQ == null) {
            synchronized (FSQueueManager.class) {
                if (resendQ == null) {
                    init(initResendQ);
                }
            }
        }
        return resendQ;
    }

    public long getWiFiReceiveFQueueSize() {
        return receiveq.size();
    }

    public long getEventFQueueSize() {
        return eventq.size();
    }

    public long getResendFQueueSize() {
        return resendQ.size();
    }

}
