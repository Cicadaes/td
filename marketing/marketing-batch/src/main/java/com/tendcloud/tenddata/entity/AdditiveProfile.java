package com.tendcloud.tenddata.entity;

import com.tendcloud.tenddata.msgpack.TDPacker;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * 附加属性，Pipeline执行所需要的参数
 * passBeforeNodeTime 与 stageName lastProcessedNodeIds lastBranchEdgeIds nextTriggerTime可为空，其他不能为空
 *
 * @author Created by tend on 2017/10/31.
 */
public class AdditiveProfile implements TDMessagePackable {

    /**
     * TODO offset 需要数据中给到
     */
    public Integer offset = -1;

    /**
     * TODO 通过上一个节点的时间
     */
    public Long passBeforeNodeTime = 0L;

    /**
     * TODO 活动ID
     */
    public Integer campaignId;

    /**
     * TODO 人群ID
     */
    public Integer crowdId;

    /**
     * TODO pipeline定义ID
     */
    public Integer pipelineDefinitionId;

    /**
     * TODO 版本信息
     */
    public String version;

    /**
     * TODO Pipeline执行的上一个stage的stageName
     */
    public String stageName;

    /**
     * TODO 上次暂停,stage中已经处理过的NodeId,暂停完毕执行过的不在执行,例：执行到计时器或触发器需要暂停等待触发
     */
    public List<String> lastProcessedNodeIds = new ArrayList<>();

    /**
     * TODO 上个stage,算子所走的分支,需要根据分支信息计算下个stage中那些能执行那些不能执行
     */
    public List<String> lastBranchEdgeIds = new ArrayList<>();

    /**
     * TODO 下一次触发时间
     */
    public String nextTriggerTime;

    @Override
    public void messagePack(TDPacker pk) throws IOException {
        pk.packArray(8);
        pk.pack(offset);
        pk.pack(passBeforeNodeTime);
        pk.pack(campaignId);
        pk.pack(crowdId);
        pk.pack(pipelineDefinitionId);
        pk.pack(version);
        pk.pack(stageName);
        pk.packArray(lastProcessedNodeIds.size());
        for (String lastProcessedNodeId : lastProcessedNodeIds) {
            pk.pack(lastProcessedNodeId);
        }
        pk.packArray(lastBranchEdgeIds.size());
        for (String lastBranchEdgeId : lastBranchEdgeIds) {
            pk.pack(lastBranchEdgeId);
        }
        pk.pack(nextTriggerTime);
    }

    @Override
    public String toString() {
        return new StringBuilder("AdditiveProfile").append(Printag.OBJSTARTAG).append(this.getClass().getName()).append(Printag.OBJENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append("offset").append(Printag.STARTAG).append(offset).append(Printag.ENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append("passBeforeNodeTime").append(Printag.STARTAG).append(passBeforeNodeTime).append(Printag.ENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append("campaignId").append(Printag.STARTAG).append(campaignId).append(Printag.ENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append("crowdId").append(Printag.STARTAG).append(crowdId).append(Printag.ENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append("pipelineDefinitionId").append(Printag.STARTAG).append(pipelineDefinitionId).append(Printag.ENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append("version").append(Printag.STARTAG).append(version).append(Printag.ENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append("stageName").append(Printag.STARTAG).append(stageName).append(Printag.ENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("List<String>").append(Printag.LISTSTARTAG).append(lastProcessedNodeIds.size()).append(Printag.LISTENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append(lastProcessedNodeIds).append(Printag.OBJENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append("List<String>").append(Printag.LISTSTARTAG).append(lastBranchEdgeIds.size()).append(Printag.LISTENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append(Printag.SPACE).append(lastBranchEdgeIds).append(Printag.OBJENDTAG)
                .append(Printag.SPACE).append(Printag.SPACE).append("nextTriggerTime").append(Printag.STARTAG).append(nextTriggerTime).append(Printag.ENDTAG)
                .toString();
    }

}
