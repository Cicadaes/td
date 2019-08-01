import { Component, OnInit, Input, Output, EventEmitter ,OnChanges , SimpleChanges} from '@angular/core';
import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms';
import {Router,ActivatedRoute} from "@angular/router";
import {AddTenantLicenceService} from "./add-tenant-licence.service";
import { NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'add-tenant-licence',
    templateUrl: './add-tenant-licence.component.html',
    styleUrls: ['./add-tenant-licence.component.css'],
    providers: [ FormBuilder]
})

export class AddTenantLicenceComponent implements OnInit,OnChanges{
    @Output() onClose = new EventEmitter<any>();
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
    _licencedata:any=[];
    isShowLicenceModal:boolean = false;
    submitFlag:boolean = true;
    datasetFlag:boolean = true;

    constructor(private fb: FormBuilder,private service:AddTenantLicenceService,private router: Router,private route: ActivatedRoute,private confirmServ: NzModalService) {
        this.tenantId =this.route.snapshot.params['tenantId'];
    }


    submitAddAppForm(data:any){
        if(!this.submitFlag){
            this.showDialog("请重新选择许可证");
            this.isNeedSubmitAddAppFormData = false;
        }else{
            this.check_dataSet();
            if(!this.datasetFlag){
                this.isNeedSubmitAddAppFormData = false;
                return;
            }
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
        this.isNeedSubmitAddAppFormData = true;
    }

    submmitLicence = (data: any) => {
        this.licence.name=this.name;
        this.licence.statusboo=this.status;
        this.licence.desc=this.desc;
        this.licence.licenceAttributeList=this._dataSet;
        data.value.tenantLicenceAttributeList=this._dataSet;
        data.value.licenceId=this.licenceId;
        this.service.addLicence(this.licence).then((data: any) => {
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

    selectDataChanged(data:any){
        //let olicenceId=this.licenceId
        if( this.licenceId!=data){
            this.licenceId=data;
            console.dir(this.licenceId);
            this.checkTenantLicence(this.licenceId);
            //查询许可证信息，将描述字段回显
            this.queryLicence();

        }
    }

    queryLicence(){
        let param ={
            id:this.licenceId
        }
        this.service.queryLicence(param).then((data: any) => {
            if(data.success=="200"){
                this.licence.desc=data.result.desc;
            }
        }).catch((err:any)=>{
            console.log(err);
        });
    }

    checkTenantLicence(data:any){
        // let _this_=this;
        let param ={
            licenceId:this.licenceId,
            tenantId:this.tenantId
        }
        this.service.checkTenantLicence(param).then((data: any) => {
            if(data.success=="200"){
                this.submitFlag=true;
                let code = data.result.code;
                if(code=="1" ||code=="3"){
                    this.submitFlag=false;
                    //alert(data.result.msg);
                    this.showDialog(data.result.msg);
                }
                if(code=="2"){
                    this.submitFlag=false;
                    this._licencedata=data.result.listLicence;
                    //this.isShowLicenceModal = true;
                    this.showLicenceDialog(data.result.msg);
                }
            }
        }).catch((err:any)=>{
            console.log(err);
        });
    }
    ngOnInit() {
    }

    addLicenceAttribute(){
        this.isedit=false;
        this.showAddAppModal();
    }


    showAddAppModal(){
        this.isShowLicenceAppModal = true;
    }

    hideAddAppModal(){
        this.isShowLicenceAppModal = false;
    }

    hideCheckedModal(){
        this.isShowLicenceModal = false;
    }

    editAttribute(data:any){
        this.isShowLicenceAppModal = true;
        this.isedit=true;
        this.currentData=data;
    }


    refreshData() {
        let params = {};
    }
    submitTbleData(data:any){
        this._dataSet=data;
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.queryParams){
            this.queryParams = changes.queryParams.currentValue || {};
        }
        if(changes.licenceId){
            //console.dir("dadadad"+this.licenceId);
        }
    }
    check_dataSet(){
        this.datasetFlag=true;
        if(this._dataSet){
            for(let i=0;i<this._dataSet.length;i++){
                let defalutValue = this._dataSet[i].defalutValue;
                if(!defalutValue){
                    this.datasetFlag=false;
                    this.showDialog("请输入Value(默认值)");
                    break;
                }
            }
        }
    }

    showDialog(msg:any){
        this.confirmServ.warning({
            nzTitle: "提示",
            nzContent:msg,
            nzOnCancel: () => {
            }
        });
    }

    showLicenceDialog(msg:any){
        let content="您所选择的许可证授权的应用类型为增值包，系统检测到您还没有为该增值包选择依赖的主应用，请重新选择。\n" +"<br>"+
            "以下为满足依赖条件的许可证，供您参考："+"<br>"+"<br>";
        for(let i=0;i<this._licencedata.length;i++){
            let name = this._licencedata[i].name;
            content+="<span><span color='blue'>"+name+"</span></span><br>";
        }
        this.confirmServ.error({
            nzTitle: "增值包不能单独授权给租户",
            nzContent: content,
            nzOnCancel: () => {
            }
        });
    }



    handleCancle = (e: any) => {
        this.onClose.emit(false);
        this.router.navigate(['/tenants/tenantsLicences',this.tenantId]);
    }



}