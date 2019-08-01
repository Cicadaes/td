import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Utiles } from '../../utils/utiles';
import { NzMessageService } from 'ng-zorro-antd';
import cloneDeep from 'lodash/cloneDeep';

/**
 * 用于存放pipeline节点数据
 * 并且存放一些pipeline组件数据处理方法
 */

@Injectable()
export class PipelineCommunicationService {
  nodeData: any = {}; // 组件详细数据
  nodeLinks: any[] = []; // 触发器组件出去的线
  campaignId: any = null; // 活动Id
  pipelineId: any = null; // pipelineId
  startTime: any; // pipeline开始时间
  endTime: any; // pipeline结束时间
  globalRule: any = {
    // 全局规则
    pipelineTerminationRuleDefinition: {},
    pipelineEnterRuleDefinition: {},
    pipelineForbiddenRuleDefinition: {}
  };
  isPipelineEdit: boolean = false; // 判断pipeline是否可以编辑
  diagram: string = ''; // pipeline节点和

  typeValueMap: any = {
    1: 'entrance',
    2: 'hourMeter',
    3: 'filter',
    4: 'generate',
    5: 'split',
    6: 'trigger',
    7: 'push',
    8: 'shortMessage',
    9: 'mail',
    10: 'end'
  };

  typeNameMap: any = {
    entrance: '入口',
    hourMeter: '计时器',
    filter: '过滤器',
    generate: '生成人群',
    split: '分流器',
    trigger: '触发器',
    push: '应用推送',
    shortMessage: '短信通知',
    mail: '邮件投放',
    end: '结束'
  };

  greenIconMap: any = {
    entrance: '/aeplus-pro/assets/images/pipeline/component-entrance-green.svg',
    hourMeter: '/aeplus-pro/assets/images/pipeline/component-hourMeter-green.svg',
    filter: '/aeplus-pro/assets/images/pipeline/component-filter-green.svg',
    generate: '/aeplus-pro/assets/images/pipeline/component-generateCrowd-green.svg',
    split: '/aeplus-pro/assets/images/pipeline/component-split-green.svg',
    trigger: '/aeplus-pro/assets/images/pipeline/component-trigger-green.svg',
    push: '/aeplus-pro/assets/images/pipeline/component-push-green.svg',
    shortMessage: '/aeplus-pro/assets/images/pipeline/component-sms-green.svg',
    mail: '/aeplus-pro/assets/images/pipeline/component-edm-green.svg',
    end: '/aeplus-pro/assets/images/pipeline/component-end-green.svg'
  };

  redIconMap: any = {
    entrance: '/aeplus-pro/assets/images/pipeline/component-entrance-red.svg',
    hourMeter: '/aeplus-pro/assets/images/pipeline/component-hourMeter-red.svg',
    filter: '/aeplus-pro/assets/images/pipeline/component-filter-red.svg',
    generate: '/aeplus-pro/assets/images/pipeline/component-generateCrowd-red.svg',
    split: '/aeplus-pro/assets/images/pipeline/component-split-red.svg',
    trigger: '/aeplus-pro/assets/images/pipeline/component-trigger-red.svg',
    push: '/aeplus-pro/assets/images/pipeline/component-push-red.svg',
    shortMessage: '/aeplus-pro/assets/images/pipeline/component-sms-red.svg',
    mail: '/aeplus-pro/assets/images/pipeline/component-edm-red.svg',
    end: '/aeplus-pro/assets/images/pipeline/component-end-red.svg'
  };

  constructor(public utiles: Utiles, public message: NzMessageService) {}

  // 创建观察者模式
  /**
   * 监听是否有线发生变化 （触发器、分流器）
   */
  private lineChange = new Subject<any>();
  lineChange$ = this.lineChange.asObservable();

  lineChangeMission(data: any) {
    this.lineChange.next(data);
  }

