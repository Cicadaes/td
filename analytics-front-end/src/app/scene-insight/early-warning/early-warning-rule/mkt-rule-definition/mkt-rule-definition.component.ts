import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mkt-rule-definition',
  templateUrl: './mkt-rule-definition.component.html',
  styleUrls: ['./mkt-rule-definition.component.less']
})
export class MktRuleDefinitionComponent implements OnInit {
  errorInfo: any = {};
  ruleDefinitionList: any = [];

  constructor() {
    this.ruleDefinitionList.push({});
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
