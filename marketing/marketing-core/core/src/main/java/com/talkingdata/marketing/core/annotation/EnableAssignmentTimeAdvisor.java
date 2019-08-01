package com.talkingdata.marketing.core.annotation;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Date;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * The type Enable assignment time advisor.
 * @author sheng.hong
 * @create 2017 -04-27-上午11:32
 * @since JDK 1.8
 */
@Aspect
@Component
public class EnableAssignmentTimeAdvisor {

    private static final Logger logger = LoggerFactory.getLogger(EnableAssignmentTimeAdvisor.class);

    /**
     * Assignment creat time and update time object.
     *
     * @param joinPoint the join point
     * @return the object
     * @throws Throwable the throwable
     */
    @Around(value = "@annotation(com.talkingdata.marketing.core.annotation.EnableAssignmentTime)")
    public Object assignmentCreatTimeAndUpdateTime(final ProceedingJoinPoint joinPoint) throws Throwable {
        Object param  = joinPoint.getArgs()[0];
        Class clazz = param.getClass();
        Method[] methods = clazz.getDeclaredMethods();
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            if ("createTime".equalsIgnoreCase(field.getName())) {
                String fieldSetName = parSetName(field.getName());
                if (!checkSetMet(methods, fieldSetName)) {
                    continue;
                }
                try {
                    Method fieldSetMet = clazz.getMethod(fieldSetName, field.getType());
                    fieldSetMet.invoke(param, new Date());
                } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                    logger.info("赋值发生异常：", e);
                }
            }
        }
        return joinPoint.proceed();
    }

    /**
     * 拼接在某属性的 set方法
     *
     * @param fieldName the field name
     * @return String string
     */
    public static String parSetName(String fieldName) {
        if (null == fieldName || "".equals(fieldName)) {
            return null;
        }
        return "set" + fieldName.substring(0, 1).toUpperCase()
                + fieldName.substring(1);
    }

    /**
     * 判断是否存在某属性的 set方法
     *
     * @param methods     the methods
     * @param fieldSetMet the field set met
     * @return boolean boolean
     */
    public static boolean checkSetMet(Method[] methods, String fieldSetMet) {
        for (Method met : methods) {
            if (fieldSetMet.equals(met.getName())) {
                return true;
            }
        }
        return false;
    }
}
