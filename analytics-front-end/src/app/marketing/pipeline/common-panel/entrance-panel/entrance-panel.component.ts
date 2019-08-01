import { Component, OnInit } from '@angular/core';
import { PipelineService } from '../../pipeline.service';
import { PipelineCommunicationService } from '../../pipeline-communication.service';

@Component({
  selector: 'app-entrance-panel',
  templateUrl: './entrance-panel.component.html',
  styleUrls: ['./entrance-panel.component.less']
})
export class EntrancePanelComponent implements OnInit {
  lessThanDaysSelect: any; // 进入规则 同一户xx天不再进入
  lessThanTimesSelect: any; // 进入规则 同一进入次数不超过

  selectCrowdData: any; // 选中的人群信息

  crowdList: any = []; // 人群列表
  terminationForbiddenEntryRelation: any; //禁止规则 关系
  fristeForbiddenEntry: any = []; //禁止规则第一个下拉菜单列表
  secondForbiddenEntry: any = []; //禁止规则第二个下拉菜单列表

  constructor(public pipelineService: PipelineService, public pcs: PipelineCommunicationService) {
    const that = this;
    if (!that.pcs.nodeData) {
      that.pcs.nodeData = {};
    }
    if (!that.pcs.nodeData.forbiddenRule) {
      that.pcs.nodeData.forbiddenRule = {
        ruleList: [],
        ruleRelation: '|'
      };
    }
    if (that.pcs.nodeData.forbiddenRule.ruleRelation === '&') {
      that.terminationForbiddenEntryRelation = { label: '并且', value: '&&' };
    } else {
      that.terminationForbiddenEntryRelation = { label: '或者', value: '||' };
    }
    /**
     * 计算类型(1-永不，2-实时，3-周期性)，当前版本固定为1：永不
     */
    if (!that.pcs.nodeData.calcType) {
      that.pcs.nodeData.calcType = 1;
    }
    that.fristeForbiddenEntry.push({ label: '发生', value: true });
    that.fristeForbiddenEntry.push({ label: '未发生', value: false });
    that.secondForbiddenEntry.push({ label: '收到推送消息', value: 'receivePushMsg' });
    that.secondForbiddenEntry.push({ label: '点击推送消息', value: 'clickPushMsg' });
    that.secondForbiddenEntry.push({ label: '点击短信链接', value: 'clickMsgUrl' });
    that.secondForbiddenEntry.push({ label: '打开邮件信息', value: 'openEmailMsg' });
    that.secondForbiddenEntry.push({ label: '点击邮件链接', value: 'clickEmailUrl' });

    if (that.pcs.nodeData.lessThanDays) {
      that.lessThanDaysSelect = true;
    }
    if (that.pcs.nodeData.lessThanTimes) {
      that.lessThanTimesSelect = true;
    }

    if (that.pcs.nodeData.forbiddenRule.ruleList && that.pcs.nodeData.forbiddenRule.ruleList.length) {
      const ruleLength = that.pcs.nodeData.forbiddenRule.ruleList.length;
      const list = that.pcs.nodeData.forbiddenRule.ruleList;
      for (let i = 0; i < ruleLength; i++) {
        if (!list[i].ruleType) {
          continue;
        }
        if (list[i].ruleType !== 'configEvent') {
          // TODO 处理非事件类型数据
          let type = 1;
          if (list[i].ruleType === 'clickMsgUrl') {
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

    // 获取人群列表 并处理人群回显数据
    that.pipelineService.getCrowd(that.pcs.nodeData.crowdRefId).subscribe((result: any) => {
      if (result.code === 200) {
        that.crowdList = result.data;
        if (that.pcs.nodeData.crowdRefId) {
          const length = that.crowdList.length;
          for (let i = 0; i < length; i++) {
            if (that.crowdList[i].id === that.pcs.nodeData.crowdRefId) {
              that.selectCrowdData = that.crowdList[i];
              break;
            }
          }
        }
      }
    });
  }

  ngOnInit() {
    const that = this;
    const ruleLength = that.pcs.nodeData.forbiddenRule.ruleList.length;
    let arr = [];
    if (ruleLength) {
      that.pcs.nodeData.forbiddenRule.ruleList.forEach(element => {
        arr.push(element.ruleParam);
      });
    }
    that.pipelineService.getEventListForTimerEcho(arr, { forbidFlag: 1 }).subscribe((result: any) => {
      // that.pipelineService.getEventListForTimer(that.pcs.isPipelineEdit, {forbidFlag: 1})
      // .subscribe((result: any) => {
      if (result.code === 200) {
        const length = result.data.data.length;
        for (let i = 0; i < length; i++) {
          const json = {
            code: result.data.data[i].code,
            ruleType: 'configEvent'
          };
          that.secondForbiddenEntry.push({
            label: result.data.data[i].name,
            value: json,
            status: result.data.data[i].status
          });
          for (let j = 0; j < that.pcs.nodeData.forbiddenRule.ruleList.length; j++) {
            if (
              that.pcs.nodeData.forbiddenRule.ruleList[j].ruleParam &&
              that.pcs.nodeData.forbiddenRule.ruleList[j].ruleParam === result.data.data[i].code
            ) {
              that.pcs.nodeData.forbiddenRule.ruleList[j].ruleType = json;
            }
          }
        }
      }
    });
  }

  selectCrowd(data: any) {
    const that = this;
    that.pcs.nodeData['crowdRefId'] = data.id;
    that.pcs.nodeData['crowdName'] = data.name;
  }

  /**
   * 选择规则
   */
  selectRule() {
    const that = this;
    if (!that.pcs.isPipelineEdit) {
      return;
    }

    if (that.pcs.nodeData.lessThanDays || that.pcs.nodeData.lessThanTimes) {
      that.pcs.nodeData.unlimited = false;
    } else {
      that.pcs.nodeData.unlimited = true;
    }
  }

  /**
   * 修改规则之间的关系
   */
  changeRuleRelation(data: any) {
    const that = this;
    if (!that.pcs.isPipelineEdit) {
      return;
    }
    if (data.value === '||') {
      data.label = '并且';
      data.value = '&&';
      that.pcs.nodeData.forbiddenRule.ruleRelation = '&';
    } else if (data.value === '&&') {
      data.label = '或者';
      data.value = '||';
      that.pcs.nodeData.forbiddenRule.ruleRelation = '|';
    }
  }

  /**
   * 禁止规则第2个下拉框发送改变
   */
  ruleTypeChange(value: any, rule: any) {
    const that = this;
    let ruleType: number = 0;
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

  /**
   * 添加禁止进入规则
   */
  addNoEntryRule() {
    let that = this;
    if (!that.pcs.isPipelineEdit) {
      return;
    }
    if (that.pcs.nodeData.forbiddenRule.ruleList.length > 9) {
      that.pcs.message.create('error', '最多添加十条规则');
      return;
    }

    const list = that.pcs.nodeData.forbiddenRule.ruleList;
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (typeof list[i].ruleType === 'object') {
          if (list[i].ruleType.ruleType === 'configEvent') {
            if (!(list[i].ruleType && list[i].ruleVal)) {
              that.pcs.message.create('error', '请将数据填写完整再添加新规则');
              return;
            }
          }
        } else {
          if (!(list[i].ruleParam && list[i].ruleType && list[i].ruleVal)) {
            that.pcs.message.create('error', '请将数据填写完整再添加新规则');
            return;
          }
        }
      }
    }

    that.pcs.nodeData.forbiddenRule.ruleList.push({
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
    that.pcs.nodeData.forbiddenRule.ruleList.splice(index, 1);
  }
}
