import { Component, OnInit, OnDestroy } from '@angular/core';
import { TenantDetailService } from './tenant-detail.service';
import {ActivatedRoute, NavigationEnd, ParamMap} from '@angular/router';

@Component({
    selector: 'app-tenant-detail',
    templateUrl: './tenant-detail.component.html',
    styleUrls: ['./tenant-detail.component.css']
})
export class TenantDetailComponent implements OnInit, OnDestroy {
    tenantId: number;
    tenantDetails: any = {};
    constructor(private service: TenantDetailService,
        private route: ActivatedRoute ) {

    }

    getTenantDetails() {
        this.service.getTenantDetailById(this.tenantId).then((data: any) => {
            if (data.success) {
                this.tenantDetails = data.data;
            }
        });
    }

    ngOnInit() {
        this.tenantId = this.route.snapshot.params['tenantId'];
        this.getTenantDetails();
    }

    ngOnDestroy() {

    }
}
