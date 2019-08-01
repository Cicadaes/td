package td.enterprise.wanalytics.processor.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;

import td.enterprise.framework.plugin.changer.atomic.impl.SpringDaoChanger;
import td.enterprise.wanalytics.processor.bean.FilterMacBean;

import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

/**
 * 把过滤出来的mac导入到数据库中工具类
 * @author junmin.li
 *
 */
public class FilterMacUtils {
    
    public static Logger logger = LoggerFactory.getLogger(FilterMacUtils.class);

    //过滤出来的mac地址集合
    //超过指定个数或者时间后，进行过滤
    public static Set <FilterMacBean> FILTER_MAC_SET = Collections.synchronizedSet(new HashSet<FilterMacBean>())  ;
    
    private static long lastSubmitTime = System.currentTimeMillis();
    
    private static int minSubmitSize = 10;
    
    private static int minSubmitInterval = 60;
    
    public static void add(FilterMacBean bean){
        FILTER_MAC_SET.add(bean);
    }
    
    static {
       Thread thread =  new Thread(new Runnable() {
            @Override
            public void run() {
                while(true){
                    try {
                        if (null != FILTER_MAC_SET
                                && !FILTER_MAC_SET.isEmpty()) {
                            if ((System.currentTimeMillis() - lastSubmitTime) / 1000 >= minSubmitInterval
                                    || FILTER_MAC_SET.size() >= minSubmitSize) {
                                submitData();
                                FILTER_MAC_SET.clear();
                                lastSubmitTime = System.currentTimeMillis();
                            }
                        }
                    } catch (Exception e) {
                        logger.error("============ FilterMacUtils error :" + e.getMessage(), e);
                        FILTER_MAC_SET.clear();
                        lastSubmitTime = System.currentTimeMillis();
                    }
                    try {
                        Thread.sleep(10000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                
            }
            
        });
       thread.setName("FilterMacUtilsThread");
       thread.start();
    }
    
    private static  void submitData() {
        //logger.info("FILTER_MAC_SET size-----------------:[" + Thread.currentThread().getName()+"],size:["+ FILTER_MAC_SET.size()+"]");
        JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
        StringBuilder sql = new StringBuilder("insert ignore into TD_CROWD_BLACK_LIST(`project_id`,`device_mac`,`source`,`status`,`tenant_id`,`creator`,`filter_reason`,`create_time`) values  ");
        int i = 0;
        Iterator<FilterMacBean>  iterator = FILTER_MAC_SET.iterator();
        
        while(iterator.hasNext()){
        	FilterMacBean bean = iterator.next();
            if(i==0){
                sql.append("(" + bean.getProjectId() + ",'" + bean.getMac() + "'," + bean.getFilterType().getName() + ",1,'" + bean.getTenantId() +"','system','" + bean.getFilterReason() + "','" + bean.getCreateTime()+ "')");
            }else{
                sql.append(",(" + bean.getProjectId() + ",'" + bean.getMac() + "'," + bean.getFilterType().getName() + ",1,'" + bean.getTenantId() +"','system','" + bean.getFilterReason() + "','" + bean.getCreateTime() + "')");
            }
            i ++;
            iterator.remove();
        }
        //logger.info("submitDataBlackListMacSQL-----------------:[" + sql.toString() + "]");
        jdbcTemplate.execute(sql.toString());
    }

}