  beforeSaveOrCheck(that: any) {
    if (!that.pcs.isPipelineEdit) {
      return;
    }

    // 处理全局规则数据
    if (that.showRightContent === 'rule') {
      const forbiddenRuleDef = that.pcs.globalRule.pipelineForbiddenRuleDefinition;
      if (forbiddenRuleDef && forbiddenRuleDef.ruleList && forbiddenRuleDef.ruleList.length > 0) {
        for (let i = 0; i < forbiddenRuleDef.ruleList.length; i++) {
          const obj = forbiddenRuleDef.ruleList[i];
          delete obj['forbidRuleList'];
          if (obj.ruleType && typeof obj.ruleType === 'object') {
            obj.ruleParam = obj.ruleType.code;
            obj.ruleType = obj.ruleType.ruleType;
          }
        }
      }
      that.diagramObj = Object.assign(that.diagramObj, that.pcs.globalRule);
    }

    if (!that.pcs.nodeData || !that.showRightContent) {
      that.diagramObj['pipelineId'] = that.pipelineObj.id;
      that.diagramObj['campaignId'] = that.pipelineObj.campaignId;
      that.diagramObj['name'] = that.pipelineObj.name;
      that.diagramObj['status'] = that.pipelineObj.status;
      that.diagramObj['version'] = that.pipelineObj.version || '1.0.0';
      that.diagramObj['startTime'] = that.pipelineObj.startTime;
      that.diagramObj['endTime'] = that.pipelineObj.endTime;
      that.diagramObj['description'] = that.pipelineObj.description;
      that.diagramObj['tenantId'] = that.pipelineObj.tenantId;
      that.diagramObj['creator'] = that.pipelineObj.creator;
      that.diagramObj['createBy'] = that.pipelineObj.createBy;
      that.diagramObj['createTime'] = that.pipelineObj.createTime;
      that.diagramObj['updater'] = that.pipelineObj.updater;
      that.diagramObj['updateBy'] = that.pipelineObj.updateBy;
      that.diagramObj['updateTime'] = that.pipelineObj.updateTime;

      that.pipelineObj['diagram'] = JSON.stringify(that.diagramObj);
      return;
    }

    if (that.pcs.nodeData.name) {
      that.pcs.nodeData.name = that.pcs.nodeData.name.trim();
    }

    let copyData = cloneDeep(that.pcs.nodeData);
    that.pcs.formatPipelineData(copyData, that);

    that.diagramObj.nodeDefinitionList[that.pcs.nodeData.index] = copyData;

    // 保存时候，先克隆一份diagram对象
    let diagramTmp = JSON.parse(JSON.stringify(that.diagramObj));

    // 更新一下node
    const node = that.graph.getCell(that.nodeMap[that.pcs.nodeData.id]);
    if (node) {
      node.data = JSON.parse(JSON.stringify(copyData));
      node.data.index = that.pcs.nodeData.index;
      if (!node.data.isErrorState) {
        node.attr({
          '.label': {
            text: that.pcs.nodeData.name || that.pcs.typeNameMap[node.data.type]
          }
        });
      }
    }

    diagramTmp['pipelineId'] = that.pipelineObj.id;
    diagramTmp['campaignId'] = that.pipelineObj.campaignId;
    diagramTmp['name'] = that.pipelineObj.name;
    diagramTmp['status'] = that.pipelineObj.status;
    diagramTmp['version'] = that.pipelineObj.version || '1.0.0';
    diagramTmp['startTime'] = that.pipelineObj.startTime;
    diagramTmp['endTime'] = that.pipelineObj.endTime;
    diagramTmp['description'] = that.pipelineObj.description;
    diagramTmp['tenantId'] = that.pipelineObj.tenantId;
    diagramTmp['creator'] = that.pipelineObj.creator;
    diagramTmp['createBy'] = that.pipelineObj.createBy;
    diagramTmp['createTime'] = that.pipelineObj.createTime;
    diagramTmp['updater'] = that.pipelineObj.updater;
    diagramTmp['updateBy'] = that.pipelineObj.updateBy;
    diagramTmp['updateTime'] = that.pipelineObj.updateTime;

    that.pipelineObj['diagram'] = JSON.stringify(diagramTmp);
  }

  //观察者模式创建完成
  public formatPipelineData(obj: any, pipeCom: any) {
    const that = this;
    delete obj.index;
    switch (obj.type) {
      case 'entrance': {
        that.formatEntrance(obj);
        break;
      }
      case 'hourMeter': {
        that.formatHourMeter(obj);
        break;
      }
      case 'filter': {
        that.formatFilter(obj);
        break;
      }
      case 'generate': {
        that.formatGenerate(obj);
        break;
      }
      case 'split': {
        that.formatSplit(obj);
        break;
      }
      case 'trigger': {
        that.formatTrigger(obj, pipeCom);
        break;
      }
      case 'push': {
        that.formatPush(obj);
        break;
      }
      case 'shortMessage': {
        that.formatShortMessage(obj);
        break;
      }
      case 'mail': {
        that.formatEdm(obj);
        break;
      }
    }
  }

