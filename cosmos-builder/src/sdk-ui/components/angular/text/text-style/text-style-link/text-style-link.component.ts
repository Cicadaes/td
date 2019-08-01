import { Component, OnInit, OnDestroy, Input, ElementRef, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { textLinkService } from './text-style-link.service';
import { Subscription } from 'rxjs/Subscription';
import { DataStore } from 'cosmos-td-sdk';
import { ConfigApi } from '../../../../../api/config-api';
import { ReportConfigService } from '../../../../../../sdk-ui/service/report-config.service';



@Component({
    selector: 'text-link',
    templateUrl: './text-style-link.component.html',
    styleUrls: ['./text-style-link.component.less'],
    providers: [FormBuilder]
})
export class textLinkComponent implements OnInit {

    private subscription: Subscription;
    private filter: any;
    private DaTa: any;
    private Value: any;
    isVisibleMiddle: boolean = false;
    isConfirmLoading: boolean = false;
    content: any;    //标题
    link: any = {
        content: "",
        site: "",
        dataLabel: "true"
    }



    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private _notification: CmNotificationService,
        private store: Store<{ formValidator: any }>,
        private textLinkService: textLinkService,
        public configApi: ConfigApi,
    ) {
        this.subscription = this.textLinkService.missionshowSource$.subscribe((data: any) => {
            this.showModalMiddle()
            if (data) {
                this.link = {
                    content: data['text'],
                    site: data['link'],
                    dataLabel: data['target']
                }
            } else {
                this.link = {
                    content: "",
                    site: "",
                    dataLabel: "true"
                }
            }
        });
    }
    showModalMiddle() {             //显示
        this.isVisibleMiddle = true;
    };
    /**
     *  确定
     * @param val
     */
    saveTheDataSource(val: any) {
        let table = this.deepCopy(val);
        this.textLinkService.SAVE(table)
        this.isVisibleMiddle = false;
    }
    /**
     * 取消
     */
    handleCancelMiddle(e: any) {
        this.isVisibleMiddle = false;
    };

    ngOnInit() {
    }
    funnelChanges() {
    }
    // 深拷贝
    private deepCopy(data: any): any {
        let json = JSON.stringify(data);
        return JSON.parse(json);
    }
}





