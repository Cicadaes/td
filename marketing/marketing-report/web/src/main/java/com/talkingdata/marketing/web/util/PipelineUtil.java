package com.talkingdata.marketing.web.util;

import com.talkingdata.marketing.core.constant.PipelineDefinitionConstant;
import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.EdgeDefinition;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.exception.MktException;
import com.talkingdata.marketing.core.service.campaign.PipelineDefinitionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * pipeline工具类
 * @author chunyan.ji
 * @create 2017-08-17-上午10:00
 * @since JDK 1.8
 */
@Component
public class PipelineUtil {

    private static final Logger logger = LoggerFactory.getLogger(PipelineUtil.class);

    private static final String PIPELINE_INSTANCE = "pipeline_instance";

    @Autowired
    private PipelineDefinitionService pipelineDefinitionService;
    @Autowired
    private ExceptionBuilder exceptionBuilder;


    /**
     * 获取内存中pipeline实例
     * @param request
     * @return
     * @throws Exception
     */
    public PipelineDefinition currentPipeline(HttpServletRequest request) throws Exception {
        return (PipelineDefinition)request.getSession().getAttribute(PIPELINE_INSTANCE);
    }
    /**
     * 保存pipeline
     * 首先将pipeline保存到内存中，再异步将存储到数据库。(废弃)
     * 同步保存数据库，异常抛出。(启用)
     *
     * @param request
     * @param pipeline
     * @throws Exception
     */
    public void save(HttpServletRequest request, PipelineDefinition pipeline, Integer actionType) throws Exception {
        //insert
        if (pipeline.getId() == null) {
            try {
                insert(pipeline);
            } catch (Exception e) {
                logger.info("保存pipeline[{}]发生异常", pipeline, e);
                throw exceptionBuilder.buildMktException(ExceptionMessage.RIGHT_TOP);
            }
        } else {//update
            try {
                update(pipeline);
            } catch (Exception e) {
                logger.info("保存pipeline[{}]发生异常", pipeline, e);
                throw exceptionBuilder.buildMktException(ExceptionMessage.RIGHT_TOP);
            }
        }
    }
    /**
     * 插入数据库pipeline数据
     *
     * @param pipeline
     * @throws Exception
     */
    public void insert(PipelineDefinition pipeline) throws Exception {
        pipelineDefinitionService.insert(pipeline);
    }
    /**
     * 更新数据库pipeline数据
     *
     * @param pipeline
     * @throws Exception
     */
    public void update(PipelineDefinition pipeline) throws Exception {
        pipelineDefinitionService.updateByPrimaryKey(pipeline);
    }

    public Map genMap(List<AbstractNodeDefinition> nodeDefinitionList, List<EdgeDefinition> edgeDefinitionList) throws MktException {
        Map<String, Object> map = new HashMap<>(16);
        for (AbstractNodeDefinition nodeDefinition:nodeDefinitionList){
            if (map.containsKey(nodeDefinition.getId())){
                throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_REPEAT_ID);
            }
            map.put(nodeDefinition.getId(),nodeDefinition);
        }
        for (EdgeDefinition edgeDefinition:edgeDefinitionList){
            if (map.containsKey(edgeDefinition.getId())){
                throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_REPEAT_ID);
            }
            map.put(edgeDefinition.getId(),edgeDefinition);
        }
        return map;
    }

    public List getNodeIdList(List<AbstractNodeDefinition> nodeDefinitionList){
        List<String> arrayList = new ArrayList<>();
        for (AbstractNodeDefinition abstractNodeDefinition:nodeDefinitionList){
            arrayList.add(abstractNodeDefinition.getId());
        }
        return  arrayList;
    }

    public List getEdgeNodeIdList(List<EdgeDefinition> edgeDefinitionList){
        List<String> arrayList = new ArrayList<>();
        for (EdgeDefinition edgeDefinition:edgeDefinitionList){
            arrayList.add(edgeDefinition.getSourceNodeId());
            arrayList.add(edgeDefinition.getTargetNodeId());
        }
        return  arrayList;
    }
}
