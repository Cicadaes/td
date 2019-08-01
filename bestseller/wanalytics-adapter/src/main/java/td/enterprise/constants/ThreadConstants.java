package td.enterprise.constants;

/**
 * @description 开关常量
 * @author sxk
 * @date 2017年10月27日
 */
public class ThreadConstants {

    /**
     * kafka处理线程池
     */
    //public static volatile int OUT_THREAD_SIZE  = Runtime.getRuntime().availableProcessors();
    public static volatile int IN_THREAD_SIZE           = 200;
    public static volatile int OUT_THREAD_SIZE          = 200;
    /**
     * 发数据线程数
     */
    public static volatile int SEND_THREAD_SIZE         = 200;
    /**
     * 固定线程去消费内存队列
     */
    public static volatile int QUEUE_THREAD_SIZE        = 4;

    public static volatile int OUT_SCHEDULE_THREAD_SIZE = Runtime.getRuntime().availableProcessors();
    /**
     * runTime大于此值打印日志
     */
    public static int          RUN_TIME_PRINTLOG        = 500;

}
