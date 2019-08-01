package com.talkingdata.marketing.batch.producer;

import com.talkingdata.marketing.batch.bean.BatchProcessDetail;
import com.talkingdata.marketing.batch.bean.BatchProcessDetailWrapper;
import com.talkingdata.marketing.batch.bean.EventPackageWraper;
import com.talkingdata.marketing.batch.dao.BatchProcessDetailDao;
import com.talkingdata.marketing.batch.message.KafkaProducer;
import com.talkingdata.marketing.core.util.JsonUtil;
import org.apache.commons.lang.StringUtils;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.Scroll;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * 查询ES中eventpackage的数据并写入到Kafka中
 *
 * @author Created by tend on 2017/11/21.
 */
@Lazy
@Component
public class EpEs2KafkaProducer extends AbstractEsSearchScroll<BatchProcessDetailWrapper> {
    private static final Logger logger = LoggerFactory.getLogger(EpEs2KafkaProducer.class);
    /**
     * eventpackage存储在es中的index名
     */
    private static final String EP_ES_INDEX = "mkt-eventpackage";
    /**
     * eventpackage存储在es中的type名
     */
    private static final String EP_ES_TYPE = "eventpackage";
    /**
     * 使用scroll查询es获取的一个批次的条数，即写Kafka一个批次的条数
     */
    private static final Integer BUFFER_SIZE = 100;
    /**
     * 查询es时候，查询的column，该column用于体现时间区间
     */
    private static final String ES_QUERY_COLUMN = "nextTriggerTime";

    private static final Integer FIVE_MINUTE_MILLIS = 5 * 60 * 1000;

    @Autowired
    private KafkaProducer kafkaProducer;

    @Autowired
    private BatchProcessDetailDao batchProcessDetailDao;

    @Autowired
    private Hdfs2KafkaProducer hdfs2KafkaProducer;

    /**
     * 根据数据库中处理事件段，将ES中数据写至Kafka，并更新数据库
     */
    public boolean producer() {
        BatchProcessDetail processDetail = batchProcessDetailDao.recentlyBatchProcess();
        processCaclStatus(processDetail);
        producerErrorFile(processDetail);
        // 当前时间减去5分钟，防止时间不同步造成数据丢失，服务器简时间同步很重要
        long currentTimeMillis = System.currentTimeMillis() - FIVE_MINUTE_MILLIS;
        BatchProcessDetailWrapper processDetailWrapper = new BatchProcessDetailWrapper(processDetail, currentTimeMillis);
        if (searchScrollEs(processDetailWrapper)) {
            persistentDetail(processDetailWrapper, null);
            return true;
        }
        return false;
    }

    @Override
    public void readEsFailHandler(BatchProcessDetailWrapper detailWrapper, Integer offset) {
        // 直接更新当前的offset，并更新其状态为待处理
        if (detailWrapper.getProcessDetail() != null) {
            batchProcessDetailDao.updateEsScrollOffsetById(detailWrapper.getProcessDetail().getId(), offset);
            batchProcessDetailDao.updateProcessingCalcStatusById(detailWrapper.getProcessDetail().getId(),
                    BatchProcessDetailDao.WAIT_CALC_STATUS);
        } else {
            // 如果第一次查询，失败了需要在数据库中插入一条数据并记录offset
            persistentDetail(detailWrapper, offset);
        }
    }

    @Override
    public void processData(List<String> data) {
        List<String> message = new ArrayList<>();
        for (String datum : data) {
            try {
                EventPackageWraper epWraper = JsonUtil.toObject(datum, EventPackageWraper.class);
                message.add(epWraper.getEventPackage());
            } catch (IOException e) {
                logger.error("查询Es的index: {}, type: {}, 返回数据: {}, 不是EventPackageWraper的json数据",
                        EP_ES_INDEX, EP_ES_TYPE, datum);
            }
        }
        kafkaProducer.sendMessage(message);
    }

    @Override
    public SearchRequest getSearchRequest(BatchProcessDetailWrapper detailWrapper, Scroll scroll) {
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        RangeQueryBuilder rangeQueryBuilder = getRangeQueryBuilder(detailWrapper.getTimeMillis(), detailWrapper.getProcessDetail());
        searchSourceBuilder.query(rangeQueryBuilder).size(BUFFER_SIZE);
        // 使用_doc 排序效率更高
        searchSourceBuilder.sort("_doc");
        SearchRequest searchRequest = new SearchRequest(EP_ES_INDEX);
        searchRequest.types(EP_ES_TYPE).scroll(scroll).source(searchSourceBuilder);
        return searchRequest;
    }

