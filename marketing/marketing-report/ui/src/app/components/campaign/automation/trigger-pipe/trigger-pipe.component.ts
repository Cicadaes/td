import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Message } from 'primeng/primeng';
import { PipelineNodeCommunicationService } from "../../../../services/communication/pipeline-node.communication.service";
import { PipelineDefinitionResourceService } from "../../../../services/admin/pipeline-definition.resource.service";
import { BehaviorDefinitionResourceService } from "../../../../services/admin/behavior-definition.resource.service";
import { TargetDefinitionResourceService } from "../../../../services/admin/target-definition.resource.service";
import * as moment from 'moment';

@Component({
	selector: 'trigger-pipe',
	templateUrl: 'trigger-pipe.component.html',
	styleUrls: ['trigger-pipe.component.scss'],
	providers: [BehaviorDefinitionResourceService, TargetDefinitionResourceService]
})

//触发管道
export class TriggerPipeComponent {

	//时间插件使用数据
    marketingValue: any = {
        showIcon: true,
        ranges: [{
            label: '今天', day: 1
        },
        {
            label: '最近七天', day: 7
        },
        {
            label: '最近一个月', day: 30
        },
        {
            label: '季度', day: 90
        }],
        dateRanges: { max: null, min: new Date(Date.now()) }
    };
    
    check_one: boolean = false;//触发规则按钮1

    check_two: boolean = false;//触发规则按钮2

    eventList: SelectItem[] = [];  //事件列表

    targetList: SelectItem[] = [];  //指标列表

    targetErrMsg: string[] = [];    //指标错误提示

    eventMap: any = {}; //事件map表 以code为key name为value

    targetMap: any = {}; //指标Map表 以code为key name为value

    otherTargetList: SelectItem[] = []; //同时满足条件

    compareList: SelectItem[] = [];  //对比下拉框数据

    lessThanDaysSelect: boolean = false;  //触发规则 n天内不被重复触发选项 默认不选择

    lessThanTimesSelect: boolean = false; //触发规则 触发次数不超过n次选项 默认不选择

    msgs: Message[] = [];  //检测成功\系统报错 使用

    @Input() nodeData: any;

    @Input() startTime: any;

    @Input() endTime: any;

    @Output() changeOverflow = new EventEmitter<any>();

    constructor(
        public pipelineNodeCommunicationService: PipelineNodeCommunicationService,
        public pipelineDefinitionResourceService: PipelineDefinitionResourceService,
        public behaviorDefinitionResourceService: BehaviorDefinitionResourceService,
        public targetDefinitionResourceService: TargetDefinitionResourceService
    ){
        let that = this;
    }

