import {Component, Output, EventEmitter, Injector, OnInit, OnChanges} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, ValidationErrors} from '@angular/forms';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {CustomAnalysisService} from '../custom-analysis.service';
import {saveMessage} from '../../../utils/post-message';
import {BaseComponent} from '../../../common/base-component';

@Component({
    selector: 'app-create-report',
    templateUrl: './create-report.component.html',
    styleUrls: ['./create-report.component.less']
})
export class CreateReportComponent extends BaseComponent implements OnInit, OnChanges {

    validateForm: FormGroup;

    selectedColor = '#8555B9';  // 选中的颜色
    name = ''; // 报表名称

    reportUrl: any; // 报表配置url

    @Output() closeSaveModel = new EventEmitter<boolean>();

    constructor(private fb: FormBuilder,
                private injector: Injector,
                private customAnalysisService: CustomAnalysisService) {
        super(injector);
        this.validateForm = this.fb.group({
            name: ['', [Validators.required, this.checkName, this.inputCheck], [this.userNameAsyncValidator]],
            color: ['#8555B9'],
        });
        this.validateForm.reset({
            name: null,
            color: '#8555B9',
        });
    }

    ngOnInit() {

        this.reportUrl = localStorage.getItem('analytics_custom_report_url');

    }

    // 包含数字、字母和中文
    inputCheck = (control: FormControl): {[key: string]: any} => {
        let flag = false;
        const controlV = control.value;
        const tmp = new RegExp('^[A-Za-z0-9\u4e00-\u9fa5]+$');
        if (tmp.test(controlV)) {
            flag = false;
        } else if (!tmp.test(controlV)) {
            flag = true;
        }
        if (controlV === null || controlV === '' || controlV === undefined) {
            flag = false;
        }
        return flag ? {'auto': {value: control.value}} : null;
    }

    checkName = (control: FormControl): {[key: string]: any} => {
        const that = this;
        let flag = false;
        const controlV = control.value;
        const length = that.getLength(controlV);
        if (length > 64) {
            flag = true;
        }
        return flag ? {'length': {value: control.value}} : null;
    }

    getLength(str: any) {
        if (!str) return 0;
        const l = str.length;
        let unicodeLen = 0;
        for (let i = 0; i < l; i++) {
            if ((str.charCodeAt(i) > 127)) {
                unicodeLen++;
            }
            unicodeLen++;
        }
        return unicodeLen;
    }

    /**
     * 创建报表
     */
    submit() {
        const that = this;
        for (const key in that.validateForm.controls) {
            if (that.validateForm.controls.hasOwnProperty(key)) {
                that.validateForm.controls[key].markAsDirty();
                // that.validateForm.controls[key].updateValueAndValidity();
            }
        }
        if (that.validateForm.invalid) {
            return;
        }
        const tmpJson = JSON.parse(JSON.stringify(that.validateForm.value));
        tmpJson['productId'] = that.productId;
        that.customAnalysisService.saveReport(tmpJson).subscribe((data: any) => {
            if (data && data['success']) {
                that.validateForm.reset({
                    name: null,
                    color: '#8555B9',
                });

                const aepUrl = window.location.origin + `/aeplus/#/basic-analysis/custom-analysis`;

                const json = {
                    customReport: {
                        url: aepUrl,
                        header: [
                            {name: '自定义分析', url: aepUrl},
                            {name: data.data.name, url: ''}
                        ],
                        reportId: data.data['reportId']
                    },
                    cache: true
                };
                saveMessage('customReport', json);
                const src = that.reportUrl + '/report-mop/#/report-detail-mop/' + data.data.reportId;

                const token = localStorage.getItem('token');
                const product_id = localStorage.getItem('productId');
                const param = '?product_id=' + product_id + '&token=' + token;
                this.commonService.goReportPage(src + param, aepUrl);
//                window.location.href = src + param;
                // this.closeSaveModel.emit(true);
            } else {
                this.message.error(data['msg']);
            }
        });
    }

    /**
     * 报表名称异步校验
     */
    userNameAsyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
        const that = this;
        setTimeout(() => {
            that.customAnalysisService.checkName({
                productId: that.productId,
                name: control.value
            }).subscribe((data: any) => {
                if (!data.success) {
                    observer.next({error: true, duplicated: true});
                } else {
                    observer.next(null);
                }
                observer.complete();
            });
        }, 1000);
    })

    confirmValidator = (control: FormControl): {[s: string]: boolean} => {
        if (!control.value) {
            return {required: true};
        } else if (control.value !== this.validateForm.controls.password.value) {
            return {confirm: true, error: true};
        }
    }

    /**
     * 关闭弹框
     */
    cancel() {
        this.closeSaveModel.emit(false);
    }

}
