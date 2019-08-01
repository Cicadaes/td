package com.talkingdata.marketing.batch.es;

import com.talkingdata.marketing.batch.bean.BatchNoticeWrapper;
import com.talkingdata.marketing.batch.bean.MessageData;
import com.talkingdata.marketing.batch.producer.AbstractEsSearchScroll;
import com.talkingdata.marketing.batch.util.HdfsUtil;
import com.talkingdata.marketing.core.entity.campaign.BatchNotice;
import com.talkingdata.marketing.core.util.DateUtil;
import com.talkingdata.marketing.core.util.JsonUtil;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.Scroll;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;

/**
 * 通知信息EsSearchScrol
 *
 * @author hongsheng
 * @create 2017-11-21-下午8:32
 * @since JDK 1.8
 */
@Component
public class NoticeMessageEsSearchScroll extends AbstractEsSearchScroll<BatchNoticeWrapper> {

    private static final Logger logger = LoggerFactory.getLogger(NoticeMessageEsSearchScroll.class);

    /**
     * yyyy-MM-dd HH:mm:ss
     */
    public static final String Y4MMDD_HHMMSS_PATTERN = "yyyy-MM-dd HH:mm:ss";
    /**
     * 使用scroll查询es获取的一个批次的条数，即写Kafka一个批次的条数
     */
    private static final Integer BUFFER_SIZE = 10000;
    /**
     * 通知数据存储在es中的index名
     */
    private static final String EP_ES_INDEX = "mkt-messagedata";
    /**
     * 通知数据存储在es中的type名
     */
    private static final String EP_ES_TYPE = "messagedata";
    /**
     * 查询es时候，查询的column，该column用于体现时间区间
     */
    private static final String ES_QUERY_COLUMN = "time";

    @Autowired
    private HdfsUtil hdfsUtil;

    @Override
    public void readEsFailHandler(BatchNoticeWrapper batchNoticeWrapper, Integer offset) {
        logger.error("[ES查询]--查询通知数据时发生错误，BatchNoticeWrapper的信息是：{[]}", batchNoticeWrapper);
    }

    @Override
    public boolean isProcessDataByOffset(BatchNoticeWrapper batchNoticeWrapper, Integer offset) {
        return true;
    }

    @Override
    public void processData(List<String> data) {
        logger.info("[ES查询]--查询出符合条件的数据是：{}", data);
        StringBuilder builder = new StringBuilder();
        StringBuilder saveFilePath = new StringBuilder();
        int n = 0;
        data.forEach(e -> {
            MessageData messageData = null;
            try {
                messageData = JsonUtil.toObject(e, MessageData.class);
            } catch (IOException ex) {
                logger.error("MessageData数据是：{}, 转换MessageData发生错误{}", messageData, ex);
            }
            if (messageData != null) {
                builder.append(messageData.getId()).append("\n");
                if (n == 0) {
                    saveFilePath.append("/tmp/mkt/").append(messageData.getCampaignId()).append(File.separator).append(messageData.getPipelineDefinitionId())
                        .append(File.separator).append(messageData.getNodeId()).append(".csv");
                }
            }
        });
        hdfsUtil.appendHdfsFile(saveFilePath.toString(), builder.toString());
    }

    @Override
    public SearchRequest getSearchRequest(BatchNoticeWrapper batchNoticeWrapper, Scroll scroll) {
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        QueryBuilder queryBuilder = getQueryBuilder(batchNoticeWrapper.getTime(), batchNoticeWrapper);
        logger.info("[ES查询]--查询通知数据条件{}", queryBuilder);
        searchSourceBuilder.query(queryBuilder).size(BUFFER_SIZE);
        // 使用_doc 排序效率更高
        searchSourceBuilder.sort("_doc");
        SearchRequest searchRequest = new SearchRequest(EP_ES_INDEX);
        searchRequest.types(EP_ES_TYPE).scroll(scroll).source(searchSourceBuilder);
        return searchRequest;
    }

    /**
     * 计算查询es的条件，循序通知无开始毫秒和结束毫秒参数
     *
     * @param currentTimeMillis 当前毫秒
     * @param batchNoticeWrapper
     * @return RangeQueryBuilder
     */
    private QueryBuilder getQueryBuilder(long currentTimeMillis, BatchNoticeWrapper batchNoticeWrapper) {
        BatchNotice batchNotice = batchNoticeWrapper.getBatchNotice();
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery()
            .must(QueryBuilders.termQuery("campaignId", batchNotice.getCampaignId()))
            .must(QueryBuilders.termQuery("pipelineDefinitionId", batchNotice.getPipelineId()))
            .must(QueryBuilders.termQuery("version", batchNotice.getVersion()))
            .must(QueryBuilders.termQuery("nodeId", batchNotice.getPipelineNodeId()))
            .must(QueryBuilders.termQuery("sentType", batchNotice.getNoticeType()));
        if (!batchNoticeWrapper.getCycleFlag()) {
            queryBuilder.must(getTimeRangeQueryBuilder(currentTimeMillis, batchNotice));
        }
        return queryBuilder;
    }

    /**
     * 设置时间条件参数
     *
     * @param currentTimeMillis
     * @param batchNotice
     * @return
     */
    private QueryBuilder getTimeRangeQueryBuilder(long currentTimeMillis, BatchNotice batchNotice) {
        RangeQueryBuilder rangeQueryBuilder = QueryBuilders.rangeQuery(ES_QUERY_COLUMN);
        if (batchNotice.getEndTime() == null) {
            rangeQueryBuilder.lt(DateUtil.date2String(Y4MMDD_HHMMSS_PATTERN, new Date(currentTimeMillis)));
        } else {
            rangeQueryBuilder.gte(DateUtil.date2String(Y4MMDD_HHMMSS_PATTERN, batchNotice.getEndTime()));
            rangeQueryBuilder.lt(DateUtil.date2String(Y4MMDD_HHMMSS_PATTERN, new Date(currentTimeMillis)));
        }
        return rangeQueryBuilder;
    }

}
