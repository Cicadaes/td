import { Component, OnInit } from '@angular/core';
import { PipelineService } from '../../pipeline.service';
import { PipelineCommunicationService } from '../../pipeline-communication.service';

@Component({
    selector: 'app-trigger-panel',
    templateUrl: './trigger-panel.component.html',
    styleUrls: ['./trigger-panel.component.less']
})
export class TriggerPanelComponent implements OnInit {

    branchType: string;     // 逻辑类型 单/多
    targetType: string;     // 触发类型 事件/指标
    monitorTime: any;       // 监测时间 页面显示

    events: any[];          // 从后端获取的事件列表
    eventsAll: any[];       // 从后端获取的事件列表
    eventsValueMap: any;

    targets: any[];         // 从后端获取的指标列表
    selectTarget: any[];    // 触发类型为指标时 选择的指标数据

    eventMap: any = {};     // 事件map表 以code为key name为value
    targetMap: any = {};    // 指标Map表 以code为key name为value

    equalList: any[];       // 范围符合列表

    check_one: boolean;
    check_two: boolean;

    defaultData: any;       // 存放修改分支数据

    constructor(public pipelineService: PipelineService,
        public pcs: PipelineCommunicationService) {
        const that = this;
        that.equalList = [{
            value: '>',
            name: '大于'
        }, {
            value: '>=',
            name: '大于等于'
        }, {
            value: '==',
            name: '等于'
        }, {
            value: '<=',
            name: '小于等于'
        }, {
            value: '<',
            name: '小于'
        }, {
            value: 'range',
            name: '区间'
        }];

        // 数据回显
        that.defaultData = {
            type: 'trigger',
            id: that.pcs.nodeData.id
        };
        that.defaultData['nodeId'] = that.pcs.nodeData.nodeId;
        if (that.pcs.nodeData.startTime && that.pcs.nodeData.endTime) {
            that.monitorTime = [new Date(that.pcs.nodeData.startTime), new Date(that.pcs.nodeData.endTime)];
        } else {
            that.monitorTime = [new Date(that.pcs.startTime), new Date(that.pcs.endTime)];
            that.pcs.nodeData.startTime = that.pcs.startTime;
            that.pcs.nodeData.endTime = that.pcs.endTime;

        }
        if (!that.pcs.nodeData.monitorType) {
            that.pcs.nodeData.monitorType = '1';
        } else {
            that.pcs.nodeData.monitorType = that.pcs.nodeData.monitorType + '';
        }
        // 最多十个分支 默认 单分支的else分支 index为10
        if (!that.pcs.nodeData.branchType) {
            that.pcs.nodeData.branchType = '1';
        } else {
            that.pcs.nodeData.branchType = that.pcs.nodeData.branchType + '';
        }
        // 如果没有默认数据显示事件
        if (!that.pcs.nodeData.targetType) {
            that.pcs.nodeData.targetType = 'event';
        }
        // 触发规则
        if (that.pcs.nodeData.sameUserTarget == 0) {
            that.check_two = true;
        }
        if (that.pcs.nodeData.sameUserTarget == 1) {
            that.check_one = true;
        }

        that.pcs.nodeData.lessThanDaysSelect = that.pcs.nodeData.sameUserLessThanDays != null;
        that.pcs.nodeData.lessThanTimesSelect = that.pcs.nodeData.sameUserLessThanTimes != null;

        let eventArr = [],targetArr;
        if (that.pcs.nodeData.mainExpression) {
            that.pcs.nodeData.mainExpression.forEach((element, index) => {
                const data = element.split(' : ');
                if(that.pcs.nodeData.targetType === 'event'){
                    eventArr.push(data[0]);
                }else if(that.pcs.nodeData.targetType === 'target' && index != (that.pcs.nodeData.mainExpression.length - 1)){
                    if(data[0] && data[0].startsWith(`'`)){
                        targetArr = data[0].split(`'`)[1];
                    }
                }
            });
        }

        // 获取事件列表
        that.pipelineService.getEventListForTimerEcho(eventArr, { triggerFlag: 1 }).subscribe((result: any) => {
            if (result && result.code === 200) {
                that.events = result.data.data;

                //                that.eventsAll = [];
                that.events.forEach((data: any) => {
                    that.eventMap[data.code] = data.name;
                    //                    that.eventsAll.push(data);
                });

                // 获取指标列表 同时满足指标列表
                that.pipelineService.getTriggerTargetListEcho(targetArr, 2).subscribe((result: any) => {
                    if (result && result.code === 200) {
                        that.targets = result.data.data;
                        that.targets.forEach((data: any) => {
                            that.targetMap[data.code] = data.name;
                        });
                        that.formatData();

                        const mainExpression = that.pcs.nodeData.mainExpression;
                        if (mainExpression && mainExpression[0] === 'undefined : == :' && mainExpression[1] === 'undefined') {
                            that.exLoop();
                        }
                        if (!mainExpression) {
                            that.exLoop();
                        }
                    }
                });

            }
        }, (err: any) => {
        });

    }

