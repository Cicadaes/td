package td.enterprise.service.DTO;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import td.enterprise.service.ThresholdService;

@Component("ThresholdParamConfigure")
public class ThresholdParamConfigure implements ApplicationListener<ContextRefreshedEvent> {
	
	public final static Logger logger = Logger.getLogger(ThresholdParamConfigure.class);
    
    @Autowired
    private ThresholdService thresholdService;
    
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
    	logger.debug("spring初始化开始======================>");
        if (event.getApplicationContext().getParent() == null) {//root application context 没有parent，他就是老大.
        	logger.debug("启动阈值设置初始化 的start方法进行阈值参数的初始化======================>");
        	thresholdService.start();
        } else {
        	logger.debug("spring初始化时,执行onApplicationEvent:event.getApplicationContext().getParent() != null======================>");
        }
        logger.debug("阈值参数初始化完毕======================>");
    }

}
