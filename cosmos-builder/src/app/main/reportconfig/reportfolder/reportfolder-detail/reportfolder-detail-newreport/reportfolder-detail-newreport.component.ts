import { RouterModule, ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { ReportfolderDetailNewreportService } from './reportfolder-detail-newreport.service';
import { ReportAdvancedSearchService } from '../../../report/report-advanced-search/report-advanced-search.service';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { msg } from '../../../../../../config/config.msg';
import { Subscription } from 'rxjs/Subscription';
import { StoreModule, Store } from 'ng-cosmos-td-common';

@Component({
    selector: 'reportfolder-detail-newreport',
    templateUrl: './reportfolder-detail-newreport.component.html',
    styleUrls: ['./reportfolder-detail-newreport.component.less']
})
export class ReportfolderDetailNewreportComponent implements OnInit {
    id: number;
    folderId: number;
    folderName: any;
    isVisibleTop = false;
    isVisibleMiddle = false;
    subscription: Subscription;//重复订阅问题
    selects = [1, 2, 3]
    single = 1;
    regular: any;
    validateForm: FormGroup;

    getFormControl(name: any) {
        return this.validateForm.controls[name];
    }
    resetForm() {
        this.validateForm.reset();
    }

    submitForm = ($event: any, value: any) => {
        $event.preventDefault();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
        }
    };

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private reportfolderDetailNewreportService: ReportfolderDetailNewreportService,
        private reportAdvancedSearchService: ReportAdvancedSearchService,
        private _notification: CmNotificationService,
        private store: Store<{ formValidator: any }>,
    ) {
        store.select('formValidator').subscribe((data: any) => {
            this.regular = data;
        });
        this.validateForm = this.fb.group({
            folderName: ['', [Validators.required, this.nameValidators]],
            commit: ['']
        });
        this.subscription = this.reportfolderDetailNewreportService.missionGrabble$.subscribe((name: any) => {
            this.folderName = name;
        });

    }

    nameValidators = (control: FormControl): any => {
        const FOLDERname_REGEXP = new RegExp(this.regular.name.regexp);
        if (!control.value) {
            return { folderName: false, length: false, required: true }
        } else if (control.value.length > 255) {
            return { folderName: false, length: true, required: false };
        }
        else if (FOLDERname_REGEXP.test(control.value)) {
            return { folderName: true, length: false, required: false };
        }
    }

    ngOnInit() {
        this.id = this.route.snapshot.params.id;
        this.reportfolderDetailNewreportService.get(this.id).then((response: any) => {
            this.folderName = response.name;
        }).catch(err => {
            // return this._notification.error(err, "", msg['notification']['error'])
        });
    }

    showModalTop = () => {
        this.isVisibleTop = true;
    };
    showModalMiddle = () => {
        this.isVisibleMiddle = true;
    };
    handleCancelTop = (e: any) => {
        this.isVisibleTop = false;
    };
    saveTheDataSource(val: any) {
        let objsure: Object = {
            "name": val.folderName,
            "folderId": this.id,
            "status": "0",
            "description": val.commit
        }
        this.reportfolderDetailNewreportService.create(objsure).then(response => {
            if (response.success) {
                this.isVisibleMiddle = false;
                this.validateForm.reset();
                this.router.navigate(['/main/reportconfig/reportDetail/' + response.data]);
                return this._notification.success(response.msg, "", msg['notification']['success'])
            } else {
                return this._notification.error(response.msg, "", msg['notification']['error'])
            }
        }).catch((err: any) => {
            // return this._notification.error(err, "", msg['notification']['error'])
        });
    }//增加


    handleCancelMiddle = (e: any) => {
        this.isVisibleMiddle = false;
        this.validateForm.reset();
    };

}

