import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { AddActionPageService } from "../page/add-action-page.service";
import { AddActionFormService } from "./add-action-form.service";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

// 校验相关
import { CheckRegExp } from '../../../../@core/utils/validators/validator.service'
import { RegexpSService } from '../../../../@core/data/regexps.service'
import { UploadImagesComponent } from '../../../../main/upload/upload-images/upload-images.component';

@Component({
  selector: 'add-action-form',
  templateUrl: './add-action-form.component.html',
  styleUrls: ['./add-action-form.component.css'],
  providers: [FormBuilder]
})

export class AddActionFormComponent implements OnInit {
  @Input() needSubmit: boolean;
  @Input() operation: string;
  @Input() editFlag: false;
  @Input() editOrAdd: string;
  wrongTip = '只能输入数字、26个英文字母（大小写）、":/?&#-_{}.="';
  @Input() set toSubmit(_toSubmit: EventEmitter<any>) {
    // console.log("Inputto  Submit===");
    _toSubmit && _toSubmit.subscribe && _toSubmit.subscribe(() => {

      this._submitForm()
    })
  }

  @Input() action: any;
  @Input() defaultType: number;
  @Input() additionalAppIdSelect: any;
  @Input() fucTypeDicId: number;
  @Input() parentFucTypeDicId: number;
  @Input() functionId: string;
  @Input() _dataSet: any;
  @Input() set newCode(_newCode: any) {
    this.code = _newCode;
  };
  @Output() onSubmit = new EventEmitter<any>();
  @Output() resultData = new EventEmitter<any>();
  @Output() changeDoType = new EventEmitter<any>();
  userTableFieldParams: any = [];
  isShowAddUerModal: boolean = false;
  resultValue: any = {};
  appAttributeParams: any = {};
  validateForm: FormGroup;
  code: any;
  nameverification: any;//name
  conturi: any; //功能地址
  contauthorizationUri: any = '只能输入数字、26个英文字母（大小写）、:/?&#-_{}.=，多个URL以英文逗号分隔';
  private checkPwd: any = CheckRegExp(this.regService.getPwd())
  idNum: number;
  id: number;
  subscription: Subscription;//订阅问题
  appIconFile: any = {
    list: [],
    number: 1,
    apiUrl: `${document.location.origin}/console-api/attachmentController/uploadImage`,
  };

  componentChange(value: any, fieldName: string) {
    if (this.checkHasFieldName(fieldName)) {
      this.validateForm.controls[fieldName].setValue(value);
    }
  }

  guid() {
    return (this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4());
  }
  S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

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

  _submitForm() {

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }

