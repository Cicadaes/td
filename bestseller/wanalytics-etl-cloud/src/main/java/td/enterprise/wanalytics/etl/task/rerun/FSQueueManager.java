package td.enterprise.wanalytics.etl.task.rerun;

import com.google.code.fqueue.FQueue;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

/**
 * junmin.li
 */
public class FSQueueManager {

    private FSQueueManager() {
        init();
    }

    private static FSQueueManager instance = null;

    private static final Logger logger = Logger.getLogger(FSQueueManager.class);

    public static FSQueueManager getInstance() {
        if (instance == null) {
            if (instance == null) {
                instance = new FSQueueManager();
            }
        }
        return instance;
    }

    // 接收queue
    private FQueue receiveq;

    public void init(){
        try {
            if ( receiveq == null) {
                String fqueuePath = SysConfigUtil.getValue(WifipixTaskConstant.FQUEUE_PATH);
                int fileSize = Integer.parseInt(SysConfigUtil.getValue(WifipixTaskConstant.FQUEUE_SIZE));
                logger.info("wifi fqueue path : " + fqueuePath);
                logger.info("fqueue size : " + fileSize);
                receiveq = new FQueue(fqueuePath, fileSize);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public FQueue getWiFiReceiveFQueue() {
        if (receiveq == null) {
           init();
        }
        return receiveq;
    }

    /**
     * 写入json
     * @param json
     */
    public  void in(String json){
        AsyncProcesser.getInstance().in(json);
    }

}
