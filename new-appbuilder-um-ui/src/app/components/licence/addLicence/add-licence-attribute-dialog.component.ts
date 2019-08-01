import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { AddLicenceAttributeDialogService } from './add-licence-attribute-dialog.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'add-licence-attribute-dialog',
  templateUrl: './add-licence-attribute-dialog.component.html',
  providers: [FormBuilder]
})
export class AddLicenceAttributeDialogComponent implements OnInit {
  @Input() queryParams: any;
  @Input() _dataSet: any;
  @Input() app: boolean;
  @Input() isShow: boolean = false;
  @Input() isedit: boolean = false;
  @Input() curIndex: number = -1
  @Input() currentData: any;
  @Output() onClose = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  //appAttribute: any = [];
  key: string = "";
  name: string = "";
  defalutValue: string = "";
  desc: string = "";
  warnmsg: string = "";

  isVisible = false;
  isConfirmLoading = false;
  errorType: number = 0;

  validateForm: FormGroup;


  showModal = () => {
    if (!this.isedit) {
      this.key = "";
      this.name = "";
      this.desc = "";
      this.defalutValue = "";
    } else {
      this.key = this.currentData.key;
      this.name = this.currentData.name;
      this.defalutValue = this.currentData.defalutValue;
      this.desc = this.currentData.desc;
    }
    this.isConfirmLoading = false;
    this.isVisible = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isShow && changes.isShow.currentValue) {
      this.isShow = changes.isShow.currentValue;
    } else {
      this.isShow = false;
    }
    if (this.isShow) {
      this.showModal();
    }
  }


  submitAttribute = (data: any) => {
    this.errorType = 0;
    this.warnmsg = "";
    if (!this.key) {
      return;
    }
    if (!this.name) {
      return;
    }
    if (!this.defalutValue || !this.defalutValue.trim()) {
      return;
    }

    this._dataSet = this._dataSet || [];
    let _dataSetbal: any[] = [];
    for (let i = 0; i < this._dataSet.length; i++) {
      _dataSetbal.push(this._dataSet[i]);
    }
    var indexId;
    if (this.isedit) {
      for (var i = this._dataSet.length - 1; i >= 0; i--) {
        var p = this._dataSet[i];
        if (p.key == this.currentData.key || p.name == this.currentData.name) {
          indexId = i;
          this._dataSet.splice(i, 1);
        }
      }
    }

    var appAttribute: any = {};
    var isAdd: number = 0;
    appAttribute.key = this.key;
    appAttribute.name = this.name;
    appAttribute.defalutValue = this.defalutValue;
    appAttribute.desc = this.desc;
    for (let q = this._dataSet.length - 1; q >= 0; q--) {
      let p1 = this._dataSet[q];
      if (p1.key == this.key || p1.name == this.name) {
        isAdd = 1;
      }
    }
    if (!this.key || !this.name) {
      isAdd = 2;
    }
    if (isAdd == 0) {
      if (this.isedit) {
        this._dataSet.splice(indexId, 0, appAttribute)
      } else {
        this._dataSet.push(appAttribute);
      }
      this.isVisible = false;
      this.onClose.emit(this.isVisible);
      this.onClose.emit(false);
    } else if (isAdd == 1) {
      //alert("key或名称不能重复！");
      this.errorType = 1;
      //this.warnmsg="key或名称不能重复";
      this._dataSet = _dataSetbal;
      this.onSubmit.emit(this._dataSet);
    } else if (isAdd == 2) {
      //alert("key或名称不能为空！");
      this.errorType = 2;
      //this.warnmsg="key或名称不能为空";
      this._dataSet = _dataSetbal;
      this.onSubmit.emit(this._dataSet);
    }
  }

  handleCancel = (e: any) => {
    this.isVisible = false;
    this.onClose.emit(this.isVisible);
  }

  constructor(private fb: FormBuilder, private service: AddLicenceAttributeDialogService) {

  }

  ngOnInit() {
    this.initValidateForm()
    this.currentData && this.setValidateValue(this.currentData)
  }

  /**
   * 初始化表单
   * @return {[type]} [description]
   */
  private initValidateForm() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(256), this.checkNameRepeat]],
      // name: [null, [Validators.required]],
      // key: [null, [Validators.required]],
      // key: [null, [Validators.required]],
      key: [null, [Validators.required, Validators.maxLength(256), this.checkCodeRepeat]],
      defalutValue: [null, [Validators.required, Validators.maxLength(256)]],
      desc: [null, [Validators.maxLength(256)]]
    });
  }

  /**
   * [getFormControl description]
   * @param  {string} name [description]
   * @return {[type]}      [description]
   */
  private getFormControl(name: string) {
    return this.validateForm.controls[name];
  }



  /**
   * 表单提交
   * @return {[type]} [description]
   */
  private _submitForm(e: any) {
    let arrtItem: any = {}
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      arrtItem[i] = this.validateForm.controls[i].value
    }
    if (!this.defalutValue.trim()) {
      return;
    }
    if (this.validateForm.status == 'VALID') {
      // this.submitAttribute(arrtItem);
      if (this.isedit) {
        if(this.curIndex >= 0){
          this._dataSet[this.curIndex] = arrtItem
        }
      } else {
        this._dataSet.push(arrtItem)
      }
      this.isVisible = false
      this.onClose.emit(this.isVisible)
      this.onClose.emit(false)

      /*setTimeout(() => {
          this._dataSet.push(arrtItem)
          this.isVisible = false;
          this.onClose.emit(this.isVisible);
          this.onSubmit.emit(arrtItem)
      }, 100)*/
    }
  }

  /**
   * 检验code和name是否重复
   * 这里使用箭头函数是因为内部取不到this
   * @param  {FormControl} control [description]
   * @return {[type]}              [description]
   */
  checkNameKeyRepeat = (control: FormControl): { [key: string]: any } => {
    let nKeyRepeat: boolean = false
    let nameValue = this.validateForm && this.validateForm.controls && this.validateForm.controls['name'].value
    nameValue && (nameValue = nameValue.trim())
    let controlV = control.value
    controlV && (controlV = controlV.trim())
    if (controlV && nameValue == controlV) {
      nKeyRepeat = true
    }
    return nKeyRepeat ? { 'nKeyRepeat': { value: control.value } } : null
  }

  /**
   * 检验code是否重复
   * 这里使用箭头函数是因为内部取不到this
   * @param  {FormControl} control [description]
   * @return {[type]}              [description]
   */
  checkCodeRepeat = (control: FormControl): { [key: string]: any } => {
    let cRepeat: boolean = false
    let controlV = control.value
    controlV && (controlV = controlV.trim())

    if (this._dataSet && this._dataSet.length) {
      for (let item of this._dataSet) {
        if (controlV && item.key == controlV) {
          cRepeat = true
          if (this.currentData && this.currentData.key == controlV) {
            cRepeat = false
          }
          break
        }
      }
    }
    return cRepeat ? { 'cRepeat': { value: control.value } } : null
  }
  /**
   * 检验name是否重复
   * 这里使用箭头函数是因为内部取不到this
   * @param  {FormControl} control [description]
   * @return {[type]}              [description]
   */
  checkNameRepeat = (control: FormControl): { [key: string]: any } => {
    let nRepeat: boolean = false
    let controlV = control.value
    controlV && (controlV = controlV.trim())

    if (this._dataSet && this._dataSet.length) {
      for (let item of this._dataSet) {
        if (controlV && item.name == controlV) {
          nRepeat = true
          if (this.currentData && this.currentData.name == controlV) {
            nRepeat = false
          }
          break
        }

      }
    }
    return nRepeat ? { 'nRepeat': { value: control.value } } : null
  }

  /**
   * 编辑设置默认值
   * @return {[type]} [description]
   */
  private setValidateValue(data: any) {
    for (let item in this.validateForm.controls) {
      this.validateForm.controls[item].setValue(data[item])
    }
  }

}