    ngOnChanges() {
        let that = this;
        that.marketingValue.dateRanges.min = new Date(that.pipelineNodeCommunicationService.startTime);
        that.marketingValue.dateRanges.max = new Date(that.pipelineNodeCommunicationService.endTime);
        that.marketingValue = Object.assign({}, that.marketingValue);
        that.compareList = [];
        that.compareList.push({label: '大于', value: '>'});
        that.compareList.push({label: '大于等于', value: '>='});
        that.compareList.push({label: '等于', value: '='});
        that.compareList.push({label: '小于', value: '<'});
        that.compareList.push({label: '小于等于', value: '<='});
        that.compareList.push({label: '区间', value: '&&'});
        if (!that.pipelineNodeCommunicationService.nodeData.monitorType) {
            that.pipelineNodeCommunicationService.nodeData.monitorType = '1'
        } else {
            that.pipelineNodeCommunicationService.nodeData.monitorType = that.pipelineNodeCommunicationService.nodeData.monitorType + '';   
        }
        if (!that.pipelineNodeCommunicationService.nodeData.branchType) {
            that.pipelineNodeCommunicationService.nodeData.branchType = '1';
        } else {
            that.pipelineNodeCommunicationService.nodeData.branchType = that.pipelineNodeCommunicationService.nodeData.branchType + '';
        }
        //如果没有数据默认显示事件
        if (!that.pipelineNodeCommunicationService.nodeData.targetType) {
            that.pipelineNodeCommunicationService.nodeData.targetType = 'event';
        }
        //触发规则  默认为没有规则
        if (!that.pipelineNodeCommunicationService.nodeData.unlimited) {
			that.pipelineNodeCommunicationService.nodeData['unlimited'] = 0;
        }
        if (that.pipelineNodeCommunicationService.nodeData.sameUserLessThanDays) {
            that.pipelineNodeCommunicationService.nodeData['unlimited'] = 1;
            that.lessThanDaysSelect = true;
        }
        if (that.pipelineNodeCommunicationService.nodeData.sameUserLessThanTimes) {
            that.pipelineNodeCommunicationService.nodeData['unlimited'] = 1;
            that.lessThanTimesSelect = true;
        }
        if (that.pipelineNodeCommunicationService.nodeData.sameUserTarget == 0) {
            that.check_two = true;
        }
        if (that.pipelineNodeCommunicationService.nodeData.sameUserTarget == 1) {
            that.check_one = true;
        }
        if (that.pipelineNodeCommunicationService.nodeData.startTime && that.pipelineNodeCommunicationService.nodeData.endTime) {
            that.marketingValue['data'] = {
                start: new Date(that.pipelineNodeCommunicationService.nodeData.startTime),
                end: new Date(that.pipelineNodeCommunicationService.nodeData.endTime)
            };
        } else {
            that.marketingValue['data'] = {
                start: that.marketingValue.dateRanges.min,
                end: that.marketingValue.dateRanges.max
            };
            that.pipelineNodeCommunicationService.nodeData.startTime = moment(that.marketingValue.dateRanges.min).valueOf();
            that.pipelineNodeCommunicationService.nodeData.endTime = moment(that.marketingValue.dateRanges.max).valueOf();
        }
        that.getEventList().then((data: any) => {
            return that.getTargetList();
        }).then((data: any) => {
            return that.getOtherTargetList();
        }).then((data: any) => {
            that.formatRule();
        }).catch((err: any) => {});
	}

    ngOnInit() {
        let that = this;
    }

    ngOnDestroy() {
    }

    //添加条件
    addCondition(conds: any){
        let that = this;
        let length = conds.length;
        if (!that.pipelineNodeCommunicationService.editFlag) {
            return;
        }
        if (length > 9) {
            that.showMessageNews('error', '最多可以添加10条');
		    return;
        }
        if (length != 0 && (!conds[length - 1].target || (!conds[length - 1].number && (!conds[length - 1].first || !conds[length - 1].second)))) {
            that.showMessageNews('error', '请选择指标并填写范围');
            return;
        }
        conds.push({code: '>'});
    }
    
    //添加单分支
    addSingleBranch(){
        let that = this;
        let branch: any;
        //如果活动不能修改 直接返回
        if (!that.pipelineNodeCommunicationService.editFlag) {
            return;
        }
        if (that.pipelineNodeCommunicationService.nodeData.targetType === 'event') {
            if (that.pipelineNodeCommunicationService.nodeData.branchType == '1') {
                branch = that.pipelineNodeCommunicationService.nodeData.eventList;
            } else if (that.pipelineNodeCommunicationService.nodeData.branchType == '2') {
                branch = that.pipelineNodeCommunicationService.nodeData.eventMultipleBranchList;
            }
        } else if (that.pipelineNodeCommunicationService.nodeData.targetType === 'target') {
            if (that.pipelineNodeCommunicationService.nodeData.branchType == '1') {
                branch = that.pipelineNodeCommunicationService.nodeData.targetList;
            } else if (that.pipelineNodeCommunicationService.nodeData.branchType == '2') {
                branch = that.pipelineNodeCommunicationService.nodeData.targetMultipleBranchList;   
            }
        }
        if ((branch[branch.length - 1].code == 'undefined' || !branch[branch.length - 1].code) && that.pipelineNodeCommunicationService.nodeData.targetType === 'event') {
            that.showMessageNews('error', '请选择事件后再添加分支数量');
            return;
        }
        if (that.pipelineNodeCommunicationService.nodeData.targetType === 'target' && (that.pipelineNodeCommunicationService.nodeData.otherTarget == 'undefined' || !that.pipelineNodeCommunicationService.nodeData.otherTarget || (!branch[branch.length - 1].number && (!branch[branch.length - 1].first || !branch[branch.length - 1].second)))) {
            that.showMessageNews('error', '请选择指标或填写分支范围');
            return;
        }
        if (branch.length > 9){
           that.showMessageNews('error', '最多可以添加10条');
		   return;
        }
        if (that.pipelineNodeCommunicationService.nodeData.targetType === 'event') {
            branch.push({});
        } else if (that.pipelineNodeCommunicationService.nodeData.targetType === 'target') {
            branch.push({code: '>'});
            that.targetErrMsg.push('');
        }
    }

