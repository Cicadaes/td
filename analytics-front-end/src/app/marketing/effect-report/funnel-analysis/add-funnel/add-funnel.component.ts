import { Component, OnInit, ViewChild, Injector, OnChanges } from '@angular/core';
import { FunnelAnalysisService } from '../funnel-analysis.service';
import { BaseComponent } from '../../../../common/base-component';
// import { reject } from 'q';

@Component({
  selector: 'app-add-funnel',
  templateUrl: './add-funnel.component.html',
  styleUrls: ['./add-funnel.component.less']
})
export class AddFunnelComponent extends BaseComponent implements OnInit, OnChanges {
  vm: any;
  funnelName: string; // 漏斗名称
  funnelStepList: any = []; // 漏斗步骤
  eventList: any = []; // 事件列表
  eventMap: any = {}; // 事件映射
  funnelDetail: any; // 漏斗详情

  funnelEventCodeList: any = []; // 漏斗事件code列表

  @ViewChild('scroll') scroll: any;

  constructor(private funnelAnalysisService: FunnelAnalysisService, private injector: Injector) {
    super(injector);

    this.processFunnelEvent();

    this.vm = {
      nameError: false,
      nameErrorInfo: '',
      stepError: false,
      stepErrorInfo: ''
    };
  }

  ngOnInit() {}

  /**
   * 处理漏斗事件
   */
  async processFunnelEvent() {
    if (this.funnelAnalysisService.funnelId) {
      await this.getFunnelDetail();
    }

    await this.getFunnelEventList();
  }

  /**
   * 获取漏斗事件
   */
  getFunnelEventList() {
    return new Promise((resolve, reject) => {
      // this.funnelAnalysisService.getFunnelEvent().subscribe(resp => {
      this.funnelAnalysisService.getFunnelEventEcho(this.funnelEventCodeList).subscribe(resp => {
        if (resp.code !== 200) {
          this.notification.create('warning', '错误提示', resp.message);
          reject();
        }

        this.eventList = resp.data['data'];
        for (let i = 0; i < this.eventList.length; i++) {
          this.eventMap[this.eventList[i]['code']] = this.eventList[i]['name'];
        }

        if (!this.funnelAnalysisService.funnelId) {
          for (let j = 0; j < 2; j++) {
            this.addStep();
          }
        }
        resolve();
      });
    });
  }

  /**
   * 获取漏斗详情
   */
  getFunnelDetail() {
    const that = this;
    return new Promise((resolve, reject) => {
      that.funnelAnalysisService.getFunnelDetail(this.funnelAnalysisService.funnelId).subscribe((data: any) => {
        if (data.code !== 200) {
          this.notification.create('warning', '错误提示', data.message);
          reject();
        }
        that.funnelDetail = data['data'];
        that.funnelName = that.funnelDetail.funnelName;
        that.funnelStepList = that.funnelDetail.funnelStepList;

        for (let i = 0; i < that.funnelStepList.length; i++) {
          const funnelStepConditionList = that.funnelStepList[i].funnelStepConditionList;
          for (let j = 0; j < funnelStepConditionList.length; j++) {
            const element = funnelStepConditionList[j];
            this.funnelEventCodeList.push(element['key']);
          }
        }
        resolve();
      });
    });
  }

  /**
   * 改变选择的事件
   * @param event
   * @param i
   * @param j
   */
  changeEvent(event: any, i: number, j: number) {
    // 设置事件名称给 要保存的参数
    this.funnelStepList[i].funnelStepConditionList[j].value = this.eventMap[event];
  }

  //校验是否有重复步骤名称
  checkRepStep() {
    const that = this;
    const len = that.funnelStepList.length;
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(that.funnelStepList[i].name);
    }
    if (that.isRepeat(arr)) {
      that.vm.stepError = true;
      that.vm.stepErrorInfo = '步骤名称重复，请重新填写';
      return true;
    } else {
      that.vm.stepError = false;
      return false;
    }
  }

  /**
   * 检测是否有重复漏斗事件
   */
  checkFunnelEvent() {
    const that = this;
    const len = that.funnelStepList;
    const strArry: any[] = [];
    for (let i = 0; i < len.length; i++) {
      if (!len[i].funnelStepConditionList[0].key) {
        that.vm.stepError = true;
        that.vm.stepErrorInfo = '请选择漏斗事件';
        return true;
      }
      if (strArry.indexOf(len[i].funnelStepConditionList[0].key) != -1) {
        that.vm.stepError = true;
        that.vm.stepErrorInfo = '漏斗事件重复，不同步骤请选择不同漏斗事件';
        return true;
      } else {
        strArry.push(len[i].funnelStepConditionList[0].key);
      }
    }
    that.vm.stepError = false;
    return false;
  }

  /**
   * 数组中是否有重复
   * @param arr
   */
  isRepeat(arr: any[]) {
    const hash = {};
    for (let i in arr) {
      if (hash[arr[i]]) {
        return true;
      }
      hash[arr[i]] = true;
    }
    return false;
  }

  //校验步骤字数是否超过26个字符
  checkStepsLen() {
    const that = this;
    const len = that.funnelStepList.length;
    for (let i = 0; i < len; i++) {
      if (!that.funnelStepList[i].name) {
        that.vm.stepError = true;
        that.vm.stepErrorInfo = '请输入漏斗步骤名称';
        return true;
      }
      if (that.funnelStepList[i].name.length > 26) {
        that.vm.stepError = true;
        that.vm.stepErrorInfo = '漏斗步骤名称长度不能超过26';
        return true;
      } else {
        that.vm.stepError = false;
      }
    }
    return that.vm.stepError ? true : false;
  }

  // 检查漏斗名称
  checkFunnelName(value: any) {
    const that = this;

    if (!that.funnelName) {
      that.vm.nameError = true;
      that.vm.nameErrorInfo = '请输入漏斗名称';
      return true;
    } else {
      that.vm.nameError = false;
      that.funnelName = value.trim();
    }

    if (value.trim().length == 0) {
      that.vm.nameError = true;
      that.vm.nameErrorInfo = '漏斗名称不能都是空格';
      return true;
    } else {
      that.vm.nameError = false;
    }

    if (value.length > 16) {
      that.vm.nameError = true;
      that.vm.nameErrorInfo = '漏斗名称不超过16个字符';
      return true;
    } else {
      that.vm.nameError = false;
    }
  }

  /**
   * 添加步骤
   */
  addStep() {
    const param = [
      {
        key: null,
        operator: 1,
        value: ''
      }
    ];

    this.funnelStepList.push({
      funnelStepConditionList: param,
      name: '',
      order: 0,
      type: 1
    });
    setTimeout(() => {
      // 滚动条
      if (this.scroll && this.scroll.nativeElement.offsetHeight && this.scroll.nativeElement.offsetHeight == 180) {
        this.scroll.nativeElement.scrollTop =
          this.scroll.nativeElement.scrollHeight - this.scroll.nativeElement.offsetHeight;
      }
    }, 0);
  }

  /**
   * 删除步骤
   * @param index
   */
  deleteStep(index: number) {
    this.funnelStepList.splice(index, 1);
  }

  /**
   * 检查保存漏斗参数
   */
  checkParam() {
    let flag = false;
    if (this.checkFunnelName(this.funnelName)) {
      return true;
    }
    if (this.checkFunnelEvent()) {
      return true;
    }
    if (this.checkStepsLen()) {
      return true;
    }
    if (this.checkRepStep()) {
      return true;
    }
    return flag;
  }
}