    ngOnInit() {
    }

    /**
     * 禁止选择时间范围
     */
    disabledDate = (e: any) => {
        const that = this;
        return e < that.pcs.startTime || e > that.pcs.endTime;
    }

    /**
     * 选择时间
     */
    onSelect(e: any) {
        const that = this;
        that.pcs.nodeData.startTime = new Date(e[0]).getTime();
        that.pcs.nodeData.endTime = new Date(e[1]).getTime();
    }

    /**
     * 选中指标时 保存指标名称 生成线时使用
     */
    selectTargetGetName(e: any) {
        const that = this;
        const length = that.targets.length;
        for (let i = 0; i < length; i++) {
            if (that.targets[i].code === e) {
                that.pcs.nodeData['otherTargetName'] = that.targets[i].name;
                const list = that.pcs.nodeData.targetList;
                const targetListLength = list.length;
                for (let j = 0; j < targetListLength; j++) {
                    let name = list[j].name;
                    if (!list[j].name && list[j].code === 'range' && list[j].first && list[j].second) {
                        name = `${that.pcs.nodeData.otherTargetName} ${list[j].first}~${list[j].second}`;
                    } else if (!list[j].name && list[j].code !== 'range' && list[j].number) {
                        name = `${that.pcs.nodeData.otherTargetName} ${list[j].code} ${list[j].number}`;
                    }
                    that.defaultData['lineType'] = 'c';
                    that.defaultData['index'] = list[j].index;
                    that.defaultData['name'] = name;
                    that.defaultData['expression'] = name;
                    that.pcs.lineChangeMission(that.defaultData);
                }
            }
        }
    }

    /**
     * 添加事件
     */
    addEvent() {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        const branch = that.pcs.nodeData.eventList;
        const length = branch.length;
        if (length && (branch[branch.length - 1].code === 'undefined' || !branch[branch.length - 1].code)
            && that.pcs.nodeData.targetType === 'event') {
            that.pcs.message.create('error', '请选择事件后再添加分支数量');
            return;
        }
        if (length > 9) {
            that.pcs.message.create('error', '最多可以添加10条');
            return;
        }
        that.pcs.nodeData.eventList.push({ index: length });

        that.configEventList();
        //        if (that.pcs.nodeData.branchType === '1') {
        //            for (let i = 0; i < that.pcs.nodeData.eventList.length; i++) {
        //                this.events = this.events.filter(one => {
        //                    return one.code !== that.pcs.nodeData.eventList[i].code;
        //                });
        //            }
        //        }
        // console.log(that.pcs.nodeData.eventList);
        // console.log(that.events);
        that.defaultData['lineType'] = 'a';
        that.defaultData['index'] = length;
        that.defaultData['name'] = '';
        that.pcs.lineChangeMission(that.defaultData);
    }

    /**
     * 删除事件
     */
    removeEvent(index: number) {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        that.defaultData['lineType'] = 'd';
        that.defaultData['index'] = that.pcs.nodeData.eventList[index].index;
        that.defaultData['deleteType'] = '';
        that.pcs.lineChangeMission(that.defaultData);
        that.pcs.nodeData.eventList.splice(index, 1);
        // 重新设置index，防止序列错误
        for (let i = 0; i < that.pcs.nodeData.eventList.length; i++) {
            const obj = that.pcs.nodeData.eventList[i];
            if (obj.index != 10) {
                obj.index = i;
            }
        }

        that.configEventList();

        //        if (that.pcs.nodeData.branchType === '1') {
        //            for (let i = 0; i < that.pcs.nodeData.eventList.length; i++) {
        //                this.events = this.eventsAll.filter(one => {
        //                    return one.code !== that.pcs.nodeData.eventList[i].code;
        //                });
        //            }
        //        }
    }

