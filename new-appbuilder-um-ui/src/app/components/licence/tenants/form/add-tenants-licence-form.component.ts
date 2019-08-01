import { Component, OnInit, Input, Output, EventEmitter ,OnChanges , SimpleChanges} from '@angular/core';
import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';

@Component({
    selector: 'add-tenants-licence-form',
    templateUrl: './add-tenants-licence-form.component.html',
    styleUrls: ['./add-tenants-licence-form.component.css'],
    providers: [ FormBuilder]
})

export class AddTenantsLicenceFormComponent implements OnInit{
    @Input() needSubmit : boolean;
    @Input() app : any;
    @Output() onSubmit = new EventEmitter<any>();
    @Output() selectChanged=new EventEmitter<any>();
    @Input() licence : any;
    noLimit:boolean=true;
    type:string = '1';
    statusboo:boolean =true;
    validateForm: FormGroup;
    additionalAppIdSelect:any;
    isInitedForm:boolean = false;
    resultValue:any={};
    ismultiple : boolean = true;
    tenantId: any ;
    @Output() resultData=new EventEmitter<any>();

    @Input() isEdit=false;


    componentChange(value:any,fieldName:string){
        if(this.checkHasFieldName(fieldName)){
            this.validateForm.controls[fieldName].setValue(value);
        }
    }

    checkHasFieldName(fieldName:string){
        let has = false;
        for(let o in this.validateForm.controls){
            if(fieldName && fieldName == o){
                has = true;
                break;
            }
        }
        return has;
    }

    _submitForm() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[ i ].markAsDirty();
        }

        setTimeout(() => {
            this.resultData.emit(this.resultValue);
            this.onSubmit.emit(this.validateForm);
        }, 100);

    }
    constructor(private fb: FormBuilder,private route: ActivatedRoute) {
        this.tenantId =this.route.snapshot.params['tenantId'];
    }

    selectSearchAdditionalAppId(value:any,fieldName:string){
        this.componentChange(value,fieldName);
        let _this = this;
        setTimeout(function () {
            _this.selectChanged.emit(value);
        },100)
    }



    initValidateForm(){
        if(this.validateForm){
            return false;
        }
        this.validateForm = this.fb.group({
            licenceId            : [ null, [ Validators.required ]],
            statusboo            : [ null],
            validity        : [ null, [ Validators.required]],
            desc            : [ null,[Validators.maxLength(256)]]
        });
    }

    ngOnInit() {
        this.statusboo=true;
        let param={
            tenantId:this.tenantId
        }
        this.additionalAppIdSelect = {
            id:3,
            fieldName:'additionalAppId',
            fieldLabel:'关联主应用',
            fieldType:'select',
            apiData:true,
            apiUrl:'/console-api/licenceController/querySelectLicenceList',
            apiParam:param,
            initValue:'',
            selectOptions:[]
        };
    }

    getFormControl(name:string) {
        return this.validateForm.controls[ name ];
    }

    dateRangeControl(date:any){
        this.validateForm.controls["validity"].setValue(date);
    }


    initAppFormData(){
        if(this.isInitedForm){
            return false;
        }
        this.isInitedForm = true;
        if(this.app){
            for(let o in this.app){
                this.componentChange(this.app[o],o);
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.needSubmit = changes.needSubmit.currentValue || false;
        if(this.needSubmit){
            this._submitForm();
        }else{
            this.initValidateForm();
            this.initAppFormData();
        }
    }


}