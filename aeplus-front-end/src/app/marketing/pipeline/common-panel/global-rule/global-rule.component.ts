import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {PipelineService} from '../../pipeline.service';
import {PipelineCommunicationService} from '../../pipeline-communication.service';
import {NzMessageService} from 'ng-cosmos-ui';

@Component({
    selector: 'app-global-rule',
    templateUrl: './global-rule.component.html',
    styleUrls: ['./global-rule.component.less']
})
export class GlobalRuleComponent implements OnInit {
    campaignId: any;                               // 活动Id
    pipeLineId: any;                               // pipeLineId
    terminationRuleList: any[] = [];               // 提前终止规则列表
    terminationRuleRelation: any;                  // 提前终止规则之间的关系（并且和或者）
    targetList: any = [];                          // 指标列表
    symbolList: any[] = [];                        // 符号列表

    lessThanDaysSelect: any;                       // 进入规则 同一户xx天不再进入
    lessThanTimesSelect: any;                      // 进入规则 同一进入次数不超过

    terminationForbiddenEntryRelation: any;        // 禁止规则 关系
    fristeForbiddenEntry: any = [];                // 禁止规则第一个下拉菜单列表
    secondForbiddenEntry: any = [];                // 禁止规则第二个下拉菜单列表
    terminationNoEntryRelation: any = {};

    constructor(public changeDetectorRef: ChangeDetectorRef,
                public pipelineService: PipelineService,
                public pcs: PipelineCommunicationService,
                public message: NzMessageService) {
        const that = this;
        that.symbolList.push({label: '大于', value: '>'});
        that.symbolList.push({label: '等于', value: '=='});
        that.symbolList.push({label: '小于', value: '<'});
        if (!that.pcs.globalRule.pipelineForbiddenRuleDefinition
            || !that.pcs.globalRule.pipelineForbiddenRuleDefinition.ruleList) {
            that.pcs.globalRule['pipelineForbiddenRuleDefinition'] = {
                ruleRelation: '|',
                ruleList: []
            };
        }
        if (that.pcs.globalRule.pipelineForbiddenRuleDefinition.ruleRelation === '&') {
            that.terminationForbiddenEntryRelation = {label: '并且', value: '&&'};
        } else {
            that.terminationForbiddenEntryRelation = {label: '或者', value: '||'};
        }

        that.fristeForbiddenEntry.push({label: '发生', value: true});
        that.fristeForbiddenEntry.push({label: '未发生', value: false});
        that.secondForbiddenEntry.push({label: '收到推送消息', value: 'receivePushMsg'});
        that.secondForbiddenEntry.push({label: '点击推送消息', value: 'clickPushMsg'});
        that.secondForbiddenEntry.push({label: '点击短信链接', value: 'clickMsgUrl'});
        that.secondForbiddenEntry.push({label: '打开邮件信息', value: 'openEmailMsg'});
        that.secondForbiddenEntry.push({label: '点击邮件链接', value: 'clickEmailUrl'});
        const tempEnterRule = that.pcs.globalRule.pipelineEnterRuleDefinition;
        if (tempEnterRule) {
            if (tempEnterRule.lessThanDays || tempEnterRule.lessThanDays === 0) {
                that.pcs.globalRule.pipelineEnterRuleDefinition.unlimited = false;
                that.lessThanDaysSelect = true;
            }
            if (tempEnterRule.lessThanTimes || tempEnterRule.lessThanTimes === 0) {
                that.pcs.globalRule.pipelineEnterRuleDefinition.unlimited = false;
                that.lessThanTimesSelect = true;
            }
        } else {
            if (!that.pcs.globalRule.pipelineEnterRuleDefinition) {
                that.pcs.globalRule.pipelineEnterRuleDefinition = {};
            }
            that.pcs.globalRule.pipelineEnterRuleDefinition['unlimited'] = true;
        }

        if (that.pcs.globalRule.pipelineForbiddenRuleDefinition.ruleList
            && that.pcs.globalRule.pipelineForbiddenRuleDefinition.ruleList.length) {
            const ruleLength = that.pcs.globalRule.pipelineForbiddenRuleDefinition.ruleList.length;
            const list = that.pcs.globalRule.pipelineForbiddenRuleDefinition.ruleList;
            for (let i = 0; i < ruleLength; i++) {
                if (!list[i].ruleType) {
                    continue;
                }

                if (typeof (list[i].ruleType) === 'object') {
                    const json = {
                        code: list[i].ruleType.code,
                        ruleType: list[i].ruleType.ruleType
                    };

                    list[i].ruleType = json;
                    continue;
                }

                if (list[i].ruleType === 'configEvent') {
                    const json = {
                        code: list[i].ruleParam,
                        ruleType: list[i].ruleType
                    };
                    list[i].ruleType = json;
                } else {
                    // TODO 处理非事件类型数据
                    let type = 0;
                    if (list[i].ruleType === 'receivePushMsg' || list[i].ruleType === 'clickPushMsg') {
                        type = 1;
                    } else if (list[i].ruleType === 'clickMsgUrl') {
                        type = 2;
                    } else if (list[i].ruleType === 'openEmailMsg' || list[i].ruleType === 'clickEmailUrl') {
                        type = 3;
                    }
                    that.pipelineService.getForbiddenRule(that.pcs.pipelineId, type).subscribe((data: any) => {
                        if (data.code === 200) {
                            list[i]['forbidRuleList'] = [];
                            for (let j = 0; j < data.data.length; j++) {
                                const json = {
                                    label: data.data[j].name,
                                    value: data.data[j].id
                                };
                                list[i]['forbidRuleList'].push(json);
                            }
                        }
                    });
                }
            }
        }
    }

