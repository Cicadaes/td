import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router } from "@angular/router"
import { Store } from '@ngrx/store';
import { CmMessageService } from 'ng-cosmos-td-ui';
import * as reducer from '../../../../ngrx/reducer';
import * as global from '../../../../ngrx/action/global';
import * as moment from 'moment';

import { DictSourceService } from '../../../../services/source/dict.source.service';
import { AdcampSourceService } from '../../../../services/source/adcamp.source.service';
import { PeoplegroupSourceService } from '../../../../services/source/peoplegroup.source.service'
import { ActivityContainerComponent } from '../../activity-container.component'
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { dark } from 'ng-cosmos-td-ui/src/service/theme.service';
@Component({
  selector: 'base-setting',
  templateUrl: './base-setting-container.component.html',
  styleUrls: ['./base-setting-container.component.less'],
  providers: [
    DictSourceService,
    PeoplegroupSourceService,
  ]
})

export class BaseSettingContainerComponent implements OnInit {
  private tradeData: any = [];
  private exposureNum = [
    1, 2, 3, 4, 5, 6, 7
  ]
  private _dateRange: Array<any> = [null, null];
  private isShow: any = 0;
  private validateForm: FormGroup;
  private searchOptions: any = [];
  private activityKey: any;
  private selectedOption: any;
  private name: any;
  private brandName: any;//品牌名称
  private tradeId: any = 0;//行业id
  private impression: any = 0;//曝光id
  private postParmas: any;
  // private startTime: any;
  // private endTime: any;
  private _store: any;
  private brandList: any
  private status: any;
  private isRange: boolean = true;
  private _startTime: any;
  private _endTime: any;
  constructor(private fb: FormBuilder,
    private dictSourceService: DictSourceService,
    private adcampSourceService: AdcampSourceService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private store$: Store<reducer.State>,
    private peoplegroupSourceService: PeoplegroupSourceService,
    private _message: CmMessageService,
  ) {

    // 受众数据请求
    this.peoplegroupSourceService.getPeoplegroupById().then((data: any) => {
      if (data.code == 200 && data.result.length > 0) {
        data.result.forEach((item: any) => {
          this.searchOptions.push({ value: item.id, label: item.name })
        })
      }
    })
    // 近期使用过的品牌
    this.adcampSourceService.getListBrandname().then((data: any) => {
      if (data.code == 200 && data.result) {
        this.brandList = data.result.slice(0, 5);
      }
    })
    // 行业信息
    this.dictSourceService.getIndustryList().then((data: any) => {
      if (data && data.result) {
        data.result.forEach((item: any) => {
          switch (item.name) {
            case '互联网': {
              item.icon = 'icon-internet'
            }
              break;
            case '日化': {
              item.icon = 'icon-cosmetic'
            }
              break;
            case '食品饮料': {
              item.icon = 'icon-drink'
            }
              break;
            case '汽车': {
              item.icon = 'icon-car'
            }
              break;
            case '餐饮酒店': {
              item.icon = 'icon-catering'
            }
              break;
            case '房车': {
              item.icon = 'icon-house'
            }
              break;
            case '教育': {
              item.icon = 'icon-education'
            }
              break;
            case '其他': {
              item.icon = 'icon-other'
            }
              break;

          }
        });
        this.tradeData = data.result
      }
    })
    // 获取key  请求当前要修改的活动
    this._store = this.store$.select('global').debounceTime(1000).distinctUntilChanged().subscribe(result => {
      this.activityKey = result.activityKey ? result.activityKey : JSON.parse(localStorage.getItem("TD_BG_ACTIVITY_OPTION")).value;
      this.adcampSourceService.getActivityByKey(this.activityKey).then((res: any) => {
        if (res && res.result) {
          this.name = res.result.activity.name;
          this.brandName = res.result.activity.brandName;
          this.tradeId = res.result.activity.industryId;
          this.impression = res.result.activity.impressionLevel;
          this.selectedOption = res.result.activity.customerGroupId;
          this.validateForm.reset({
            name: this.name,
            brandName: this.brandName
          })
       
          const start = !!res.result.activity.startTime ? new Date(res.result.activity.startTime) : new Date();
          const end = !!res.result.activity.endTime ? new Date(res.result.activity.endTime) : new Date();
          this._dateRange = [start, end];
          this._startTime = start;
          this._endTime =end ;
          this.status = this.timeStamp(moment(res.result.activity.startTime).format('YYYY-MM-DD'), moment(res.result.activity.endTime).format('YYYY-MM-DD'))
          if (this.status > 0 && this.status < 100) {
            this.isRange = true;
          } else {
            this.isRange = false;
          }
        }
      })
    })
  }

  ngOnInit() {
    this.cdr.detach();
    this.validateForm = this.fb.group({
      brandName: [null, [Validators.required]],
      name: [null, [Validators.required]],
      time: [null, [Validators.required]],
      times: [null]
    });
  }
  ngOnDestroy() {
    this._store.unsubscribe();
  }
  ngAfterViewInit() {
    setTimeout(() => this.cdr.reattach());
  }
  modelChange(e: any) {
    this._dateRange= e;
  
  }
  // 限制日期选择今天之后
  _disabledDate(current: Date): boolean {
    return current && current.getTime() <= Date.now();
  }
  //  表单组验证
  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    }
  };

  getCaptcha(e: MouseEvent) { e.preventDefault(); }

  getFormControl(name: any) {
    return this.validateForm.controls[name];
  }
  // 行业选择
  industryClick(i: any) {
    this.tradeId = i;
  }
  changeBrand(name: any) {
    this.validateForm.reset({
      name: this.name,
      brandName: name
    })
  }
  // 保存
  save() {
    this.brandName = this.validateForm.value.brandName;
    this.name = this.validateForm.value.name;
    let end = moment(this._dateRange[1]).format('YYYY-MM-DD');
    if (this.status > 0 && this.status < 100) {
      end = moment(this._endTime).format('YYYY-MM-DD');
    }

    this.postParmas = {
      activityKey: this.activityKey,
      name: this.name,
      brandName: this.brandName,
      industryId: this.tradeId,
      customerGroupId: this.selectedOption,
      impressionLevel: this.impression,
      startTime: moment(this._dateRange[0]).format('YYYY-MM-DD'),
      endTime: end,
    }

    this.adcampSourceService.updateActivity(this.postParmas).then((data: any) => {
      if (data.code === 200) {
        this._message.success('保存成功！');
      }
    })
  }


  // 点击品牌名称修改当前名称
  changeBrandName(name: string) {
    this.validateForm.controls.brandName.setValue(name);
  }

  timeStamp(start: any, end: any) {
    let nowstamp = new Date().getTime(),
      startstsmp = Number(new Date(start)),
      endstamp = Number(new Date(end)),
      balance = (nowstamp - startstsmp) / (endstamp - startstsmp) * 100;
    if ((endstamp - startstsmp) == 0 && (endstamp < nowstamp) || balance > 100) {
      balance = 100;
    } else if ((endstamp - startstsmp) == 0 && (endstamp > nowstamp) || (nowstamp - startstsmp) / (endstamp - startstsmp) < 0) {
      balance = 0;
    }
    return balance;
  }
}
