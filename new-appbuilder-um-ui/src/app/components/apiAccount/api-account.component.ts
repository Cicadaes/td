import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollToTopService } from '../../@themes/scroll-service';
import { ApiAccountService } from './api-account.service';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';
import * as _ from 'lodash';

@Component({
    selector: 'app-api-account',
    templateUrl: './api-account.component.html',
    styleUrls: ['./api-account.component.css']
})
export class ApiAccountComponent implements OnInit {
    tenantId: any;
    rolecode: any;
    constructor(
        private service: ApiAccountService,
        private activeRoute: ActivatedRoute,
        private scrollSer: ScrollToTopService,
        private modalService: NzModalService,
        private nzNotificationService: NzNotificationService) {
            this.rolecode = window['appConfig'].rolecode;
            this.tenantId = this.activeRoute.snapshot.params['tenantId'];
        if (this.rolecode === 'UM_TENANT_ADMIN') {
            this.tenantId = window['appConfig'].tenant.id;
        }
        console.log('this.tenantId', this.tenantId, this.rolecode);
    }

    ngOnInit() { }

}