    /**
     * 切换单分支 多分支
     * 修改触发类型 （事件、指标）
     */
    exLoop() {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        //        this.events = [];
        //        this.eventsAll.forEach(one => {
        //            this.events.push(one);
        //        });
        that.defaultData['lineType'] = 'd';
        that.defaultData['deleteType'] = 'all';
        that.pcs.lineChangeMission(that.defaultData);

        if (that.pcs.nodeData.targetType === 'target') {
            that.pcs.nodeData.targetList = [];
            that.pcs.nodeData.targetList.push({
                code: '>',
                index: 0,
            });
        } else if (that.pcs.nodeData.targetType === 'event') {
            that.pcs.nodeData.eventList = [];
            that.pcs.nodeData.eventList.push({
                index: 0,
            });
            that.configEventList();
        }
        if (that.pcs.nodeData.branchType === '1') {
            that.defaultData['lineType'] = 'a';
            that.defaultData['index'] = 10;
            that.defaultData['name'] = that.pcs.nodeData.otherName || '';
            that.defaultData['expression'] = that.pcs.nodeData.otherName || '';
            that.pcs.lineChangeMission(that.defaultData);
        }

        let list = [];
        if (that.pcs.nodeData.targetType === 'target') {
            list = that.pcs.nodeData.targetList;

            for (let i = 0; i < list.length; i++) {
                const obj = list[i];
                if (!obj.name) {
                    if (!that.pcs.nodeData || !that.pcs.nodeData.otherTargetName) {
                        obj.name = '';
                    } else {
                        if (obj.code === 'range' && obj.first && obj.second) {
                            obj.name = `${that.pcs.nodeData.otherTargetName} ${obj.first}~${obj.second}`;
                        } else if (obj.code && obj.code !== 'range' && obj.number) {
                            obj.name = `${that.pcs.nodeData.otherTargetName} ${obj.code} ${obj.number}`;
                        }
                    }
                }

                that.defaultData['lineType'] = 'a';
                that.defaultData['index'] = obj.index;
                that.defaultData['name'] = obj.name;
                that.defaultData['expression'] = obj.name;
                that.pcs.lineChangeMission(that.defaultData);
            }
        } else if (that.pcs.nodeData.targetType === 'event') {
            list = that.pcs.nodeData.eventList;

            for (let i = 0; i < list.length; i++) {
                const obj = list[i];
                let name = obj.name || obj.eventName || '';

                that.defaultData['lineType'] = 'a';
                that.defaultData['index'] = obj.index;
                that.defaultData['name'] = name;
                that.defaultData['expression'] = name;
                that.pcs.lineChangeMission(that.defaultData);
            }
        }

    }

    /**
     * 分支名称改变 线名称改变
     */
    rename(data: any, e?: any) {
        const that = this;
        if (that.pcs.nodeData.targetType === 'event') {
            const code = e || data['code'];
            that.defaultData['lineType'] = 'c';
            that.defaultData['index'] = data.index;
            that.defaultData['name'] = data.name || that.eventMap[code] || '';
            that.defaultData['expression'] = data.name || that.eventMap[code] || '';
            that.pcs.lineChangeMission(that.defaultData);
        } else if (that.pcs.nodeData.targetType === 'target') {
            let name = '';
            if (that.pcs.nodeData && that.pcs.nodeData.otherTargetName) {
                if (data.code && data.name) {
                    name = data.name;
                } else if (data.code === 'range' && data.first && data.second) {
                    name = `${that.pcs.nodeData.otherTargetName} ${data.first}~${data.second}`;
                } else if (data.code && data.code !== 'range' && data.number) {
                    name = `${that.pcs.nodeData.otherTargetName} ${data.code} ${data.number}`;
                }
            }
            that.defaultData['lineType'] = 'c';
            that.defaultData['index'] = data.index;
            that.defaultData['name'] = name;
            that.defaultData['expression'] = name;
            that.pcs.lineChangeMission(that.defaultData);
        }
    }

