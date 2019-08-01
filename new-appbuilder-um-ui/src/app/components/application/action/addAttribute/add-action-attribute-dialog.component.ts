import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AddActionAttributeDialogService } from './add-action-attribute-dialog.service';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";


@Component({
  selector: 'add-action-attribute-dialog',
  templateUrl: './add-action-attribute-dialog.component.html',
})
export class AddActionAttributeDialogComponent {
  @Input() queryParams: any;
  @Input() _dataSet: any;
  @Input() action: boolean;
  @Input() isedit: boolean = false;
  @Input() currentData: any;
  @Input() isShow: boolean = false;
  @Output() onClose = new EventEmitter<any>();
  validateForm: FormGroup;
  isNeedSubmitAddUserFormData: boolean = false;
  isVisible = false;
  isConfirmLoading = false;
  keyFlag = false;

  checkHasFieldName(fieldName: string) {
    let has = false;
    for (let o in this.validateForm.controls) {
      if (fieldName && fieldName == o) {
        has = true;
        break;
      }
    }
    return has;
  }

  componentChange(value: any, fieldName: string) {
    if (this.checkHasFieldName(fieldName)) {
      this.validateForm.controls[fieldName].setValue(value);
    }
  }

  showModal = () => {
    this.isConfirmLoading = false;
    this.isVisible = true;

  }

  getFormControl(name: string) {
    return this.validateForm && this.validateForm.controls && this.validateForm.controls[name];
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initValidateForm();
    if (changes.currentData && changes.currentData.currentValue) {
      this.currentData = changes.currentData.currentValue;
      if (this.currentData && this.currentData.operation != 'delete') {
        for (let o in this.currentData) {
          this.componentChange(this.currentData[o], o);
        }
      }
    }
    if (this.isShow) {
      this.showModal();
    }
  }

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    setTimeout(() => {
      this.submitAddUserForm(this.validateForm)
    }, 100);
  }

  submitAddUserForm(data: any) {
    if (data.status == 'VALID') {
      let actionAttribute = data.value;
      this.isNeedSubmitAddUserFormData = false;
      this._dataSet = this._dataSet || [];
      var indexId;
      if (this.isedit) {
        for (var i = this._dataSet.length - 1; i >= 0; i--) {
          var p = this._dataSet[i];
          if (p.key == this.currentData.key || p.name == this.currentData.name) {
            indexId = i;
            let umactionAttribute = this._dataSet[indexId];
            actionAttribute.id = umactionAttribute.id;
            this._dataSet.splice(i, 1);
          }
        }
      }
      var isAdd: number = 0;
      for (let q = this._dataSet.length - 1; q >= 0; q--) {
        let p1 = this._dataSet[q];
        if ((p1.key == actionAttribute.key || p1.name == actionAttribute.name) && p1.operation != 'delete') {
          isAdd = 1;
        }
      }
      if (isAdd == 0) {
        if (this.isedit) {
          data.value.operation = 'update';
          this._dataSet.splice(indexId, 0, actionAttribute)
        } else {
          data.value.operation = 'add';
          this._dataSet.push(actionAttribute);
          console.log('------>',this._dataSet);
        }
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
        this.onClose.emit(false);
      } else if (isAdd == 1) {
        alert("名称和key不能重复！");
      }
    }
  }

  handleCancel = (e: any) => {
    if (this.isedit) {
      for (var i = this._dataSet.length - 1; i >= 0; i--) {
        var p = this._dataSet[i];
        if (p.key == this.currentData.key && p.name == this.currentData.name) {
          this._dataSet[i].update = false;
        }
      }
    }
    this.isVisible = false;
    this.onClose.emit(this.isVisible);
  }

  initValidateForm() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required, this.checkNameRepeat, Validators.maxLength(256)]],
      key: [null, [Validators.required, this.checkKeyRepeat, Validators.maxLength(256)]],
      value: [null, [Validators.required, Validators.maxLength(256)]],
      desc: [null, [Validators.maxLength(256)]]
    });
  }

  handleOk = (e: any) => {
    this.isNeedSubmitAddUserFormData = true;

  }


  constructor(private fb: FormBuilder, private service: AddActionAttributeDialogService) {

  }

  test() {
    console.log(123131)
  }

  /**
   * 检验code是否重复
   * 这里使用箭头函数是因为内部取不到this
   * @param  {FormControl} control [description]
   * @return {[type]}              [description]
   */
  checkKeyRepeat = (control: FormControl): { [key: string]: any } => {
    let keyRepeat: boolean = false;
    this.keyFlag = false;
    let controlV = control.value
    controlV && (controlV = controlV.trim())

    if (this._dataSet.length > 0) {
      for (var i = this._dataSet.length - 1; i >= 0; i--) {
        var p = this._dataSet[i];
        var pV = p.key || ''
        pV && (pV = pV.trim())

        if (this.isedit) {
          if (pV == controlV && p.update != true && p.operation != 'delete') {
            this.keyFlag = true;
            keyRepeat = true;
          }
        } else {
          if (pV == controlV && p.operation != 'delete') {
            this.keyFlag = true;
            keyRepeat = true;
          }
        }

      }
    }
    return keyRepeat ? { 'keyRepeat': { value: control.value } } : null
  }

  checkNameRepeat = (control: FormControl): { [key: string]: any } => {
    let nNameRepeat: boolean = false;
    let controlV = control.value
    controlV && (controlV = controlV.trim())
    if (this._dataSet.length > 0) {
      for (var i = this._dataSet.length - 1; i >= 0; i--) {
        var p = this._dataSet[i];
        var pV = p.name || ''
        pV && (pV = pV.trim())

        if (this.isedit) {
          if (pV == controlV && p.update != true && p.operation != 'delete') {
            nNameRepeat = true;
          }
        } else {
          if (pV == controlV && p.operation != 'delete') {
            nNameRepeat = true;
          }
        }
      }
    }
    return nNameRepeat ? { 'nNameRepeat': { value: control.value } } : null

  }

  checkNKeyRepeat = (control: FormControl): { [key: string]: any } => {
    let nKeyRepeat: boolean = false;
    let str1 = this.getFormControl('name') && this.getFormControl('name').value
    let str2 = this.getFormControl('key') && this.getFormControl('key').value

    str1 = str1 && str1.trim()
    str2 = str2 && str2.trim()

    if (str1 == str2) {
      nKeyRepeat = true
    }

    return nKeyRepeat ? { 'nKeyRepeat': { value: control.value } } : null
  }

}