    // console.log(this.validateForm);
    if (this.validateForm.invalid) {
      return;

    }
    this.resultData.emit(this.resultValue);
    this.onSubmit.emit(this.validateForm);

  }
  constructor(private regService: RegexpSService, private fb: FormBuilder, private service: AddActionFormService, private route: ActivatedRoute
  ) {
    this.subscription = this.service.editGrabble$.subscribe((grabble: any) => {
      this.id = grabble;
    });
  }

  updateConfirmValidator() {
    /** wait for refresh value */
    setTimeout(() => {
      this.validateForm.controls['checkPassword'].updateValueAndValidity();
    });
  }

  getCaptcha(e: MouseEvent) {
    e.preventDefault();
  }

  // confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
  //   if (!control.value) {
  //     return { required: true };
  //   } else if (control.value !== this.validateForm.controls['password'].value) {
  //     return { confirm: true, error: true };
  //   }
  // };
  //
  //
  //
  confirmationSerialNumber(): ValidatorFn {
    return (control: FormControl) => {
      let forbiddenName: boolean = false;
      // let controlV = control.value ? control.value : '';
      // controlV && (controlV = controlV.trim());

      if (/\D/g.test(control.value) || control.value.length > 6) {
        forbiddenName = true;
      }
      return forbiddenName ? { 'forbiddenName': { value: control.value } } : null;
    }
  };



  initValidateForm() {
    //监听service里的id值，当编辑时传id

    if (this.validateForm) {
      return false;
    }
    const that = this;
    if (this.id) {//当操作为编辑时，添加id值
      this.validateForm = this.fb.group({
        name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^\S.*\S$|^\S$/)], this.checkRepeatCodeAs],
        code: that.code,
        authorizationUri: [null, [Validators.maxLength(768), Validators.minLength(2), Validators.pattern(/^([A-Za-z0-9 | : | \? | \= | \. | # | & | \- | \/ | _ | \{ | \}]+\,*)+$/)]],
        uri: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(256), Validators.pattern(/^[A-Za-z0-9\-_:#\?\=&\.{}/]+$/)]],
        // serialNumber: [null, [Validators.required, this.checkPwd]],
        serialNumber: 0,
        // serialNumber: [null, [Validators.required, this.confirmationSerialNumber()]],
        desc: [null, [Validators.maxLength(256)]],
        fucTypeDicId: [null, [Validators.required]],
        parentId: [(this.action && this.action.parentId ? this.action.parentId : 0)],
        id: [this.id],
        parentName: [(this.action && this.action.parentName ? this.action.parentName : 'root')]
      });
    } else {
      this.validateForm = this.fb.group({
        name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^\S.*\S$|^\S$/)], this.checkRepeatCodeAs],
        code: that.code,
        authorizationUri: [null, [Validators.maxLength(256), Validators.minLength(2), Validators.pattern(/^([A-Za-z0-9 | : | \? | \= | \. | # | & | \- | \/ | _ | \{ | \}]+\,*)+$/)]],
        uri: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(256), Validators.pattern(/^[A-Za-z0-9\-_:#\?\=&\.{}/]+$/)]],
        // serialNumber: [null, [Validators.required, this.checkPwd]],
        serialNumber: 0,
        // serialNumber: [null, [Validators.required, this.confirmationSerialNumber()]],
        desc: [null, [Validators.maxLength(256)]],
        fucTypeDicId: this.defaultType,
        parentId: [0],
        id: null,
        parentName: ['root']
      });
    }

  }
  resetValidateForm(data: any) {
    if (data.icon == null || data.icon == '' || data.icon == undefined) { // 没有icon时清除
      this.appIconFile.list = [];
      this.appIconFile = Object.assign({}, this.appIconFile);
    }

    const that = this;
    if (this.editOrAdd == 'select' || this.editOrAdd == 'update') {

      this.validateForm.reset({
        name: null,
        code: that.code,
        authorizationUri: null,
        uri: null,
        desc: null,
        fucTypeDicId: this.defaultType,
        id: null,
        serialNumber: 0,
        parentId: data.parentId ? data.parentId : 0,
        parentName: data.parentName ? data.parentName : 'root',
      });
    } else {//新增

      this.validateForm.reset({
        name: null,
        code: that.code,
        authorizationUri: null,
        uri: null,
        desc: null,
        fucTypeDicId: this.defaultType,
        id: null,
        serialNumber: 0,
        parentId: data.parentId ? data.parentId : 0,
        parentName: data.parentName ? data.parentName : 'root'
      });
    }

  }

  space() {

  }
  /**
 * 检验name是否重复
 * 这里使用箭头函数是因为内部取不到this
 * @param  {FormControl} control [description]
 * @return {[type]}              [description]
 */
  checkRepeatCodeAs = async (control: FormControl): Promise<any> => {
    let cont = !(/^([\u4E00-\u9FA5]|[A-Za-z]|[0-9]|[ ]|[-_&])+$/).test(control.value || '')
    if (cont) {
      return new Promise((resolve: any, reject: any) => {
        resolve({ 'features': { value: cont } })
        this.nameverification = "只能输入中文、数字、26个英文字母（大小写）、-_&、空格"
      })
    } else {
      return new Promise((resolve: any, reject: any) => {
        let controlV: string = control.value || ''
        controlV && (controlV = controlV.trim())
        let params: any = {
          isname: controlV,
        }
        params.appId = this.route.snapshot.params['id'];
        if (this.id) {
          params.id = this.id;
        }
        this.service.checkRepeat(params).subscribe((data: any) => {
          resolve(!data.success ? { 'features': { value: control.value } } : null)
          this.nameverification = "应用名称已存在"
        })
      })
    }
  }
  /**
   * 检验uri
   */
  checkRepeaturiAs = async (control: FormControl): Promise<any> => {

    let cont = !(/^([A-Za-z]|[0-9]|[:/?&#-_{}.])+$/).test(control.value || '')
    if (control.value && control.value.length < 10) {
      return new Promise((resolve: any, reject: any) => {
        resolve({ 'conturi': { value: true } })
        this.conturi = "输入的功能地址长度不得小于10位"
      })
    } else if (cont) {
      return new Promise((resolve: any, reject: any) => {
        resolve({ 'conturi': { value: cont } })
        this.conturi = "只能输入数字、26个英文字母（大小写）、':/?&#-_{}.'"
      })
    }
  }

  ngOnInit() {
    this.code = this.guid();
    this.action = {};
    this.initValidateForm();
  }



  selectSearchAdditionalAppId(value: any, fieldName: string) {

    this.componentChange(value, fieldName);
  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  initIcon() {
    /* this.appIconFile.list = [{
         uid: 146,
         name: 'yhgj.png',
         status: 'done',
         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
         //thumbUrl: icon
     }];*/
    /*let icon=this.action.icon;
    if(icon){
        this.appIconFile.list = [{
            uid: 146,
            name: 'yhgj.png',
            status: 'done',
            //url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            thumbUrl: this.action.icon
        }];
        this.resultValue.icon = this.appIconFile.list[0].thumbUrl;
    }*/
  }
  initActionFormData() {
    if (this.action) {
      for (let o in this.action) {
        this.componentChange(this.action[o], o);
      }
    }
  }

  showAddUserModal() {
    this.isShowAddUerModal = true;
  }

  onSearchUserList(params: any) {
    this.userTableFieldParams = params;
  }

  onUploadAppIconFile(files: any[]) {

    if (files.length > 0 && files[0].thumbUrl) {

      this.resultValue.icon = files[0].thumbUrl;
    } else {
      this.resultValue.icon = "";
    }

  }

  ngOnChanges(changes: SimpleChanges) {

    this.initValidateForm();
    if (changes.action && changes.action.currentValue) {

      this.action = {};
      this.action = changes.action.currentValue;
      let icon = this.action.icon;
      if (icon) {
        this.appIconFile.list = [{
          uid: 146,
          name: 'widgets.png',
          status: 'done',
          // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          thumbUrl: icon
        }];
        this.appIconFile = Object.assign({}, this.appIconFile);
        this.resultValue.icon = this.appIconFile.list[0].thumbUrl;
        // console.log(this.resultValue);
      }

      if (this.action) {
        this.resetValidateForm(this.action);
      }
    }

    if (changes.editFlag && changes.editFlag.currentValue) {
      this.initData(this.action)
    } else {
      if (this.action) {
        this.resetValidateForm(this.action);
      }
    }

    if (this.needSubmit) {
      this._submitForm();
    } else {
      // this.initValidateForm()
      // this.initActionFormData()
    }
    // if (changes.fucTypeDicId && changes.fucTypeDicId.currentValue) {
    //   this.fucTypeDicId = this.fucTypeDicId != null ? this.fucTypeDicId : changes.fucTypeDicId.currentValue;
    //   if (this.additionalAppIdSelect) {
    //     this.additionalAppIdSelect.initValue = this.fucTypeDicId;
    //   }
    //
    // }
    // if (changes.additionalAppIdSelect && changes.additionalAppIdSelect.currentValue) {
    //   this.additionalAppIdSelect = changes.additionalAppIdSelect.currentValue;
    //   this.fucTypeDicId = this.fucTypeDicId;
    // }
  }


  /**
   * 初始化数据
   * @return {[type]} [description]
   */
  private initData(data: any) {
    try {
      if (data && Object.keys(data).length) {
        this.setDefaultV()
      }
    } catch (e) {

    }
  }

  /**
   * 编辑设置值
   * @return {[type]} [description]
   */
  private setDefaultV() {

    let validateKeyArr: any = []
    if (this.validateForm && this.validateForm.controls) {
      validateKeyArr = Object.keys(this.validateForm.controls)
    }
    if (validateKeyArr && validateKeyArr.length) {
      for (let item of validateKeyArr) {
        // if (item == 'fucTypeDicId') {
        // }
        this.action[item] && this.validateForm.controls[item] && this.validateForm.controls[item].setValue(this.action[item])
      }
    }
  }

}