    checkParams() {
        const that = this;
        const branch = that.pcs.nodeData.targetList;
        const length = branch.length;
        for (let i = 0; i < length; i++) {
            if (branch[i].code === 'range') {
                if (Number(branch[i].second) <= Number(branch[i].first)) {
                    that.pcs.message.create('error', '区间范围不正确');
                    return;
                } else {
                    if (that.pcs.nodeData.branchType === '1') {
                        for (let j = 0; j < length; j++) {
                            if (branch[j].code === 'range' && j > i) {
                                if (Number(branch[i].first) < Number(branch[j].first)) {
                                    if (Number(branch[i].second) >= Number(branch[j].first)) {
                                        that.pcs.message.create('error', '区间范围不能重叠');
                                        return;
                                    }
                                } else {
                                    if (Number(branch[i].first) <= Number(branch[j].second)) {
                                        that.pcs.message.create('error', '区间范围不能重叠');
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * 单分支 else分支名称发生改变
     */
    reOtherName() {
        let that = this;
        that.defaultData['lineType'] = 'c';
        that.defaultData['index'] = 10;
        that.defaultData['name'] = that.pcs.nodeData.otherName || '';
        that.defaultData['expression'] = that.pcs.nodeData.otherName || '';
        that.pcs.lineChangeMission(that.defaultData);
    }

    /**
     * 添加指标
     */
    addTarget() {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        const branch = that.pcs.nodeData.targetList;
        const length = branch.length;
        if (that.pcs.nodeData.otherTarget === 'undefined'
            || !that.pcs.nodeData.otherTarget
            || (!branch[length - 1].number && (!branch[length - 1].first || !branch[length - 1].second))) {
            that.pcs.message.create('error', '请选择指标或填写分支范围');
            return;
        }
        if (length > 9) {
            that.pcs.message.create('error', '最多可以添加10条');
            return;
        }

        for (let i = 0; i < length; i++) {
            if (branch[i].code === 'range') {
                if (Number(branch[i].second) <= Number(branch[i].first)) {
                    that.pcs.message.create('error', '区间范围不正确');
                    return;
                } else {
                    if (that.pcs.nodeData.branchType === '1') {
                        for (let j = 0; j < length; j++) {
                            if (branch[j].code === 'range' && j > i) {
                                if (Number(branch[i].first) < Number(branch[j].first)) {
                                    if (Number(branch[i].second) >= Number(branch[j].first)) {
                                        that.pcs.message.create('error', '区间范围不能重叠');
                                        return;
                                    }
                                } else {
                                    if (Number(branch[i].first) <= Number(branch[j].second)) {
                                        that.pcs.message.create('error', '区间范围不能重叠');
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        that.defaultData['lineType'] = 'a';
        that.defaultData['index'] = length;
        that.defaultData['name'] = '';
        that.pcs.lineChangeMission(that.defaultData);
        that.pcs.nodeData.targetList.push({ code: '>', index: length });
    }

    /**
     * 删除指标
     */
    removeTarget(index: number) {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        that.defaultData['lineType'] = 'd';
        that.defaultData['index'] = that.pcs.nodeData.targetList[index].index;
        that.defaultData['deleteType'] = '';
        that.pcs.lineChangeMission(that.defaultData);
        that.pcs.nodeData.targetList.splice(index, 1);
    }

    /**
     * 添加同时满足条件
     */
    addConditions() {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        const length = that.pcs.nodeData.conditions.length;
        const conds = that.pcs.nodeData.conditions;
        if (length > 9) {
            that.pcs.message.create('error', '最多可以添加10条规则');
            return;
        }
        if (length != 0 && (!conds[length - 1].target || (!conds[length - 1].number && (!conds[length - 1].first || !conds[length - 1].second)))) {
            that.pcs.message.create('error', '请选择指标并填写范围');
            return;
        }
        that.pcs.nodeData.conditions.push({ code: '>' });
    }

    /**
     * 删除同时满足条件
     */
    removeConditions(index: number) {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        that.pcs.nodeData.conditions.splice(index, 1);
    }

    /**
     *
     */
    checkRadio(e: any, flag: string) {
        const that = this;
        if (flag === 'one' && e) {
            that.check_one = e;
            that.check_two = !e;
            that.pcs.nodeData.sameUserTarget = 1;
        } else if (flag === 'two' && e) {
            that.check_one = !e;
            that.check_two = e;
            that.pcs.nodeData.sameUserTarget = 0;
        }
    }

    /**
     * 将后端传来的数据格式化成需要的格式
     */
    formatData() {
        const that = this;
        /**
         * 单分支：事件1 : == : 分支1, 事件2 : == : 分支2, 分支3
         * 多分支：事件1 : == : 分支1, 事件1 : == : 分支1, 事件2 : = : 分支2
         * 单分支：指标 : range : 123-220 : == : 分支1, 指标 : < : 3 : == : 分支2, 分支3
         * 多分支：指标 : range : 123-220 : == : 分支1, 指标 : < : 3 : == : 分支1, 指标 : < : 3 : == : 分支2
         */
        const links = that.pcs.nodeLinks;    // 所有的线
        const mainExpression = that.pcs.nodeData.mainExpression;
        that.pcs.nodeData['eventList'] = [];
        that.pcs.nodeData['targetList'] = [];
        that.pcs.nodeData['conditions'] = [];
        if (mainExpression) {
            if (that.pcs.nodeData.targetType === 'event') {
                let mainExpressionLength = mainExpression.length;
                if (that.pcs.nodeData.branchType === '1') {
                    mainExpressionLength = mainExpressionLength - 1;
                    let name = mainExpression[mainExpression.length - 1];
                    if (name === 'undefined') {
                        name = '';
                    }
                    that.pcs.nodeData.otherName = name;
                }
                for (let i = 0; i < mainExpressionLength; i++) {
                    const data = mainExpression[i].split(' : ');
                    const obj = {
                        code: data[0],
                        name: data[2]
                    };
                    if (obj.code == 'undefined' || obj.code == 'null') {
                        obj.code = null;
                    }
                    if (obj.name == 'undefined' || obj.name == 'null') {
                        obj.name = '';
                    }
                    const tempJson = {};
                    tempJson['index'] = i;
                    tempJson['code'] = obj.code;
                    tempJson['name'] = obj.name;
                    tempJson['eventName'] = that.eventMap[obj.code];
                    if (links[i] && links[i].data && links[i].data.id) {
                        tempJson['id'] = links[i].data.id;
                    }
                    that.pcs.nodeData.eventList.push(tempJson);
                }

                if (that.pcs.nodeData.eventList.length === 0) {
                    that.pcs.nodeData.eventList.push({ index: 0 });
                    that.defaultData['lineType'] = 'a';
                    that.defaultData['index'] = 0;
                    that.pcs.lineChangeMission(that.defaultData);
                    if (that.pcs.nodeData.branchType === '1') {
                        that.defaultData['lineType'] = 'a';
                        that.defaultData['index'] = 10;
                        that.pcs.lineChangeMission(that.defaultData);
                    }
                }

                that.configEventList();
            } else if (that.pcs.nodeData.targetType === 'target') {
                let mainExpressionLength = mainExpression.length;
                if (that.pcs.nodeData.branchType === '1') {
                    mainExpressionLength = mainExpressionLength - 1;
                    let name = mainExpression[mainExpression.length - 1];
                    if (name && name.startsWith(`'`)) {
                        name = name.split(`'`)[1];
                    }
                    if (name === 'undefined') {
                        name = '';
                    }
                    that.pcs.nodeData.otherName = name;
                }
                for (let i = 0; i < mainExpressionLength; i++) {
                    const data = mainExpression[i].split(' : ');

                    const obj = {
                        otherTarget: data[0],
                        name: data[4],
                        code: data[1],
                        number: data[2]
                    };
                    if (obj.otherTarget && obj.otherTarget.startsWith(`'`)) {
                        obj.otherTarget = obj.otherTarget.split(`'`)[1];
                    }
                    if (obj.otherTarget === 'undefined' || obj.otherTarget === 'null') {
                        obj.otherTarget = null;
                    }
                    that.pcs.nodeData.otherTarget = obj.otherTarget;

                    if (obj.name && obj.name.startsWith(`'`)) {
                        obj.name = obj.name.split(`'`)[1];
                    }
                    if (obj.name === 'undefined' || obj.name === 'null') {
                        obj.name = null;
                    }

                    if (obj.code && obj.code.startsWith(`'`)) {
                        obj.code = obj.code.split(`'`)[1];
                    }
                    if (obj.code === 'undefined' || obj.code === 'null') {
                        obj.code = 'range';
                    }

                    if (obj.number && obj.number.startsWith(`'`)) {
                        obj.number = obj.number.split(`'`)[1];
                    }
                    if (obj.number === 'undefined' || obj.number === 'null') {
                        obj.number = '';
                    }

                    const tempJson = {};

                    tempJson['index'] = i;
                    tempJson['code'] = obj.code;
                    tempJson['name'] = obj.name;
                    tempJson['eventName'] = that.targetMap[obj.code];
                    if (obj.code !== 'range') {
                        tempJson['number'] = obj.number;
                    } else {
                        if (obj.number) {
                            tempJson['first'] = obj.number.split('-')[0];
                            tempJson['second'] = obj.number.split('-')[1];
                        }
                    }
                    if (links[i] && links[i].data && links[i].data.id) {
                        tempJson['id'] = links[i].data.id;
                    }
                    that.pcs.nodeData.targetList.push(tempJson);
                }
                for (let i = 0; i < that.targets.length; i++) {
                    if (that.pcs.nodeData.otherTarget === that.targets[i].code) {
                        that.pcs.nodeData['otherTargetName'] = that.targets[i].name;
                        break;
                    }
                }
            }
        }

        if (that.pcs.nodeData.targetList.length === 0) {
            that.pcs.nodeData.targetList.push({ index: 0, code: '>' });
        }
        const additionExpression = that.pcs.nodeData.additionExpression;
        if (additionExpression) {
            for (let i = 0; i < additionExpression.length; i++) {
                const data = additionExpression[i].split(' : ');
                const obj = {
                    target: data[0],
                    code: data[1],
                    number: data[2],
                };
                if (obj.target && obj.target.startsWith(`'`)) {
                    obj.target = obj.target.split(`'`)[1];
                }
                if (obj.code && obj.code.startsWith(`'`)) {
                    obj.code = obj.code.split(`'`)[1];
                }
                if (obj.number === 'undefined' || obj.number === 'null') {
                    obj.number = '';
                }
                const tempJson = {};
                tempJson['target'] = obj.target;
                tempJson['code'] = obj.code;
                if (tempJson['code'] !== 'range') {
                    tempJson['number'] = obj.number;
                } else {
                    if (obj.number) {
                        tempJson['first'] = obj.number.split('-')[0];
                        tempJson['second'] = obj.number.split('-')[1];
                    }
                }
                that.pcs.nodeData.conditions.push(tempJson);
            }
        }
    }

    configEventList(value?: any, index?: any) {
        // 准备已选值map
        this.eventsValueMap = {};
        for (let i = 0; i < this.pcs.nodeData.eventList.length; i++) {
            const obj = this.pcs.nodeData.eventList[i];
            let code = obj.code;
            if (i === index) {
                code = value;
            }
            this.eventsValueMap[code] = 1;
        }

        // 根据已选值筛选备选列表
        for (let i = 0; i < this.pcs.nodeData.eventList.length; i++) {
            const obj = this.pcs.nodeData.eventList[i];

            let code = obj.code;
            if (i === index) {
                code = value;
            }

            const eventsMin = [];
            for (let j = 0; j < this.events.length; j++) {
                const obj1 = this.events[j];

                if (!this.eventsValueMap[obj1.code] || code == obj1.code) {
                    eventsMin.push(obj1);
                }
            }

            if (this.pcs.nodeData.branchType == 1) {
                obj.eventsMin = eventsMin;
            } else {
                obj.eventsMin = this.events;
            }
        }
    }
}
