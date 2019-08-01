import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { permissionsService } from '../../permissions/permissions.service';


@Component({
  selector: 'add-permissions-form',
  templateUrl: './add-permissions-form.component.html',
  styleUrls: ['./add-permissions-form.component.css'],
  providers: [FormBuilder]
})

export class AddPermissionsFormComponent implements OnInit {
  @Input() needSubmit: boolean;
  private nameList: any;
  @Input() tenantId: any;
  @Input() role: any;
  @Output() onSubmit = new EventEmitter<any>();

  validateForm: FormGroup;

  @Input() set toSubmit(_toSubmit: EventEmitter<any>) {
    _toSubmit && _toSubmit.subscribe(() => {
      this._submitForm();
    })
  }

  constructor(private service: permissionsService, private fb: FormBuilder) {
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
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }

    setTimeout(() => {
      this.onSubmit.emit(this.validateForm);
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['name'].value) {
      return { confirm: true, error: true };
    }
  };

  getCaptcha(event: MouseEvent) {
    event.preventDefault();
  }

  initValidateForm() {
    if (this.validateForm) {
      return false;
    }
    this.validateForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(256)], this.checkNameRepeat],
      desc: [null, [Validators.maxLength(256)]]
    });
  }

  ngOnInit() {
    this.getNameList()
    this.initValidateForm();
    if (this.role) {
      this.initRoleFormData()
    }
  }

  getFormControl(name: string) {
    return this.validateForm && this.validateForm.controls && this.validateForm.controls[name];
  }

  initRoleFormData() {
    if (this.role) {
      for (let o in this.role) {
        this.componentChange(this.role[o], o);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.needSubmit = changes.needSubmit.currentValue || false;
    // if (this.needSubmit) {
    //   this._submitForm();
    // } else {
    //   this.initValidateForm();
    //   this.initRoleFormData();
    // }
  }

  checkNameRepeat = (control: FormControl): { [key: string]: any } => {
    let nameRepeat: boolean = false;
    let controlV = control.value
    controlV && (controlV = controlV.trim())
    if(this.role){ // 编辑
        return new Promise((resolve: any, reject: any) => {
            this.service.checkRolseName({ name: controlV,id: this.role.id}).then((data: any) => {
              if(data.success == false){
                nameRepeat = true;
              }else {
                nameRepeat = false;
              }
              resolve(nameRepeat ? { 'nameRepeat': { value: control.value } } : null)
            })
          })
    }else {
        return new Promise((resolve: any, reject: any) => {
            this.service.checkRolseName({ name: controlV, tenantId: this.tenantId }).then((data: any) => {
              if(data.success == false){
                nameRepeat = true;
              }else {
                nameRepeat = false;
              }
              resolve(nameRepeat ? { 'nameRepeat': { value: control.value } } : null)
            })
          })
    }
    
  }

//获取数据对象列表
  getNameList() {
    let params: any = {};
    params.tenantId = this.tenantId;
    params.page = 1;
    params.rows = 1000;

    this.service.queryTenantRolesByPage(params).then((data: any) => {
      if (data.success == true) {
        this.nameList = data.data;
      }
    });
  }

  setNameList(data: any) {
    if (data && data.length) {
      this.nameList = data.map((item: any) => {
        return item.name
      })
    }
  }


}
