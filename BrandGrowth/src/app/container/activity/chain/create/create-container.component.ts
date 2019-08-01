import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import * as reducer from './../../../../ngrx/reducer';
import * as secondLevel from './../../../../ngrx/action/secondLevel';
import { Observable } from 'rxjs/Observable';
import { CmMessageService } from 'ng-cosmos-td-ui';

// import Services
import { AdcampSourceService } from '../../../../services/source/adcamp.source.service';
import { MediaSourceService } from '../../../../services/source/media.source.service';
import { DictSourceService } from '../../../../services/source/dict.source.service';
import { ActpageSourceService } from '../../../../services/source/actpage.source.service';
import { MonitorSourceService } from '../../../../services/source/monitor.source.service';
import { BtlSourceService } from '../../../../services/source/btl.source.service';

const _ = require('lodash');

export interface SelectItem {
  value: string,
  label: string
}

@Component({
  selector: 'create-container',
  templateUrl: './create-container.component.html',
  styleUrls: ['./create-container.component.less'],
  providers: [
    AdcampSourceService,
    MediaSourceService,
    DictSourceService,
    ActpageSourceService,
    MonitorSourceService,
    BtlSourceService
  ],
  encapsulation: ViewEncapsulation.None 
})
export class CreateContainerComponent implements OnInit {
  validateForm: FormGroup; // 保存表单信息

  private _activityOptions: SelectItem[] = []; // 营销活动
  private _channelOptions: SelectItem[] = []; // 推广渠道
  private _adformatOptions: SelectItem[] = []; // 广告格式
  private _activityPageOptions: SelectItem[] = []; // 活动页
  private _probeListOptions: SelectItem[] = []; // 活动页
  private subscription: any = null;