    //删除单分支
    delSingleBranch(branch: any, index: number){
        let that = this;
        if (!that.pipelineNodeCommunicationService.editFlag) {
            return;
        }
        branch.splice(index,1);
    }

    //删除同时满足的条件
    delConditions(index: number) {
        let that = this;
        if (!that.pipelineNodeCommunicationService.editFlag) {
            return;
        }
        that.pipelineNodeCommunicationService.nodeData['conditions'].splice(index, 1);
    }

    //切换逻辑类型
    exLoop(value: any){
        let that = this;
        if (!that.pipelineNodeCommunicationService.editFlag) {
            return;
        }
        that.pipelineNodeCommunicationService.nodeData.branchType = value;
    }

    changeEvent(){
        let that = this;
        that.pipelineNodeCommunicationService.nodeData.targetType = 'event';
    }

    changeTarget(){
        let that = this;
        that.pipelineNodeCommunicationService.nodeData.targetType = 'target';
    }

	//选择时间区间
    onSelect(date: any) {
        let that = this;
        that.pipelineNodeCommunicationService.nodeData.startTime = new Date(date.start).getTime();
        that.pipelineNodeCommunicationService.nodeData.endTime = new Date(date.end).getTime();
    }

    //获取事件列表
    getEventList() {
        let that = this;
        return that.pipelineDefinitionResourceService.getEvent(5).then((result: any) => {
            that.eventList = [];
            result.map((data: any) => {
                that.eventList.push({label: data.name, value: data.code});
                that.eventMap[data.code] = data.name;
            });
            return;
        }).catch()
    }

    //获取指标列表
    getTargetList() {
        let that = this;
        return that.pipelineDefinitionResourceService.getIndex(that.pipelineNodeCommunicationService.campaignId).then((result: any) => {
            that.targetList = [];
            result.map((data: any) => {
                that.targetList.push({label: data.name, value: data.code});
                that.targetMap[data.code] = data.name;
            });

            return;
        }).catch()
    }

    //选中事件 将事件名称保存 生成线使用
    selectEvent(e: any, index: number) {
        let that = this;
        let length = that.eventList.length;
        for (let i = 0; i < length; i++) {
            if (that.eventList[i].value === e.value) {
                if (that.pipelineNodeCommunicationService.nodeData.branchType === '1') {
                    that.pipelineNodeCommunicationService.nodeData.eventList[index]['eventName'] = that.eventList[i].label;
                } else if (that.pipelineNodeCommunicationService.nodeData.branchType === '2') {
                    that.pipelineNodeCommunicationService.nodeData.eventMultipleBranchList[index]['eventName'] = that.eventList[i].label;
                }
                break;
            }
        }
    }

    //选中指标 将指标的名称保存 生成线使用
    selectTargetGetName(e: any, index: number) {
        let that = this;
        let length = that.targetList.length;
        for (let i = 0; i < length; i++) {
            if (that.targetList[i].value === e.value) {
                that.pipelineNodeCommunicationService.nodeData['otherTargetName'] = that.targetList[i].label;
                break;
            }
        }
    }

    //获取同时满足的指标列表
    getOtherTargetList() {
        let that = this;
        return that.pipelineDefinitionResourceService.getOtherTargets(that.pipelineNodeCommunicationService.campaignId, that.pipelineNodeCommunicationService.pipeLineId).then((result: any) => {
            that.otherTargetList = [];
            result.map((data: any) => {
                that.otherTargetList.push({label: data.name, value: data.code});
            });

            return;
        }).catch();
    }

