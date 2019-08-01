import { Component, OnInit, Input, Output, EventEmitter ,OnChanges , SimpleChanges} from '@angular/core';
import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms';
import { DetailTenantLicenceService } from './detail-tenant-licence.service';
import {Router,ActivatedRoute} from "@angular/router";

@Component({
    selector: 'detail-tenant-licence',
    templateUrl: './detail-tenant-licence.component.html',
    styleUrls: ['./detail-tenant-licence.component.css'],
    providers: [ FormBuilder]
})

export class DetailTenantLicenceComponent implements OnInit{
    @Output() onClose = new EventEmitter<any>();
    noLimit:boolean=true;
    noEdit:boolean=true;
    initDateRange:any[] = [null, null];
    _dataSet: any=[];
    selectedId:any;
    status = true;
    name = "";
    desc = "";
    licence :any={};
    isNeedSubmitAddAppFormData:boolean;
    additionalAppIdSelect:any;
    @Input() isedit: boolean = false;
    isShowLicenceAppModal:boolean = false;
    currentData : any;
    queryParams:any;
    licencesTableFieldParams: any;
    licenceId:any;
    tenantId:any;
    id: number;
    tenantLicence:any;

    constructor(private fb: FormBuilder,private service:DetailTenantLicenceService,private router: Router,private route: ActivatedRoute) {
        this.tenantId =this.route.snapshot.params['tenantId'];
        this.id=this.route.snapshot.params['id'];
    }


    submitAddAppForm(data:any){
        if(this._dataSet.length==0){
            alert("无属性信息！");
        }else{
            data.value.tenantLicenceAttributeList=this._dataSet;
            data.value.licenceId=this.licenceId;
            data.value.tenantIds=this.tenantId;
            this.isNeedSubmitAddAppFormData = false;
            if(data.status == 'VALID'){
                this.service.addLicence(data.value).then((data: any) => {
                    this.onClose.emit(false);
                    this.router.navigate(['/tenants/tenantsLicences',this.tenantId]);
                }).catch((err:any)=>{
                    console.log(err);
                });
            }
        }
    }
    handleOk = (e: any) => {
        this.tenantLicence.tenantLicenceAttributeList=this._dataSet;
        this.service.updateTenantLicence(this.tenantLicence).then((data: any) => {
            this.onClose.emit(false);
            this.router.navigate(['/tenants/tenantsLicences',this.tenantId]);
        }).catch((err:any)=>{
            console.log(err);
        });

    }



    selectSearchAdditionalAppId(value:any,fieldName:string){
        if(value){
            this.selectedId=value.id;
            //alert(this.selectedId);
            //加载应用功能集合
        }

    }

    ngOnInit() {
        this.queryData();
    }
    queryData(){
        let params={
            id:this.id
        };
        this.service.getLicence(params).then((data: any) => {
            this.tenantLicence=data.result;
            if( this.tenantLicence){
                this.initDateRange[0]=this.tenantLicence.startDate;
                this.initDateRange[1]=this.tenantLicence.endDate;
                this.tenantLicence.validity[0] = new Date(this.tenantLicence.startDate);
                this.tenantLicence.validity[1] = new Date(this.tenantLicence.endDate);
                this.getTenantsLicencesAttributes();
            }
        }).catch((err:any)=>{
            console.log(err);
        });
    }

    showAddAppModal(){
        this.isShowLicenceAppModal = true;
    }

    hideAddAppModal(){
        this.isShowLicenceAppModal = false;
    }

    editAttribute(data:any){
        this.isShowLicenceAppModal = true;
        this.isedit=true;
        this.currentData=data;
    }

    dateRangeControl(date:any){
        this.tenantLicence.validity=date;
    }

    refreshData() {
        let params = {};
    }
    submitTbleData(data:any){
        this._dataSet=data;
    }

    getTenantsLicencesAttributes(){
        let params = this.queryParams || {};
        params.tenantId=this.tenantLicence.tenantId;
        params.tenantLicenceId=this.tenantLicence.id;
        this.service.getTenantsLicencesAttributes( params).then((data: any) => {
            this._dataSet = data.result;
        }).catch((err:any)=>{
            console.log(err);
        });
    }

}