  private _isEdit: boolean = false; // 是否是编辑状态
  private _monitorData: any; // 保存监测链接数据的域

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store$: Store<reducer.State>,
    private btlSourceService: BtlSourceService,
    private adcampSourceService: AdcampSourceService,
    private mediaSourceService: MediaSourceService,
    private dictSourceService: DictSourceService,
    private actpageSourceService: ActpageSourceService,
    private monitorSourceService: MonitorSourceService,
    private _message: CmMessageService,
  ) {
    // 初始化页面需要的信息
    this.initialActivityList();      // 初始化营销活动列表
    this.initialChannelList();       // 初始化推广渠道列表
    this.initialAdTypeList();        // 初始化广告格式列表
    this.initialOfflineAreaList();   // 初始化线下区域列表
  }

  ngOnInit(): void {
    // 初始化表单相关信息
    this.validateForm = this.initialValidateForm();
    
    // 订阅二级面包屑的相关信息
    this.subscription = this.store$.select('secondLevel').subscribe((result: any) => {
      // 如果二级面包屑的id，即secondLevelId存在，就认为处于编辑状态
      this._isEdit = result.secondLevelId ? true : false;


      let activityKey: any; // 活动key
      if (localStorage.getItem('TD_BG_ACTIVITY_OPTION') 
      && JSON.parse(localStorage.getItem('TD_BG_ACTIVITY_OPTION')).value) {
        activityKey = JSON.parse(localStorage.getItem('TD_BG_ACTIVITY_OPTION'))['value'];

        // 初始化活动页列表
        this.initialActpageList(activityKey);
      }

      // 如过监测链接或活动id无法获得，就认为是新建而不是编辑
      if (result.secondLevelId && activityKey) {
        // 监测链接id
        let monitorId = result.secondLevelId;
        // 根据监测链接id获取指定监测链接信息
        this.monitorSourceService.getMonitorLinkById(activityKey, monitorId).then((data: any) => {
          if (data.result) {
            this._monitorData = data.result; // 监测链接信息
            
            // 重置表单信息
            this.resetValidateForm(this._monitorData);
          }
        })
      }
    })
  }

  /**
   * 新建监测链接
   */
  insertMonitorLink(): Observable<any> {
    return Observable.create((observer: any) => {
      if (!this.validateForm.valid) {
        for (const i in this.validateForm.controls) {
          this.validateForm.controls[i].markAsDirty();
        }
        observer.next(false);
        return;
      }

      let params: any = {
        activityKey:  this.validateForm.get('campaign').value,	     //	活动key	 
        name:         this.validateForm.get('chain').value,	         //	监测名称		 
        agentName:    this.validateForm.get('aCompany').value,     	 //	代理名称	 
        existActPage: this.validateForm.get('usePage').value,	       //	是否有活动页	1:有 0:无
        channelId:    this.validateForm.get('channels').value[0],	     //	媒体id	 
        shortUrl:     null,                                          //	6位短链	 
        adType:       this.validateForm.get('adformat').value,	     //	广告类型
        existBtl:     this.validateForm.get('shopAnalysis').value    // 线下区域
      }

      // 如果点击预估量有值，才将它传给params
      if (this.validateForm.get('clickProd').value) {
        params['clickEvalute'] = this.validateForm.get('clickProd').value;
      }

      // 如果曝光预估量有值，才将它传给params
      if (this.validateForm.get('expProd').value) {
        params['impressionEvalute'] = this.validateForm.get('expProd').value;
      }

      // 如果活动预算有值，才将它传给params
      if (this.validateForm.get('actBudget').value) {
        params['budget'] = this.validateForm.get('actBudget').value;
      }

      // 如果使用活动页，即值为 1 时，添加活动页id到params
      if (this.validateForm.get('usePage').value && this.validateForm.get('usePage').value === 1) {
        params['actPageId'] = this.validateForm.get('sActPage').value;  //	活动页id	
      }

      // 如果使用到店分析，即值为 1 时，添加活动页线下区域id到params
      if (this.validateForm.get('shopAnalysis').value && this.validateForm.get('shopAnalysis').value === 1 && this.validateForm.get('offlineArea').value) {
        params['btlId'] = this.validateForm.get('offlineArea').value;
      }

      // 如果是编辑监测链接，后端需要传监测链接id
      if (this._monitorData && this._monitorData.id && this._isEdit) {
        params['id'] = this._monitorData.id;
      }

      this.monitorSourceService.getMonitorLinkGenerateShortUrl(this.validateForm.get('campaign').value)
        .then((data: any) => {
          if (data.code === 200 && data.result) {
            params.shortUrl = data.result;
            if (!this._isEdit) {
              this.monitorSourceService.insertMonitorLink(params).then((res: any) => {
                if (res.code === 200) {
                  this.resetValidateForm();
                  observer.next(true);
                }
              })
            } else {
              this.monitorSourceService.updateMonitorLink(params).then((res: any) => {
                if (res.code === 200) {
                  observer.next(true);
                }
              })
            }
          }
        })
    })
  }

  /**
   * 新建完了后直接返回监测链接页面
   */
  backChain(): void {
    this.insertMonitorLink().subscribe((flag: boolean) => {
      if (flag) {
        this.router.navigate(['/activity/chain']);
      }
    })
  }

  resetCreatePage(): void {
    this.insertMonitorLink().subscribe((flag: boolean) => {
      if (!!document.getElementById('app-content') && document.getElementById('app-content').scrollTop > 0) {
        setTimeout(() => {
          document.getElementById('app-content').scrollTop = 0;
        }, 0);
      }
      this._message.success('提交成功', {
        nzDuration: 2000,
      });
    })
  }

  /**
   * 初始化表单相关信息
   */
  initialValidateForm(): any {
    let activityKey = null;
    // 判断localStorage里是否有activityKey，如果有取出来
    if(localStorage.getItem("TD_BG_ACTIVITY_OPTION")) {
      let selectedOption = JSON.parse(localStorage.getItem("TD_BG_ACTIVITY_OPTION"));
      activityKey = selectedOption.value;
    }
    return this.fb.group({
      campaign:      [activityKey, [Validators.required]], // 营销活动
      channels:      [[], [Validators.required]], // 推广渠道
      aCompany:      [null, [Validators.required]], // 代理公司
      adformat:      [null, [Validators.required]], // 广告格式
      chain:         [null, [Validators.required]], // 监测链接
      expProd:       [null],                        // 曝光预估量
      usePage:       [0,    [Validators.required]],    // 使用活动页
      sActPage:      [null],                        // 选择活动页
      clickProd:     [null],                        // 点击预估量
      actBudget:     [null],                        // 活动预算
      shopAnalysis:  [0,    [Validators.required]],    // 到店分析
      offlineArea:   [null],                        // 线下区域
    });
  }

  /**
   * 重制表单信息
   * @param monitorData 监测链接信息
   */
  resetValidateForm(monitorData?: any): void {
    let activityKey = null;
      // 判断localStorage里是否有activityKey，如果有取出来
    if(localStorage.getItem("TD_BG_ACTIVITY_OPTION")) {
      let selectedOption = JSON.parse(localStorage.getItem("TD_BG_ACTIVITY_OPTION"));
      activityKey = selectedOption.value;
    }
    if (!monitorData) monitorData = {};
    this.validateForm.reset({
      campaign:     monitorData['activityKey']       ? monitorData.activityKey       : activityKey, // 营销活动
      channels:     monitorData['channelId']         ? [monitorData.channelId]       : [],          // 推广渠道
      aCompany:     monitorData['agentName']         ? monitorData.agentName         : null,        // 代理公司
      adformat:     monitorData['adType']            ? monitorData.adType            : null,        // 广告格式
      chain:        monitorData['name']              ? monitorData.name              : null,        // 监测链接
      expProd:      monitorData['impressionEvalute'] ? monitorData.impressionEvalute : null,        // 曝光预估量
      usePage:      monitorData['existsActPage']     ? monitorData.existsActPage     : 0,           // 使用活动页
      sActPage:     monitorData['actPageId']         ? monitorData.actPageId         : 0,           // 选择活动页
      clickProd:    monitorData['clickEvalute']      ? monitorData.clickEvalute      : null,        // 点击预估量
      actBudget:    monitorData['budget']            ? monitorData.budget            : null,        // 活动预算
      shopAnalysis: monitorData['existBtl']          ? monitorData.existBtl          : 0,           // 到店分析
      offlineArea:  monitorData['btlId']             ? monitorData.btlId             : 0,           // 线下区域
    });
  }

  /**
   * 根据参数向表单控件里添加验证器
   * @param value 1 或 0 1的时候添加，0的时候清除验证器
   * @param name 表单控件名
   */
  addRequiredValidatorToFormControl(value: any, name: string): void {
    if (value === 1) {
      this.setValidatorToFormControl(name, Validators.required);
    } else {
      this.clearValidatorsOfFormControl(name);
    }
  }

  /**
   * 向表单控件里添加验证器
   * @param name 表单控件的名字
   * @param newValidator 验证器
   */
  setValidatorToFormControl(name: string, newValidator: any): void {
    this.getFormControl(name).setValidators(newValidator);
  }

  /**
   * 清除某个表单控件里的验证器
   * @param name 表单控件的名字
   */
  clearValidatorsOfFormControl(name: string) {
    this.getFormControl(name).clearValidators();
    this.getFormControl(name).reset();
  }

  /**
   * 初始化营销活动列表
   */
  initialActivityList(): void {
    this.adcampSourceService.getActivityList().then((data: any) => {
      if (data.code === 200 && data.result && data.result.length > 0) {
        data.result.map((item: any) => {
          this._activityOptions.push({
            value: item.activityKey,
            label: item.name
          });
        });
      }
    });
  }

  /**
   * 初始化推广渠道列表
   */
  initialChannelList(): void {
    this.mediaSourceService.getChannelList().then((data: any) => {
      if (data.code === 200 && data.result) {
        data.result.map((item: any) => {
          this._channelOptions.push({
            value: item.id,
            label: item.localName
            // label: item.name
          });
        });
        this._channelOptions = _.cloneDeep(this._channelOptions);
      }
    });
  }

  /**
   * 初始化广告格式列表
   */
  initialAdTypeList(): void {
    this.dictSourceService.getAdTypeList().then((data: any) => {
      if (data.code === 200 && data.result) {
        data.result.map((item: any) => {
          this._adformatOptions.push({
            value: item.id,
            label: item.name
          });
        });
      }
    });
  }

  /**
   * 初始化活动页列表
   */
  initialActpageList(activityKey: any): void {
    this.actpageSourceService.getActpageList()
      .then((data: any) => {
        if (data.code === 200 && data.result) {
          data.result.map((item: any) => {
            this._activityPageOptions.push({
              value: item.id,
              label: item.name
            });
          });
        }
      });
  }

  /**
   * 初始化线下区域列表
   */
  initialOfflineAreaList(): void {
    this.btlSourceService.getBtlList().then((data: any) => {
      if (data.code === 200 && data.result) {
        data.result.map((item: any) => {
          this._probeListOptions.push({
            value: item.id,
            label: item.name
          });
        });
      }
    });
  }

  /**
   * 获取表单项
   * @param name 表单项的名字
   */
  getFormControl(name: any): any {
    return this.validateForm.controls[name];
  }
  
  ngOnDestroy(): void {
    // 当离开编辑或新建监测链接页面的时候，将二级面包屑里的信息置为空，保证二次进入的时候不会有残留信息
    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_ID,
      secondLevelId: null
    });

    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_NAME,
      secondLevelName: null
    });

    // 取消对Observable的订阅，保证性能
    this.subscription.unsubscribe();
  }

}
