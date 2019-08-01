import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '../../../common/base-component';
import * as differenceInDays from 'date-fns/difference_in_days';
import { CapacityPathService } from '../capacity-path.service';

@Component({
  selector: 'app-capacity-path-add',
  templateUrl: './capacity-path-add.component.html',
  styleUrls: ['./capacity-path-add.component.less']
})
export class CapacityPathAddComponent extends BaseComponent {
  tabs: any = []; // 事件还是页面
  validateForm: FormGroup; // 表单
  startPointTypeList: any = []; // 起始点列表
  switchValue = false; // 必经路径开关

  _dateFormat = 'yyyy-MM-dd';
  _today = new Date();
  _dateRange;
  _dateRangeOld;
  _selectEvent: any = {};
  _capacityPathId: any;
  _invalidNecessaryPath: boolean;
  _tagName: any;
  _sourceId: any;
  _hearder: any;
  _isVisitor: boolean;
  _isSaving: any;

  _initDateRange() {
    if (!this._dateRange) {
      const date = this.globals.getDateRangeByLastDay(-7);
      const yesterday = this.globals.getDateRangeByLastDay(-1).start;
      this._dateRange = [new Date(date.start), new Date(yesterday)];
    }
  }

  _disabledDate = (current: Date): boolean => {
    return differenceInDays(current, this._today) > 0 || differenceInDays(current, this._today) < -365;
  };

  _changeDaterange(value: any) {
    this._dateRange = value;
    if (this._dateRange) {
      const days = this.globals.getDateDays(this._dateRange[0], this._dateRange[1]);
      if (days > 30) {
        setTimeout(() => {
          this._dateRange = this._dateRangeOld;
        }, 100);
        this.message.create('warning', '时间范围不能超过一个月');
        return false;
      }
    }
    this._dateRangeOld = this._dateRange;
  }

