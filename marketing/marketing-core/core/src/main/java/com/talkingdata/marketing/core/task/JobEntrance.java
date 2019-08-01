package com.talkingdata.marketing.core.task;

import com.talkingdata.marketing.core.constant.SysJobConfigConstants;
import com.talkingdata.marketing.core.entity.admin.SysJobConfig;
import com.talkingdata.marketing.core.page.admin.SysJobConfigPage;
import com.talkingdata.marketing.core.service.admin.SysJobConfigService;
import com.talkingdata.marketing.core.util.SpringContextUtil;
import org.apache.commons.lang.StringUtils;
import org.quartz.CronTrigger;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleTrigger;
import org.quartz.impl.StdSchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.Collections;
import java.util.List;

/**
 * The type Job entrance.
 *
 * @author armeng
 * @description: 定时任务入口类
 * @version: 1.0
 * @modify:
 * @Copyright: 公司版权拥有  任务管理器所管理的任务必须实现 job接口,并重写execute才能被定时任务管理器加载成功。 如需要单线程执行的作业，需再实现StatefulJob接口，作业代码不变，实现该接口后， 执行完一次该任务才能再次执行。
 */
@Component
public class JobEntrance {
    private Logger logger = LoggerFactory.getLogger(getClass());

    /**
     * Quartz 调度器
     */
    private Scheduler scheduler = null;

    /**
     * 定时任务入口方法
     */
    public void execute() {
        // 查询FinJobConfig表生效的任务条目
        List<SysJobConfig> jobConfigList = findValidJobConfig();
        try {
            scheduler = StdSchedulerFactory.getDefaultScheduler();
            // 启动scheduler
            scheduler.start();
            logger.info("启动scheduler容器!");
        } catch (SchedulerException e1) {
            logger.error("创建Scheduler异常!");
        }
        if (jobConfigList.size() > 0) {
            logger.info("查询到有效的定时任务" + jobConfigList.size() + "条!");
        } else {
            logger.error("未查询到有效的定时任务!");
        }
        SysJobConfig jobConfig = null;
        for (int i = 0; i < jobConfigList.size(); i++) {
            jobConfig = jobConfigList.get(i);
            logger.info("准备加载定时任务:" + jobConfig.getName());

            // 如果是S或者是空的，则执行默认的SimpleTrigger
            if (StringUtils.isBlank(jobConfig.getTriggerType()) || jobConfig.getTriggerType()
                    .equals(SysJobConfigConstants.SysJobConfigTriggerTypeConstants.JOB_TRIGGER_TYPE_SIMPLE)) {
                if (jobConfig.getIntervall() == null) {
                    logger.error("定时任务:" + jobConfig.getName() + "间隔时间为空");
                    continue;
                }

                try {
                    // 任务明细对象
                    JobDetail jobDetail = new JobDetail(jobConfig.getName(), Scheduler.DEFAULT_GROUP + i, Class.forName(jobConfig.getClassName()));
                    // 任务触发对象 间隔时间单位(分钟)
                    SimpleTrigger trigger = new SimpleTrigger(jobConfig.getName(), Scheduler.DEFAULT_GROUP + i);
                    // 设置开始、结束时间
                    if (jobConfig.getStartTime() != null) {
                        trigger.setStartTime(jobConfig.getStartTime());
                    }
                    if (jobConfig.getEndTime() != null) {
                        trigger.setEndTime(jobConfig.getEndTime());
                    }
                    // 设置重复次数,无限次
                    trigger.setRepeatCount(SimpleTrigger.REPEAT_INDEFINITELY);
                    // 设置重复间隔时间单位毫秒 <=0则不允许加载改任务
                    if (jobConfig.getIntervall() != null && Integer.parseInt(jobConfig.getIntervall()) > 0) {
                        trigger.setRepeatInterval(Integer.parseInt(jobConfig.getIntervall()) * 1000);
                        // 添加到scheduler容器等待运行
                        scheduler.scheduleJob(jobDetail, trigger);
                        logger.info("加载定时任务:" + jobConfig.getName() + "成功");
                    } else {
                        logger.error("定时任务" + jobConfig.getName() + "间隔时间为:" + jobConfig.getIntervall() + ",加载失败");
                    }
                } catch (ClassNotFoundException e) {
                    logger.error("加载定时任务:" + jobConfig.getName() + "异常!类路径错误,找不到该实现类.", e);
                } catch (SchedulerException e) {
                    logger.error("加载定时任务:" + jobConfig.getName() + "异常!调度器异常!", e);
                } catch (IllegalArgumentException e) {
                    logger.error("加载定时任务:" + jobConfig.getName() + "异常!任务实现类未实现org.quartz.Job接口!", e);
                }
            } else {
                // cronTrigger
                if (StringUtils.isBlank(jobConfig.getCronExpression())) {
                    logger.error("定时任务:" + jobConfig.getName() + "cron表达式为空");
                    continue;
                }

                String cronExpression = jobConfig.getCronExpression();
                // 任务明细对象
                try {
                    JobDetail jobDetail = new JobDetail(jobConfig.getName(), Scheduler.DEFAULT_GROUP + i, Class.forName(jobConfig.getClassName()));
                    CronTrigger trigger = new CronTrigger(jobConfig.getName(), Scheduler.DEFAULT_GROUP + i, cronExpression);
                    scheduler.scheduleJob(jobDetail, trigger);
                    logger.info("加载定时任务:" + jobConfig.getName() + "成功");
                } catch (ClassNotFoundException e) {
                    logger.error("加载定时任务:" + jobConfig.getName() + "异常!类路径错误,找不到该实现类.", e);
                } catch (ParseException e) {
                    logger.error("加载定时任务:" + jobConfig.getName() + "异常!调度器异常!", e);
                } catch (SchedulerException e) {
                    logger.error("加载定时任务:" + jobConfig.getName() + "异常!调度器异常!", e);
                }
            }
        }
    }

    private List<SysJobConfig> findValidJobConfig() {
        SysJobConfigService sysJobConfigService = (SysJobConfigService) SpringContextUtil.getBean("sysJobConfigService");
        SysJobConfigPage sysJobConfigPage = new SysJobConfigPage();
        sysJobConfigPage.setPageSize(Integer.MAX_VALUE);
        sysJobConfigPage.setStatus(String.valueOf(SysJobConfigConstants.SysJobConfigStatusConstants.VALID));
        try {
            return sysJobConfigService.queryByList(sysJobConfigPage);
        } catch (Exception e) {
            logger.error("findValidJobConfig err:", e);
            return Collections.emptyList();
        }
    }

    /**
     * 退出任务调度 停止未执行的任务
     */
    public void exit() {
        try {
            scheduler.shutdown();
        } catch (SchedulerException e) {
            logger.error("退出定时任务时调度器异常!", e);
        }
    }
}