    @Override
    public boolean isProcessDataByOffset(BatchProcessDetailWrapper detailWrapper, Integer offset) {
        BatchProcessDetail detail = detailWrapper.getProcessDetail();
        return detail == null || detail.getEsScrollOffset() == null || offset >= detail.getEsScrollOffset();
    }

    /**
     * 持久化处理流程数据到数据库
     */
    private void persistentDetail(BatchProcessDetailWrapper detailWrapper, Integer offset) {
        BatchProcessDetail processDetail = detailWrapper.getProcessDetail();
        BatchProcessDetail currentBatch = new BatchProcessDetail();
        currentBatch.setStatus(BatchProcessDetailDao.RECENTLY_BATCH_STATUS);
        currentBatch.setCalcStatus(BatchProcessDetailDao.WAIT_CALC_STATUS);
        currentBatch.setEsScrollOffset(offset);
        if (processDetail == null) {
            currentBatch.setStartTime(new Date(0));
        } else {
            currentBatch.setStartTime(processDetail.getEndTime());
        }
        currentBatch.setEndTime(new Date(detailWrapper.getTimeMillis()));
        currentBatch.setErrorFilePath("");
        currentBatch.setErrorInfo("");
        if (processDetail != null) {
            batchProcessDetailDao.updateBeforeStatusById(processDetail.getId());
        }
        batchProcessDetailDao.saveBatchProcess(currentBatch);
    }

    /**
     * 判断计算状态是否为计算中，如果为计算中则表示已有程序计算，则退出
     * 否则，更新计算状态为计算中
     */
    private void processCaclStatus(BatchProcessDetail processDetail) {
        if (processDetail != null) {
            if (Objects.equals(processDetail.getCalcStatus(), BatchProcessDetailDao.PROCESSING_CALC_STATUS)) {
                logger.info("batch id: {}, startTime: {}, entTime: {}, is processing, exit. ",
                        processDetail.getId(), processDetail.getStartTime(), processDetail.getEndTime());
                System.exit(0);
            }
            batchProcessDetailDao.updateProcessingCalcStatusById(processDetail.getId(), BatchProcessDetailDao.PROCESSING_CALC_STATUS);
        }
    }

    /**
     * 处理上一次的未发送至Kafka的信息文件
     *
     * @param processDetail 上次detail对象
     */
    private void producerErrorFile(BatchProcessDetail processDetail) {
        if (processDetail != null && StringUtils.isNotEmpty(processDetail.getErrorFilePath())) {
            hdfs2KafkaProducer.producer(processDetail.getErrorFilePath());
        }
    }

    /**
     * 计算查询es的条件，开始毫秒和结束毫秒
     *
     * @param currentTimeMillis 当前毫秒
     * @param processDetail     上次detail对象
     * @return RangeQueryBuilder
     */
    private RangeQueryBuilder getRangeQueryBuilder(long currentTimeMillis, BatchProcessDetail processDetail) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        RangeQueryBuilder rangeQueryBuilder = QueryBuilders.rangeQuery(ES_QUERY_COLUMN);
        if (processDetail == null) {
            rangeQueryBuilder.lt(format.format(currentTimeMillis));
            logger.info("search es condition: {} < {}", ES_QUERY_COLUMN, format.format(currentTimeMillis));
        } else {
            if (processDetail.getEsScrollOffset() != null && processDetail.getEsScrollOffset() > 0) {
                // 如果查询出来的offset不为空且大于0，则表示上次Scroll处理失败过，继续处理上批次
                String start = format.format(processDetail.getStartTime());
                String end = format.format(processDetail.getEndTime());
                rangeQueryBuilder.gte(start);
                rangeQueryBuilder.lt(end);
                logger.info("search es condition: {} >= {} && < {} ", ES_QUERY_COLUMN, start, end);
            } else {
                // 否则处理新的批次
                String start = format.format(processDetail.getEndTime());
                String end = format.format(currentTimeMillis);
                rangeQueryBuilder.gte(start);
                rangeQueryBuilder.lt(end);
                logger.info("search es condition: {} >= {} && < {} ", ES_QUERY_COLUMN, start, end);
            }
        }
        return rangeQueryBuilder;
    }
}
