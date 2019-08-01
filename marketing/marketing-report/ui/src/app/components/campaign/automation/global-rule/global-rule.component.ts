import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { PipelineDefinitionResourceService } from "../../../../services/admin/pipeline-definition.resource.service";
import { PipelineNodeCommunicationService } from "../../../../services/communication/pipeline-node.communication.service";

@Component({
	selector: 'global-rule',
	templateUrl: 'global-rule.component.html',
	styleUrls: ['global-rule.component.scss'],
	providers: [PipelineDefinitionResourceService]
})

export class GlobalRuleComponent implements OnInit {

	campaignId: any;  //活动Id

	pipeLineId: any;  //pipeLineId

	terminationRuleList: any[] = [];   //提前终止规则列表

	terminationRuleRelation: any;      //提前终止规则之间的关系（并且和或者）

	targetList: SelectItem[] = [];    //指标列表

	symbolList: SelectItem[] = [];    //符号列表

	selectLessThanDays: boolean = false;       //全局进入规则 同一用户xx天不在进入

	selectLessThanTimes: boolean = false;      //全局进入规则 同一用户进入次数不超过xx次

	fristeNoEntry: SelectItem[] = [];   //全局禁止规则第一个下拉菜单列表

	secondNoEntry: SelectItem[] = [];   //全局禁止规则第二个下拉菜单列表

	terminationNoEntryRelation: any;  //全局禁止规则之间的关系

	noEntryRules: any = [];    //全局禁止规则列表

	testData: any;  //测试用 后续删除

	constructor(
		public pipelineDefinitionResourceService: PipelineDefinitionResourceService,
		public pipelineNodeCommunicationService: PipelineNodeCommunicationService,
		public changeDetectorRef: ChangeDetectorRef
	) {
		let that = this;
		that.campaignId = that.pipelineNodeCommunicationService.campaignId;
		that.pipeLineId = that.pipelineNodeCommunicationService.pipeLineId;
		that.symbolList.push({label: '大于', value: '>'});
		that.symbolList.push({label: '等于', value: '='});
		that.symbolList.push({label: '小于', value: '<'});
		that.fristeNoEntry.push({label: '发生', value: '发生'});
		that.fristeNoEntry.push({label: '未发生', value: '未发生'});
		that.secondNoEntry.push({label: '收到推送消息', value: 'getPush'});
		that.secondNoEntry.push({label: '点击推送消息', value: 'clickPush'});
		that.secondNoEntry.push({label: '点击短信链接', value: 'clickSms'});
		that.terminationNoEntryRelation = {label : '或者', value: '||'};

		let tempEnterRule = that.pipelineNodeCommunicationService.rule.pipelineEnterRuleDefinition;
		if (tempEnterRule && !tempEnterRule.unlimited) {
			if (tempEnterRule.lessThanDays || tempEnterRule.lessThanDays == 0) {
				that.pipelineNodeCommunicationService.rule.pipelineEnterRuleDefinition.unlimited = false;
				that.selectLessThanDays = true;	
			}
			if (tempEnterRule.lessThanTimes || tempEnterRule.lessThanTimes == 0) {
				that.pipelineNodeCommunicationService.rule.pipelineEnterRuleDefinition.unlimited = false;
				that.selectLessThanTimes = true;
			}
		} else {
			that.pipelineNodeCommunicationService.rule.pipelineEnterRuleDefinition.unlimited = true;
		}
	}

	ngOnInit() {
		let that = this;
		that.handleData();
    }

    //检验确定和测试按钮
    async handleData(): Promise<any> {
        this.formatTerminationRule(this.pipelineNodeCommunicationService.rule.pipelineTerminationRuleDefinition.expression);
        await this.getTarget();
        this.handleTerminationRule();
    }

	//获取pipeLine指标
    async getTarget(): Promise<any> {
		let that = this;
        return new Promise((resolve: any, reject: any) => {
            that.pipelineDefinitionResourceService.getTerminationRule(that.campaignId, that.pipeLineId).then((result: any) => {
                result.map((data: any) => {
                    if (data.type === 'index') {
                        data.value = Infinity;
                    }
                    that.targetList.push({label: data.name, value: {type: data.type, code: data.code, value: data.value}});
                });
				resolve()
            }).catch(() => {
                reject()
            });
        })
	}

	//添加提前终止规则
	addRule() {
		let that = this;
		that.terminationRuleList.push({code: '='});
	}

	//删除提前终止规则
	deleteRule(index: number) {
		let that = this;
		if (!that.pipelineNodeCommunicationService.editFlag) {
			return;
		}
		that.terminationRuleList.splice(index, 1);
	}