  /**
   * 格式化入口组件参数
   */
  formatEntrance(data: any) {
    if (data.forbiddenRule && data.forbiddenRule.ruleList && data.forbiddenRule.ruleList.length > 0) {
      let ruleList = data.forbiddenRule.ruleList;
      let length = data.forbiddenRule.ruleList.length;
      for (let i = 0; i < length; i++) {
        delete ruleList[i]['forbidRuleList'];
        if (ruleList[i].ruleType && typeof ruleList[i].ruleType === 'object') {
          ruleList[i].ruleParam = ruleList[i].ruleType.code;
          ruleList[i].ruleType = ruleList[i].ruleType.ruleType;
        }
        if (!ruleList[i].ruleParam && !ruleList[i].ruleType && !ruleList[i].ruleVal) {
          ruleList.splice(i, 1);
        }
      }
    }
  }

  /**
   * 格式化计时器组件参数
   */
  formatHourMeter(data: any) {
    if (data.hourMeterType === '1') {
      if (data.behaviorList && data.behaviorList.length) {
        const length = data.behaviorList.length;
        if (!data.behaviorList[length - 1].event || data.behaviorList[length - 1].event === 'undefined') {
          data.behaviorList.pop();
        }
      }
      let expression: string = '';
      if (data.behaviorList && data.behaviorList.length) {
        const behaviorListLength = data.behaviorList.length;
        for (let i = 0; i < behaviorListLength; i++) {
          const selectedEvent = data.behaviorList[i].event || 'undefined';
          if (i !== 0) {
            const behaviorRelation = data.behaviorRelation === 'and' ? '&&' : '||';
            expression += ` : ${behaviorRelation} : '${selectedEvent}'`;
          } else {
            expression += `'${selectedEvent}'`;
          }
        }
      }
      data.expression = expression;
    } else if (data.hourMeterType === '2') {
      if (data.afterDay || data.afterHours || data.afterMinutes) {
        data.timeSchedulingExpression = `${data.afterDay || 0} : ${data.afterHours || 0} : ${data.afterMinutes || 0}`;
      }
    }
    if (data.targetDate) {
      data.targetHour = data.targetHour || 0;
      data.targetMinute = data.targetMinute || 0;
      let date: string = this.utiles.formatDate(data.targetDate, 2);
      date += ` ${data.targetHour}:${data.targetMinute}`;
      data.stopTimeMillis = new Date(date).getTime();
    } else {
      data.stopTimeMillis = null;
    }

    delete data.targetDate;
    delete data.targetHour;
    delete data.targetMinute;
    delete data.behaviorRelation;
    delete data.behaviorList;
    delete data.afterDay;
    delete data.afterHours;
    delete data.afterMinutes;

    if (!data.hourMeterType) {
      data.hourMeterType = '1';
    }
  }

  /**
   * 格式化过滤器组件参数
   */
  formatFilter(data: any) {
    data.tagRowKeyList = [];
    if (data.dynamicList) {
      for (let i = 0; i < data.dynamicList.length; i++) {
        const obj = data.dynamicList[i];
        data.tagRowKeyList.push(obj.key);
      }
    }
  }

  /**
   * 格式化生成人群组件参数
   */
  formatGenerate(data: any) {}

  /**
   * 格式化分流器组件参数
   */
  formatSplit(data: any) {
    delete data['changeType'];
    if (data.splitType === '1' || data.splitType === '2') {
      delete data.dimensionCode;
    }
    if (data.branchList) {
      for (let i = 0; i < data.branchList.length; i++) {
        if (data.splitType === '1') {
          delete data.branchList[i].percent;
          delete data.branchList[i].optionCode;
        } else if (data.splitType === '2') {
          delete data.branchList[i].min;
          delete data.branchList[i].max;
          delete data.branchList[i].optionCode;
        } else if (data.splitType === '3') {
          delete data.branchList[i].min;
          delete data.branchList[i].max;
          delete data.branchList[i].percent;
        }
      }
      data.count = data.branchList.length;
    }
    if (data.dimensionCode && data.dimensionCode instanceof Array) {
      data.dimensionCode = data.dimensionCode[0];
    }
    if (!data.splitType) {
      data['splitType'] = '1';
    }
  }

