import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { AddAppExtendDialogService } from './add-app-extend-dialog.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// 校验相关
import { CheckRegExp } from '../../../../@core/utils/validators/validator.service'
import { RegexpSService } from '../../../../@core/data/regexps.service'

@Component({
  selector: 'add-app-extend-dialog',
  templateUrl: './add-app-extend-dialog.component.html',
  styleUrls: ['./add-app-extend-dialog.component.css'],
  providers: [FormBuilder]
})
export class AddAppExtendDialogComponent implements OnInit {
  @Input() queryParams: any;
  @Input() _extendDate: any=[];
  @Input() app: boolean;
  @Input() isShow: boolean = false;
  @Input() isedit: boolean = false;
  @Input() currentData: any;
  @Output() onClose = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  //appAttribute: any = [];
  code: string = "";
  name: string = "";
  defalutValue: string = "";
  desc: string = "";
  oldcode: string = "";
  oldname: string = "";
  olddefaultValue: string = "";
  errorCode: number = 0;
  isVisible = false;
  isConfirmLoading = false;
  private dialogTitle: string = '新建扩展属性'
  // 字符串合法性校验
  private checkGenStr: any = CheckRegExp(this.regService.getGeneralstr())

  showModal = () => {
    this.errorCode = 0;
    this.initValidateForm();
    if (!this.isedit) {
      this.code = "";
      this.name = "";
      this.defalutValue = "";
      this.desc = "";
      this.dialogTitle = '新建扩展属性'
    } else {
      this.code = this.currentData.code;
      this.name = this.currentData.name;
      this.defalutValue = this.currentData.defalutValue;
      this.desc = this.currentData.desc;
      this.dialogTitle = '编辑扩展属性'
    }
    this.isConfirmLoading = false;
    this.isVisible = true;
  }
  private validateForm: FormGroup

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
    if (this.validateForm.status != 'VALID') {
      return;
    }
    this._extendDate = this._extendDate || [];
    // let _extendDate: any[] = [];
    // for (let i = 0; i < this._extendDate.length; i++) {
    //     _extendDate.push(this._extendDate[i]);
    // }

    var indexId;
    if (this.isedit) {
      for (var i = this._extendDate.length - 1; i >= 0; i--) {
        var p = this._extendDate[i];
        if (p.code == this.currentData.code || p.name == this.currentData.name) {
         // indexId = i;
          this._extendDate.splice(i, 1);
        }
      }
    }

    var appExtend: any = {};
    var isAdd: number = 0;
    appExtend.code = this.code;
    appExtend.name = this.name;
    appExtend.defalutValue = this.defalutValue;
    appExtend.desc = this.desc;


    
    this._extendDate.push(this.validateForm.value)
    this.onSubmit.emit(this._extendDate);
    this.handleCancel({})

    this.initValidateForm()
  }

  handleCancel = (e: any) => {
    this.isVisible = false;
    this.onClose.emit(this.isVisible);
  }

  constructor(private fb: FormBuilder, private regService: RegexpSService, private service: AddAppExtendDialogService) {

  }

  ngOnInit() {
    /*this.code="";
    this.name="";
    this.defaultValue="";*/

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
      name: [null, [Validators.required, this.checkNameRepeat, Validators.maxLength(128)]],
      defalutValue: [null, [Validators.required, Validators.maxLength(256)]],
      desc: [null, [Validators.maxLength(256)]]
    })
  }

  _checkedForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
  }

  checkCodeRepeat = (control: FormControl): { [key: string]: any } => {
    let cRepeat: boolean = false
    let controlV = control.value
    controlV && (controlV = controlV.trim())

    if (this._extendDate && this._extendDate.length) {
      for (let item of this._extendDate) {
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

    if (this._extendDate && this._extendDate.length) {
      for (let item of this._extendDate) {
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

  get _name() {
    return this.validateForm.get('name');
  }

  get _code() {
    return this.validateForm.get('code');
  }

  get _defalutValue() {
    return this.validateForm.get('defalutValue');
  }

  get _desc() {
    return this.validateForm.get('desc');
  }

//   checkCodeRepeat = (control: FormControl): { [key: string]: any } => {
//     let cRepeat: boolean = false
//     let controlV = control.value
//     controlV && (controlV = controlV.trim())

//     if (this._dataSet && this._dataSet.length) {
//       for (let item of this._dataSet) {
//         if (controlV && item.code == controlV) {
//           if (this.currentData && controlV == this.currentData.code) {
//             break
//           } else {
//             cRepeat = true
//             break
//           }

//         }
//         // if (controlV && item.code == controlV && controlV != this.currentData.code) {
//         //   cRepeat = true
//         //   break
//         // }
//       }
//     }
//     return cRepeat ? { 'cRepeat': true } : null
//   }
//   checkNameRepeat = (control: FormControl): { [key: string]: any } => {
//     let nRepeat: boolean = false
//     let controlV = control.value
//     controlV && (controlV = controlV.trim())

//     if (this._dataSet && this._dataSet.length) {
//       for (let item of this._dataSet) {
//         if (controlV && item.name == controlV) {
//           if (this.currentData && controlV == this.currentData.name) {
//             break
//           } else {
//             nRepeat = true
//             break
//           }

//         }
//       }
//     }
//     return nRepeat ? { 'nRepeat': true } : null
//   }
}
