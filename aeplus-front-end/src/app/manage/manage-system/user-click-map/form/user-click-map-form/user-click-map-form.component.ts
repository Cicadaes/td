import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators
} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {UserClickMapService} from '../../user-click-map.service';
import {Globals} from '../../../../../utils/globals';

@Component({
    selector: 'app-user-click-map-form',
    templateUrl: './user-click-map-form.component.html',
    styleUrls: ['./user-click-map-form.component.less'],
    providers: [UserClickMapService]
})
export class UserClickMapFormComponent implements OnInit, OnChanges {
    @Input() isSubmit: boolean;
    @Input() data: any;
    @Input() systemError: any;
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onBack = new EventEmitter<any>();
    _isSubmit: boolean;
    validateForm: FormGroup;
    _data: any = {
        sorting: 0
    };
    _sourceidOptions: any[];
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
        console.log(value);
    };

    getFormControl(name: string) {
        return this.validateForm.controls[name];
    }

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

    displaynameAsyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
        const id = this.getValueByField('id');
        const value = this.trim(this.getValueByField('displayname'));
        if (value === '') {
            observer.next({required: true, duplicated: false});
            observer.complete();
            return false;
        }
        const param = {
            id: id,
            displayname: value,
            productid: this.globals.getProductIdByStorage()
        };
        this._checkRepeatApi(param, observer);
    });

    nameAsyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
//    const id = this.getValueByField('id');
        const value = this.trim(this.getValueByField('name'));
        if (value === '') {
            observer.next({required: true, duplicated: false});
            observer.complete();
            return false;
        } else {
            if (value.toLowerCase().indexOf('http://') === -1 && value.toLowerCase().indexOf('https://') === -1) {
                observer.next({error: true, rule: true, duplicated: false});
                observer.complete();
                return false;
            } else if (value.toLowerCase().indexOf('?') !== -1 || value.toLowerCase().indexOf('？') !== -1) {
                observer.next({error: true, mark: true, duplicated: false});
                observer.complete();
                return false;
            } else if (!this.globals.checkUrl(value)) {
                observer.next({error: true, url: true, duplicated: false});
                observer.complete();
                return false;
            }
        }
        observer.next(null);
        observer.complete();
        /*const param = {
          id: id,
          name: value,
          productid: this.globals.getProductIdByStorage()
        };
        this._checkRepeatApi(param, observer);*/
    });

    _checkRepeatApi(param, observer) {
        this.service.checkRepeat(param).subscribe((response: any) => {
            if (!response.success) {
                observer.next({error: true, duplicated: true});
            } else {
                observer.next(null);
            }
            observer.complete();
            this.onBack.emit(this.validateForm);
        });
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
            return {required: true};
        } else if (control.value !== this.validateForm.controls.password.value) {
            return {confirm: true, error: true};
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

    constructor(private fb: FormBuilder, private service: UserClickMapService, private globals: Globals) {
        this.validateForm = this.fb.group({
            id: [null],
            productid: [this.globals.getProductIdByStorage()],
            appkey: [localStorage.getItem('appkey')],
            displayname: ['', [Validators.required]],
            name: ['', [Validators.required], [this.nameAsyncValidator]],
            sourceid: ['', [Validators.required]],
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

    initDisplayTypeOptions() {
        this._sourceidOptions = [{
            value: '',
            label: '请选择'
        }, {
            value: '2',
            label: 'H5'
        }, {
            value: '1',
            label: 'Web'
        }];
    }

    ngOnInit() {
        this.initDisplayTypeOptions();
    }

}
