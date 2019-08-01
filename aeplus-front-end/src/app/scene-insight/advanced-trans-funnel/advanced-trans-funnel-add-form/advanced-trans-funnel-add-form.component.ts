import {Component, Input, Output, EventEmitter, SimpleChanges, Injector} from '@angular/core';
import * as differenceInDays from 'date-fns/difference_in_days';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AdvancedTransFunnelService} from '../advanced-trans-funnel.service';
import {BaseComponent} from '../../../common/base-component';

@Component({
    selector: 'app-advanced-trans-funnel-add-form',
    templateUrl: './advanced-trans-funnel-add-form.component.html',
    styleUrls: ['./advanced-trans-funnel-add-form.component.less']
})
export class AdvancedTransFunnelAddFormComponent extends BaseComponent {
    @Input() isSubmit: boolean;
    @Input() data: any;
    @Input() systemError: any;
    @Input() cardTitle: any;
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onBack = new EventEmitter<any>();

    _cardTitle: string;
    _dateFormat = 'yyyy-MM-dd';
    _today = new Date(this.globals.getDateZeroTime(new Date().getTime()));
    _dateRange;
    _dateRangeOld;

    _isSubmit: boolean;
    validateForm: FormGroup;
    _data: any;
    _funnelOrder = '0';
    _systemError: any = {
        error: false,
        msg: ''
    };
    _steps: any;

    _initDateRange() {
        if (!this._dateRange) {
            const date = this.globals.getDateRangeByLastDay(-30);
            const yesterday = this.globals.getDateRangeByLastDay(0).start;
            this._dateRange = [new Date(date.start), new Date(yesterday)];
            this._dateRangeOld = this._dateRange;
        }
        this.componentChange(this._dateRange, 'dateRange');
    }

    _disabledDate = (current: Date): boolean => {
        return differenceInDays(current, this._today) > 0;
 //       return differenceInDays(current, this._today) > 0 || differenceInDays(current, this._today) < -365;
    }

    _changeDaterange(value: any) {
        const days = this.globals.getDateDays(value[0], value[1]);
        console.dir(days);
        if (days > 365) {
            setTimeout(() => {
                this._dateRange = this._dateRangeOld;
                this.componentChange(this._dateRange, 'dateRange');
            }, 100);
            this.message.create('warning', '时间范围不能超过一年');
            return false;
        }
        this._dateRange = value;
        this._dateRangeOld = this._dateRange;
    }

    submitForm = ($event, value) => {
        $event.preventDefault();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
            this.validateForm.controls[key].updateValueAndValidity();
        }
//    console.log(value);
    }

    _submitForm = () => {
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
            this.validateForm.controls[key].updateValueAndValidity();
        }
        setTimeout(() => {
            this.onSubmit.emit(this.validateForm);
        }, 100);
    }

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

    changeInputValue(obj: any, fieldName: string) {
        const value = obj.target.value;
        this.componentChange(this.trim(value), fieldName);
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
            return {required: true};
        } else if (control.value !== this.validateForm.controls.password.value) {
            return {confirm: true, error: true};
        }
    }

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
                if (o === 'funnelOrder') {
                    this._funnelOrder = this._data[o].toString();
                    this.componentChange(this._data[o], this._funnelOrder);
                } else if (o === 'dateRange' && this._data[o]) {
                    this._dateRange = [];
                    if (this._data[o] && this._data[o].indexOf('~') !== -1) {
                        const _dateRangeAttr = this._data[o].split('~');
                        const startTimeFormat = this.globals.dateFormat1(_dateRangeAttr[0], '/');
                        const endTimeFormat = this.globals.dateFormat1(_dateRangeAttr[1], '/');
                        const startTime = new Date(startTimeFormat);
                        const endTime = new Date(endTimeFormat);
                        this._dateRange.push(startTime);
                        this._dateRange.push(endTime);
                        this.componentChange(this._dateRange, o);
                        this._dateRangeOld = this._dateRange;
                    }
                } else if (o === 'steps') {
                    this._steps = this._data[o];
                    this.componentChange(this._steps, o);
                } else {
                    this.componentChange(this._data[o], o);
                }
            }
        } else {
            /*this._initDateRange();
            this.componentChange(this._dateRange, 'dateRange');*/
        }
    }

    constructor(private fb: FormBuilder,
                private service: AdvancedTransFunnelService,
                private injector: Injector) {
        super(injector);
        this.validateForm = this.fb.group({
            id: [null],
            steps: [null, [Validators.required]],
            productId: [this.productId],
            name: ['', [Validators.required]],
            dateRange: ['', [Validators.required]],
            funnelOrder: ['0']
        });
        this._initDateRange();
    }

    onBackFunnelSteps(value: any) {
        this._steps = value;
        setTimeout(() => {
            this.componentChange(this._steps, 'steps');
            this._submitForm();
            console.dir([this._steps]);
        }, 100);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isSubmit) {
            this._isSubmit = changes.isSubmit.currentValue;
        }
        if (this._isSubmit) {
//      this._submitForm();
        }

        if (changes.cardTitle) {
            this._cardTitle = changes.cardTitle.currentValue || '添加漏斗';
        }

        if (changes.data && changes.data.currentValue) {
            this._data = changes.data.currentValue;
            this.initFormData();
        }

        if (changes.systemError) {
            this._systemError = changes.systemError.currentValue;
        }
    }

    ngOnInit() {
    }

}
