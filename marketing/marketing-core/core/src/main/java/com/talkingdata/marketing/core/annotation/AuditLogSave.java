package com.talkingdata.marketing.core.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 审计日志接口
 * @author xiaoming.kang
 * Created by armeng on 2018/01/18.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface AuditLogSave {

    OpType opType();
    TargetType targetType();
    String targetId() default "";

    enum OpType{
        /**
        新建
         */
        create,
        /**
        更新
         */
        update,
        /**
         * 删除
         */
        delete
    }

    enum TargetType{
        /**
         * 人群
         */
        crowd,
        /**
         * 营销活动
         */
        campaign,
        /**
         * 投放
         */
        segment
    }
}
