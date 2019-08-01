import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Store } from '@ngrx/store';
import * as reducer from '../../../ngrx/reducer';
import * as moment from 'moment';
import { AdcampSourceService } from '../../../services/source/adcamp.source.service';
import { ExportSourceService } from '../../../services/source/export.source.service'

const _ = require('lodash');

@Component({
  selector: 'create-container',
  templateUrl: './create-container.component.html',
  styleUrls: ['./create-container.component.less'],
  providers: [
    AdcampSourceService,
    ExportSourceService
  ]
})
export class CreateContainerComponent implements OnInit {
 private selectacEvent: any;   // 导出活动名称
 private acoptions: any = [];  // 导出选择活动列表
 private eventList: any = [];  // 事件列表
 private selectEvent: any;   // 导出事件名称
 private dateRange: any = [];  // 时间范围
 private monitorLink: any = [];  // 媒体监测链接列表
 private monitorLinkList: any = [];  // 选中媒体监测链接
 private selectacEventFlag: boolean = false;  //校验导出活动名称
 private selectEventFlag: boolean = false;  //校验导出事件名称
 private dateRangeFlag: boolean = false;  //校验时间范围
 private getMonitorListFlag: boolean = true;  //媒体监测链接选择模块
 private allCheckedFlag: boolean = false;  // 全部链接
 private allTndeterminateFlag: boolean = false;  // 全部链接
 private monitorLinkFlag: boolean = false;  // 是否选择了监测链接
 private isDisable: boolean = true;  // 确定按钮禁用状态
 
  constructor(
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private adcampSourceService: AdcampSourceService,
    private exportSourceService: ExportSourceService,
  ) {
    // 事件列表
    this.eventList = [
      {
        value: 2,
        label:"曝光"
      },
      {
        value: 1,
        label:"点击"
      }
    ];
    // 所有活动
    this.adcampSourceService.getActivityListWithAddition().then((data: any) => {
      if (data.code == 200 && data.result) {
        data.result.forEach((e: any) => {
          this.acoptions.push({
            value: e.activity.activityKey,
            label: e.activity.name,
          })
        });
      }
    })
  }

  ngOnInit() {
    
  }

  /**
   * 选择全部链接
   * 改变下两级选中状态
   * @param flag 选中状态 false 未选中 true 选中
   */
  allChecked(flag: boolean){
    this.allTndeterminateFlag = false;
    this.monitorLink.forEach((el: any) => {
      el.isSelect = flag;
      if(flag) {
        el.indeterminate == flag
      }
      el.monitorList.forEach((cl: any) => {
        cl.isSelect = flag;
      });
    });

    this.changeMonitorLinkList();
  }

  // 改变全部链接按钮状态
  getallChecked(){
    let n = 0; 
    let len = this.monitorLink.length;  
    this.monitorLink.forEach((cl: any) => {
      if(cl.isSelect == false || cl.isSelect == undefined) {
        n++;
      }
    });
    this.allTndeterminateFlag = (n !== len && n !== 0);
    this.allCheckedFlag = (n === 0);
    this.monitorLinkFlag = (this.monitorLinkList.length > 0);
  }

  // 更新monitorLinkList字段
  changeMonitorLinkList(){
    this.monitorLinkList = [];
    this.monitorLink.forEach((el: any) => {
      if(el.isSelect == true || el.indeterminate == true) {
        el.monitorList.forEach((cl: any) => { 
          if(cl.isSelect == true) {
            this.monitorLinkList.push(cl.id);
          }
        });
      }
    });
    this.monitorLinkFlag = (this.monitorLinkList.length < 1);
  }

  /**
   * 改变下一级选中状态并且改变上一级状态
   * @param flag 选中状态 false 未选中 true 选中
   * @param item 第二级列表中被选中项
   */
  updateAllChecked(flag: boolean, item: any) {
    item.indeterminate = false;
    item.monitorList.forEach((el: any) => {
      el.isSelect = flag;
    });

    this.getallChecked();

    this.changeMonitorLinkList();
  }


  /**
   * 改变同一级其他元素选中状态
   * @param flag 选中状态 false 未选中 true 选中
   * @param item 第二级列表中被选中项
   */
  updateSingleChecked(flag: any, item: any) {
    // 遍历二级列表的所有monitorList内容，如果不是全选，将indeterminate置为true，反之false
    let currSecondItem = item;  // 当前选中的二级项
    let n = 0;  // 记录未选中项的数目
    let len = currSecondItem.monitorList.length;  // 记录所有项的数目

    // 遍历选中的二级项下的所有子项内容，记录未选中项的数目
    currSecondItem.monitorList.forEach((ci: any) => {
      if(ci.isSelect == false || ci.isSelect == undefined) {
        n++;
      }
    });

    // 如果不是全选
    currSecondItem.indeterminate = (n !== len && n !== 0);
    // 如果是全选
    currSecondItem.isSelect = (n === 0);
  
    this.getallChecked();

    this.changeMonitorLinkList();
  }

  // 确认提交
  confirm(form: any) {
    // 检验表单
    if(this.monitorLinkList.length < 1) {
      this.monitorLinkFlag = true;
      return;
    }else {
      this.monitorLinkFlag = false;
    }
    
    let params = {
      activityKey: this.selectacEvent.value,
      eventId: this.selectEvent.value,
      start: moment(this.dateRange[0]).format('YYYY-MM-DD'),
      end: moment(this.dateRange[1]).format('YYYY-MM-DD'),
      monitorLinkList: this.monitorLinkList,
      name: this.selectacEvent.label
    };

    this.exportSourceService.insertExport(params).then((data: any) => {
      if (data.code == 200) {
        this.router.navigate(['/export']);
      }
    })
  }

  // 获取数组长度
  getLength(arr: any) {
    if (Object.prototype.toString.call(arr) == '[object Array]') {
      return arr.length;
    }
    return 0;
  }

  changeValue(value:any,type:any){
    if(type == 'selectacEvent' && value) {
      this.selectacEventFlag = false;
    }

    if(type == 'selectEvent' && value) {
      this.selectEventFlag = false;
    }

    if(type == 'dateRange' && value) {
      this.dateRangeFlag = false;
    }

    setTimeout(() => {
      if(this.selectacEvent && this.dateRange.length > 0 && this.selectEvent) {
        let params = {
          activityKey: this.selectacEvent.value,
          eventId: this.selectEvent.value,
          start: moment(this.dateRange[0]).format('YYYY-MM-DD'),
          end: moment(this.dateRange[1]).format('YYYY-MM-DD')
        };
        this.getMonitorLink(params);
      }
    });
  }

  // 取消
  cancel(){
    this.router.navigate(['/export'])
  }

  // 获取媒体监测链接列表
  getMonitorLink(params:any){
    this.exportSourceService.getListMonitorLink(params).then((data: any) => {
      if (data.code == 200 && data.result) {
        this.monitorLink = _.cloneDeep(data.result);
        if(this.monitorLink.length > 0){
          this.getMonitorListFlag = false;
          this.isDisable = false;
        }
      }
    })
  }
 
}

