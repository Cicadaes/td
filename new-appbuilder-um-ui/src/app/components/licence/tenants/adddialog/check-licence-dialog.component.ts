import { Component, OnInit, Input, Output, EventEmitter ,OnChanges , SimpleChanges} from '@angular/core';
import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms';
import {CheckLicenceDialogService} from './check-licence-dialog.service';
import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';

@Component({
    selector: 'check-licence-dialog',
    templateUrl: './check-licence-dialog.component.html',
    styleUrls: ['./check-licence-dialog.component.css'],
    providers: [ FormBuilder]
})

export class CheckLicenceDialogComponent implements OnInit{
    @Output() onClose = new EventEmitter<any>();
    @Input() _dataSet: any = [];
    @Input() _licencedata: any = [];
    @Input() isShow:boolean = false;
    @Input() licence:any={};
    isVisible = false;
    isConfirmLoading = false;
    isEdit = false;
    constructor(private fb: FormBuilder,private service:CheckLicenceDialogService,private router: Router) {

    }

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = true;
        //this.licence.statusboo=this.licence.status==1 ? true:false;
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.isShow && changes.isShow.currentValue){
            this.isShow = changes.isShow.currentValue;
        }else{
            this.isShow = false;
        }
        if(this.isShow){
            this.showModal();
        };
    }

    handleOk = (e: any) => {
        //this.isNeedSubmitAddAppFormData = true;
        this.service.editLicence(this.licence).subscribe((data: any) => {
            if(data.success){
                this.isVisible = false;
                this.onClose.emit(this.isVisible);
                this.onClose.emit(false);
            }else{
                alert(data.data)
            }
        })
    }
    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }
    ngOnInit() {
        if(this.licence){
            this.licence.statusboo=this.licence.status==1 ? true:false;
        }
    }



}