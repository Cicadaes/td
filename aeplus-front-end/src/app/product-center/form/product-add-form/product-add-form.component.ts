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
import {ProductCenterService} from '../../product-center.service';

@Component({
    selector: 'app-product-add-form',
    templateUrl: './product-add-form.component.html',
    styleUrls: ['./product-add-form.component.less'],
    providers: [ProductCenterService]
})
export class ProductAddFormComponent implements OnInit, OnChanges {
    @Input() isSubmit: boolean;
    @Input() data: any;
    @Input() systemError: any;
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onBack = new EventEmitter<any>();
    _isSubmit: boolean;
    validateForm: FormGroup;
    _data: any;
    _iscompensate: string = '1';
    isAutoMNP: boolean = false;    // 判断是否有小程序权限
    _systemError: any = {
        error: false,
        msg: ''
    };
    _isShowPwd: boolean;
    _miniprogramAppidError: any = {
        isError: false,
        errorMsg: ''
    };
    _miniprogramSecretError: any = {
        isError: false,
        errorMsg: ''
    };
    submitForm = ($event, value) => {
        $event.preventDefault();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
            this.validateForm.controls[key].updateValueAndValidity();
        }
//    console.log(value);
    };

    _submitForm = () => {
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
            this.validateForm.controls[key].updateValueAndValidity();
        }
        if (this._miniprogramAppidError.isError || this._miniprogramSecretError.isError) {
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

    productnameAsyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
        const id = this.getValueByField('id');
        const value = this.trim(this.getValueByField('productname'));
        if (value === '') {
            observer.next({required: true, duplicated: false});
        }
        const param = {
            id: id,
            productname: value
        };
        this.service.checkProduct(param).subscribe((response: any) => {
            if (!response.success) {
                observer.next({error: true, duplicated: true});
            } else {
                observer.next(null);
            }
            observer.complete();
            this.onBack.emit(this.validateForm);
        });
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

    changeInputValue(obj: any, fieldName: string) {
        const value = obj.target.value;
        this.componentChange(this.trim(value), fieldName);
    }

    keyupInputValue(obj: any, fieldName: string) {
        this._systemError = {
            error: false,
            msg: ''
        };
        this.validMiniprogramAppidError(obj, fieldName);
        this.validMiniprogramSecretError(obj, fieldName);
    }

    validMiniprogramAppidError(obj: any, fieldName: string) {
        console.dir([obj, fieldName]);
        if (fieldName === 'miniprogramAppid') {
            const value = this.getValueByField(fieldName);
            this._miniprogramAppidError = {
                isError: false,
                errorMsg: ''
            };
            if (value) {
                if (!/^[A-Za-z0-9_]+$/.test(value)) {
                    this._miniprogramAppidError = {
                        isError: true,
                        errorMsg: '微信分配的小程序唯一ID只能是字母，数字和下划线'
                    };
                }
            }
        }
    }

    validMiniprogramSecretError(obj: any, fieldName: string) {
        console.dir([obj, fieldName]);
        if (fieldName === 'miniprogramSecret') {
            const value = this.getValueByField(fieldName);
            this._miniprogramSecretError = {
                isError: false,
                errorMsg: ''
            };
            if (value) {
                if (!/^[A-Za-z0-9_]+$/.test(value)) {
                    this._miniprogramSecretError = {
                        isError: true,
                        errorMsg: '微信分配的小程序Secret只能是字母，数字和下划线'
                    };
                }
            }
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
                if (o === 'iscompensate' && this._data[o]) {
                    this._iscompensate = this._data[o].toString();
                }
            }
        }
    }

    constructor(private fb: FormBuilder, private service: ProductCenterService) {
        this.validateForm = this.fb.group({
            id: [''],
            productname: ['', [Validators.required]],
            miniprogramAppid: [''],
            miniprogramSecret: [''],
            desc: [''],
            iscompensate: ['1']
        });
        const that = this;
        window.parent.postMessage(JSON.stringify({eventType: 'transfer'}), '*');
        window.addEventListener('message', function (event: any) {
            if (event.data && typeof event.data === 'string') {
                const data = JSON.parse(event.data);
                if (data && data.eventInfo && data.eventType === 'transfer') {
                    const list = data.eventInfo.data;
                    const length = list.length;
                    for (let i = 0; i < length; i++) {
                        if (list[i].code === 'miniprogram') {
                            that.isAutoMNP = true;
                            break;
                        }
                    }
                }
            }
        });
    }

    _showHidePwd() {
        this._isShowPwd = !this._isShowPwd;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isSubmit) {
            this._isSubmit = changes.isSubmit.currentValue;
        }
        if (this._isSubmit) {
            this._submitForm();
        }

        if (changes.data) {
            this._data = changes.data.currentValue;
            this.initFormData();
        }

        if (changes.systemError) {
            this._systemError = changes.systemError.currentValue;
        }
    }

    ngOnInit() {
        this._isShowPwd = true;
    }

}
