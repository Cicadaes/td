import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { AddAppAttributeDialogService } from './add-app-attribute-dialog.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// 校验相关
import { CheckRegExp } from '../../../../@core/utils/validators/validator.service';
import { RegexpSService } from '../../../../@core/data/regexps.service';

@Component({
  selector: 'add-app-attribute-dialog',
  templateUrl: './add-app-attribute-dialog.component.html',
  providers: [FormBuilder]
})
export class AddAppAttributeDialogComponent implements OnInit {
  @Input() queryParams: any;
  @Input() _dataSet: any;
  @Input() app: boolean;
  @Input() isShow: boolean = false;
  @Input() isedit: boolean = false;
  @Input() currentData: any;
  @Output() onClose = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  //appAttribute: any = [];
  code =  '';
  name =  '';
  defaultValue =  '';
  oldcode =  '';
  oldname =  '';
  olddefaultValue =  '';
  errorCode =  0;
  isVisible = false;
  isConfirmLoading = false;
  private dialogTitle =  '新建功能类别';
  // 字符串合法性校验
  private checkGenStr: any = CheckRegExp(this.regService.getGeneralstr());

  showModal = () => {
    this.errorCode = 0;
    this.initValidateForm();
    if (!this.isedit) {
      this.code = '';
      this.name = '';
      this.defaultValue = '';
      this.dialogTitle = '新建功能类别';
    } else {
      this.code = this.currentData.code;
      this.name = this.currentData.name;
      this.defaultValue = this.currentData.defaultValue;
      this.dialogTitle = '编辑功能类别';
    }
    this.isConfirmLoading = false;
    this.isVisible = true;
  }
  private validateForm: FormGroup;

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
    this._checkedForm();
    if (this.validateForm.status !== 'VALID') {
      return;
    }
    this._dataSet = this._dataSet || [];
    // let _dataSetbal: any[] = [];
    // for (let i = 0; i < this._dataSet.length; i++) {
    //   _dataSetbal.push(this._dataSet[i]);
    // }

    // var indexId;
    if (this.isedit) {
      for (var i = this._dataSet.length - 1; i >= 0; i--) {
        var p = this._dataSet[i];
        if (p.code == this.currentData.code || p.name == this.currentData.name) {
          // indexId = i;
          this._dataSet.splice(i, 1);
        }
      }
    }

    var appAttribute: any = {};
    var isAdd =  0;
    appAttribute.code = this.code;
    appAttribute.name = this.name;
    appAttribute.defaultValue = this.defaultValue;

    /* this.errorCode=0;
    for (var i = this._dataSet.length - 1; i >= 0; i--) {
      var p = this._dataSet[i];
      if (p.code == this.code) {
        isAdd = 1;
      }
      if( p.name == this.name){
          isAdd = 3;
      }

    }
    if (!this.code || !this.name) {
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
    } else if (isAdd == 1||isAdd == 3) {
      this._dataSet = _dataSetbal;
      //alert('功能类型代码或名称不能重复！');
      this.errorCode=isAdd;
        this.onSubmit.emit(this._dataSet);
        return;
    } else if (isAdd == 2) {
      //this._dataSet = _dataSetbal;
      //alert('功能类型代码或名称不能为空！');
        this.errorCode=2;
    }*/
    this._dataSet.push(this.validateForm.value)
    this.onSubmit.emit(this._dataSet);
    this.handleCancel({})

    this.initValidateForm()
  }

  handleCancel = (e: any) => {
    this.isVisible = false;
    this.onClose.emit(this.isVisible);
  }

  constructor(private fb: FormBuilder, private regService: RegexpSService, private service: AddAppAttributeDialogService) {

  }

  ngOnInit() {
    /*this.code='';
    this.name='';
    this.defaultValue='';*/

    this.initValidateForm()
  }

  /**
   * 提交表单
   * @return {[type]} [description]
   */
  private _submitForm() {

  }

  private initValidateForm() {
    this.validateForm = this.fb.group({
      code: [null, [Validators.required, this.checkGenStr, this.checkCodeRepeat, Validators.maxLength(128)]],
      // name: [null, [Validators.required]],
      name: [null, [Validators.required, this.checkNameRepeat, Validators.maxLength(128)]],
      defaultValue: [null, [Validators.maxLength(256)]]
    })
  }

  _checkedForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
  }

  get _name() {
    return this.validateForm.get('name');
  }

  get _code() {
    return this.validateForm.get('code');
  }

  get _defaultValue() {
    return this.validateForm.get('defaultValue');
  }

  checkCodeRepeat = (control: FormControl): { [key: string]: any } => {
    let cRepeat: boolean = false
    let controlV = control.value
    controlV && (controlV = controlV.trim())

    if (this._dataSet && this._dataSet.length) {
      for (let item of this._dataSet) {
        if (controlV && item.code == controlV) {
          if (this.currentData && controlV == this.currentData.code) {
            break
          } else {
            cRepeat = true
            break
          }

        }
        // if (controlV && item.code == controlV && controlV != this.currentData.code) {
        //   cRepeat = true
        //   break
        // }
      }
    }
    return cRepeat ? { 'cRepeat': true } : null
  }
  checkNameRepeat = (control: FormControl): { [key: string]: any } => {
    let nRepeat: boolean = false
    let controlV = control.value
    controlV && (controlV = controlV.trim())

    if (this._dataSet && this._dataSet.length) {
      for (let item of this._dataSet) {
        if (controlV && item.name == controlV) {
          if (this.currentData && controlV == this.currentData.name) {
            break
          } else {
            nRepeat = true
            break
          }

        }
      }
    }
    return nRepeat ? { 'nRepeat': true } : null
  }
}
