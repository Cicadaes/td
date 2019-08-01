import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { MainService } from '../../../main.service';
import { ReportfoldercreateService } from './reportfolder-create.service';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReportfolderAdvancedSearchService } from '../reportfolder-advanced-search/reportfolder-advanced-search.service';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { msg } from '../../../../../config/config.msg';
import { StoreModule, Store } from 'ng-cosmos-td-common';

@Component({
    selector: 'reportfolder-create',
    templateUrl: './reportfolder-create.component.html',
    styleUrls: ['./reportfolder-create.component.less'],
    providers: [FormBuilder]
})
export class ReportfolderCreateComponent implements OnInit, OnDestroy {
    isVisibleTop = false;
    isVisibleMiddle = false;
    validateForm: FormGroup;
    regular: any;

    getFormControl(name: any) {
        return this.validateForm.controls[name];
    }
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private mainService: MainService,
        private reportfoldercreateService: ReportfoldercreateService,
        private reportfolderAdvancedSearchService: ReportfolderAdvancedSearchService,
        private _notification: CmNotificationService,
        private store: Store<{ formValidator: any }>,
    ) {
        store.select('formValidator').subscribe((data: any) => {
            this.regular = data;
        });
        this.validateForm = this.fb.group({
            Name: ['', [Validators.required,this.nameValidators]],
            commit: ['']
        });
    }

    nameValidators = (control: FormControl): any => {
        const Name_REGEXP = new RegExp(this.regular.name.regexp);
        if (!control.value) {
            return {  name: false, length: false,required:true  }
        } else if (control.value.length > 255) {
            return { name: false, length: true,required:false };  
        }
         else if (Name_REGEXP.test(control.value)) {
            return { name: true, length: false, required:false  };
        }
    }

    showModalTop = () => {
        this.isVisibleTop = true;
    }

    showModalMiddle = () => {
        this.isVisibleMiddle = true;
    }

    handleCancelMiddle = (e: any) => {
        this.isVisibleMiddle = false;
        this.validateForm.reset();
    }
    resetForm() {
        this.validateForm.reset();
    }

    saveTheDataSource(val: any) {
        let objsure: Object = {
            "name": val.Name,
            "description": val.commit
        }
        this.reportfoldercreateService.create(objsure).then(response => {
            if (response.success) {
                this.reportfolderAdvancedSearchService.homeValue({});
                this.isVisibleMiddle = false;
                this.validateForm.reset();
                return this._notification.success(response.msg, "", msg['notification']['success'])
            } else {
                return this._notification.error(response.msg, "", msg['notification']['error'])
            }
        }).catch((err: any) => {
            // return this._notification.error(err, "", msg['notification']['error'])
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {

    }

}

