import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { EditAppExtendDialogService } from './edit-app-extend-dialog.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'

// 校验相关
import { CheckRegExp } from '../../../../@core/utils/validators/validator.service'
import { RegexpSService } from '../../../../@core/data/regexps.service'

@Component({
  selector: 'edit-app-extend-dialog',
  templateUrl: './edit-app-extend-dialog.component.html',
  providers: [FormBuilder]
})
export class EditAppExtendDialogComponent implements OnInit {
  @Input() queryParams: any;
  @Input() _dataSet: any;
  @Input() app: boolean;
  @Input() isShow: boolean = false;
  @Input() isedit: boolean = false;
  @Input() currentData: any;
  @Output() onClose = new EventEmitter<any>();
  //appAttribute: any = [];
  code: string = ""
  name: string = ""
  defaultValue: string = ""
  oldcode: string = ""
  oldname: string = ""
  olddefaultValue: string = ""

  isVisible = false
  isConfirmLoading = false

  private diaSeader: string = '新建功能类别'
  private validateForm: FormGroup
  private checkGenStr: any = CheckRegExp(this.regService.getGeneralstr())


  showModal = () => {
    this.initValidateForm();
    if (!this.isedit) {
      this.diaSeader = '新建功能类别'
      this.code = "";
      this.name = "";
      this.defaultValue = "";
    } else {
      this.diaSeader = '编辑功能类别'
      this.code = this.currentData.code;
      this.name = this.currentData.name;
      this.defaultValue = this.currentData.defaultValue;
    }
    this.isConfirmLoading = false;
    this.isVisible = true;
  }

  getFormControl(name: string) {
    return this.validateForm && this.validateForm.controls && this.validateForm.controls[name];
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
    this._checkedForm()
    if (this.validateForm.status == 'VALID') {
      var appAttribute: any = {};
      appAttribute.code = this.code;
      appAttribute.name = this.name;
      appAttribute.defaultValue = this.defaultValue;
      if (this.isedit) {
        appAttribute.id = this.currentData.id
      }
      this.service.editAppAtttibute(appAttribute, this.queryParams.id).subscribe((data: any) => {
        if (data.success == 200) {
          this.isVisible = false;
          this.onClose.emit(this.isVisible);
          this.onClose.emit(false);
        } else {
          alert(data.result);
        }
      })
    }

    // this.initValidateForm()

  }

  handleCancel = (e: any) => {
    this.isVisible = false;
    this.onClose.emit(this.isVisible);
  }

  constructor(private route: ActivatedRoute, private regService: RegexpSService, private fb: FormBuilder, private service: EditAppExtendDialogService) {

  }

  ngOnInit() {
    this.initValidateForm()
  }

  private initValidateForm() {
    this.validateForm = this.fb.group({
      code: [null, [Validators.required, this.checkGenStr, Validators.maxLength(128)], this.checkCodeRepeatAs],
      name: [null, [Validators.required, Validators.maxLength(128)], this.checkNameRepeatAs],
      // code: [null, [Validators.required, this.checkCodeRepeat, this.checkGenStr, Validators.maxLength(128)]],
      // name: [null, [Validators.required, this.checkNameRepeat, Validators.maxLength(128)]],
      defaultValue: [null, [Validators.maxLength(256)]]
    })
  }

  checkNameRepeatAs = (control: FormControl): Promise<any> => {
    return new Promise((resolve: any, reject: any) => {
      let params: any = {
        name: control.value,
        appId: this.route.snapshot.params['id']
      }
      if(this.currentData && this.currentData.id){
        params.id = this.currentData.id
      }
      this.service.checkRepeat(params).subscribe((data: any) => {
        resolve(!data.success ? { 'nNameRepeat': { value: control.value } } : null)
      })
    })
  }
  
  checkCodeRepeatAs = (control: FormControl): Promise<any> => {
    return new Promise((resolve: any, reject: any) => {
      let params: any = {
        code: control.value,
        appId: this.route.snapshot.params['id']
      }
      if(this.currentData && this.currentData.id){
        params.id = this.currentData.id
      }
      this.service.checkRepeat(params).subscribe((data: any) => {
        resolve(!data.success ? { 'nCodeRepeat': { value: control.value } } : null)
      })
    })
  }

  checkNameRepeat = (control: FormControl): { [key: string]: any } => {
    let nNameRepeat: boolean = false;
    let controlV = control.value
    controlV && (controlV = controlV.trim())
    if (this._dataSet.length > 0) {
      for (var i = this._dataSet.length - 1; i >= 0; i--) {
        var p = this._dataSet[i];
        if (this.isedit) {
          if (p.name == controlV && p.update != true && p.operation != 'delete') {
            nNameRepeat = true;
          }
        } else {
          if (p.name == controlV && p.operation != 'delete') {
            nNameRepeat = true;
          }
        }
      }
    }
    return nNameRepeat ? { 'nNameRepeat': { value: control.value } } : null
  }

  checkCodeRepeat = (control: FormControl): { [key: string]: any } => {
    let nCodeRepeat: boolean = false;
    let controlV = control.value
    controlV && (controlV = controlV.trim())
    if (this._dataSet.length > 0) {
      for (var i = this._dataSet.length - 1; i >= 0; i--) {
        var p = this._dataSet[i];
        if (this.isedit) {
          if (p.code == controlV && p.update != true && p.operation != 'delete') {
            nCodeRepeat = true;
          }
        } else {
          if (p.code == controlV && p.operation != 'delete') {
            nCodeRepeat = true;
          }
        }
      }
    }
    return nCodeRepeat ? { 'nCodeRepeat': { value: control.value } } : null

  }

  get _name() {
    return this.validateForm.get('name');
  }

  get _code() {
    return this.validateForm.get('code');
  }

  _checkedForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
  }

  // private checkName

}
