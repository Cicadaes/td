import { Component, OnInit, OnDestroy } from '@angular/core';
import { LicencesService } from './licences.service';

@Component({
    selector: 'licences',
    templateUrl: './licences.component.html',
    styleUrls: ['./licences.component.css']
})
export class LicencesComponent implements OnInit, OnDestroy {
    licencesFieldArray:any[];
    licencesTableFieldParams : any;
    rolecode :any;
    constructor(private service: LicencesService) {

    }
    initFieldArray():void{
        if(this.rolecode=="UM_SUPER_ADMIN"){
            this.licencesFieldArray = [{
                id:1,
                fieldName:'name',
                fieldLabel:'名称',
                fieldType:'input'
            },{
                id:2,
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
                id:3,
                fieldName:'updateUserName',
                fieldLabel:'更新人',
                fieldType:'input'
            },{
                id:4,
                fieldName:'updateTimeRange',
                fieldLabel:'更新时间',
                fieldType:'date-range'
            }];
        }
        if(this.rolecode=="UM_OPER_ADMIN"){
            this.licencesFieldArray = [{
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
            }];
        }
    }
    ngOnInit() {
        this.rolecode=window['appConfig'].rolecode;
        this.initFieldArray();
    }
    onSearchList(params:any){
        this.licencesTableFieldParams = params;
    }
    ngOnDestroy() {

    }

}