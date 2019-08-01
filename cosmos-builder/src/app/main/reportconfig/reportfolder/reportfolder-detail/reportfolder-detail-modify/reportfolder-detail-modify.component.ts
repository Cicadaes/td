import { RouterModule, ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MainService } from '../../../../main.service';
import { ReportfolderDetailModifyService } from './reportfolder-detail-modify.service';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { msg } from '../../../../../../config/config.msg';
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { ReportfolderDetailAdvancedSearchService } from '../reportfolder-detail-advanced-search/reportfolder-detail-advanced-search.service';
import { ReportfolderDetailNewreportService } from '../reportfolder-detail-newreport/reportfolder-detail-newreport.service';
@Component({
    selector: 'reportfolder-detail-modify',
    templateUrl: './reportfolder-detail-modify.component.html',
    styleUrls: ['./reportfolder-detail-modify.component.less']
})
export class ReportfolderDetailModifyComponent implements OnInit, OnDestroy {

    isVisibleTop = false;
    isVisibleMiddle = false;
    selects = [1, 2, 3]
    single = 1;
    validateForm: FormGroup = new FormGroup({
        Name: new FormControl(),
        commit: new FormControl()
    });
    _name: any;
    _desc: any;
    regular: any;

    resetForm() {
        this.validateForm.reset();
    }
    submitForm = ($event: any, value: any) => {
        $event.preventDefault();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
        }
    };
    getFormControl(name: any) {
        return this.validateForm.controls[name];
    }
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private mainService: MainService,
        private reportfolderDetailNewreportService: ReportfolderDetailNewreportService,
        private reportfolderDetailModifyService: ReportfolderDetailModifyService,
        private _notification: CmNotificationService,
        private reportfolderDetailAdvancedSearchService: ReportfolderDetailAdvancedSearchService,
        private store: Store<{ formValidator: any }>,
    ) {
        store.select('formValidator').subscribe((data: any) => {
            this.regular = data;
        });
        this.reportfolderDetailModifyService.get(this.route.snapshot.params.id).then((response: any) => {
            this._name = response.name;
            this._desc = response.description;
            this.validateForm = this.fb.group({
                Name: [this._name, [Validators.required, this.nameValidators]],
                commit: [this._desc, []]
            });
        }).catch(err => {
            // return this._notification.error(err, "", msg['notification']['error']);
        });
    }

    // 表单初始
    initForm() {
        this.reportfolderDetailModifyService.get(this.route.snapshot.params.id).then((response: any) => {
            this.validateForm = this.fb.group({
                Name: [response.name, [Validators.required, this.nameValidators]],
                commit: [response.description]
            });
        }).catch(err => {
            // return this._notification.error(err, "", msg['notification']['error']);
        });
    }
    // 名称验证
    nameValidators = (control: FormControl): any => {
        const Name_REGEXP = new RegExp(this.regular.name.regexp);
        if (!control.value) {
            return { name: false, length: false, required: true }
        } else if (control.value.length > 255) {
            return { name: false, length: true, required: false };
        } else if (Name_REGEXP.test(control.value)) {
            return { name: true, length: false, required: false };
        }
    }

    showModalMiddle() {
        this.isVisibleMiddle = true;
    };

    handleCancelMiddle() {
        this.isVisibleMiddle = false;
        this.initForm();
    };

    saveTheDataSource(val: any) {
        if (val.commit == null) {
            val.commit = ""
        }
        let objsure: Object = {
            "name": val.Name,
            "description": val.commit,
            "id": this.route.snapshot.params.id
        }
        this.validateForm.value.Name = val.Name;
        this.validateForm.value.commit = val.commit;
        this.reportfolderDetailModifyService.update(objsure).then(response => {
            if (JSON.parse(response._body).success) {
                this.isVisibleMiddle = false;
                this.reportfolderDetailModifyService.hasSaved = true;
                this.reportfolderDetailAdvancedSearchService.homeValue({});
                this.reportfolderDetailNewreportService.updateName(val.Name);
                return this._notification.success(JSON.parse(response._body).msg, "", msg['notification']['success'])
            } else {
                return this._notification.error(JSON.parse(response._body).msg, "", msg['notification']['error'])
            }
        }).catch((err: any) => {
            // return this._notification.error(err, "", msg['notification']['error'])
        });

    }//修改

    ngOnInit() {

    }

    ngOnDestroy() {

    }

}