    /* 检查单分支触发指标逻辑参数 */
    checkParams() {
        this.targetErrMsg = [''];

        let targetList = this.pipelineNodeCommunicationService.nodeData && this.pipelineNodeCommunicationService.nodeData.targetList || [];

        if (targetList.length <= 1) {
            return;
        }
        for (let i = 1; i < targetList.length; i++) {
            this.targetErrMsg.push('');
            if (targetList[i].code != '&&' && !targetList[i].number) {
                continue;
            }
            if (targetList[i].code == '&&' && (!targetList[i].first || !targetList[i].second)) {
                continue;
            }
            for (let j = 0; j < i; j++) {
                if (targetList[j].code != '&&' && !targetList[j].number) {
                    continue;
                }
                if (targetList[j].code == '&&' && (!targetList[j].first || !targetList[j].second)) {
                    continue;
                }
                if (targetList[j].code == '>') {
                    if (targetList[i].code == '>' || targetList[i].code == '>=') {
                        if ((targetList[i].code == '>=') && (parseInt(targetList[i].number) == parseInt(targetList[j].number))) {
                            this.targetErrMsg[i] = '建议把">="改成"="';
                        }
                        else if (parseInt(targetList[i].number) >= parseInt(targetList[j].number)) {
                            this.targetErrMsg[i] = '无效的逻辑分支';
                        }
                        else {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                    else if (targetList[i].code == '<=' || targetList[i].code == '=') {
                        if (parseInt(targetList[i].number) > parseInt(targetList[j].number)) {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                    else if (targetList[i].code == '<') {
                        if (parseInt(targetList[i].number) > parseInt(targetList[j].number)+1) {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                    else if (targetList[i].code == '&&') {
                        if (parseInt(targetList[i].second) <= parseInt(targetList[i].first)) {
                            this.targetErrMsg[i] = '区间值范围有误';
                            continue;
                        }
                        if (parseInt(targetList[i].second) > parseInt(targetList[j].number)+1) {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                }
                else if (targetList[j].code == '>=') {
                    if (targetList[i].code == '>' || targetList[i].code == '>=') {
                        if (targetList[i].code == '>=' && (parseInt(targetList[i].number) == parseInt(targetList[j].number)-1)) {
                            this.targetErrMsg[i] = '建议把">="改成"="';
                        }
                        else if (parseInt(targetList[i].number) >= parseInt(targetList[j].number)-1) {
                            this.targetErrMsg[i] = '无效的逻辑分支';
                        }
                        else {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                    else if (targetList[i].code == '<=' || targetList[i].code == '=') {
                        if (parseInt(targetList[i].number) >= parseInt(targetList[j].number)) {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                    else if (targetList[i].code == '<') {
                        if (parseInt(targetList[i].number) > parseInt(targetList[j].number)) {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                    else if (targetList[i].code == '&&') {
                        if (parseInt(targetList[i].second) <= parseInt(targetList[i].first)) {
                            this.targetErrMsg[i] = '区间值范围有误';
                            continue;
                        }
                        if (parseInt(targetList[i].second) > parseInt(targetList[j].number)) {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                }
                else if (targetList[j].code == '<') {
                    if (targetList[i].code == '<' || targetList[i].code == '<=') {
                        if ((targetList[i].code == '<=') && (parseInt(targetList[i].number) == parseInt(targetList[j].number))) {
                            this.targetErrMsg[i] = '建议把"<="改成"="';
                        }
                        else if (parseInt(targetList[i].number) <= parseInt(targetList[j].number)) {
                            this.targetErrMsg[i] = '无效的逻辑分支';
                        }
                        else {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                    else if (targetList[i].code == '>=' || targetList[i].code == '=') {
                        if (parseInt(targetList[i].number) < parseInt(targetList[j].number)) {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                    else if (targetList[i].code == '>') {
                        if (parseInt(targetList[i].number) < parseInt(targetList[j].number)-1) {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                    else if (targetList[i].code == '&&') {
                        if (parseInt(targetList[i].second) <= parseInt(targetList[i].first)) {
                            this.targetErrMsg[i] = '区间值范围有误';
                            continue;
                        }
                        if (parseInt(targetList[i].first) < parseInt(targetList[j].number)) {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                }
                else if (targetList[j].code == '<=') {
                    if (targetList[i].code == '<' || targetList[i].code == '<=') {
                        if (parseInt(targetList[i].number) == parseInt(targetList[j].number)+1) {
                            if (targetList[i].code == '<=') {
                                this.targetErrMsg[i] = '建议把"<="改成"="';
                            } else {
                                this.targetErrMsg[i] = '无效的逻辑分支';
                            }
                            this.targetErrMsg[i] = '建议把">="改成"="';
                        }
                        else if (parseInt(targetList[i].number) <= parseInt(targetList[j].number)) {
                            this.targetErrMsg[i] = '无效的逻辑分支';
                        }
                        else {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                    else if (targetList[i].code == '>=' || targetList[i].code == '=') {
                        if (parseInt(targetList[i].number) <= parseInt(targetList[j].number)) {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                    else if (targetList[i].code == '>') {
                        if (parseInt(targetList[i].number) < parseInt(targetList[j].number)) {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                    else if (targetList[i].code == '&&') {
                        if (parseInt(targetList[i].second) <= parseInt(targetList[i].first)) {
                            this.targetErrMsg[i] = '区间值范围有误';
                            continue;
                        }
                        if (parseInt(targetList[i].first) < parseInt(targetList[j].number)) {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                }
                else if (targetList[j].code == '=') {
                    if (targetList[i].code == '=') {
                        if (parseInt(targetList[i].number) == parseInt(targetList[j].number)) {
                            this.targetErrMsg[i] = '无效的逻辑分支';
                        }
                    }
                    else if (targetList[i].code == '&&') {
                        if (parseInt(targetList[i].second) <= parseInt(targetList[i].first)) {
                            this.targetErrMsg[i] = '区间值范围有误';
                        }
                    }
                }
                else if (targetList[j].code == '&&') {
                    if (parseInt(targetList[j].second) <= parseInt(targetList[j].first)) {
                        this.targetErrMsg[j] = '区间值范围有误';
                        continue;
                    }
                    if (targetList[i].code == '=') {
                        if ((parseInt(targetList[i].number) > parseInt(targetList[j].first)) && (parseInt(targetList[i].number) < parseInt(targetList[j].second))) {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                    else if (targetList[i].code == '<' || targetList[i].code == '<=') {
                        if (parseInt(targetList[i].number) > parseInt(targetList[j].first)) {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                    else if (targetList[i].code == '>' || targetList[i].code == '>=') {
                        if (parseInt(targetList[i].number) < parseInt(targetList[j].second)) {
                            this.targetErrMsg[i] = '数值范围重叠';
                        }
                    }
                    else if (targetList[i].code == '&&') {
                        if (parseInt(targetList[i].second) <= parseInt(targetList[i].first)) {
                            this.targetErrMsg[i] = '区间值范围有误';
                            continue;
                        }
                        if ((parseInt(targetList[i].second) > parseInt(targetList[j].first)) && (parseInt(targetList[i].first) < parseInt(targetList[j].second))) {
                            this.targetErrMsg[i] = '区间值范围有误';
                        }
                    }
                }
            }
        }
    }

    //选择触发规则
    selectRule (e: any, data: string) {
        let that = this;
        if (!that.pipelineNodeCommunicationService.editFlag) {
            return;
        }
		if (data === '1') {
            that.lessThanDaysSelect = !that.lessThanDaysSelect;
            if (!that.lessThanDaysSelect) {
                that.pipelineNodeCommunicationService.nodeData.sameUserLessThanDays = "";
            }
		} else if (data === '2') {
            that.lessThanTimesSelect = !that.lessThanTimesSelect;
            if (!that.lessThanTimesSelect) {
                that.pipelineNodeCommunicationService.nodeData.sameUserLessThanTimes = "";
            }
		}

    }

    // 修改规则
	changeRule(e: any) {
		let that = this;
		if (that.pipelineNodeCommunicationService.nodeData.sameUserLessThanDays) {
			that.pipelineNodeCommunicationService.nodeData.unlimited = 1;
		} else if(that.pipelineNodeCommunicationService.nodeData.sameUserLessThanTimes){
			that.pipelineNodeCommunicationService.nodeData.unlimited = 1;
		}
	}

    /**
     * 将后端传来的数据格式化成需要的格式
     */
    formatRule() {
        let that = this;
        /*
         * mainExpression
         * 单分支：指标 : > : 123 : && 指标 : < : 220 : == : 分支1, 指标 : < : 3 : == : 分支2, 分支3
         * 多分支：指标 : > : 123 : && 指标 : < : 220 : == : 分支1, 指标 : < : 3 : == : 分支1, 指标 : < : 3 : == : 分支2
         */
        let links = that.pipelineNodeCommunicationService.nodeLinks; // 获取当前组件出去的线

        let mainExpression = that.pipelineNodeCommunicationService.nodeData.mainExpression;
        that.pipelineNodeCommunicationService.nodeData['eventList'] = [];
        that.pipelineNodeCommunicationService.nodeData['targetList'] = [];
        that.pipelineNodeCommunicationService.nodeData['targetMultipleBranchList'] = [];
        that.pipelineNodeCommunicationService.nodeData['eventMultipleBranchList'] = [];
        if (mainExpression && mainExpression.length) {
            let length = mainExpression.length;
            if (that.pipelineNodeCommunicationService.nodeData.targetType === 'event') {
                if (that.pipelineNodeCommunicationService.nodeData.branchType == '1') {
                    if (mainExpression[mainExpression.length - 1].split(' : ').length == 3) {
                        that.pipelineNodeCommunicationService.nodeData.otherName = '';
                    } else {
                        length = length - 1;
                        that.pipelineNodeCommunicationService.nodeData.otherName = mainExpression[mainExpression.length - 1] == 'undefined' ? '' : mainExpression[mainExpression.length - 1];
                    }
                }
                for (let i = 0; i < length; i++) {
                    let data = mainExpression[i].split(' : ');
                    let tempJson = {};
                    tempJson['code'] = data[0];
                    tempJson['name'] = data[2] == 'undefined' || data[2] == 'null' ? '' : data[2];
                    tempJson['eventName'] = that.eventMap[data[0]];
                    if (links[i] && links[i].data && links[i].data.id) {
                        tempJson['id'] = links[i].data.id;
                    }
                    if (that.pipelineNodeCommunicationService.nodeData.branchType == '1') {
                        that.pipelineNodeCommunicationService.nodeData.eventList.push(tempJson);
                    } else if (that.pipelineNodeCommunicationService.nodeData.branchType == '2') {
                        that.pipelineNodeCommunicationService.nodeData.eventMultipleBranchList.push(tempJson);
                    }
                }
            } else if (that.pipelineNodeCommunicationService.nodeData.targetType === 'target') {
                if (that.pipelineNodeCommunicationService.nodeData.branchType == '1') {
                    if (mainExpression[mainExpression.length - 1].split(' : ').length > 1) {
                        that.pipelineNodeCommunicationService.nodeData.otherName = '';
                    } else {
                        length = length - 1;
                        mainExpression[mainExpression.length - 1] = mainExpression[mainExpression.length - 1] && mainExpression[mainExpression.length - 1].split("'")[1];
                        that.pipelineNodeCommunicationService.nodeData.otherName = mainExpression[mainExpression.length - 1] == 'undefined' ? '' : mainExpression[mainExpression.length - 1];
                    }
                }
                for (let i = 0; i < length; i++) {
                    let data = mainExpression[i].split(' : ');
                    let tempJson = {};
                    that.pipelineNodeCommunicationService.nodeData.otherTarget = data[0] && data[0].split("'")[1];
                    if (data.length === 5) {
                        data[4] = data[4] && data[4].split("'")[1];
                        tempJson['code'] = data[1] && data[1].split("'")[1];
                        tempJson['number'] = data[2] == 'undefined' || data[2] == 'null' ? '' : data[2];
                        tempJson['name'] = data[4] == 'undefined' || data[4] == 'null' ? '' : data[4];
                    } else {
                        data[8] = data[8] && data[8].split("'")[1];
                        tempJson['first'] = data[2] == 'undefined' || data[2] == 'null' ? '' : data[2];
                        tempJson['code'] = data[3] && data[3].split("'")[1];
                        tempJson['second'] = data[6] == 'undefined' || data[6] == 'null' ? '' : data[6];
                        tempJson['name'] = data[8] == 'undefined' || data[8] == 'null' ? '' : data[8];
                    }
                    tempJson['eventName'] = that.targetMap[tempJson['code']];
                    if (links[i] && links[i].data && links[i].data.id) {
                        tempJson['id'] = links[i].data.id;
                    }
                    if (that.pipelineNodeCommunicationService.nodeData.branchType == '1') {
                        that.pipelineNodeCommunicationService.nodeData.targetList.push(tempJson);
                        that.targetErrMsg.push('');
                    } else if (that.pipelineNodeCommunicationService.nodeData.branchType == '2') {
                        that.pipelineNodeCommunicationService.nodeData.targetMultipleBranchList.push(tempJson);
                    }
                }
                for (let i = 0; i < that.targetList.length; i++) {
                    if (that.pipelineNodeCommunicationService.nodeData.otherTarget === that.targetList[i].value) {
                        that.pipelineNodeCommunicationService.nodeData['otherTargetName'] = that.targetList[i].label;
                        break;
                    } 
                }
            }
        } 
        if (that.pipelineNodeCommunicationService.nodeData['eventList'].length === 0) {
            that.pipelineNodeCommunicationService.nodeData['eventList'].push({});
        }
        if (that.pipelineNodeCommunicationService.nodeData['targetList'].length === 0) {
            that.pipelineNodeCommunicationService.nodeData['targetList'].push({code: '>'});
        }
        if (that.pipelineNodeCommunicationService.nodeData['targetMultipleBranchList'].length === 0) {
            that.pipelineNodeCommunicationService.nodeData['targetMultipleBranchList'].push({code: '>'});
        }
        if (that.pipelineNodeCommunicationService.nodeData['eventMultipleBranchList'].length === 0) {
            that.pipelineNodeCommunicationService.nodeData['eventMultipleBranchList'].push({});
        }
        let additionExpression = that.pipelineNodeCommunicationService.nodeData.additionExpression;
        if (additionExpression) {
            let additionLength = additionExpression.length;
            that.pipelineNodeCommunicationService.nodeData['conditions'] = [];
            for (let i = 0; i < additionLength; i++) {
                let data = additionExpression[i].split(' : ');
                let tempJson = {}
                if (data.length === 3) {
                    tempJson['target'] = data[0] && (data[0].split("'")[1] || data[0].split("'")[0]);
                    tempJson['code'] = data[1] && (data[1].split("'")[1] || data[1].split("'")[0]);
                    tempJson['number'] = data[2] == 'undefined' || data[2] == 'null' ? '' : data[2];
                } else {
                    tempJson['target'] = data[0] && (data[0].split("'")[1] || data[0].split("'")[0]);
                    tempJson['first'] = data[2] == 'undefined' || data[2] == 'null' ? '' : data[2];
                    tempJson['code'] = data[3] && (data[3].split("'")[1] || data[3].split("'")[0]);
                    data[6] == data[6] && (data[6].split("'")[1] || data[6].split("'")[0]) || 'undefined';
                    tempJson['second'] = data[6] == 'undefined' || data[6] == 'null'? '' : data[6];
                }
                that.pipelineNodeCommunicationService.nodeData['conditions'].push(tempJson);
            }
        } else {
            that.pipelineNodeCommunicationService.nodeData['conditions'] = [];
            that.pipelineNodeCommunicationService.nodeData['conditions'].push({code: '>'});
        }
    }

    //尝试
    checkRadio(event:any,data:any){
        if(data == "one"){
            this.check_one = true;
            this.check_two = false;
            this.pipelineNodeCommunicationService.nodeData.sameUserTarget = 1;
        }else{
            this.check_one = false;
            this.check_two = true;
            this.pipelineNodeCommunicationService.nodeData.sameUserTarget = 0;
        }

    }

    //时间组件点击事件
    onDateClick(e: any) {
        let that = this;
        that.changeOverflow.emit(e);
    }

    // 右上角提示信息
	showMessageNews(type: any, detail: any) {
		let that = this;
		let message = '';
		if (type === 'info') {
			message = '成功';
		} else if (type === 'error') {
			message = '失败';
		}
		that.msgs.push({severity: type, summary: message, detail: detail})
    }
}