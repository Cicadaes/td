import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReportcreateService } from './report-create.service';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReportAdvancedSearchService } from '../report-advanced-search/report-advanced-search.service';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { msg } from '../../../../../config/config.msg';
import { StoreModule, Store } from 'ng-cosmos-td-common';

@Component({
    selector: 'report-create',
    templateUrl: './report-create.component.html',
    styleUrls: ['./report-create.component.less'],
    providers: [FormBuilder]
})
export class ReportCreateComponent implements OnInit, OnDestroy {

    isVisibleTop: boolean = false;
    isVisibleMiddle: boolean = false;
    mesg: any = [];
    selects: any = [];
    folderId: number;
    isVisible: boolean = false;
    isConfirmLoading: boolean = false;
    validateForm: FormGroup;
    options: any = [];
    loading = false;
    index: number = 1;
    total: number;
    selectedOption: any;
    load: string = 'loading...';
    query: object = {
        page: 1,
        pageSize: 4
    }
    regular: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private reportcreateService: ReportcreateService,
        private reportAdvancedSearchService: ReportAdvancedSearchService,
        private _notification: CmNotificationService,
        private store: Store<{ formValidator: any }>,
    ) {
        store.select('formValidator').subscribe((data: any) => {
            this.regular = data;
        });
        this.validateForm = this.fb.group({
            Name: ['', [Validators.required, this.nameValidators]],
            folder: ['', [Validators.required]],
            commit: [''],
        });
    }

    nameValidators = (control: FormControl): any => {
        const Name_REGEXP = new RegExp(this.regular.name.regexp);
        if (!control.value) {
            return { name: false, length: false, required: true }
        } else if (control.value.length > 255) {
            return { name: false, length: true, required: false };
        }
        else if (Name_REGEXP.test(control.value)) {
            return { name: true, length: false, required: false };
        }
    }

    getFormControl(name: any) {
        return this.validateForm.controls[name];
    }

    submitForm = ($event: any, value: any) => {
        $event.preventDefault();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
        }
    };

    showModalTop = () => {
        this.isVisibleTop = true;
    };


    showModalMiddle = () => {
        this.isVisibleMiddle = true;
        this.initRefolder(1)
    };


    handleOkTop = (e: any) => {
        this.isVisibleTop = false;
    };


    handleCancelTop = (e: any) => {
        this.isVisibleTop = false;
    };

    saveTheDataSource(val: any) {
        this.isConfirmLoading = true;
        this.reportcreateService.hasSaved = true;
        let that = this;
        for (var i = 0, len = this.mesg.length; i < len; i++) {
            if (val.folder == this.mesg[i].name) {
                this.folderId = this.mesg[i].id
            }
        }
        let objsure: Object = {
            "name": val.Name,
            "folderId": this.folderId,
            "status": "0",
            "description": val.commit
        }
        this.reportcreateService.create(objsure).then(response => {
            // console.log(response)
            this.isConfirmLoading = false;
            if (response.success) {
                this.isVisibleMiddle = false;
                this.validateForm.reset();
                setTimeout(() => {
                    this.router.navigate(['/main/reportconfig/reportDetail/' + response.data]);
                }, 240);
                
                // return this._notification.success(response.msg, "", msg['notification']['success']);
            } else {
                return this._notification.error(response.msg, "", msg['notification']['error']);
            }
        }).catch((err: any) => {
            // return this._notification.error(err, "", msg['notification']['error']);
        });
    }//增加


    handleCancelMiddle = (e: any) => {
        this.isVisibleMiddle = false;
        this.validateForm.reset();
    };

    scrollToBottom() {
        this.index = this.index + 1;
        let num = Math.ceil(this.total / 4);
        if (!this.loading) {
            this.loading = true;
            if (this.index == num + 1) {
                // console.log('没有数据了')
                this.load = '没有数据了';
            } else {
                setTimeout(() => {
                    this.initRefolder(this.index);
                    this.loading = false;
                }, 0);
            }

        }
    }

    ngOnInit() {
        this.selectedOption = this.options[0];
    }

    initRefolder(index: number) {
        this.query['page'] = index;
        this.selects = [];
        this.reportcreateService.query({pageSize:99999}).then((response: any) => {
            if(response){
                this.total = response.total;
                let len = response.data.length;
                for (var i = 0; i < len; i++) {
                    this.mesg.push({ name: response.data[i].name, id: response.data[i].id })
                    this.selects.push(response.data[i].name)
                    this.options.push({ value: response.data[i].id, label: response.data[i].name });
                }
            }
        }).catch((err) => {
            // return this._notification.error(err, "", msg['notification']['error'])
        })
    }

    ngOnDestroy(){

    }
}





