import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit} from '@angular/core';
import { LicenceBasicInfoService } from './licence-basicInfo.service';
import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms';

@Component({
    selector: 'licence-basicInfo',
    templateUrl: './licence-basicInfo.component.html',
    providers: [ FormBuilder]
})
export class LicenceBasicInfoComponent implements OnInit{
    @Input() needSubmit : boolean;
    @Input() queryParams : any;
    @Input() _dataSet : any;
    @Input() app : boolean;
    @Input() isShow:boolean = false;
    @Output() onClose = new EventEmitter<any>();
    //appAttribute: any = [];
    code:string="";
    name:string="";
    defaultValue:string="";

    isVisible = false;
    isConfirmLoading = false;

    showModal = () => {
        this.code="";
        this.name="";
        this.defaultValue="";
        this.isConfirmLoading = false;
        this.isVisible = true;
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


    submitAttribute = (data: any) => {
        var appAttribute: any = {};
        var isAdd:number = 0;
        appAttribute.code = this.code;
        appAttribute.name = this.name;
        appAttribute.defaultValue = this.defaultValue;
        this._dataSet = this._dataSet || [];
        for(var i = this._dataSet.length-1 ; i >= 0 ; i-- ) {
            var p = this._dataSet[i];
            if(p.code == this.code || p.name == this.name) {
                isAdd=1;
            }
        }
        if ( !this.code || !this.name) {
            isAdd = 2;
        }
        if (isAdd == 0) {
            this._dataSet.push(appAttribute);
            this.isVisible = false;
            this.onClose.emit(this.isVisible);
            this.onClose.emit(false);
        }else if (isAdd == 1) {
            alert("功能类型代码或名称不能重复！");
        }else if (isAdd == 2){
            alert("功能类型代码或名称不能为空！");
        }

        //alert(this.queryParams.id);
        //data.value.appId=this.queryParams.id;
        //if(data.status == 'VALID'){
            /*this.service.addAppAtttibute(data.value,this.queryParams.id).subscribe((data: any) => {
                this.isVisible = false;
                this.onClose.emit(this.isVisible);
                alert("添加成功");
                //this.onClose.emit(false);
            })*/
        //}
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }

    constructor(private service: LicenceBasicInfoService) {

    }

    ngOnInit() {
        /*this.code="";
        this.name="";
        this.defaultValue="";*/
    }
}