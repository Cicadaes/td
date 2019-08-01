package com.talkingdata.datacloud.util;

import java.lang.reflect.Array;
import java.util.Collection;
import java.util.Map;

/**
 * Created by qingfa.zhou on 15/12/29.
 */
public class ObjUtil {

    /**
     * 判断一个对象是否为空。它支持如下对象类型：
     * <ul>
     * <li>null : 一定为空
     * <li>字符串 : ""为空,多个空格也为空
     * <li>数组
     * <li>集合
     * <li>Map
     * <li>其他对象 : 一定不为空
     * </ul>
     *
     * @param obj 任意对象
     * @return 是否为空
     */
    public final static boolean isEmpty(final Object obj) {
        if (obj == null) {
            return true;
        }
        if (obj instanceof String) {
            return "".equals(String.valueOf(obj).trim());
        }
        if (obj.getClass().isArray()) {
            if (obj instanceof String[]) {
                return Array.getLength(obj) == 0 || "".equals(String.valueOf(Array.get(obj, 0)).trim());
            } else {
                return Array.getLength(obj) == 0;
            }
        }
        if (obj instanceof Collection) {
            return ((Collection<?>) obj).isEmpty();
        }
        if (obj instanceof Map) {
            return ((Map<?, ?>) obj).isEmpty();
        }
        return false;
    }
}
