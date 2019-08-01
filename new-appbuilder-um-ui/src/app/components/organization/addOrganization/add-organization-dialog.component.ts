import { Component, Input, Output, EventEmitter,OnChanges , SimpleChanges} from '@angular/core';
import { AddOrganizationDialogService } from './add-organization-dialog.service';

@Component({
    selector: 'add-organization-dialog',
    templateUrl: './add-organization-dialog.component.html',
    styleUrls: ['./add-organization-dialog.component.css']
})
export class AddOrganizationDialogComponent {
    @Input() queryParams : any;
    @Input() _dataSet : any;
    @Input() action : boolean;
    @Input() isedit:boolean=false;
    @Input() currentData : any;
    @Input() isShow:boolean = false;
    @Input() oldOrganization :any;
    @Input() checkedData:any;
    @Output() onClose = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();
    organization :any;
    parentId:any;
    parentName:any;
    id:string="";
    name:string="";
    desc:string="";

    isVisible = false;
    isConfirmLoading = false;
    errorCode:number=0;
    title: any;

    showModal = () => {
        if(!this.isedit){
            this.id="";
            this.name="";
            this.desc="";
            this.title = '新增组织机构';
        }else{
            this.id=this.checkedData.id;
            this.name=this.checkedData.name;
            this.desc=this.checkedData.desc;
            this.title = '编辑组织机构';
            this.queryOrganization();
        }
        this.isConfirmLoading = false;
        this.isVisible = true;
        //this.queryParent();
    }
    queryOrganization(){
        let organization: any ={};
        organization.id=this.id;
        this.service.queryOrganization(organization).subscribe((data: any) => {
            if(data.success){
                this.oldOrganization.name=data.result.parentName;
            }
        })
    }
    queryParent(){
        if(this.organization){
            this.parentId=0;
            //this.
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        if(changes.isShow && changes.isShow.currentValue){
            this.isShow = changes.isShow.currentValue;
        }else{
            this.isShow = false;
        }
        if(this.isShow){
            this.showModal();
        }
    }


    submitOrganiztion = (data: any) => {
        this.errorCode=0;
        if(this.name.length > 256){
            this.errorCode=9;
            return;
        }
        if(this.desc.length > 256){
            this.errorCode=10;
            return;
        }
        if(!this.name){
            this.errorCode=1;
            return;
        }
        
        var organization: any ={};  
        organization.name=this.name.replace(/(^\s*)|(\s*$)/g, "");  // 过滤前后 .replace(/(^\s*)|(\s*$)/g, "");
        organization.desc=this.desc;
        organization.tenantId=this.oldOrganization.tenantId;
        organization.parentId=this.oldOrganization.id;//第一级为0
        if(this.isedit){
            organization.id=this.id;
            //organization.id=this.currentData.id
            delete organization.parentId
        }
        if(this.checkedData){
            organization.tenantId=this.checkedData.tenantId;
        }
        this.service.addOrganization(organization).subscribe((data: any) => {
            if(data.success){
                this.isVisible = false;
               /* this.onClose.emit(this.isVisible);
                this.onClose.emit(false);*/
                this.onSubmit.emit(data.data);
            }else{
                this.errorCode=data.msg;
                //(data.msg);
            }
        })
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    constructor(private service: AddOrganizationDialogService) {

    }

}
