import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EditAppPageService } from './edit-app-page.service';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
  selector: 'edit-app-page',
  templateUrl: './edit-app-page.component.html',
  styleUrls: ['./edit-app-page.component.css'],
  providers: [FormBuilder]
})

export class EditAppPageComponent implements OnInit {
  @Output() onClose = new EventEmitter<any>();
  @Input() _dataSet: any = [];
  @Input() isShow = false;
  @Input() app: any = {};
  errorFlag = 0;
  isVisible = false;
  isConfirmLoading = false;
  isNeedSubmitAddAppFormData: boolean;
  isEdit = false;
  resultData: any = {};
  selectedAppId: any[] = [];
  flag: boolean;

  private toSubmit: EventEmitter<any> = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private service: EditAppPageService, private router: Router, private confirmServ: NzModalService) {

  }
  /**
   *子=>子(要顺便改便父)
   * @param data
   */
  picture(data: any) {
    this.errorFlag = data;
  }
  showModal = () => {
    this.isConfirmLoading = false;
    this.isVisible = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isShow && changes.isShow.currentValue) {
      this.isShow = changes.isShow.currentValue;
    } else {
      this.isShow = false;
    }
    if (this.isShow) {
      this.showModal();
    }
  }
  submitAddAppForm(data: any) {
    //  this.errorFlag = 0;
    // this.isNeedSubmitAddAppFormData = false;
    if (this.resultData) {
      if (data.value.type === 2 && (this.resultData.selectedIds === null || this.resultData.selectedIds.length === 0)) {
        setTimeout(() => {
          this.errorFlag = 6;
        }, 0);
        return;
        /*this.confirmServ.error({
            nzTitle: "无法修改",
            nzContent: "依赖的主应用不能为空"
        });*/
      }
      data.value.additionalAppIds = this.resultData.selectedIds;
      data.value.appIcon = this.resultData.iconId;
      data.value.icon = this.resultData.icon;
      data.value.applargeIcon = this.resultData.largeIconId;
      data.value.largeIcon = this.resultData.largeIcon;
    }
    if (data.value.type === '1') {
      if (!this.resultData.icon) {
        setTimeout(() => {
          this.errorFlag = 3;
        }, 0);
        // this.showDialog("请上传应用图标")
        return;
      }
      if (!this.resultData.largeIcon) {
        setTimeout(() => {
          this.errorFlag = 4;
        }, 0);
        // this.showDialog("请上传应用图标")
        return;
      }
    }
    if (data.status === 'VALID') {
      if (this.app) {
        data.value.id = this.app.id;
      }
      if (data.value && (data.value.status || data.value.status === 1)) {
        data.value.status = 1;
      } else {
        data.value.status = 0;
      }
      this.service.addApp(data.value).subscribe((data: any) => {
        if (data.success === 200) {
          this.isVisible = false;
          this.onClose.emit(this.isVisible);
          this.onClose.emit(false);
          // this.router.navigate(['/apps/detailAppPage',data.result]);
        } else {
          this.isVisible = false;
          this.onClose.emit(this.isVisible);
          this.onClose.emit(false);

          this.showDialog(data.result)
          //  if(data.result.indexOf('无法禁用')!='-1'){
          //      this.errorFlag=1;
          //  }
          //  if(data.result.indexOf('应用名称已存在')!='-1'){
          //      this.errorFlag=2;
          //  }

          /*this.isVisible = false;
          this.onClose.emit(this.isVisible);
          this.confirmServ.error({
              nzTitle: "修改失败",
              nzContent: data.result
          });*/
        }
      });
    }
  }

  submitResultData(data: any) {
    this.resultData.selectedIds = data.selectedIds;
    this.resultData.iconId = data.iconId;
    this.resultData.icon = data.icon;
    this.resultData.largeTconId = data.largeTconId;
    this.resultData.largeIcon = data.largeIcon;
  }
  handleOk = (e: any) => {
    this.toSubmit.emit();
    this.flag = !this.flag;
    this.isNeedSubmitAddAppFormData = true;
  }
  handleCancel = (e: any) => {
    event.stopPropagation();
    this.isVisible = false;
    this.onClose.emit(this.isVisible);
  }
  ngOnInit() {
    // 查询选中的主应用
    this.initSelectedApp();
  }
  initSelectedApp() {
    const params = {
      id: this.app.id
    };
    this.service.getLicences(params).subscribe((data: any) => {
      for (let i = 0; i < data.list.length; i++) {
        this.selectedAppId.push(data.list[i].id);
      }
    });
  }


  showDialog(msg: any) {
    this.confirmServ.warning({
      nzTitle: msg,
      nzContent: ''
    });
  }

}
