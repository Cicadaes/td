import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class PipelineNodeCommunicationService {

    nodeData: any = {};

    nodeLinks: any[] = [];  //触发器组件出去的线

    campaignId: any = '';

    pipeLineId: any = '';

    startTime: any;

    endTime: any;

    rule: any = {
        pipelineTerminationRuleDefinition: {},
        pipelineEnterRuleDefinition: {},
        pipelineForbiddenRuleDefinition: {}
    };
    
    editFlag: boolean = false;  //判断能否修改

    constructor(){}

    //TODO 整理所有组件数据
	public formatPipeLineData(nodeDefinitionList: any) {
		let that = this;
        let length = nodeDefinitionList.length;
		for (let i = 0; i < length; i++) {
			delete nodeDefinitionList[i].index;
			if (nodeDefinitionList[i].type === 'split') {
                that.formatSplitPipe(nodeDefinitionList[i]);
			} else if (nodeDefinitionList[i].type === 'hourMeter') {
                that.formatHourMeterPipe(nodeDefinitionList[i]);
            } else if (nodeDefinitionList[i].type === 'push') {
                that.formatPushPipe(nodeDefinitionList[i]);
            } else if (nodeDefinitionList[i].type === 'shortMessage') {
                that.formatShortMessage(nodeDefinitionList[i]);
            } else if (nodeDefinitionList[i].type === 'entrance') {
                that.formatEntrance(nodeDefinitionList[i]);
            } else if (nodeDefinitionList[i].type === 'trigger') {
                that.formatTrigger(nodeDefinitionList[i]);
            }
		}
    }
    
    /**
     * 格式化入口组件并初始化参数
     * @param data 
     */
    formatEntrance(data: any) {
        if (!data.crowdType) {
            data['crowdType'] = '1';
        }
        if (!data.calcType) {
            data['calcType'] = '1';
        }
    }

    /**
     * 格式化触发器组件并初始化参数
     * @param data 
     */
    formatTrigger(data: any) {
        if (!data.branchType) {
            data['branchType'] = '1';
        }
        if (!data.monitorType) {
            data['monitorType'] = '1';
        }
        if (!data.targetType) {
            data.targetType = 'event';
            data.startTime = new Date(this.startTime).valueOf();
            data.endTime = new Date(this.endTime).valueOf();
        }
    }

    /**
     * 格式化分流器组件并初始参数
     * @param data 
     */
	formatSplitPipe(data: any) {
        if (data.splitType == 1 || data.splitType == 2) {
            delete data.dimensionCode;
        }
        if (data.branchList) {
            for (let i = 0; i < data.branchList.length; i++) {
                if (data.splitType == 1) {
                    /*if (!data.branchList[i].min) {
                        data.branchList[i].min = '0';
                    }
                    if (!data.branchList[i].max) {
                        data.branchList[i].max = '0';
                    }*/
                    delete data.branchList.percent;
                    delete data.branchList.optionCode;
                } else if (data.splitType == 2) {
                    delete data.branchList.min;
                    delete data.branchList.max;
                    delete data.branchList.optionCode;
                } else if (data.splitType == 3) {
                    delete data.branchList.min;
                    delete data.branchList.max;
                    delete data.branchList.percent;
                }
            }
        }
        if (data.dimensionCode && data.dimensionCode instanceof Array) {
            data.dimensionCode = data.dimensionCode[0];        
        }
        if (!data.splitType) {
            data['splitType'] = '1';
        }
    }
    
    /**
     * 格式化计时器组件并初始化参数
     * @param data 
     */
    formatHourMeterPipe(data: any) {
        if (data.hourMeterType) {
            data.hourMeterType = +data.hourMeterType;
        } else {
            data.hourMeterType = '1';
        }
    }
    
    /**
     * 格式化应用推送组件并初始化参数
     * @param data 
     */
    formatPushPipe(data: any) {
        if (!data.platform) {
            data.platform = 'android';
        }
        if (!data.channel) {
            data.channel = 'td';
        }
        if (!data.triggerType) {
            data.triggerType = '1';
        }
    }
    
    /**
     * 格式化短信推送组件并初始化参数
     * @param data 
     */
    formatShortMessage(data: any) {
        if (!data.attachmentName) {
            delete data.attachmentName;
        }
        if (!data.attachmentId) {
            delete data.attachmentId;
        }
        if (!data.triggerType) {
            data.triggerType = '1';
        }
    }
}