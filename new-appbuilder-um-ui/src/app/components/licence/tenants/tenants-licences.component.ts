import { Component, OnInit, OnDestroy } from '@angular/core';
import { TenantsLicencesService } from './tenants-licences.service';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';

@Component({
    selector: 'tenants-licences',
    templateUrl: './tenants-licences.component.html',
    styleUrls: ['./tenants-licences.component.css']
})
export class TenantsLicencesComponent implements OnInit, OnDestroy {
    licencesFieldArray:any[] = [{
        id:1,
        fieldName:'name',
        fieldLabel:'名称',
        fieldType:'input'
    },{
        id:3,
        fieldName:'status',
        fieldLabel:'状态',
        fieldType:'select',
        apiData:false,
        initValue:'',
        selectOptions:[{
            value:'',
            label:'全部'
        },{
            value:'1',
            label:'正常'
        },{
            value:'0',
            label:'禁用'
        }]
    },{
        id:4,
        fieldName:'createTimeRange',
        fieldLabel:'有效期',
        fieldType:'date-range'
    }];
    licencesTableFieldParams : any;
    tenantId:any;
    rolecode:any;
    constructor(private service: TenantsLicencesService,private route: ActivatedRoute) {
        this.tenantId =this.route.snapshot.params['tenantId'];
        if(this.rolecode=="UM_TENANT_ADMIN"){
            this.tenantId=window['appConfig'].tenant.id;
        }
        //console.dir(this.tenantId);
        //rolecode
    }

    ngOnInit() {
        this.rolecode=window['appConfig'].rolecode;
    }
    onSearchList(params:any){
        this.licencesTableFieldParams = params;
    }
    ngOnDestroy() {

    }

}