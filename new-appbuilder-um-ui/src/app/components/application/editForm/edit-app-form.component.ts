import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

// 校验相关
import { CheckRegExp } from '../../../@core/utils/validators/validator.service';
import { RegexpSService } from '../../../@core/data/regexps.service';
import { AppTableService } from '../app/table/app-table.service';

@Component({
  selector: 'edit-app-form',
  templateUrl: './edit-app-form.component.html',
  styleUrls: ['./edit-app-form.component.css'],
  providers: [FormBuilder]
})

export class EditAppFormComponent implements OnInit {
  @Input() needSubmit: boolean;
  @Input() app: any;
  @Input() flag: boolean;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() resultData = new EventEmitter<any>();
  @Output() picture = new EventEmitter<any>();

  type: string = '1';
  status: boolean = true;
  validateForm: FormGroup;
  additionalAppIdSelect: any;
  isInitedForm: boolean = false;
  selectedId: any;
  resultValue: any = {};
  imageErrorFlag: boolean = false;
  imageErrorFlagMax: boolean = false;
  @Input() isEdit = false;
  ismultiple: boolean = true;
  @Input() selectedAppId: any[];
  //@Input() errorFlag: boolean = false;
  errorFlag: any;
  @Input() set Flag(data: any) {
    this.errorFlag = data
  }
  appIconFile: any = {
    list: [],
    number: 1,
    apiUrl: `${document.location.origin}/console-api/attachmentController/uploadImage`,

  };
  appIconFileMax: any = {
    list: [],
    number: 1,
    apiUrl: `${document.location.origin}/console-api/attachmentController/uploadImage`,

  };
  @Input() set toSubmit(toSubmit: EventEmitter<any>) {
    toSubmit && toSubmit.subscribe(() => {
      this._submitForm()
    })
  }

