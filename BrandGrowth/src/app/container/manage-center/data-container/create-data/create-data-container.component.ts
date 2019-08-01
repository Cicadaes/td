import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router } from '@angular/router'
// store
import { Store } from '@ngrx/store';
import * as reducer from './../../../../ngrx/reducer';
import * as global from './../../../../ngrx/action/global';
// import service
import { DictSourceService } from '../../../../services/source/dict.source.service'
import { CustomSourceService } from '../../../../services/source/custom.source.service'
import { AdcampSourceService } from '../../../../services/source/adcamp.source.service'
@Component({
  selector: 'create-data-container',
  templateUrl: './create-data-container.component.html',
  styleUrls: ['./create-data-container.component.less'],
  providers: [
    DictSourceService,
    CustomSourceService,
    AdcampSourceService,
  ]
})
export class CreateDataContainerComponent implements OnInit {
  private _store: any;
  private isDisable: any = false;
  private key: any;
  private eidtParams: any;
  // 表单验证
  private validateForm: FormGroup;
  private callBackName: any;
  private callBackEvent: any;
  private activity: any;
  private reveiceUrl: any;
  private levelId: any;
  private parmas: any = [];
  // 事件
  private selectedcbEvent: any = 1;
  cboptions: { value: string, label: string }[] = [];
  // 活动
  private selectacEvent: any = null;
  acoptions: any = [];
  // 参数
  private eventList: any = this.eventList = [];
  private eventParmas: any = {
    eventId: 1,
    platformId: 0
  }
  constructor(
    private fb: FormBuilder,
    private dictSourceService: DictSourceService,
    private customSourceService: CustomSourceService,
    private adcampSourceService: AdcampSourceService,
    private store$: Store<reducer.State>,
    private router: Router
  ) {
    //回调事件 
    this.dictSourceService.getCallbackEventList().then((data: any) => {
      if (data.code == 200 && data.result) {
        data.result.forEach((e: any) => {
          this.cboptions.push({
            value: e.eventId,
            label: e.chName
          })
        });
         this.selectedcbEvent = this.cboptions[0].value;
      }
    })
    // 所有活动
    this.adcampSourceService.getActivityListWithAddition().then((data: any) => {
      if (data.code == 200 && data.result) {
        data.result.forEach((e: any) => {
          this.acoptions.push({
            value: e.activity.id,
            label: e.activity.name,
          })
        });
        if (!this.selectacEvent) {
          this.selectacEvent = this.acoptions[0].value
        }
      }
    })
    //  判断编辑状态
    this._store = this.store$.select('secondLevel').debounceTime(1000).distinctUntilChanged().subscribe((result: any) => {
      if (result.secondLevelId) {
        this.levelId = result.secondLevelId;
        
        this.customSourceService.getCustomCallbackById(result.secondLevelId).then((res: any) => {
          if (res.code == 200 && res.result) {
           // 重置表单数据
            this.validateForm.reset({
              callBackName: res.result.name,
              activity: res.result.activityId,
              callBackEvent: res.result.eventId,
              reveiceUrl: res.result.url
            })
            if (res.result.params !== "") {
              this.eidtParams = JSON.parse(res.result.params)
            }
            
            this.isDisable = true;
            this.eventParmas.eventId = res.result.eventId;
          }
        })
       }
      else {
        this.validateForm.reset({
          callBackName: '',
          activity: '',
          callBackEvent: '',
          reveiceUrl: ''
        })
        this.isDisable = false;
        this.eventParmas.eventId = 1;
      }
    })

  }

  ngOnInit() {
    // 表单验证
    this.validateForm = this.fb.group({
      callBackName: [null, [Validators.required]],
      activity: [this.selectacEvent, [Validators.required]],
      callBackEvent: [this.selectedcbEvent],
      reveiceUrl: [null, [Validators.required]],
    });
  }
  // 表单验证
  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
  }
  getFormControl(name: any) {
    return this.validateForm.controls[name];
  }
  getCaptcha(e: MouseEvent) {
    e.preventDefault();
  }
  ngOnChanges() {
    // 事件参数 
    if (this.selectedcbEvent) {
      this.eventParmas.eventId = this.selectedcbEvent;
      this.dictSourceService.getCallbackParamsList(this.eventParmas.eventId, this.eventParmas.platformId).then((data: any) => {
        if (data.code == 200 && data.result) {
          const list = data.result;
          const array: any[] = [];
          // 给parmas赋值
          list.forEach((e: any) => {
            array.push({ key: '', value: e.paramName })
          })
          this.parmas = array;
          // 处理事件参数
          for (let key in this.eidtParams) {
            list.forEach((e: any) => {
              if (this.eidtParams[key] == e.paramName) {
                e.paramValue = key;
              }
            })
          }
          this.eventList = list;
        }
      })
    }
  }
  ngOnDestroy() {
    this._store.unsubscribe();
  }
  // 新建&编辑
  save() {
    this._submitForm();
    if (this.validateForm.invalid) return;
    let postParmas;
    // 编辑
    const obj: any = {};
    this.parmas.filter((x: any) => !!x.key).map((item: any) => {
      obj[item.key] = item.value;
    });
    if (this.levelId) {
      postParmas = {
        name: this.validateForm.value.callBackName,
        id: this.levelId,
        eventId: this.eventParmas.eventId,
        url: this.validateForm.value.reveiceUrl,
        params: JSON.stringify(obj)
      }
      this.customSourceService.updateCustomCallback(postParmas).then((data: any) => {
        if (data.code == 200) {
          this.router.navigate(['/manage-center/data'])
        }
      })
      // 新建
    } else {
      postParmas = {
        name: this.validateForm.value.callBackName,
        activityId: this.selectacEvent,
        eventId: this.eventParmas.eventId,
        url: this.validateForm.value.reveiceUrl,
        params: JSON.stringify(obj)
      }
      this.customSourceService.insertCustomCallback(postParmas).then((data: any) => {
        if (data.code == 200) {
          this.router.navigate(['/manage-center/data'])
        }
      })
    }
  }
  // 取消
  cancel() {
    this.router.navigate(['/manage-center/data'])
  }
  // 事件参数输入获取
  onKey(e: any) {
    this.parmas.forEach((i: any) => {
      if (i.value == e.target.name) {
        i.key = e.target.value;
      }
    })
 
  }

}