    ngOnInit() {
        const that = this;
        console.log(this.pcs.isPipelineEdit);
        that.handleData();
        that.pipelineService.getEventListForTimer(that.pcs.isPipelineEdit, {forbidFlag: 1}).subscribe((result: any) => {
            if (result.code === 200) {
                const length = result.data.data.length;
                for (let i = 0; i < length; i++) {
                    that.secondForbiddenEntry.push(
                        {
                            label: result.data.data[i].name,
                            value: {
                                code: result.data.data[i].code,
                                ruleType: 'configEvent'
                            }
                        }
                    );
                }
                const ruleList = this.pcs.globalRule.pipelineForbiddenRuleDefinition.ruleList;
                for (let a = 0; a < ruleList.length; a++) {
                    for (let b = 0; b < that.secondForbiddenEntry.length; b++) {
                        if (ruleList[a].ruleType && typeof (ruleList[a].ruleType) === 'object') {
                            if (that.secondForbiddenEntry[b].value && typeof (that.secondForbiddenEntry[b].value) === 'object') {
                                if (that.secondForbiddenEntry[b].value.code === ruleList[a].ruleType.code) {
                                    ruleList[a].ruleType = that.secondForbiddenEntry[b].value;
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    // 检验确定和测试按钮
    async handleData(): Promise<any> {
        if (!this.pcs.globalRule.pipelineTerminationRuleDefinition) {
            this.pcs.globalRule.pipelineTerminationRuleDefinition = {};
        }
        this.formatTerminationRule(this.pcs.globalRule.pipelineTerminationRuleDefinition.expression);
        await this.getTarget();
        this.handleTerminationRule();
    }

    // 获取pipeLine指标
    async getTarget(): Promise<any> {
        this.pipelineService.getTerminationRule(this.pcs.campaignId, this.pcs.pipelineId).subscribe((data: any) => {
            if (data.code === 200) {
                const result = data.data;
                for (let i = 0; i < result.length; i++) {
                    if (result[i].type === 'equity') {
                        result[i].code = result[i].equityId;
                    }

                    this.targetList.push({
                        label: result[i].name, value: {
                            type: result[i].type,
                            code: result[i].code, value: result[i].value
                        }
                    });

                }

                if (this.terminationRuleList.length > 0) {
                    for (let a = 0; a < this.terminationRuleList.length; a++) {
                        for (let b = 0; b < this.targetList.length; b++) {
                            if (this.terminationRuleList[a].target.code === this.targetList[b].value.code
                                || Number(this.terminationRuleList[a].target.code) === this.targetList[b].value.code) {
                                this.terminationRuleList[a].target = this.targetList[b].value;
                            }
                        }
                    }
                }
            }
        });
    }

    // 提前终止规则处理后端传来的数据
    formatTerminationRule(terminationRule: string) {
        const that = this;
        if (terminationRule && terminationRule !== 'undefined') {
            const ruleList = terminationRule.split(' : ');
            let tempIndex = 0;
            that.terminationRuleList = [];
            ruleList.forEach((data: any, index: number) => {
                switch (index % 4) {
                    case 0:
                        tempIndex = that.terminationRuleList.length;
                        const tempData = data.split('|');
                        that.terminationRuleList.push({target: {code: tempData[0], type: tempData[1]}});
                        break;
                    case 1:
                        that.terminationRuleList[tempIndex]['code'] = (data && data !== 'undefined') ? data : '>';
                        break;
                    case 2:
                        that.terminationRuleList[tempIndex]['number'] = (data && data !== 'undefined') ? data : '';
                        break;
                    case 3:
                        if (tempIndex === 0) {
                            if (data === '&&') {
                                that.terminationRuleRelation = {label: '并且', value: '&&'};
                            } else {
                                that.terminationRuleRelation = {label: '或者', value: '||'};
                            }
                        }
                        break;
                    default:
                        break;
                }
            });
        } else {
            that.terminationRuleRelation = {label: '或者', value: '||'};
        }
        if (that.terminationRuleList.length === 1) {
            that.terminationRuleRelation = {label: '或者', value: '||'};
        }
    }

    handleTerminationRule() {
        const that = this;
        that.terminationRuleList.forEach((item: any, index: number) => {
            for (let i = 0; i < that.targetList.length; i++) {
                let nonMatch = false;
                for (const key in item.target) {
                    if (item.target[key] !== that.targetList[i].value[key]) {
                        nonMatch = true;
                        break;
                    }
                }
                if (!nonMatch) {
                    item.target = that.targetList[i].value;
                    break;
                }
            }
        });
    }

    /**
     * 选择规则
     */
    selectRule() {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }

        if (that.pcs.globalRule.pipelineEnterRuleDefinition.lessThanDays || that.pcs.globalRule.pipelineEnterRuleDefinition.lessThanTimes) {
            that.pcs.globalRule.pipelineEnterRuleDefinition.unlimited = false;
        } else {
            that.pcs.globalRule.pipelineEnterRuleDefinition.unlimited = true;
        }
    }

    // 修改规则之间的关系
    changeRuleRelation(data: any) {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        if (data.value === '||') {
            data.label = '并且';
            data.value = '&&';
        } else if (data.value === '&&') {
            data.label = '或者';
            data.value = '||';
        }
        that.changeTerminationRule();
    }

    // 提前终止规则数据整理（给后端用）
    changeTerminationRule(data?: any) {
        const that = this;
        let enterRuleDefinitioncode = '';
        if (data && data.target && (+data.number > +data.target.value)) {
            data.number = data.target.value;
            that.changeDetectorRef.detectChanges();
        }
        that.terminationRuleList.forEach((one: any, index: any) => {
            if (index) {
                if (one.target) {
                    if (one.target.code !== 'undefined' || one.target.type !== 'undefined' || one.number) {
                        enterRuleDefinitioncode += ` : ${that.terminationRuleRelation.value} : `;
                    }
                } else {
                    if (one.target || one.number) {
                        enterRuleDefinitioncode += ` : ${that.terminationRuleRelation.value} : `;
                    }
                }
            }
            if (one.target) {
                if (one.target.code !== 'undefined' || one.target.type !== 'undefined' || one.number) {
                    enterRuleDefinitioncode += `${one.target.code}|${one.target.type} : ${one.code} : ${one.number}`;
                }
            } else {
                if (one.target || one.number) {
                    enterRuleDefinitioncode += `${one.target}|${one.target} : ${one.code} : ${one.number}`;
                }
            }
        });
        that.pcs.globalRule.pipelineTerminationRuleDefinition['expression'] = enterRuleDefinitioncode;
    }

    /**
     * 修改规则之间的关系
     */
    changeNoEntryRuleRelation(data: any) {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        if (data.value === '||') {
            data.label = '并且';
            data.value = '&&';
            that.pcs.globalRule.pipelineForbiddenRuleDefinition.ruleRelation = '&';
        } else if (data.value === '&&') {
            data.label = '或者';
            data.value = '||';
            that.pcs.globalRule.pipelineForbiddenRuleDefinition.ruleRelation = '|';
        }
    }

    /**
     * 禁止规则第2个下拉框发送改变
     */
    ruleTypeChange(value: any, rule: any) {
        const that = this;
        let ruleType = 0;
        if (value === 'receivePushMsg' || value === 'clickPushMsg') {
            ruleType = 1;
        } else if (value === 'clickMsgUrl') {
            ruleType = 2;
        } else if (value === 'openEmailMsg' || value === 'clickEmailUrl') {
            ruleType = 3;
        }
        if (ruleType !== 1 && ruleType !== 2 && ruleType !== 3) {
            delete rule['forbidRuleList'];
            return;
        }
        that.pipelineService.getForbiddenRule(that.pcs.pipelineId, ruleType).subscribe((data: any) => {
            if (data.code === 200) {
                rule.ruleParam = null;
                rule['forbidRuleList'] = [];
                for (let i = 0; i < data.data.length; i++) {
                    const json = {
                        label: data.data[i].name,
                        value: data.data[i].id
                    };
                    rule['forbidRuleList'].push(json);
                }
            }
        });
    }

    // 添加提前终止规则
    addRule() {
        if (this.terminationRuleList.length > 0) {
            for (let i = 0; i < this.terminationRuleList.length; i++) {
                if (!(this.terminationRuleList[i].code && this.terminationRuleList[i].number && this.terminationRuleList[i].target)) {
                    this.message.create('error', '请将数据填写完整再添加新规则');
                    return;
                }
            }
        }
        if (this.terminationRuleList.length > 9 || !this.pcs.isPipelineEdit) {
            this.message.create('error', '最多可以添加10条');
            return;
        }
        this.terminationRuleList.push({code: '=='});
    }

    // 删除提前终止规则
    deleteRule(index: number) {
        if (!this.pcs.isPipelineEdit) {
            return;
        }
        this.terminationRuleList.splice(index, 1);
        let enterRuleDefinitioncode = '';
        this.terminationRuleList.forEach((one: any, i: any) => {
            if (i) {
                enterRuleDefinitioncode += ` : ${this.terminationRuleRelation.value} : `;
            }
            if (one.target) {
                enterRuleDefinitioncode += `${one.target.code}|${one.target.type} : ${one.code} : ${one.number}`;
            } else {
                enterRuleDefinitioncode += `${one.target}|${one.target} : ${one.code} : ${one.number}`;
            }
        });
        this.pcs.globalRule.pipelineTerminationRuleDefinition['expression'] = enterRuleDefinitioncode;
        console.log(enterRuleDefinitioncode);
    }

    /**
     * 添加禁止进入规则
     */
    addNoEntryRule() {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }

        const list = that.pcs.globalRule.pipelineForbiddenRuleDefinition.ruleList;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (typeof (list[i].ruleType) === 'object') {
                    if (list[i].ruleType.ruleType === 'configEvent') {
                        if (!(list[i].ruleType && list[i].ruleVal)) {
                            this.message.create('error', '请将数据填写完整再添加新规则');
                            return;
                        }
                    }
                } else {
                    if (!(list[i].ruleParam && list[i].ruleType && list[i].ruleVal)) {
                        this.message.create('error', '请将数据填写完整再添加新规则');
                        return;
                    }
                }
            }
        }

        if (that.pcs.globalRule.pipelineForbiddenRuleDefinition.ruleList.length > 9) {
            this.message.create('error', '最多可以添加10条');
            return;
        }
        that.pcs.globalRule.pipelineForbiddenRuleDefinition.ruleList.push({
            happen: false,
            ruleParam: null,
            ruleType: null,
            ruleVal: null
        });
    }

    /**
     * 删除禁止进入规则
     */
    delNoEntryRule(index: number) {
        const that = this;
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        that.pcs.globalRule.pipelineForbiddenRuleDefinition.ruleList.splice(index, 1);
    }
}
