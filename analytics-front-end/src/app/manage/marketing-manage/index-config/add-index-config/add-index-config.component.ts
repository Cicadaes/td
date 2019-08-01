import { Component, Input, Output, EventEmitter, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MarketingManageService } from '../../marketing-manage.service';
import { CommonService } from '../../../../common/services/common.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Globals } from '../../../../utils/globals';

@Component({
  selector: 'app-add-index-config',
  templateUrl: './add-index-config.component.html',
  styleUrls: ['./add-index-config.component.less']
})
export class AddIndexConfigComponent implements OnInit, OnChanges {
  productId: any = 467;
  valueData: any = [];
  valueTableLoading = false;
  @Input() isVisible;
  @Input() editFlag: any;
  @Input() editData: any;
  @Output() hideDialog = new EventEmitter<any>();
  @Output() saveDate = new EventEmitter<any>();
  validateForm: FormGroup;
  flag = true;
  valueList: any = []; // 可选维度
  indexValueList: any = []; // 指标选择列表
  _name: any = null;
  ruleFlag: boolean; // 规则/条件
  triggerFlag: boolean; // 触发器-指标
  planFlag: boolean; // 计划目标
  scope: any = [0, 0, 0]; // 添加至列表 scope[0]：规则/条件 scope[1]：触发器-指标 scope[2]：计划目标
  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private commonService: CommonService,
    private marketingManageService: MarketingManageService,
    private globals: Globals
  ) {}

  ngOnInit() {
    if (this.commonService.productId) {
      this.productId = Number(this.commonService.productId);
    }
    // this.validateForm = this.initialValidateForm();
    // this.getIndexValueList();

    // if (this.editFlag) {
    //     this.resetValidateForm(this.editData);
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.validateForm = this.initialValidateForm();
    if (changes.isVisible) {
      this.isVisible = changes.isVisible.currentValue;
    }

    if (changes.editFlag) {
      this.editFlag = changes.editFlag.currentValue;
    }

    if (changes.editData) {
      this.editData = changes.editData.currentValue;
    }

    if (this.editFlag) {
      if (this.editData && this.editData['scope']) {
        this.scope = [];
        for (let i = 0; i < this.editData['scope'].length; i++) {
          if (this.editData['scope'][i] === '1' || this.editData['scope'][i] === true) {
            this.editData['scope'][i] = true;
          } else {
            this.editData['scope'][i] = false;
          }
          this.scope.push(this.editData['scope'][i]);
        }
      }
      this.resetValidateForm(this.editData);
    } else if (!this.editFlag && this.isVisible) {
      this.getIndexValueList();
      this.scope = [false, false, false];
    }
  }

  // 初始化表单
  initialValidateForm(): any {
    return this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(32), this.checkName]], // 指标名称
      code: [null, [Validators.required]], // 指标选择
      description: [null, Validators.maxLength(480)] // 描述
    });
  }

  // 重置化表单
  resetValidateForm(data: any) {
    this.validateForm.reset({
      name: data['name'] ? data.name : null, // 指标名称
      code: data['name'] ? data.code : null, // 指标选择
      description: data['description'] ? data.description : null // 描述
    });
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  //  取消
  handleCancel = e => {
    this.isVisible = false;
    this.globals.resetBodyStyle();
    this.hideDialog.emit(this.isVisible);
  };

  // 表单验证
  submitForm() {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        // this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }

  checkName = (control: FormControl): { [key: string]: any } => {
    let nameError = false;
    const controlV = control.value;
    const reg = new RegExp('^[A-Za-z\u4e00-\u9fa5]+$');
    if (reg.test(controlV)) {
      nameError = false;
    } else if (!reg.test(controlV)) {
      nameError = true;
    }
    if (controlV == null || controlV === '' || controlV === undefined) {
      nameError = false;
    }
    return nameError ? { nameError: { value: control.value } } : null;
  };

  // 保存
  save() {
    this.submitForm();
    if (this.validateForm.invalid) {
      return;
    }
    const that = this;
    for (let i = 0; i < that.scope.length; i++) {
      if (that.scope[i] === true || that.scope[i] === '1' || that.scope[i] === 1) {
        that.scope[i] = 1;
      } else {
        that.scope[i] = 0;
      }
    }
    const obj = {
      productId: that.productId,
      name: that.validateForm.get('name').value,
      code: that.validateForm.get('code').value.esfieldname,
      scope: that.scope.join(',')
    };
    this.globals.resetBodyStyle();
    if (
      that.validateForm.get('description').value &&
      that.validateForm.get('description').value != null &&
      that.validateForm.get('description').value !== ''
    ) {
      obj['description'] = that.validateForm.get('description').value;
    }

    if (this.editFlag) {
      const data = Object.assign({}, this.editData);
      data['name'] = that.validateForm.get('name').value;
      data['code'] = this.editData['code'];
      data['description'] = that.validateForm.get('description').value;
      data['scope'] = that.scope.join(',');

      // this.editData['name'] = that.validateForm.get('name').value;
      // this.editData['code'] = that.validateForm.get('code').value.esfieldname;
      // this.editData['description'] = that.validateForm.get('description').value;
      // this.editData['scope'] = that.scope.join(',');

      this.marketingManageService.updateIndex(data).subscribe(response => {
        if (response.code === 200) {
          this.editData['scope'] = that.scope.join(',');
          this.isVisible = false;
          this.saveDate.emit();
        } else {
          this.notification.create('warning', '错误提示', response.message);
        }
      });
    } else {
      this.marketingManageService.insertIndex(obj).subscribe(response => {
        if (response.code === 200) {
          this.isVisible = false;
          this.saveDate.emit();
        } else {
          this.notification.create('warning', '错误提示', response.message);
        }
      });
    }
  }

  // 获取可选择的维度
  getIndexValueList() {
    const that = this;
    this.marketingManageService
      .getIndexValueList({
        productId: that.productId
      })
      .subscribe(response => {
        if (response.code === 200) {
          this.indexValueList = response.data;
          if (this.editFlag) {
            for (let i = 0; i < this.indexValueList.length; i++) {
              if (this.indexValueList[i].esfieldname === this.editData.code) {
                this._name = this.indexValueList[i];
              }
            }
          }
        } else {
          this.notification.create('warning', '错误提示', response.message);
        }
      });
  }
}