  /**
   * 格式化触发器组件参数
   */
  formatTrigger(data: any, that: any) {
    let nodeData = data;

    // 处理触发器分支规则
    nodeData.mainExpression = [];
    if (nodeData.targetType === 'event' && nodeData.eventList) {
      nodeData.eventList.forEach((data: any) => {
        nodeData.mainExpression.push(`${data.code} : == : ${data.name}`);
      });
      if (nodeData.branchType == '1') {
        // 单分支
        nodeData.mainExpression.push(`${nodeData.otherName || 'undefined'}`);
      }
    } else if (nodeData.targetType === 'target' && nodeData.targetList) {
      nodeData.targetList.forEach((data: any) => {
        if (data.code !== 'range') {
          nodeData.mainExpression.push(
            `'${nodeData.otherTarget}' : '${data.code}' : ${data.number || 0} : == : '${data.name || undefined}'`
          );
        } else {
          nodeData.mainExpression.push(
            `'${nodeData.otherTarget}' : range : ${data.first || 0}-${data.second || 0} : == : '${data.name ||
              undefined}'`
          );
        }
      });
      if (nodeData.branchType == '1') {
        nodeData.mainExpression.push(`'${nodeData.otherName || undefined}'`);
      }
    }

    // 同时满足条件
    nodeData.additionExpression = [];
    if (nodeData.conditions && nodeData.conditions.length) {
      nodeData.conditions.forEach((data: any) => {
        if (data && data.target !== 'undefined') {
          if (data.code !== 'range' && data.number) {
            nodeData.additionExpression.push(`'${data.target}' : '${data.code}' : ${data.number || undefined}`);
          } else if (data.first && data.second) {
            nodeData.additionExpression.push(
              `'${data.target}' : range : ${data.first || undefined}-${data.second || undefined}`
            );
            // tslint:disable-next-line
            // nodeData.additionExpression.push(`'${data.target}' : > : ${data.first || undefined} : '${data.code}' : '${data.target}' : < : ${data.second || undefined}`);
          }
        }
      });
    }

    if (!nodeData || !nodeData.mainExpression || !nodeData.mainExpression.length) {
      return;
    }

    // 删除不需要的字段
    delete nodeData.eventList;
    delete nodeData.targetList;
    delete nodeData.eventMultipleBranchList;
    delete nodeData.targetMultipleBranchList;
    delete nodeData.conditions;
    delete nodeData.otherName;
    delete nodeData.otherTarget;
    delete nodeData.otherTargetName;

    // =================
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
    if (!data.lessThanDaysSelect) {
      delete data.sameUserLessThanDays;
    }
    if (!data.lessThanTimesSelect) {
      delete data.sameUserLessThanTimes;
    }

    if (typeof data.startTime === 'object') {
      data.startTime = data.startTime.getTime();
    }
    if (typeof data.endTime === 'object') {
      data.endTime = data.endTime.getTime();
    }
    if (typeof data.startTime === 'string' && data.startTime.indexOf('Z') !== -1) {
      data.startTime = new Date(data.startTime).getTime();
    }
    if (typeof data.endTime === 'string' && data.endTime.indexOf('Z') !== -1) {
      data.endTime = new Date(data.endTime).getTime();
    }
  }