	//提前终止规则处理后端传来的数据
    formatTerminationRule(terminationRule: string) {
		let that = this;
		if (terminationRule && terminationRule !== 'undefined') {
			let ruleList = terminationRule.split(' : ');
			let tempIndex = 0;
			that.terminationRuleList = [];
			ruleList.map((data: any, index: number) => {
				switch (index%4) {
					case 0:
						tempIndex = that.terminationRuleList.length;
						let tempData = data.split('|');
						that.terminationRuleList.push({target: {code: tempData[0], type: tempData[1]}});
						break;
					case 1:
						that.terminationRuleList[tempIndex]['code'] = (data && data != 'undefined') ? data : '>';
						break;
					case 2:
						that.terminationRuleList[tempIndex]['number'] = (data && data != 'undefined') ? data : '';
					case 3:
						if(tempIndex === 0) {
							if (data === '&&'){
								that.terminationRuleRelation = {label: '并且', value: '&&'};
							} else {
								that.terminationRuleRelation = {label: '或者', value: '||'};
							}
						}
						break;
					default: break;
				}
			})
		} else {
			that.terminationRuleRelation = {label: '或者', value: '||'};
		}
	}

    handleTerminationRule() {
        let that = this;
        that.terminationRuleList.map((item: any, index: number) => {
            for (let i = 0; i < that.targetList.length; i++) {
                let nonMatch = false;
                for (let key in item.target) {
                    if (item.target[key] != that.targetList[i].value[key]) {
                        nonMatch = true;
                        break;
                    }
                }
                if (!nonMatch) {
                    item.target = that.targetList[i].value;
                    break;
                }
            }
        })
    }


	//提前终止规则数据整理（给后端用）
	changeTerminationRule(data?: any) {
		let that = this;
		let enterRuleDefinitioncode: string = '';
		if (data && data.target && (+data.number > +data.target.value)) {
			data.number = data.target.value;
			that.changeDetectorRef.detectChanges();
		}
		that.terminationRuleList.map((data: any, index: any) => {
			if (index) {
				enterRuleDefinitioncode += ` : ${that.terminationRuleRelation.value} : `;
			}
			if (data.target) {
				enterRuleDefinitioncode += `${data.target.code}|${data.target.type} : ${data.code} : ${data.number}`;
			} else {
				enterRuleDefinitioncode += `${data.target}|${data.target} : ${data.code} : ${data.number}`;
			}
		});
		that.pipelineNodeCommunicationService.rule.pipelineTerminationRuleDefinition['expression'] = enterRuleDefinitioncode;
	}

	//全局进入规则限制修改后 字段更改
	enterRuleChange(e: any) {
		let that = this;
		if (!that.pipelineNodeCommunicationService.editFlag) {
			return;
		}
		if (that.pipelineNodeCommunicationService.rule.pipelineEnterRuleDefinition.lessThanDays || that.pipelineNodeCommunicationService.rule.pipelineEnterRuleDefinition.lessThanTimes) {
			that.pipelineNodeCommunicationService.rule.pipelineEnterRuleDefinition.unlimited = false;
		} 
	}

	//选择全局进入规则限制 
	selectRule(e: any,data: string) {
		let that = this;
		if (!that.pipelineNodeCommunicationService.editFlag) {
			return;
		}
		if (data === '1') {
			that.selectLessThanDays = !that.selectLessThanDays;
		 	that.pipelineNodeCommunicationService.rule.pipelineEnterRuleDefinition.lessThanDays = "";
		} else if (data === '2') {
			that.selectLessThanTimes = !that.selectLessThanTimes;
		 	that.pipelineNodeCommunicationService.rule.pipelineEnterRuleDefinition.lessThanTimes = "";	
		}
		if (!that.selectLessThanDays && !that.selectLessThanTimes && !that.pipelineNodeCommunicationService.rule.pipelineEnterRuleDefinition.lessThanDays && !that.pipelineNodeCommunicationService.rule.pipelineEnterRuleDefinition.lessThanTimes) {
			that.pipelineNodeCommunicationService.rule.pipelineEnterRuleDefinition.unlimited = true;
		} else {
			that.pipelineNodeCommunicationService.rule.pipelineEnterRuleDefinition.unlimited = false;
		}
	}

	//添加全局禁止规则
	addNoEntryRule(){
		let that = this;
		if (!that.pipelineNodeCommunicationService.editFlag) {
			return;
		}
		that.noEntryRules.push({});
	}

	//删除全局禁止规则
	delNoEntryRule(index: number){
		let that = this;
		if (!that.pipelineNodeCommunicationService.editFlag) {
			return;
		}
		that.noEntryRules.splice(index,1);
	};

	//修改规则之间的关系
	changeRuleRelation(data: any) {
		if (!this.pipelineNodeCommunicationService.editFlag) {
			return;
		}
		if (data.value === '||') {
			data.label = '并且';
			data.value = '&&';
		} else if (data.value === '&&') {
			data.label = '或者';
			data.value = '||';
		}
	}

	/**
	 * 禁止规则 选择条件
	 */
	selectNoEntry(e: any, rule: any) {
		let that = this;
		let type = 'push';
		if (e.value === 'clickSms') {
			type = 'shortMessage';
		}
		that.pipelineDefinitionResourceService.getForbidRuleList(that.pipelineNodeCommunicationService.pipeLineId, type)
		.then((data: any) => {
			//TODO 数据结构未确定
			let list: SelectItem[] = []
			for (let i = 0; i < data.length; i++) {
				let json = {
					label: data[i].name,
					value: data[i].id,
				};
				list.push(json);
			}
			rule['forbidRuleList'] = list;
		}).catch();
	}
}