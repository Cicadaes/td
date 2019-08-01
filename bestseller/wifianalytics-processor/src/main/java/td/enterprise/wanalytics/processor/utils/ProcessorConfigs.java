package td.enterprise.wanalytics.processor.utils;

import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.Properties;

/**
 * 从配置文件获取系统参数
 * @author tao.yang@tendcloud.com
 */
public class ProcessorConfigs {

	private static Properties processWiFiConfig;
	
	static {
		ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext(new String[] {"processorWiFiConfigContext.xml"});
		processWiFiConfig = applicationContext.getBean("processorWiFiConfig", Properties.class);
		applicationContext.close();
	}
	
	public static Properties getprocessWiFiConfigProperties() {
		return processWiFiConfig;
	}

}
