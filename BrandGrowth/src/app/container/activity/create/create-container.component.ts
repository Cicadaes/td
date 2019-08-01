import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as reducer from './../../../ngrx/reducer';
import * as global from '../../../ngrx/action/global';
import * as moment from 'moment';
import { DictSourceService } from '../../../services/source/dict.source.service';
import { AdcampSourceService } from '../../../services/source/adcamp.source.service'
import { PeoplegroupSourceService } from '../../../services/source/peoplegroup.source.service'
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { CmMessageService } from 'ng-cosmos-td-ui';
import { Router } from '@angular/router';
@Component({
  selector: 'create-container',
  templateUrl: './create-container.component.html',
  styleUrls: ['./create-container.component.less'],
  providers: [
    DictSourceService,
    AdcampSourceService,
    PeoplegroupSourceService,
  ]
})
export class CreateContainerComponent implements OnInit {
  private current = 0; // 当前页index.
  private index = 'First-content'; // 默认第一页
  private validateForm: FormGroup; // 表单组验证
  private searchOptions: any = []; // 目标受众数据
  private selectedOption: any; // 目标受众选中项
  private isShow: any = 0; // 行业边框是否显示
  private impression: any = 1; // 曝光频次选中项
  private postParmas: any = {}; // 新建活动参数
  private name: any; // 活动名称
  private brandName: any; // 品牌名称
  private tradeData: any; // 行业信息
  private tradeId: number = 1; // 选中行业id
  private _dateRange: any = []; // 时间控件值
  private exposureNum = [ //曝光频次
    1, 2, 3, 4, 5, 6, 7
  ];
  private errorCode: boolean = false; // 提交时后端返回的错误码
  private brandList: any = [];
  constructor(private _message: CmMessageService,
    private fb: FormBuilder,
    private store$: Store<reducer.State>,
    private dictSourceService: DictSourceService,
    private adcampSourceService: AdcampSourceService,
    private router: Router,
    private peoplegroupSourceService: PeoplegroupSourceService,
  ) {
    // 行业信息请求
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
    // 近期使用过的品牌
    this.adcampSourceService.getListBrandname().then((data: any) => {
      if (data.code == 200 && data.result) {
        this.brandList = data.result.slice(0, 5);
      }
    })
    // 受众数据请求
    this.peoplegroupSourceService.getPeoplegroupById().then((data: any) => {
      if (data.code == 200 && data.result.length > 0) {
        data.result.forEach((item: any) => {
          this.searchOptions.push({ value: item.id, label: item.name })
        })
      }
    })
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      brandName: [null, [Validators.required]],
      name: [null, [Validators.required]],
      time: [null, [Validators.required]],
    });
  }

  industryClick(i: any) {
    this.tradeId = i + 1;
    this.isShow = i;
  }
  impressionClick(i: any) { this.impression = i; }

  // 限制日期选择今天之后
  _disabledDate(current: Date): boolean {
    return current && current.getTime() < Date.now();
  }
  // 提交
  submit(value: any) {
    this.brandName = this.validateForm.value.brandName;
    this.name = this.validateForm.value.name;
    this.postParmas = {
      name: this.name,
      brandName: this.brandName,
      industryId: this.tradeId,
      impressionLevel: this.impression,
      customerGroupId: this.selectedOption,
      startTime: moment(this._dateRange[0]).format('YYYY-MM-DD'),
      endTime: moment(this._dateRange[1]).format('YYYY-MM-DD'),
    };

    this.adcampSourceService.insertActivity(this.postParmas).then((data: any) => {
      if (data.code === 200 && value === 1) {
        localStorage.setItem('TD_BG_ACTIVITY_OPTION', JSON.stringify({ 'value': data.result.activityKey, 'label': data.result.name }))
        this.store$.dispatch({
          type: global.SET_GLOBAL_CAMPAIGN_OPTION,
          activityKey: data.result.activityKey,
          activityName: data.result.name
        });
        this.router.navigate(["/activity/chain/create", '新建监测链接']);
      } else if (data.code === 200 && value === 2) {
        this.router.navigate(["/activity"]);
      }
    })
  }

  // 表单验证
  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      if (this.validateForm.valid) {
        this.next();
      }
    }

    this.name = this.validateForm.get('name').value;
    this.brandName = this.validateForm.get('brandName').value
  }

  getFormControl(name: any) {
    return this.validateForm.controls[name];
  }

  getCaptcha(e: MouseEvent) {
    e.preventDefault();
  }

  // 步骤条
  next() {
    this.errorCode = false;
    this.adcampSourceService.getActivityList().then((data: any) => {
      if (data.code == 200 && data.result) {
        data.result.map((item: any) => {
          if (item.name == this.validateForm.get('name').value) {
            this.errorCode = true;
          }
        });
      }
      if (this.errorCode) {
        return;
      } else {
        this.errorCode = false;
        this.current += 1;
        this.changeContent();
      }
    })

  }

  changeContent() {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

  // 点击品牌名称修改当前名称
  changeBrandName(name: string) {
    this.validateForm.controls.brandName.setValue(name);
  }
}