  constructor(private fb: FormBuilder, private injector: Injector, private service: CapacityPathService) {
    super(injector);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this._capacityPathId = params.get('id');
      this._tagName = params.get('tag');
      this._sourceId = params.get('sourceId') || '';
      this._isVisitor = params.get('isVisitor') == 'true' ? true : false;
    });
    if (
      this._isVisitor &&
      this._tagName != 'App' &&
      this._tagName != 'H5' &&
      this._tagName != 'miniprogram' &&
      this._tagName != 'Web'
    ) {
      this.commonService.goInto({
        name: '智能路径',
        url: `/scene-insight/capacity-path`
      });
    }
    this._hearder = this._tagName
      ? this._tagName == 'miniprogram'
        ? `添加小程序路径`
        : `添加${this._tagName}路径`
      : '添加智能路径';
    this.queryEventTypeList();

    this.tabs = [
      {
        id: '1',
        name: '全部事件'
      },
      {
        id: '2',
        name: '仅含页面'
      }
    ];
  }

  queryEventTypeList() {
    this.service.queryEventTypes().subscribe((response: any) => {
      if (response) {
        this.startPointTypeList = [];
        if (this._tagName == 'App' || this._tagName == 'H5' || this._tagName == 'Web') {
          for (let i = 0; i < response.list.length; i++) {
            if (
              response.list[i].dicItemValue == '系统预置事件' ||
              response.list[i].dicItemValue == '自定义事件' ||
              response.list[i].dicItemValue == '访问页面'
            ) {
              this.startPointTypeList.push(response.list[i]);
            }
          }
        } else if (this._tagName == 'miniprogram') {
          for (let i = 0; i < response.list.length; i++) {
            if (
              response.list[i].dicItemValue == '系统预置事件' ||
              response.list[i].dicItemValue == '小程序自定义事件' ||
              response.list[i].dicItemValue == '访问页面' ||
              response.list[i].dicItemValue == '小程序场景事件' ||
              response.list[i].dicItemValue == '小程序扫码事件' ||
              response.list[i].dicItemValue == '小程序分享事件' ||
              response.list[i].dicItemValue == '小程序点击分享Link事件'
            ) {
              this.startPointTypeList.push(response.list[i]);
            }
          }
        } else {
          this.startPointTypeList = response.list;
        }
      }
      this.validateForm = this.initialValidateForm();
      if (this._capacityPathId) {
        this.queryById();
      }
    });
  }

  queryById() {
    const params = {
      id: this._capacityPathId
    };
    this.service.queryById(params).subscribe((response: any) => {
      if (response) {
        //          this.resetValidateForm(response.list || {});
        this.initFormData(response.list || {});
      }
    });
  }

  // 初始化表单
  initialValidateForm(): any {
    let startPointType = null;
    let endPointType = null;
    let necessaryPathType = null;
    if (!this._capacityPathId && this.startPointTypeList.length > 0) {
      startPointType = this.startPointTypeList[0].id;
      endPointType = this.startPointTypeList[0].id;
      necessaryPathType = this.startPointTypeList[0].id;
      this.initSelectEvent(startPointType, 'startPointType');
      this.initSelectEvent(endPointType, 'endPointType');
      this.initSelectEvent(necessaryPathType, 'necessaryPathType');
    }
    return this.fb.group({
      id: [null],
      sourceid: ['1', [Validators.required]],
      productid: [this.globals.getProductIdByStorage(), [Validators.required]],
      name: [null, [Validators.required, Validators.maxLength(64)]], // 智能路径名称
      repeatType: ['1', [Validators.required]], // 1合并，2展开
      type: ['1', [Validators.required]], // 1全部事件,2仅含页面
      startPointType: [startPointType, [Validators.required]],
      startPoint: [null, [Validators.required]],
      startPointName: [null, [Validators.required]], // 起始点事件
      endPointType: [endPointType, [Validators.required]], // 截止点事件
      endPoint: [null, [Validators.required]], // 截止点事件
      endPointName: [null, [Validators.required]], // 截止点事件
      dateRange: ['', [Validators.required]],
      necessaryPathType: [necessaryPathType], // 必经路径
      necessaryPath: [null], // 必经路径
      necessaryPathName: [null] // 必经路径
    });
  }

  initFormData(data: any) {
    //    this.clearFormData();
    if (data) {
      for (const o in data) {
        if (o === 'dateRange' && data[o]) {
          this._dateRange = [];
          if (data[o] && data[o].indexOf('~') !== -1) {
            const _dateRangeAttr = data[o].split('~');
            const startTimeFormat = this.globals.dateFormat1(_dateRangeAttr[0], '/');
            const endTimeFormat = this.globals.dateFormat1(_dateRangeAttr[1], '/');
            const startTime = new Date(startTimeFormat);
            const endTime = new Date(endTimeFormat);
            this._dateRange.push(startTime);
            this._dateRange.push(endTime);
            this.componentChange(this._dateRange, o);
            this._dateRangeOld = this._dateRange;
          }
        } else if (o === 'type' || o === 'repeatType') {
          let value = data[o];
          if (value) {
            value = value.toString();
          }
          this.componentChange(value, o);
        } else if (o === 'necessaryPathType') {
          let necessaryPathType = data[o];
          if (!necessaryPathType && this.startPointTypeList && this.startPointTypeList.length > 0) {
            necessaryPathType = this.startPointTypeList[0].id;
          }
          this.componentChange(necessaryPathType, o);
        } else {
          this.componentChange(data[o], o);
        }
      }
      if (data['necessaryPathType'] && data['necessaryPath']) {
        this.switchValue = true;
      }
    }
  }

  // 表单验证
  submitForm() {
    // console.log(this.validateForm.controls);
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }

  // 动态检验必经路径
  requiredChange(required: boolean): void {
    // console.log(required);
    if (!required) {
      this.validateForm.get('necessaryPath').clearValidators();
      this.validateForm.get('necessaryPath').markAsPristine();
    } else {
      this.validateForm.get('necessaryPath').setValidators(Validators.required);
      this.validateForm.get('necessaryPath').markAsDirty();
    }
    this.validateForm.get('necessaryPath').updateValueAndValidity();
  }

  // 要验证的表单的字段
  getFormControl(name: string) {
    if (this.validateForm && this.validateForm.controls) {
      return this.validateForm.controls[name];
    }
  }

  // 选择计算时间
  timeChange(value: any, type: any) {
    // console.log('=====>value', value);
    // console.log('=====>type', type);
  }

  // 选择起始点 截止点
  selectTypeChange(value: any, field: any) {
    console.dir([value, field, this.validateForm.controls]);
    setTimeout(() => {
      this.initSelectEvent(value, field);
    }, 100);
  }

  initSelectEvent(value: any, field: any) {
    let initValue = '';
    let fieldName = '';
    if (field === 'startPointType') {
      fieldName = 'startPoint';
    } else if (field === 'endPointType') {
      fieldName = 'endPoint';
    } else if (field === 'necessaryPathType') {
      fieldName = 'necessaryPath';
    }
    const type = this.getFormControl(field);
    if (type && !type.dirty && this.getFormControl(fieldName).value) {
      initValue = this.getFormControl(fieldName).value;
    }
    const parentId = value || '';
    this._selectEvent[field] = {
      solid: true,
      apiUrl: this.service.queryEventPostUrl,
      apiType: 'post',
      apiData: true,
      apiPaging: true,
      apiSearch: true,
      keywordFiled: 'dicItemAliasOrValue',
      initFirst: false,
      initValue: initValue,
      //      keywordFiled: 'searchName',
      apiParam: {
        page: 1,
        dicItemKey: 'eventid',
        rows: 20,
        eventTypeId: parentId,
        id: initValue || '',
        //                dicItemAliasOrValue: searchName,
        sdkId: this._sourceId || null
      }
    };
  }

  onSelectEvent(option: any, field: any) {
    console.dir([option, field]);
    let value = '';
    let label = '';
    if (option) {
      value = option.id;
      label = option.dicItemAlias;
    }
    let fieldName = '';
    if (field === 'startPoint') {
      fieldName = 'startPointName';
    } else if (field === 'endPoint') {
      fieldName = 'endPointName';
    } else if (field === 'necessaryPath') {
      fieldName = 'necessaryPathName';
    }
    this.componentChange(value, field);
    this.componentChange(label, fieldName);
    this._invalidNecessaryPath = false;
  }

  componentChange(value: any, fieldName: string) {
    if (this.checkHasFieldName(fieldName)) {
      this.validateForm.controls[fieldName].setValue(value);
    }
  }

  checkHasFieldName(fieldName: string) {
    let has = false;
    for (const o in this.validateForm.controls) {
      if (fieldName && fieldName === o) {
        has = true;
        break;
      }
    }
    return has;
  }

  _add(data: any) {
    this.service.create(data).subscribe((response: any) => {
      this._isSaving = false;
      if (response.success) {
        this.commonService.goBack();
        this.message.create('success', `智能路径"${data['name']}"创建成功`);
      } else {
        this.message.create('error', response.msg);
      }
    });
  }

  _update(data: any) {
    this.service.edit(data).subscribe((response: any) => {
      this._isSaving = false;
      if (response.success) {
        this.commonService.goBack();
        this.message.create('success', `智能路径"${data['name']}"编辑成功`);
      } else {
        this.message.create('error', response.msg);
      }
    });
  }

  validNecessaryPath() {
    if (
      !this.validateForm.value.necessaryPathType ||
      !this.validateForm.value.necessaryPath ||
      !this.validateForm.value.necessaryPathName
    ) {
      return true;
    } else {
      return false;
    }
  }

  // 保存表单
  save() {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this._invalidNecessaryPath = this.validNecessaryPath();
    if (this.validateForm.invalid) {
      console.dir([this.validateForm]);
      return;
    }
    if (this.switchValue && this._invalidNecessaryPath) {
      return false;
    }
    const newData = this.validateForm.value;
    const startDate = this.globals.dateFormatNumber(this.validateForm.value.dateRange[0], '');
    const endDate = this.globals.dateFormatNumber(this.validateForm.value.dateRange[1], '');
    newData.dateRange = `${startDate}~${endDate}`;
    if (!this.switchValue) {
      newData.necessaryPathType = null;
      newData.necessaryPath = null;
      newData.necessaryPathName = null;
    }
    if (!this._sourceId && this._isVisitor) {
      this.message.create('warning', '缺少sdkId参数');
      this.commonService.goInto({
        name: '智能路径',
        url: `/scene-insight/capacity-path`
      });
      return;
    } else {
      newData.sourceid = this._sourceId;
    }
    if (this._isSaving) {
      return false;
    }
    this._isSaving = true;
    if (newData.id) {
      this._update(newData);
    } else {
      this._add(newData);
    }
  }

  // 取消表单
  cancel() {
    this.commonService.goBack();
  }
}
