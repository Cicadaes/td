import { Component, Input, Output, EventEmitter, SimpleChanges, Injector, OnInit, OnChanges } from '@angular/core';
import { ProcessManageService } from '../process-manage.service';
import { BaseComponent } from '../../../common/base-component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-reject-dialog',
    templateUrl: './reject-dialog.component.html',
    styleUrls: ['./reject-dialog.component.less']
})
export class RejectDialogComponent extends BaseComponent implements OnInit, OnChanges {
    value: string;
    @Input() isVisible: any;
    @Input() rejectData: any;
    @Output() hideDialog = new EventEmitter<any>();
    @Output() saveDate = new EventEmitter<any>();
    validateForm: FormGroup;


    constructor(
        private processManageService: ProcessManageService,
        private injector: Injector,
        private fb: FormBuilder,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.validateForm = this.initialValidateForm();
    }

    // 初始化表单
    initialValidateForm(): any {
        return this.fb.group({
            reason: [null, [Validators.required, Validators.maxLength(500)]]           // 拒绝理由
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        this.validateForm = this.initialValidateForm();

        if (changes.isVisible) {
            this.isVisible = changes.isVisible.currentValue;
        }

        if (changes.rejectData) {
            this.rejectData = changes.rejectData.currentValue;
        }
    }

    //  取消
    handleCancel = (e) => {
        this.isVisible = false;
        this.globals.resetBodyStyle();
        this.hideDialog.emit(this.isVisible);
    }

    getFormControl(name: string) {
        return this.validateForm.controls[name];
    }

    // 表单验证
    submitForm() {
        for (const i in this.validateForm.controls) {
            if (this.validateForm.controls.hasOwnProperty(i)) {
                this.validateForm.controls[i].markAsDirty();
                // this.validateForm.controls[i].updateValueAndValidity();
            }
        }
    }

    // 保存
    save() {
        const that = this;
        this.submitForm();
        if (this.validateForm.invalid) {
            return;
        }
        const obj = {
            id: that.rejectData.id,
            reason: that.validateForm.get('reason').value,
        };
        this.globals.resetBodyStyle();
        this.processManageService.insertReason(obj).subscribe((response) => {
            if (response.code === 200) {
                this.isVisible = false;
                this.saveDate.emit();
            } else {
                this.isVisible = false;
                this.notification.create('warning', '错误提示', response.message);
            }
        }, (err: any) => {
            this.isVisible = false;
        });
    }
}

