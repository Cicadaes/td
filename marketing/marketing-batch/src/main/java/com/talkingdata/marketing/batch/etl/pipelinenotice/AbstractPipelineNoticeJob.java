package com.talkingdata.marketing.batch.etl.pipelinenotice;

import com.talkingdata.marketing.batch.bean.BatchNoticeWrapper;
import com.talkingdata.marketing.batch.es.NoticeMessageEsSearchScroll;
import com.talkingdata.marketing.core.entity.campaign.BatchNotice;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.core.service.campaign.BatchNoticeService;
import com.talkingdata.marketing.core.service.campaign.PipelineDefinitionService;
import com.talkingdata.marketing.core.util.CronDateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.talkingdata.marketing.core.constant.BatchNoticeConstants.BatchNoticeCalcStatusConstants.*;
import static com.talkingdata.marketing.core.constant.BatchNoticeConstants.BatchNoticeStatusConstants.*;
import static com.talkingdata.marketing.core.constant.TriggerConstants.TriggerTypeConstants.LOOP;

/**
 * Pipeline通知任务
 * 此类为抽象类，描述通知任务的执行步骤。具体类型的通知实施由具体类继承此类，并重写getProcessData()和notice()方法.
 *
 * @author hongsheng
 * @create 2017-11-13-下午2:35
 * @since JDK 1.8
 */
public abstract class AbstractPipelineNoticeJob {
    /**
     * 通知任务执行的时间跨度(毫秒)
     */
    private static final long ETL_EXECUTE_SPAN = 10 * 60 * 1000;
    /**
     * 当前处理截止时间
     */
    private Date currentProcessTime;
    /**
     * 当前处理流程数据的状态
     */
    private Map<Integer, List<Integer>> currentProcessPipelineStatus;
    /**
     * 5分钟时间跨度值(服务器时间同步问题)
     */
    private static final long TIME_SPAN_MILLIS = 5 * 60 * 1000;

    //    private static final DateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    private static final Logger logger = LoggerFactory.getLogger(AbstractPipelineNoticeJob.class);

    @Autowired
    protected BatchNoticeService batchNoticeService;

    @Autowired
    protected PipelineDefinitionService pipelineDefinitionService;

    @Autowired
    protected NoticeMessageEsSearchScroll noticeMessageEsSearchScroll;

    /**
     * 执行通知任务
     * 1.获取需要执行的数据
     * 2.执行通知
     */
    public void executeNotice() {
        logger.info("[Pipeline通知任务]--开始执行");
        try {
            List<BatchNotice> data = getProcessData();
            if (!data.isEmpty()) {
                notice(data);
            } else {
                logger.info("[Pipeline通知任务]--无需要执行的数据");
            }
        } catch (Exception e) {
            logger.error("[Pipeline通知任务]--任务执行失败", e);
        }
        logger.info("[Pipeline通知任务]--结束执行");
    }

    /**
     * 处理通知数据
     * -查询ES
     * -将结果写入HDFS(此操作在ES查询回调处理的方法processData())
     * -注意：需要过滤掉循环推送时间未到的通知，按ETL执行的时间间隔区间
     *
     * @param notices
     * @throws Exception
     */
    protected void processBatchNotices(List<BatchNotice> notices) throws Exception {
        notices.forEach(e -> {
            AbstractNodeDefinition nodeDefinition = null;
            boolean cycleFlag = false;
            Date nextNoticeTime = null;

            try {
                if (e.getTriggerType() == LOOP) {
                    if (!isExecuteOfCycleNotice(e.getNoticeTime())) {
                        return;
                    }
                    cycleFlag = true;
                    nextNoticeTime = CronDateUtils.getNextByCron(e.getCronExpression(), new Date());
                    batchNoticeService.updateNoticeTimeByPrimaryKey(e.getId(), nextNoticeTime);
                }
            } catch (Exception ex) {
                logger.info("[Pipeline通知任务]--当前通知数据BatchNotice[{}]更新循环下一次通知时间失败", e, ex);
                return;
            }
            BatchNoticeWrapper batchNoticeWrapper = new BatchNoticeWrapper(e, currentProcessTime.getTime() - TIME_SPAN_MILLIS, cycleFlag,
                    nodeDefinition);
            boolean result = noticeMessageEsSearchScroll.searchScrollEs(batchNoticeWrapper);
            if (result) {
                BatchNotice batchNotice = new BatchNotice();
                batchNotice.setId(e.getId());
                batchNotice.setStartTime(e.getEndTime());
                batchNotice.setEndTime(new Date(currentProcessTime.getTime() - TIME_SPAN_MILLIS));
                batchNotice.setCalcStatus(CALC_STATUS_FINISH);
                batchNotice.setStatus(getBatchNoticeNextStatus(e));
                try {
                    batchNoticeService.updateByPrimaryKeySelective(batchNotice);
                } catch (Exception ex) {
                    logger.error("[Pipeline通知任务]--当前通知数据BatchNotice[{}]更新失败", batchNotice, ex);
                }
            }
        });
        noticeMessageEsSearchScroll.close();
    }

