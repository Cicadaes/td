import { RouterModule, ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReportModifyService } from './report-modify.service';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { msg } from '../../../../../../config/config.msg';
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { ReportAdvancedSearchService } from '../../report-advanced-search/report-advanced-search.service';
@Component({
    selector: 'report-modify',
    templateUrl: './report-modify.component.html',
    styleUrls: ['./report-modify.less']
})
export class ReportModifyComponent implements OnInit, OnDestroy {

    isVisibleTop = false;
    isVisibleMiddle = false;
    validateForm: FormGroup = new FormGroup({
        Name: new FormControl(),
        commit: new FormControl()
    });
    _name: any;
    _desc: any;
    regular: any;
    _data:any;

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
        private _notification: CmNotificationService,
        private store: Store<{ formValidator: any }>,
        private reportModifyService:ReportModifyService,
        private reportAdvancedSearchService:ReportAdvancedSearchService
    ) {
        store.select('formValidator').subscribe((data: any) => {
            this.regular = data;
        });
        this.reportModifyService.missionUpdateReport$.subscribe((data:any) => {
            if(data.status==0){
                this._data = data;
                this.showModalMiddle();
                this._name = data.name;
                this._desc = data.description;
                this.validateForm = this.fb.group({
                    Name: [this._name, [Validators.required, this.nameValidators]],
                    commit: [this._desc, []]
                });
            }
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
    };

    saveTheDataSource(val: any) {
        if (val.commit == null) {
            val.commit = ""
        }
        let objsure: Object = {
            "name": val.Name,
            "description": val.commit,
            "id": this._data.id,
            "folderId":this._data.folderId,
            "status":this._data.status
        }
        this.validateForm.value.Name = val.Name;
        this.validateForm.value.commit = val.commit;
        this.reportModifyService.update(objsure).then(response => {
            if (JSON.parse(response._body).success) {
                this.isVisibleMiddle = false;
                this.reportAdvancedSearchService.homeValue({});
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

