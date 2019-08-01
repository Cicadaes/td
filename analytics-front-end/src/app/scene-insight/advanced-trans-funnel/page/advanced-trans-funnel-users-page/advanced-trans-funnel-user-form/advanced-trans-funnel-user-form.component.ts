import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Globals } from '../../../../../utils/globals';
import { AdvancedTransFunnelService } from '../../../advanced-trans-funnel.service';

@Component({
  selector: 'app-advanced-trans-funnel-user-form',
  templateUrl: './advanced-trans-funnel-user-form.component.html',
  styleUrls: ['./advanced-trans-funnel-user-form.component.less']
})
export class AdvancedTransFunnelUserFormComponent implements OnInit, OnChanges {
  @Input() isSubmit: boolean;
  @Input() data: any;
  @Input() systemError: any;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onBack = new EventEmitter<any>();
  _isSubmit: boolean;
  validateForm: FormGroup;
  _data: any = {};

  _isCalculateError: boolean;
  _systemError: any = {
    error: false,
    msg: ''
  };
  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    // console.log(value);
  };

  keyupInputValue(obj: any, fieldName: string) {
    this._systemError = {
      error: false,
      msg: ''
    };
  }

  changeInputValue(obj: any, fieldName: string) {
    const value = obj.target.value;
    this.componentChange(this.trim(value), fieldName);
  }

  _submitForm = () => {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    if (this._isCalculateError) {
      this.onBack.emit(this.validateForm);
      return false;
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
    for (const o in this.validateForm.controls) {
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
    //    this.clearFormData();
    if (this._data) {
      for (const o in this._data) {
        this.componentChange(this._data[o], o);
      }
    }
  }

  constructor(private fb: FormBuilder, private service: AdvancedTransFunnelService, public globals: Globals) {
    this.validateForm = this.fb.group({
      crowdName: ['', [Validators.required]],
      crowdDesc: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isSubmit) {
      this._isSubmit = changes.isSubmit.currentValue;
    }
    if (this._isSubmit) {
      this._submitForm();
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