  /**
   * 格式化应用推送组件参数
   */
  formatPush(data: any) {
    data.triggerType = +data.triggerType;
    if (data.groupName === null || data.groupName === '' || data.groupName === undefined) {
      if (data.hasOwnProperty('groupId')) {
        delete data.groupId;
      }
    }
    if (data.triggerType === 2) {
      if (!data.date || !data.hour || !data.minute) {
        if (!data.frontendAttr) {
          data.appointedTime = '';
        } else {
          const temp = JSON.parse(data.frontendAttr);
          data.date = temp.date;
          data.hour = temp.hour;
          data.minute = temp.minute;
          data.appointedTime = `${this.formateTime(data.date)} ${data.hour}:${data.minute}:00`;
        }
      } else {
        data.appointedTime = `${this.formateTime(data.date)} ${data.hour}:${data.minute}:00`;
      }
      const tempJSON = {
        date: data.date,
        hour: data.hour,
        minute: data.minute
      };
      data.frontendAttr = JSON.stringify(tempJSON);
    } else {
      data.appointedTime = null;
    }
    const customParameters = [];
    const equitys = [];
    if (data.message && (data.customParameters || data.equitys)) {
      let content = data.message;
      content = content.replace(/&amp;/g, '&');
      const reg = /\$\{[\s\S]+?\}/g;
      const equityList = content.match(reg);
      if (equityList && equityList.length > 0) {
        for (let i = 0; i < equityList.length; i++) {
          let tmpEquity = equityList[i].split('{')[1];
          tmpEquity = tmpEquity.split('}')[0];
          if (data.customParameters && data.customParameters.indexOf(tmpEquity) >= 0) {
            customParameters.push(tmpEquity);
          }
          if (data.equitys && data.equitys.indexOf(tmpEquity) >= 0) {
            equitys.push(tmpEquity);
          }
        }
        data.customParameters = customParameters;
        data.equitys = equitys;
      }
    }
    // if (!data.isVibration) {
    //     delete data.extendAttr;
    // }
    if (data.channelCode !== 'tdpush') {
      delete data.huawei;
      delete data.xiaomi;
    }
  }

  /**
   * 格式化短信通知组件参数
   */
  formatShortMessage(data: any) {
    data.triggerType = +data.triggerType;
    data.shortMessageType = +data.shortMessageType;
    if (data.groupName === null || data.groupName === '' || data.groupName === undefined) {
      if (data.hasOwnProperty('groupId')) {
        delete data.groupId;
      }
    }
    if (data.triggerType === 2) {
      if (!data.date || !data.hour || !data.minute) {
        if (!data.frontendAttr) {
          data.appointedTime = '';
        } else {
          const temp = JSON.parse(data.frontendAttr);
          data.date = temp.date;
          data.hour = temp.hour;
          data.minute = temp.minute;
          data.appointedTime = `${this.formateTime(data.date)} ${data.hour}:${data.minute}:00`;
        }
      } else {
        data.appointedTime = `${this.formateTime(data.date)} ${data.hour}:${data.minute}:00`;
      }
      const tempJSON = {
        date: data.date,
        hour: data.hour,
        minute: data.minute
      };
      data.frontendAttr = JSON.stringify(tempJSON);
    }
    const customParameters = [];
    const equitys = [];
    if (data.message && (data.customParameters || data.equitys)) {
      let content = data.message;
      content = content.replace(/&amp;/g, '&');
      const reg = /\$\{[\s\S]+?\}/g;
      const equityList = content.match(reg);
      if (equityList && equityList.length > 0) {
        for (let i = 0; i < equityList.length; i++) {
          let tmpEquity = equityList[i].split('{')[1];
          tmpEquity = tmpEquity.split('}')[0];
          if (data.customParameters && data.customParameters.indexOf(tmpEquity) >= 0) {
            customParameters.push(tmpEquity);
          }
          if (data.equitys && data.equitys.indexOf(tmpEquity) >= 0) {
            equitys.push(tmpEquity);
          }
        }
        data.customParameters = customParameters;
        data.equitys = equitys;
      }
    }
  }

  /**
   * 格式化邮件投放组件参数
   */
  formatEdm(data: any) {
    data.triggerType = +data.triggerType;
    if (data.groupName === null || data.groupName === '' || data.groupName === undefined) {
      if (data.hasOwnProperty('groupId')) {
        delete data.groupId;
      }
    }
    if (data.triggerType === 2) {
      if (!data.date || !data.hour || !data.minute) {
        if (!data.frontendAttr) {
          data.appointedTime = '';
        } else {
          const temp = JSON.parse(data.frontendAttr);
          data.date = temp.date;
          data.hour = temp.hour;
          data.minute = temp.minute;
          data.appointedTime = `${this.formateTime(data.date)} ${data.hour}:${data.minute}:00`;
        }
      } else {
        data.appointedTime = `${this.formateTime(data.date)} ${data.hour}:${data.minute}:00`;
      }
      const tempJSON = {
        date: data.date,
        hour: data.hour,
        minute: data.minute
      };
      data.frontendAttr = JSON.stringify(tempJSON);
    }
  }

  /**
   * 格式化时间
   * 输出 yyyy-MM-dd
   */
  formateTime(date: any) {
    date = new Date(date);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    return `${year}-${month}-${day}`;
  }
}
