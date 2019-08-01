import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { ParamMgtService } from '../../param-mgt.service';
import { Globals } from '../../../../../utils/globals';

@Component({
  selector: 'app-param-mgt-add-form',
  templateUrl: './param-mgt-add-form.component.html',
  styleUrls: ['./param-mgt-add-form.component.less'],
  providers: [ParamMgtService]
})
export class ParamMgtAddFormComponent implements OnInit, OnChanges {
  @Input() isSubmit: boolean;
  @Input() data: any;
  @Input() systemError: any;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onBack = new EventEmitter<any>();
  _isSubmit: boolean;
  validateForm: FormGroup;
  _data: any = {};
  _systemError: any = {
    error: false,
    msg: ''
  };

  keyupInputValue() {
    this._systemError = {
      error: false,
      msg: ''
    };
  }
  _submitForm = () => {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      return;
    }
    if (!this.validateForm.controls.name.value) {
      return;
    }
    if (!this.validateForm.controls.parammean.value) {
      return;
    }
    setTimeout(() => {
      this.onSubmit.emit(this.validateForm);
    }, 100);
  };

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  parammeanAsyncValidator = (control: FormControl) =>
    Observable.create((observer: Observer<ValidationErrors>) => {
      const value = this.getValueByField('parammean').trim();
      if (value === '') {
        observer.next({ required: true, duplicated: false });
        observer.complete();
      }
      this.onBack.emit(this.validateForm);
    });

  nameAsyncValidator = (control: FormControl) =>
    Observable.create((observer: Observer<ValidationErrors>) => {
      const value = this.getValueByField('name').trim();
      if (value === '') {
        observer.next({ required: true, duplicated: false });
        observer.complete();
      } else {
        if (!/^[A-Za-z0-9_]+$/.test(value)) {
          observer.next({ error: true, rule: true, duplicated: false });
          observer.complete();
        } else {
          observer.next(null);
          observer.complete();
        }
      }
      this.onBack.emit(this.validateForm);
    });

  trim(str: string) {
    if (str) {
      return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
    } else {
      return '';
    }
  }

  getValueByField(fieldName: string) {
    return this.validateForm.controls[fieldName].value || '';
  }

  _trimInput(fieldName: string) {
    const value = this.trim(this.getValueByField(fieldName));
    this.componentChange(value, fieldName);
  }

  componentChange(value: any, fieldName: string) {
    if (this.checkHasFieldName(fieldName)) {
      this.validateForm.controls[fieldName].setValue(value);
    }
  }

  checkHasFieldName(fieldName: string) {
    let has = false;
    for (let o in this.validateForm.controls) {
      if (fieldName && fieldName === o) {
        has = true;
        break;
      }
    }
    return has;
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  };

  clearFormData() {
    if (this.validateForm && this.validateForm.controls) {
      for (const o in this.validateForm.controls) {
        this.validateForm.controls[o].setValue('');
      }
    }
  }

  initFormData() {
    if (this._data) {
      for (const o in this._data) {
        this.componentChange(this._data[o], o);
      }
    }
  }

  constructor(private fb: FormBuilder, private service: ParamMgtService, public globals: Globals) {
    this.validateForm = this.fb.group({
      productid: [this.globals.getProductIdByStorage()],
      name: ['', [Validators.required], [this.nameAsyncValidator]],
      displayname: [''],
      parammean: ['', [Validators.required], [this.parammeanAsyncValidator]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isSubmit) {
      this._isSubmit = changes.isSubmit.currentValue;
      if (this._isSubmit) {
        setTimeout(() => {
          this._submitForm(), 200;
        });
      }
    }
    if (changes.data && changes.data.currentValue) {
      this._data = changes.data.currentValue;
      this.initFormData();
    }
    if (changes.systemError) {
      this._systemError = changes.systemError.currentValue;
    }
  }

  ngOnInit() {}
}
