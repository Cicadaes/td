import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { EditLicencePageService } from './edit-licence-page.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NzModalService } from 'ng-cosmos-ui';
@Component({
  selector: 'edit-licence-page',
  templateUrl: './edit-licence-page.component.html',
  styleUrls: ['./edit-licence-page.component.css'],
  providers: [FormBuilder]
})

export class EditLicencePageComponent implements OnInit {
  @Output() onClose = new EventEmitter<any>();
  @Input() _dataSet: any = [];
  @Input() isShow: boolean = false;
  // @Input() licence:any={};
  @Input() set licence(_licence: any) {
    this._licence = JSON.parse(JSON.stringify(_licence))
    this.__licence = JSON.parse(JSON.stringify(_licence))
  }

  private _licence: any = {}
  private __licence: any = {}

  isVisible = false;
  isConfirmLoading = false;
  isEdit = false;
  flag: boolean = true;
  errorType: number = 0;
  constructor(private fb: FormBuilder, private service: EditLicencePageService, private router: Router, private confirmServ: NzModalService) {

  }

  showModal = () => {
    this.errorType = 0;
    this.isConfirmLoading = false;
    this.isVisible = true;
    this._licence.statusboo = this._licence.status == 1 ? true : false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isShow && changes.isShow.currentValue) {
      this.isShow = changes.isShow.currentValue;
    } else {
      this.isShow = false;
    }
    if (this.isShow) {
      this.showModal();
    };
  }

  handleOk = (e: any) => {
    if (this.errorType != 0) {
      return;
    }
    //this.isNeedSubmitAddAppFormData = true;
    //this.flag=true;
    if ((this._licence.status == 1 && !this._licence.statusboo) || (this._licence.status == 0 && this._licence.statusboo)) {
      this.isVisible = false;
      //查询后台有没有已授权的租户
      let param = {
        id: this._licence.id
      }
      this.service.queryAuthTenants(param).subscribe((data: any) => {
        if (data.success == "200") {
          let tenantsList = data.result;
          if (tenantsList != null && tenantsList.length > 0) {
            this.showConfirm(tenantsList)
          } else {
            this.editLicence();
          }
        } else {
          alert(data.data)
        }
      })
    } else {
      this.editLicence();
    }

  }

  editLicence() {
    this.service.editLicence(this._licence).subscribe((data: any) => {
      if (data.success) {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
        this.onClose.emit(false);
      } else {
        alert(data.data)
      }
    })
  }

  handleCancel = (e: any) => {
    this.isVisible = false;
    this.onClose.emit(this.isVisible);
  }
  showConfirm(data: any) {
    let content = "<table><tr><th align=\"left\" width='200px'>公司名称</th> <th align=\"left\" width='200px'>状态</th></tr>";
    for (let i = 0; i < data.length; i++) {
      content += "<tr>"
      let tenant = data[i];
      content += "<td align=\"left\"  width='200px'>" + tenant.companyName + "</td>";
      if (tenant.status == 1) {
        content += "<td align=\"left\"  width='200px'>正常</td>";
      } else {
        content += "<td align=\"left\"  width='200px'>禁用</td>";
      }
      content += "</tr>"
    }
    content += "<table>"
    let _thissss = this;
    this.confirmServ.confirm({
      nzTitle: "许可证状态修改会影响到其已授权的租户，请谨慎操作",
      nzContent: content,
      nzOnOk: () => {
        _thissss.editLicence();
      },
      nzOnCancel: () => {
        _thissss.isVisible = true;
      }
    });
  }
  nzBlurEvent(value:any) {
    this.errorType = 0;
    if (value == "name") {
        if(this._licence.name.length > 256){
            this.errorType = 9;
        }
        if (this._licence.name.trim()) {
            this.cheeckLicenceNane();
        } 
        if(this._licence.name.length < 1){
            this.errorType = 1;
        }
    } 
     if (value == "desc"){
        if(this._licence.desc.length > 256){
            this.errorType = 10;
        }
    }
    
  }

  cheeckLicenceNane() {
    let param = {
      name: this._licence.name,
      id: this._licence.id,
    }
    if (this._licence.name == this.__licence.name) {
      this.errorType = 0
    } else {
      this.service.queryOneNameById(param).subscribe((data: any) => {
        if (data.success == false) {
            this.errorType = 2;
        }
      })
    }
  }

  ngOnInit() {
    if (this._licence) {
      this._licence.statusboo = this._licence.status == 1 ? true : false;
    }
  }



}
