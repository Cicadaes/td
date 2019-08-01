import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ReportPublishService } from './report-publish.service';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { msg } from '../../../../../config/config.msg';

@Component({
    selector: 'report-publish',
    templateUrl: './report-publish.component.html',
    styleUrls: ['./report-publish.component.less']
})
export class ReportPublishComponent implements OnInit {
    isVisible = false;
    subscription: Subscription;
    title: string;
    publish: string;
    params: any;
    validateForm: FormGroup;
    publishOption: Array<any> = [];

    constructor(
        private reportPublishService: ReportPublishService,
        private fb: FormBuilder,
        private _notification: CmNotificationService,
    ) {
        this.subscription = this.reportPublishService.missionpublishReport$.subscribe((obj: any) => {
            this.title = obj.name;
            this.params = {
                "id": obj.id,
                "appCode": "",
                "desc": obj.description,
                "functionCode": null,
                "functionParentId": 0,
                "funtionName": obj.name,
                "uri": `${window.location.origin}${window.location.pathname}#/publish/${obj.id}`
            }
            this.showModal();
        });
        this.validateForm = this.fb.group({
            publish: ['', [Validators.required]],
        });
    }

    ngOnInit() {
        // 获取um列表
        this.reportPublishService.getList().then((response: any) => {
            let data = JSON.parse(response._body);
            for (let i = 0; i < data.length; i++) {
                this.publishOption.push({
                    value: data[i].appCode,
                    label: data[i].name
                })
            }
        }).catch(err => {
            // return this._notification.error(err, "", msg['notification']['error'])
        });
    }



    showModal = () => {
        this.isVisible = true;
    }


    handleOk = (e: any) => {
        this.isVisible = false;
        this.params['appCode'] = this.publish;
        this.reportPublishService.ispublishReportOK(this.params);
        this.resetForm();
    }


    handleCancel = (e: any) => {
        this.isVisible = false;
        this.resetForm();
    }

    selectChange(value: any) {
    }

    resetForm() {
        this.validateForm.reset();
    }

}

