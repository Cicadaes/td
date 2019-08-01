import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';

const _ = require("lodash");

@Component({
  selector: 'custom-template',
  templateUrl: './custom-template.component.html',
  styleUrls: ['./custom-template.component.less']
})
export class CustomTemplateComponent implements OnInit {
  @Output() closeSider = new EventEmitter();

  @Input() listDiyChart: any = [];  // 自定义报告类型左侧图标列表
  @Input() isEdit: boolean = false; // 当前是否处于编辑状态
  @Input() reportModel: any;
  @Input() id: any;
  @Input() name: any;

  parsedListDiyChart: any = [];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.listDiyChart.forEach((item: any) => {
      this.parsedListDiyChart.push({
        chartCatagory: item.chart.chartCatagory,
        children: [],
        fold: true
      });
    });
    this.parsedListDiyChart = _.uniqBy(this.parsedListDiyChart, (item: any) => {
      return item.chartCatagory;
    });
    this.listDiyChart.forEach((item: any) => {
      this.parsedListDiyChart.forEach((el: any) => {
        if (el.chartCatagory === item.chart.chartCatagory) {
          el.children.push({
            label: item.chart.desc,
            value: item.ppt
          });
        }
      });
    });
  }

  closeSiderBar() {
    this.closeSider.emit(false);
  }

  save() {
    if (this.isEdit) {
      this.router.navigate(['/report/edit/edit-data', this.name, this.id, this.reportModel]);
    } else {
      this.router.navigate(['/report/create/edit-data', '新建报告']);
    }
  }

  saveReportPpt() {
    this.reportModel.reportPPT = '';
    this.parsedListDiyChart.forEach((ldc: any) => {
      ldc.children.forEach((child: any) => {
        if (child['checked']) {
          this.reportModel.reportPPT = this.reportModel.reportPPT + child.value + ',';
        }
      });
    });  
    if (this.reportModel.reportPPT[this.reportModel.reportPPT.length - 1] === ',') {
      this.reportModel.reportPPT = this.reportModel.reportPPT.slice(0, -1);
    }
  }
}
