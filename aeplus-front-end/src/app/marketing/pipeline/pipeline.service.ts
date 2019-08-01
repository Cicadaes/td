import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../curd.service';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class PipelineService extends CurdService {

    constructor(private injector: Injector) {
        super(injector);
        this.baseUrl = '/marketing-api';
    }

    /**
     * 获取所有节点配置参数
     */
    getOperatorList() {
        const url = `${this.baseUrl}/campaign/pipelineOperators`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取活动详情
     */
    getCampaign(campaignId: number) {
        const url = `${this.baseUrl}/campaign/campaigns/${campaignId}`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取营销流程详情数据
     */
    getPipeline(pipelineId: number) {
        const url = `${this.baseUrl}/campaign/pipelines/${pipelineId}`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 营销流程保存草稿
     */
    saveDraft(pipelineData: any) {
        const url = `${this.baseUrl}/campaign/pipelines/saveDraft`;
        return this.http.post(url, pipelineData).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 修改流程名称
     */
    savePipelineName(pipelineId: number, pipelineName: string) {
        const url = `${this.baseUrl}/campaign/pipelines/savePipelineName/${pipelineId}?pipelineName=${pipelineName}`;
        return this.http.post(url, {}).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取人群列表
     */
    getCrowd() {
        const url = `${this.baseUrl}/crowd/crowds?page=1&pageSize=99999999`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取人群列表 模糊查询和分页 TODO 分页还未做
     */
    getCrowdList(crowdName: string, page: number, rows: number) {
//        const url = `${this.baseUrl}/crowd/crowds/crowds/query?crowdName=${crowdName}&page=${page}&rows=99999999`;
        let url = `${this.baseUrl}/crowd/crowds?page=1&pageSize=99999999`;
        if (crowdName) {
            url += '&refName=' + crowdName;
        }
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取禁止规则 pipeLine 第三个下拉框数据
     */
    getForbiddenRule(pipelineId: number, ruleType: number) {
        const url = `${this.baseUrl}/campaign/pipelineOperators/forbidden-rule/${pipelineId}/${ruleType}`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取禁止规则   事件列表
     * 获取计时器组件 事件列表
     * 获取触发器组件 事件列表
     */
    getEventListForTimer(isPipelineEdit: boolean, data?: any) {
        let url = `${this.baseUrl}/config/eventConfigs/all`;
        if (isPipelineEdit) {
            url += `?status=0`;
        }
        if (data) {
            let paramUrl = this.getParams(data);
            if(url.indexOf('?') > -1){
                url = `${url}&${paramUrl.substring(1)}`;
            }else{
                url += paramUrl;
            }
        }
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取过滤器 过滤条件 标签列表
     */
    getTargetListForFilter() {
        const url = `${this.baseUrl}/crowd/crowds?page=1&pageSize=99999999`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取分流器 维度参数
     * TODO 弃用
     */
    getShuntDimensions() {
        const url = `${this.baseUrl}/campaign/pipelineOperators/dimensions`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取分流器 维度数据
     * @param isPipelineEdit 是否可以修改pipe   true查询过滤的数据
     */
    getShuntDimensionsList(isPipelineEdit: boolean) {
        let url = `${this.baseUrl}/config/dimensionConfigs/all`;
        if (isPipelineEdit) {
            url += `?status=0`;
        }
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取分流器 维度数据 全部的
     */
    getShuntDimensionsOption(dicKey: string) {
        const url = `${this.baseUrl}/config/dimensionOptionConfigs/queryOptionsFromApi?dicKey=${dicKey}`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取分流器 维度值数据
     * dimensionId
     */
    getShuntDimensionsOptionList(dimensionId: number) {
        const url = `${this.baseUrl}/config/dimensionOptionConfigs/queryAll?dimensionId=${dimensionId}`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取触发器组件 指标数据
     * scopeType 0 查所有 1 查规则条件指标  2 查触发器指标 3 查计划目标
     */
    getTriggerTargetList(scopeType: number, isPipelineEdit: boolean) {
        let url = `${this.baseUrl}/config/targetConfigs/scope/${scopeType}`;
        if (isPipelineEdit) {
            url += `?status=0`;
        }
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取投放组列表
     */
    getSegmentGroupList(campaignId: number) {
        const url = `${this.baseUrl}/campaign/segmentGroups?campaignId=${campaignId}`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 新建投放组(bad:有业务逻辑，不加入bad自动处理)
     */
    saveSegmentGroup(campaignId: number, groupName: string, productId: any) {
        const url = `${this.baseUrl}/campaign/segmentGroups/create`;
        const body = {
            groupName: groupName,
            campaignId: campaignId,
            productId: productId
        };
        return this.http.post(url, body).pipe(catchError(this.handleError));
    }

    /**
     * 删除投放组
     */
    deleteSegmentGroup(groupId: number) {
        const url = `${this.baseUrl}/campaign/segmentGroups/${groupId}`;
        return this.http.delete(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取push 插入自定义参数列表
     */
    getCustomParameters(pipelineId: number) {
        const url = `${this.baseUrl}/campaign/pipelines/variables/${pipelineId}`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取app配置
     */
    getAppConfig(appId: string) {
        const url = `${this.baseUrl}/config/appConfigs/appId/${appId}`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取渠道配置列表
     */
    getChannelList(type: number) {
        const url = `${this.baseUrl}/config/channelConfigs/byChannelType/${type}`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 开始pipeline测试
     */
    debugStart(data: any, pipelineId: number) {
        const url = `${this.baseUrl}/campaign/pipelines/${pipelineId}/debug`;
        return this.http.post(url, data).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 暂停pipeline测试
     */
    debugPause(pipelineId: number) {
        const url = `${this.baseUrl}/campaign/pipelines/${pipelineId}/debugPause`;
        return this.http.post(url, {}).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 恢复pipeline测试
     */
    debugResume(pipelineId: number) {
        const url = `${this.baseUrl}/campaign/pipelines/${pipelineId}/debugResume`;
        return this.http.post(url, {}).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 终止pipeline测试
     */
    debugAbort(pipelineId: number) {
        const url = `${this.baseUrl}/campaign/pipelines/${pipelineId}/debugAbort`;
        return this.http.post(url, {}).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 创建人群 （营销闭环人群 不是用户人群）(bad:有业务逻辑，不加入bad自动处理)
     */
    createCrowd(crowdName: string) {
        const url = `${this.baseUrl}/crowd/crowds`;
        return this.http.post(url, crowdName).pipe(catchError(this.handleError));
    }

    /**
     * 根据人群名称获取人群  （获取营销闭环人群）
     */
    getCrowdByCrowdName(crowdName: string) {
        const url = `${this.baseUrl}/crowd/crowds/crowds/findByName?crowdName=${crowdName}&page=1&rows=10`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * pipeline校验
     */
    check(pipeline: any) {
        const url = `${this.baseUrl}/campaign/pipelines/check`;
        return this.http.post(url, pipeline).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * pipeline提交
     */
    submitPipeline(pipelineId: number) {
        const url = `${this.baseUrl}/campaign/pipelines/submit/${pipelineId}`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 获取生成人群列表
     */
    generateBehaviorPath(nodeId: number, diagram: string) {
        const url = `${this.baseUrl}/campaign/pipelineOperators/generateBehaviorPath?nodeId=${nodeId}`;
        return this.http.post(url, diagram).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 提前终止规则 pipeLine 第一个下拉框数据
     */
    getTerminationRule(campaignId: any, pipelineId: any) {
        const url = `${this.baseUrl}/campaign/pipelineDefinitions/config/${campaignId}/${pipelineId}/terminationRule`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 根据pipelineId和nodeId获取segmentId和名称
     */
    getSegmentByPipelineId(pipelineId: number, nodeId: any) {
        const url = `${this.baseUrl}/campaign/pipelines/segment/${pipelineId}/${nodeId}`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }

    /**
     * 根据pipelineid获取monitor数据
     */
    getMonitorData(pipelineId: number) {
        const url = `${this.baseUrl}/campaign/pipelineMonitors/${pipelineId}`;
        return this.http.get(url).pipe(map(this.handleBad), catchError(this.handleError));
    }
}
