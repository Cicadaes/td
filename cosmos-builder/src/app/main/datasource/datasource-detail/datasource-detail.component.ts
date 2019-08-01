import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MainService } from '../../main.service';
import { Observable } from 'rxjs';

import { DatasourceDetailService } from './datasource-detail.service';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';


@Component({
    selector: 'datasource-detail',
    templateUrl: './datasource-detail.component.html',
    styleUrls: ['./datasource-detail.component.less'],
    providers: [FormBuilder]
})
export class DatasourceDetailComponent implements OnInit, OnDestroy {
    title: Array<any>;
    metadataId: any;
    id: number;
    datasourceDeta: any = {};//数据源详情
    status: any;
    validateForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private mainService: MainService,
        private datasourceDetailService: DatasourceDetailService,
        private _notification: CmNotificationService
    ) {
        this.id = this.route.snapshot.params.id;

        this.metadataId = this.route.params['value']['id'];

        this.title = this.route.snapshot.data['title'];

        this.title[1]['url'] = `datasource/${this.route.snapshot.url[0]['path']}/${this.metadataId}`;

        this.validateForm = this.fb.group({
            state: [''],
        })

    }

    ngOnInit() {
        this.changeTitle(this.title);
        this.datasourceDetailService.get(this.id).then((response: any) => {
            this.datasourceDeta = response;
            this.status = this.datasourceDeta.status == "1" ? true : false;
        }).catch((err: any) => {
            // this._notification.error("错误", err);
        });

    }
    ngOnDestroy() {

    }

    getFormControl(name: any) {
        return this.validateForm.controls[name];
    }

    changeTitle(title: Array<any>) {
        setTimeout(() => {
            this.mainService.titleMission(title);
        }, 0);
    }
}