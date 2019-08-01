import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddAppPageService } from './add-app-page.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
  selector: 'add-app-page',
  templateUrl: './add-app-page.component.html',
  styleUrls: ['./add-app-page.component.css'],
  providers: [FormBuilder]
})

export class AddAppPageComponent implements OnInit {
  @Output() onClose = new EventEmitter<any>();
  @Input() _dataSet: any = [];
  @Input() _extendDate: any = [];
  isNeedSubmitAddAppFormData: boolean;
  selectedIds: any;
  iconId: any;
  resultData: any = {};
  errorFlag =  false;
  errorFlagMax =  false;
  constructor(private fb: FormBuilder, private service: AddAppPageService, private router: Router, private confirmServ: NzModalService) {

  }
  submitAddAppForm(data: any) {
    // if(this._dataSet.length==0){
    //     alert('请添加功能类型！');
    // }else{
    data.value.appAttribute = this._dataSet;
    data.value.appExtendAttributeList = this._extendDate;
    this.isNeedSubmitAddAppFormData = false;
    if (this.resultData) {
      data.value.additionalAppIds = this.resultData.selectedIds;
      data.value.appIcon = this.resultData.iconId;
      data.value.icon = this.resultData.icon;

      data.value.additionalAppIds = this.resultData.selectedIds;
      data.value.appIcon = this.resultData.iconId;
      data.value.largeIcon = this.resultData.largeIcon;
      if (data.value.type === 2 && (this.resultData.selectedIds === null || this.resultData.selectedIds.length === 0)) {
        this.showDialog('请选择主应用');
        return;
      }
    }
    if (data.value.type === '1') {
      if (!this.resultData.icon) {
        this.errorFlag = true;
        return;
      }
    }
    if (data.value.type === '1') {
      if (!this.resultData.largeIcon) {
        this.errorFlagMax = true;
        return;
      }
    }
    if (data.status === 'VALID') {
      if (data.value && (data.value.status || data.value.status === 1)) {
        data.value.status = 1;
      } else {
        data.value.status = 0;
      }
      this.service.addApp(data.value).subscribe((data1: any) => {
        if (data1.success === 200) {
          this.onClose.emit(false);
          this.router.navigate(['/apps/detailAppPage', data1.result]);
        } else {
          alert(data1.result);
        }
      });
    }
    // }
  }

  submitResultData(data: any) {
    this.resultData.selectedIds = data.selectedIds;
    this.resultData.iconId = data.iconId;
    this.resultData.icon = data.icon;
    this.resultData.selectedIds = data.selectedIds;
    this.resultData.iconId = data.iconId;
    this.resultData.largeIcon = data.largeIcon;
  }
  handleOk = (e: any) => {
    this.isNeedSubmitAddAppFormData = true;
  }
  initAttribute() {
    const appAttribute1: any = {};
    const appAttribute2: any = {};
    appAttribute1.code = 'MENU';
    appAttribute1.name = '菜单';
    appAttribute1.defaultValue = '菜单';
    appAttribute2.code = 'BUTTON';
    appAttribute2.name = '按钮';
    appAttribute2.defaultValue = '按钮';
    this._dataSet.push(appAttribute1);
    this._dataSet.push(appAttribute2);
  }
  initExtendList() {
    this._extendDate = [];
  }
  ngOnInit() {
    this.initAttribute();
    this.initExtendList();
  }

  showDialog(msg: any) {
    this.confirmServ.warning({
      nzTitle: msg,
      nzOnCancel: () => {
      }
    });
  }


}