  componentChange(value: any, fieldName: string) {
    if (this.checkHasFieldName(fieldName)) {
      this.validateForm.controls[fieldName].setValue(value);
    }
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
    const uistatus: string = this.checkImproveBag(this.validateForm.value.type, this.resultValue)
    if (uistatus == 'VALID') {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
      }

      if (this.validateForm.status == 'VALID') {
        this.resultData.emit(this.resultValue)
        this.onSubmit.emit(this.validateForm)
      }
    }
  }
  constructor(private regService: RegexpSService, private fb: FormBuilder, private appListService: AppTableService) {

  }

  /* selectSearchAdditionalAppId(value:any,fieldName:string){
       this.selectedId=value;
       this.componentChange(value,fieldName);
   }*/

  selectSearchAdditionalAppId(value: any, fieldName: string) {
    this.resultValue.selectedIds = '';
    for (var i = 0; i < value.length; i++) {
      if (this.resultValue.selectedIds == null || this.resultValue.selectedIds == '') {
        this.resultValue.selectedIds = value[i];
      } else {
        this.resultValue.selectedIds = this.resultValue.selectedIds + ',' + value[i];
      }

      // this.resultValue.selectedIds=this.resultValue.selectedIds +','+value[i].id;
    }
    //this.resultValue.selectedIds
    if (this.resultValue.selectedIds != '') {
      this.errorFlag = 0;
    }
    this.componentChange(value, fieldName);
  }
  additionalAppIdSelectOptions(allOptions: any) {

  }


  initValidateForm() {
    if (this.validateForm) {
      return false;
    }
    if (this.type == '2') {
      this.validateForm = this.fb.group({
        name: [null, [Validators.required, this.checkRepeatName, Validators.maxLength(256)]],
        status: [null, [Validators.required]],
        type: [null, [Validators.required]],
        version: [null, [Validators.required, Validators.maxLength(128)]],
        uri: [null, [Validators.required, Validators.maxLength(256)]],
        additionalAppId: [null, [Validators.required]],
        provider: [null, [Validators.maxLength(256)]],
        desc: [null, [Validators.required, Validators.maxLength(256)]]
      });
    } else {
      this.validateForm = this.fb.group({
        name: [null, [Validators.required, this.checkRepeatName, Validators.maxLength(256)]],
        status: [null, [Validators.required]],
        type: [null, [Validators.required]],
        version: [null, [Validators.required, Validators.maxLength(128)]],
        uri: [null, [Validators.required, Validators.maxLength(256)]],
        provider: [null, [Validators.maxLength(256)]],
        desc: [null, [Validators.required, Validators.maxLength(256)]]
      });
    }

  }

  changeNameCode = (control: FormControl): { [s: string]: boolean } => {
    this.errorFlag = 0;
    if (control.value) {
      return { required: false };
    } else {
      return { required: true, error: true };
    }
  };

  ngOnInit() {
    this.getApplist();
    this.status = true;
    let id;
    // let largeTconId;
    let icon: any = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUQxRTM0M0ExREUzMTFFODk2N0RFM0VGMTJGMTJEQzgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUQxRTM0M0IxREUzMTFFODk2N0RFM0VGMTJGMTJEQzgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5RDFFMzQzODFERTMxMUU4OTY3REUzRUYxMkYxMkRDOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5RDFFMzQzOTFERTMxMUU4OTY3REUzRUYxMkYxMkRDOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pj7PrGsAAAaGSURBVHja7FtdbBVF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';
    let largeIcon: any = 'data:image/png;base64,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'
    if (this.app) {
      if (this.app.status == 0) {
        this.status = false;
      }
      this.type = this.app.type + '';
      icon = this.app.icon;
      id = this.app.id;
      largeIcon = this.app.largeIcon;
      // largeTconId = this.app.largeTconId;
    }
    this.additionalAppIdSelect = {
      id: 3,
      fieldName: 'additionalAppId',
      fieldLabel: '关联主应用',
      fieldType: 'select',
      apiData: true,
      apiUrl: '/console-api/appController/queryListByName',
      apiParam: { id: id },
      initValue: this.selectedAppId[0],
      selectOptions: []
    };
    //this.appIconFile.list = [];
    this.appIconFile.list = [{
      uid: 146,
      name: 'yhgj.png',
      status: 'done',
      //url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: icon
    }];
    this.resultValue.icon = this.appIconFile.list[0].thumbUrl;
    this.appIconFileMax.list = [{
      uid: 12,
      name: 'yhgjmax.png',
      status: 'done',
      //url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: largeIcon
    }];
    this.resultValue.largeIcon = this.appIconFileMax.list[0].thumbUrl;
    this.initAppFormData();
  }


  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  initAppFormData() {
    /*if (this.isInitedForm) {
      return false;
    }*/
    this.isInitedForm = true;
    if (this.app) {
      for (let o in this.app) {
        this.componentChange(this.app[o], o);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.type == '2') {
      if (this.resultValue.selectedIds.length < 1) {
        this.errorFlag = 6;
      }
    }
    if (this.needSubmit) {
      this.needSubmit = (changes.needSubmit && changes.needSubmit.currentValue) || false;
      this._submitForm();
    } else {
      this.needSubmit = false;
      this.initValidateForm();
      if (this.errorFlag == 0) {
        // VALID
        if (this.validateForm.status == 'VALID') {
          this.initAppFormData();
        }

      }
    }
  }

  onUploadAppIconFile(files: any[]) {
    this.imageErrorFlag = false;
    if (files.length > 0 && files[0].response) {
      console.dir(files[0].response.id);
      this.resultValue.iconId = files[0].response.id;
      this.resultValue.icon = files[0].thumbUrl;
    } else {
      this.errorFlag = 0;
      this.picture.emit(this.errorFlag)
    }
  }

  onRemoveAppIconFile(files: any[]) {
    this.resultValue.icon = null;
  }

  onErrorAppIconFile(type: any) { //type == true 格式错误
    this.imageErrorFlag = type;
  }
  onUploadAppIconFileMax(files: any[]) {
    this.imageErrorFlagMax = false;
    if (files.length > 0 && files[0].response) {
      console.dir(files[0].response.id);
      this.resultValue.largeTconId = files[0].response.id;
      this.resultValue.largeIcon = files[0].thumbUrl;
    } else {
      this.errorFlag = 0;
      this.picture.emit(this.errorFlag)
    }
    //console.dir([files,'aaaa']);
  }

  onRemoveAppIconFileMax(files: any[]) {
    this.resultValue.largeIcon = null;
  }

  onErrorAppIconFileMax(type: any) { //type == true 格式错误
    this.imageErrorFlagMax = type;
  }
  // 所有的应用名称和代码
  public applistInfo: Array<any> = []

  /**
   * 获取所有app的信息
   * @return {[type]} [description]
   */
  private getApplist() {
    let params = {
      page: 1,
      rows: 100
    }
    this.appListService.getApps(params).then((data: any) => {
      this.applistInfo = data.list.map((item: any) => {
        return {
          name: item.name,
          code: item.code,
          id: item.id
        }
      })
    }).catch((err: any) => {
      console.log(err);
    });
  }

  /**
   * 检验code是否重复
   * 这里使用箭头函数是因为内部取不到this
   * @param  {FormControl} control [description]
   * @return {[type]}              [description]
   */
  checkRepeatName = (control: FormControl): { [key: string]: any } => {
    let codeRepeat: boolean = false
    if (this.applistInfo && this.applistInfo.length && control.value) {
      for (let item of this.applistInfo) {
        if (item.name.trim() === control.value.trim() && item.id != this.app.id) {
          codeRepeat = true
          break
        }
      }
    }
    return codeRepeat ? { 'nameRepeat': { value: control.value } } : null
  }

  /**
   * 检查增值包是否有选择
   * @return {[type]} [description]
   */
  private checkImproveBag(type: any, obj: any): string {

    let uistatus: string = 'VALID'
    if (type == 2) {
      !obj.selectedIds && (uistatus = 'INVALID')
    }
    return uistatus
  }

}
