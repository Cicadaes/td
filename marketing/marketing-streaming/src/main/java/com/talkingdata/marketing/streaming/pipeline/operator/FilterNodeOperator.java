package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.streaming.bitmap.MktBitmapImpl;
import com.talkingdata.marketing.streaming.cache.EhcacheService;
import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.streaming.pipeline.exception.CrowdNotMatchException;
import com.talkingdata.marketing.streaming.pipeline.exception.NodeOperatorException;
import com.talkingdata.marketing.streaming.pipeline.definition.node.FilterNodeDefinition;
import com.talkingdata.marketing.streaming.util.HbaseUtils;
import com.tendcloud.tenddata.entity.EventPackage;
import com.tenddata.bitmap.Bitmap;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.util.Iterator;
import java.util.List;
import java.util.zip.GZIPInputStream;

/**
 * 过滤器算子
 *
 * @author hongsheng
 * @create 2017-09-27-下午6:02
 * @since JDK 1.8
 */
@Component
public class FilterNodeOperator extends AbstractOperator {
    private static final Logger logger = LoggerFactory.getLogger(FilterNodeOperator.class);
    /**
     * 存储行为bitmap的HBase表名
     */
    @Value("${filter.operator.hbase.table.name}")
    private String hbaseTableName;
    /**
     * HBase中存储行为bitmap的列族名
     */
    @Value("${filter.operator.hbase.column.family}")
    private String hbaseColumnFamily;
    /**
     * HBase中存储行为bitmap的列名
     */
    @Value("${filter.operator.hbase.bitmap.column}")
    private String hbaseBitmapColumn;
    /**
     * 过滤器算子条件直接的关系，或
     */
    private static final String FILTER_OPERATOR_RELATION_OR = "|";

    @Autowired
    private HbaseUtils hbase;

    @Autowired
    private EhcacheService ehcacheService;
    /*
     * 过滤器算子条件直接的关系，且
     */
    // private static final String FILTER_OPERATOR_RELATION_AND = "&";

    /**
     * 通过行为标签的Bitmap过滤用户
     *
     * @param pipelineDefinition pipeline数据
     * @param nodeDefinition     当前执行的具体算子
     * @param eventPackage       用户的属性、行为等数据
     * @return true：满足条件，false
     * @throws NodeOperatorException  NodeOperatorException
     * @throws CrowdNotMatchException 如果eventpackage人群id与算子人群id不符，抛出此异常
     */
    @Override
    public Boolean executor(PipelineDefinition pipelineDefinition, AbstractNodeDefinition nodeDefinition,
                            EventPackage eventPackage) throws NodeOperatorException, CrowdNotMatchException {
        validateCrowdIsMatch(pipelineDefinition, eventPackage, nodeDefinition);
        FilterNodeDefinition filterNodeDef;
        if (nodeDefinition instanceof FilterNodeDefinition) {
            filterNodeDef = (FilterNodeDefinition) nodeDefinition;
        } else {
            throw new NodeOperatorException("AbstractNodeDefinition 不是正确的 FilterNodeDefinition");
        }
        boolean result = false;
        List<String> tagRowKeyList = filterNodeDef.getTagRowKeyList();
        if (tagRowKeyList == null) {
            logger.error("pipelineId: {}, filter operator tag list is null", pipelineDefinition.getId());
            return false;
        }
        for (String rowKey : tagRowKeyList) {
            MktBitmapImpl mktBitmap = getMktBitmap(rowKey);
            boolean contains = mktBitmap.contains(eventPackage.additiveProfile.offset);
            if (FILTER_OPERATOR_RELATION_OR.equals(filterNodeDef.getRelation()) && contains) {
                return true;
            } else {
                result = contains;
            }
        }
        logger.warn("mDeviceId: {}, pipelineId: {}, nodeName: {} tagRowKeyList: {}, offset: {}, filterOperator return false",
                eventPackage.mDeviceId, pipelineDefinition.getId(), filterNodeDef.getName(),
                StringUtils.join(tagRowKeyList, ","), eventPackage.additiveProfile.offset);
        return result;
    }

    /**
     * 根据rowkey查询HBase，并将查询出来的Bitmap转换成MktBitmapImpl
     *
     * @param rowKey rowKey
     * @return MktBitmapImpl
     */
    private MktBitmapImpl getMktBitmap(String rowKey) {
        byte[] bitMapByte = ehcacheService.findBitmapCache(rowKey);
        if (bitMapByte == null) {
            // 查询HBase
            bitMapByte = hbase.getByRowKey(hbaseTableName, rowKey, hbaseColumnFamily, hbaseBitmapColumn);
            if (bitMapByte == null) {
                bitMapByte = new byte[0];
            }
            ehcacheService.saveBitmapCache(rowKey, bitMapByte);
        }
        MktBitmapImpl mktBitmap = new MktBitmapImpl();
        if (bitMapByte.length == 0) {
            logger.error("rowKey: {},tableName: {}, column_family: {}, column: {}, value not exist",
                    rowKey, hbaseTableName, hbaseColumnFamily, hbaseBitmapColumn);
            return mktBitmap;
        }
        // 转换byte数组为Bitmap对象
        ByteArrayInputStream bais = new ByteArrayInputStream(bitMapByte);
        GZIPInputStream gzipIn;
        Bitmap bitmap;
        try {
            gzipIn = new GZIPInputStream(bais);
            ObjectInputStream is = new ObjectInputStream(gzipIn);
            bitmap = (Bitmap) is.readObject();
        } catch (IOException | ClassNotFoundException e) {
            logger.error("rowKey: {},tableName: {}, column_family: {}, column: {}, bitmap transform failed: ",
                    rowKey, hbaseTableName, hbaseColumnFamily, hbaseBitmapColumn, e);
            return mktBitmap;
        }
        // 将Bitmap转换为mktBitmap
        Iterator<Integer> offsetIterator = bitmap.offsetIterator();
        while (offsetIterator.hasNext()) {
            mktBitmap.set(offsetIterator.next());
        }
        return mktBitmap;
    }
}
