import { Component, Input, Output, EventEmitter, SimpleChanges, Injector, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserConfiguredService } from '../../user-configured.service';
import { BaseComponent } from '../../../../common/base-component';

@Component({
  selector: 'app-portrayal-dialog',
  templateUrl: './portrayal-dialog.component.html',
  styleUrls: ['./portrayal-dialog.component.less'],
  styles: [
    `
      ::ng-deep .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      ::ng-deep .vertical-center-modal .ant-modal {
        top: 0;
      }
    `
  ]
})
export class PortrayalDialogComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() portrayalFlag: any;
  @Input() editData: any;
  @Output() hideDialog = new EventEmitter<any>();
  @Output() saveDate = new EventEmitter<any>();
  validateForm: FormGroup;
  flag = true;

  constructor(
    private fb: FormBuilder,
    private injector: Injector,
    private userConfiguredService: UserConfiguredService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.validateForm = this.initialValidateForm();

    if (this.portrayalFlag) {
      this.resetValidateForm(this.editData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isVisible) {
      this.isVisible = changes.isVisible.currentValue;
    }

    if (changes.portrayalFlag) {
      this.portrayalFlag = changes.portrayalFlag.currentValue;
    }

    if (changes.editData) {
      this.editData = changes.editData.currentValue;
    }
  }

  // 初始化表单
  initialValidateForm(): any {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(42), this.verifyName], this.checkNameRepeat], // 画像组名称
      sortOrder: [null, [Validators.required, Validators.maxLength(3), this.positiveInteger], this.checkSortOrderRepeat]
      // 显示顺序
    });
  }

  verifyName = (control: FormControl): { [key: string]: any } => {
    let nameError = false;
    const controlV = control.value;
    const reg = new RegExp('^[A-Za-z0-9\u4e00-\u9fa5]+$');
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

  // 空格校验
  replaceName = (control: FormControl): { [key: string]: any } => {
    let nameNull = false;
    if (control.value === null) {
      return null;
    }

    if (control.value === '') {
      return null;
    }
    const controlV = control.value ? control.value.replace(/\s+/g, '') : '';
    if (this.validateForm && controlV.length > 0) {
      nameNull = false;
      return nameNull ? { nameNull: { value: controlV } } : null;
    } else if (this.validateForm && controlV.length === 0) {
      // this.getFormControl('name').setValue(null);
      nameNull = true;
      return nameNull ? { nameNull: { value: controlV } } : null;
    }
  };

  // 重置化表单
  resetValidateForm(data: any) {
    this.validateForm.reset({
      name: data['name'] ? data.name : null, // 画像组名称
      sortOrder: data['sortOrder'] ? data.sortOrder : null // 显示顺序
    });
  }

  // 校验画像组名称是否重复
  checkNameRepeat = async (control: FormControl): Promise<any> => {
    let nameRepeat = false;
    const controlV = control.value;
    if (!controlV) {
      return;
    }
    let obj;
    if (this.portrayalFlag) {
      // 编辑
      obj = {
        name: controlV,
        id: this.editData.id,
        productId: this.editData.productId,
        sortOrder: this.editData.sortOrder
      };
    } else {
      obj = {
        name: controlV,
        productId: this.productId
      };
    }
    return await new Promise((resolve: any, reject: any) => {
      this.userConfiguredService.checkPortraitName(obj).subscribe((response: any) => {
        if (response.data === false) {
          nameRepeat = true;
        } else {
          nameRepeat = false;
        }
        resolve(nameRepeat ? { nameRepeat: { value: control.value } } : null);
      });
    });
  };

  checkSortOrderRepeat = async (control: FormControl): Promise<any> => {
    let sortOrderRepeat = false;
    const controlV = control.value;
    let obj;
    if (this.portrayalFlag) {
      // 编辑
      obj = {
        name: this.editData.name,
        id: this.editData.id,
        productId: this.editData.productId,
        sortOrder: controlV
      };
    } else {
      obj = {
        sortOrder: controlV,
        productId: this.productId
      };
    }
    return await new Promise((resolve: any, reject: any) => {
      this.userConfiguredService.checkPortraitSortOrder(obj).subscribe((response: any) => {
        if (response.data === false) {
          sortOrderRepeat = true;
        } else {
          sortOrderRepeat = false;
        }
        resolve(sortOrderRepeat ? { sortOrderRepeat: { value: control.value } } : null);
      });
    });
  };

  // 校验是不是正整数
  positiveInteger = (control: FormControl): { [key: string]: any } => {
    let positiveInteger = false;
    const controlV = control.value;
    const reg = /^[1-9]\d*$/;
    if (reg.test(controlV)) {
      positiveInteger = false;
    } else if (!reg.test(controlV)) {
      positiveInteger = true;
    }

    if (controlV == null || controlV === '' || controlV === undefined) {
      positiveInteger = false;
    }

    return positiveInteger ? { positiveInteger: { value: control.value } } : null;
  };

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

  // 保存
  save() {
    this.submitForm();
    if (!this.validateForm.controls.name.value) {
      return;
    }
    // // console.log('====>', this.validateForm.invalid);

    if (this.validateForm.invalid) {
      return;
    }
    this.globals.resetBodyStyle();
    if (this.portrayalFlag) {
      // 编辑
      const params = {};
      params['name'] = this.validateForm.get('name').value.replace(/\s+/g, '');
      params['sortOrder'] = Number(this.validateForm.get('sortOrder').value);
      params['productId'] = this.editData.productId;
      params['id'] = this.editData.id;
      params['reportId'] = this.editData.reportId;
      this.userConfiguredService.editPortrait(this.editData.id, params).subscribe((response: any) => {
        this.isVisible = false;
        this.saveDate.emit();
        this.hideDialog.emit(this.isVisible);
      });
    } else {
      // 新增
      const params = {};
      params['name'] = this.validateForm.get('name').value.replace(/\s+/g, '');
      params['sortOrder'] = Number(this.validateForm.get('sortOrder').value);
      params['productId'] = this.productId;
      this.userConfiguredService.insertPortrait(params).subscribe((response: any) => {
        this.saveDate.emit();
        this.isVisible = false;
        this.hideDialog.emit(this.isVisible);
      });
    }
  }
}