    /**
     * 锁定当前未开始、进行中状态的数据
     *
     * @param noticeType 通知类型
     * @return
     * @throws Exception
     */
    protected List<BatchNotice> lockCurrentCalcBatchNotices(int noticeType) throws Exception {
        return batchNoticeService.findCurrentCalcBatchNotices(noticeType);
    }

    /**
     * 过滤出需要执行通知操作的数据
     *
     * @param batchNotices
     * @return
     * @throws Exception
     */
    protected List<BatchNotice> filterBatchNotices(final List<BatchNotice> batchNotices) throws Exception {
        Set<Integer> pipelineIds = getPipelineIds(batchNotices);
        if (pipelineIds.isEmpty()) {
            return Collections.EMPTY_LIST;
        }
        List<PipelineDefinition> pipelineDefinitions = pipelineDefinitionService.findSimpleInstanceByIds(pipelineIds);
        Map<Integer, List<Integer>> pipelineStatus = calcPipelineStatus(pipelineDefinitions);
        currentProcessPipelineStatus = pipelineStatus;

        List<BatchNotice> result = new ArrayList<>();
        filter(batchNotices, pipelineStatus.get(STATUS_PROGRESSING), result);
        filter(batchNotices, pipelineStatus.get(STATUS_FINISH), result);
        return result;
    }

    /**
     * 检索需要执行通知的数据
     *
     * @return List集合，如果没有则返回空集合
     * @throws Exception
     */
    protected abstract List<BatchNotice> getProcessData() throws Exception;

    /**
     * 执行通知
     *
     * @param notices 待执行通知的数据
     * @throws Exception
     */
    protected abstract void notice(List<BatchNotice> notices) throws Exception;

    /**
     * 判断循环推送是否执行
     *
     * @param noticeTime 上一次执行时间
     * @return 执行返回true, 不执行返回false
     * @throws Exception
     */
    private boolean isExecuteOfCycleNotice(Date noticeTime) {
        long startSentTime = currentProcessTime.getTime() - ETL_EXECUTE_SPAN;
        long endSentTime = currentProcessTime.getTime();
        long currentSentTime = noticeTime.getTime();
        if (currentSentTime >= startSentTime && currentSentTime < endSentTime) {
            return true;
        }
        return false;
    }

    /**
     * 获取当前通知数据的状态
     *
     * @param batchNotice
     * @return
     */
    private int getBatchNoticeNextStatus(BatchNotice batchNotice) {
        if (currentProcessPipelineStatus.get(STATUS_PROGRESSING).contains(batchNotice.getPipelineId())) {
            return STATUS_PROGRESSING;
        }
        if (currentProcessPipelineStatus.get(STATUS_FINISH).contains(batchNotice.getPipelineId())) {
            return STATUS_FINISH;
        }
        return batchNotice.getStatus();
    }

    /**
     * 过滤出进行中和已完成状态的数据，即为当次需要执行通知操作的数据
     * 注意：因为已完成状态的数据在此之前是进行中，需要再最后执行一次，才能置为已完成状态。
     *
     * @param batchNotices
     * @param pipelineIds
     * @param result
     * @throws Exception
     */
    private void filter(List<BatchNotice> batchNotices, List<Integer> pipelineIds, List<BatchNotice> result) throws Exception {
        pipelineIds.forEach(e1 -> {
            batchNotices.forEach(e2 -> {
                if (e1.equals(e2.getPipelineId())) {
                    result.add(e2);
                }
            });
        });
    }

    /**
     * 计算Pipeline状态，统计进行中和已完成两种状态
     *
     * @param pipelineDefinitions Pipeline数据
     * @return
     * @throws Exception
     */
    private Map<Integer, List<Integer>> calcPipelineStatus(List<PipelineDefinition> pipelineDefinitions) throws Exception {
        Map<Integer, List<Integer>> result = new HashMap<>(2);
        List<Integer> progress = new ArrayList<>();
        List<Integer> finish = new ArrayList<>();
        result.put(STATUS_PROGRESSING, progress);
        result.put(STATUS_FINISH, finish);

        Date nowTime = new Date(System.currentTimeMillis());
        currentProcessTime = nowTime;
        pipelineDefinitions.forEach(e -> {
            if (!nowTime.before(e.getStartTime()) && !nowTime.after(e.getEndTime())) {
                progress.add(e.getId());
            }
            if (nowTime.after(e.getEndTime())) {
                finish.add(e.getId());
            }
        });
        return result;
    }

    /**
     * 获取全部PipelineID
     *
     * @param batchNotices
     * @return 如果没有返回空集合
     * @throws Exception
     */
    private Set<Integer> getPipelineIds(List<BatchNotice> batchNotices) throws Exception {
        return batchNotices.stream().map(e -> e.getPipelineId()).collect(Collectors.toSet());
    }

}
