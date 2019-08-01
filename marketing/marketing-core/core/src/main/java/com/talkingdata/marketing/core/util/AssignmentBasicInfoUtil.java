package com.talkingdata.marketing.core.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Method;
import java.util.Date;

/**
 * The type Assignment basic info util.
 *
 * @create 2017 -05-16-下午2:55
 * @since JDK 1.8
 * @author hongsheng
 */
public class AssignmentBasicInfoUtil {

    private static final Logger logger = LoggerFactory.getLogger(AssignmentBasicInfoUtil.class);

	/**
	 * 创建数据时赋值
	 * 此方法要求参数对象必须包含下面的方法，否则赋值失败
	 *
	 * @param <D> the type parameter
	 * @param <S> the type parameter
	 * @param d   目标对象
	 * @param s   源对应
	 */
	public static <D, S> void setCreateBasicInfo(D d, S s) {
        try {
            Class dClazz = d.getClass();
            Class sClazz = s.getClass();

            Method setTenantId = dClazz.getMethod("setTenantId", String.class);
            Method getTenantId = sClazz.getMethod("getTenantId", null);
            setTenantId.invoke(d, (String) getTenantId.invoke(s));

            Method setCreator = dClazz.getMethod("setCreator", String.class);
            Method getCreator = sClazz.getMethod("getCreator", null);
            setCreator.invoke(d, (String) getCreator.invoke(s));

            Method setCreateBy = dClazz.getMethod("setCreateBy", String.class);
            Method getCreateBy = sClazz.getMethod("getCreateBy", null);
            setCreateBy.invoke(d, (String) getCreateBy.invoke(s));

            Method setCreateTime = dClazz.getMethod("setCreateTime", Date.class);
            setCreateTime.invoke(d, new Date());
        } catch (Exception e) {
            logger.info("setCreateBasicInfo method throws Exception ", e);
        }
    }

	/**
	 * 更新数据时赋值
	 * 此方法要求参数对象必须包含下面的方法，否则赋值失败
	 *
	 * @param <D> the type parameter
	 * @param <S> the type parameter
	 * @param d   目标对象
	 * @param s   源对应
	 */
	public static <D, S> void setUpdateBasicInfo(D d, S s) {
        try {
            Class dClazz = d.getClass();
            Class sClazz = s.getClass();

            Method setUpdater = dClazz.getMethod("setUpdater", String.class);
            Method getUpdater = sClazz.getMethod("getUpdater", null);
            setUpdater.invoke(d, (String) getUpdater.invoke(s));

            Method setUpdateBy = dClazz.getMethod("setUpdateBy", String.class);
            Method getUpdateBy = sClazz.getMethod("getUpdateBy", null);
            setUpdateBy.invoke(d, (String) getUpdateBy.invoke(s));
        } catch (Exception e) {
            logger.info("setUpdateBasicInfo method throws Exception ", e);
        }
    }
}
