package com.talkingdata.marketing.core.util;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * The type Spring context util.
 * @author hongsheng
 */
public class SpringContextUtil{
    private static ApplicationContext applicationContext = null;

	/**
	 * Sets application context.
	 *
	 * @param applicationContext the application context
	 * @throws BeansException the beans exception
	 */
	public static void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        if(SpringContextUtil.applicationContext == null){
            SpringContextUtil.applicationContext  = applicationContext;
        }
    }

	/**
	 * 获取applicationContext
	 *
	 * @return ApplicationContext application context
	 */
	public synchronized static ApplicationContext getApplicationContext() {
        if (applicationContext == null){
            applicationContext = new ClassPathXmlApplicationContext("classpath:config/spring-config.xml");
        }
        return applicationContext;
    }

	/**
	 * //通过name获取 Bean.
	 *
	 * @param name the name
	 * @return object object
	 */
	public static Object getBean(String name){
        return getApplicationContext().getBean(name);
    }

	/**
	 * //通过class获取Bean.
	 *
	 * @param <T>   the type parameter
	 * @param clazz the clazz
	 * @return t t
	 */
	public static <T> T getBean(Class<T> clazz){
        return getApplicationContext().getBean(clazz);
    }

	/**
	 * 通过name,以及Clazz返回指定的Bean
	 *
	 * @param <T>   the type parameter
	 * @param name  the name
	 * @param clazz the clazz
	 * @return t t
	 */
	public static <T> T getBean(String name,Class<T> clazz){
        return getApplicationContext().getBean(name, clazz);
    }
}