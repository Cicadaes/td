import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { EditLicenceAttributeDialogService } from './edit-licence-attribute-dialog.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
  selector: 'edit-licence-attribute-dialog',
  templateUrl: './edit-licence-attribute-dialog.component.html',
  providers: [FormBuilder]
})
export class EditLicenceAttributeDialogComponent implements OnInit {
  @Input() queryParams: any;
  @Input() _dataSet: any;
  @Input() app: boolean;
  @Input() isShow: boolean = false;
  @Input() isEdit: boolean = false;
  @Input() currentData: any;
  @Output() onClose = new EventEmitter<any>();
  //appAttribute: any = [];
  key: string = "";
  name: string = "";
  defalutValue: string = "";
  desc: string = "";

  errorFlag: boolean = false;
  isVisible = false;
  isConfirmLoading = false;
  validateForm: FormGroup;
  errorMsg = "";

  private title: string = '添加属性'

  showModal = () => {
    this.errorFlag = false;
    if (!this.isEdit) {
      this.key = "";
      this.name = "";
      this.defalutValue = "";
      this.desc = "";
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
    // this._checkedForm();
    this.errorFlag = false;
    if (!this.defalutValue) {
      //this.showDialog("Value(默认值)必填");
      return;
    }
    var licenceAttribute: any = {};
    licenceAttribute.key = this.key;
    licenceAttribute.name = this.name;
    licenceAttribute.defalutValue = this.defalutValue;
    licenceAttribute.desc = this.desc;
    licenceAttribute.licenceId = this.queryParams.id;
    if (this.isEdit) {
      licenceAttribute.id = this.currentData.id
    }
    this.service.editLicenceAtttibute(licenceAttribute).subscribe((data: any) => {
      if (data.success) {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
        this.onClose.emit(false);
      } else {
        //alert(data.data);
        this.errorMsg = data.msg;
        this.errorFlag = true;
      }
    })


  }

  handleCancel = (e: any) => {
    this.isVisible = false;
    this.onClose.emit(this.isVisible);
  }

  constructor(private service: EditLicenceAttributeDialogService, private confirmServ: NzModalService, private fb: FormBuilder) {

  }

  showDialog(msg: any) {
    this.confirmServ.warning({
      nzTitle: msg,
      nzOnCancel: () => {
      }
    });
  }
  ngOnInit() {
    this.setTitle()
    this.initValidateForm()
  }


  _checkedForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
  }

  /**
   * 初始化表单
   * @return {[type]} [description]
   */
  private initValidateForm() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(256), this.checkNameRepeat]],
      // key: [null, [Validators.required]],
      key: [null, [Validators.required, Validators.maxLength(256), this.checkCodeRepeat]],
      //key: [null, [Validators.required, this.checkNameKeyRepeat, this.checkCodeRepeat]],
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
      // this._dataSet.push(arrtItem)
      // this.isVisible = false
      // this.onClose.emit(this.isVisible)

      this.submitAttribute(arrtItem)

      /*setTimeout(() => {
          // this._dataSet.push(arrtItem)
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
          if (this.currentData && this.currentData.key && this.currentData.key == controlV) {
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
        let itemV = item.name
        itemV && (itemV = itemV.trim())
        if (controlV && itemV == controlV) {
          nRepeat = true
          if (this.currentData && this.currentData.name && this.currentData.name == controlV) {
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

  /**
   * 设置标题
   * @return {[type]} [description]
   */
  private setTitle() {
    this.title = this.isEdit ? '编辑属性' : '添加属性'
  }

}
