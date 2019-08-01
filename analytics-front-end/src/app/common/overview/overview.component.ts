import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent implements OnInit {
  _rowCount: any = 4;
  @Input() loading: any = false;
  @Input() set rowCount(value: any) {
    this._rowCount = 24 / value;
  } // 每行显示个数
  @Input() options: any = {};
  /**
   * @param options {
   *  title: 概览标题名称,
   *  data: [
   *      {
   *          label: 指标名称，
   *          value: 指标值 （数值/百分比 自行处理）
   *      }
   *  ],
   *  popover: [
   *      {
   *          label: 指标名称，
   *          value: 指标描述
   *      }
   * ]
   * }
   */

  constructor() {}

  ngOnInit() {}
}
