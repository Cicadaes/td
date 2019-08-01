import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-early-warning-rule',
  templateUrl: './early-warning-rule.component.html',
  styleUrls: ['./early-warning-rule.component.less']
})
export class EarlyWarningRuleComponent implements OnInit {
  earlyInfo: any = {}; // 预警信息
  errorInfo: any = {};
  ruleDefinitionList: any = [];

  constructor() {
    this.ruleDefinitionList.push({});
    this.earlyInfo['type'] = 'business';
  }

  ngOnInit() {}

  /**
   * 删除规则定义
   * @param data
   * @param i
   */
  deleteRule(data: any, i: number) {
    this.ruleDefinitionList.splice(i, 1);
  }

  /**
   * 添加规则
   * @param event
   */
  addRule(event: Event) {
    this.ruleDefinitionList.push({});
  }

  /**
   * 十进制数字转26字母
   * @param value
   */
  codeToString(value: number) {
    return String.fromCharCode(value + 65);
  }
}
