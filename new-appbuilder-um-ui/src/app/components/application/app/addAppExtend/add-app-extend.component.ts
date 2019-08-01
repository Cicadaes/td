import { Component, OnInit, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { AddAppExtendService } from './add-app-extend.service';
import { NzModalService } from 'ng-cosmos-ui';
import { ScrollToTopService } from '../../../../@themes/scroll-service';

@Component({
  selector: 'add-app-extend',
  templateUrl: './add-app-extend.component.html',
  styleUrls: ['./add-app-extend.component.css']
})

export class AddAppExtendCompontent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() app: any;
  isShowAddAppModal = false;

  //  @Input() _extendDate: any = [];
  @Input() isedit = false;
  currentData: any;
  _loading = true;
  @Input() _extendDate: any = [];
  constructor(private scrollSer: ScrollToTopService, private service: AddAppExtendService, private confirmServ: NzModalService) {

  }

  submitAddAppModal(data: any) {
    this._extendDate = data;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isShowAddAppModal) {
      //  alert(333);
      this.refreshData();
    }
    if (!changes.isShow) {
      // alert(444);
      this.refreshData();
    }
  }
  addAppExtendbute = (e: any) => {
    this.isedit = false;
    this.showAddAppModal();
  }

  showAddAppModal() {
    this.isShowAddAppModal = true;
  }

  hideAddAppModal() {
    this.isShowAddAppModal = false;
    this.currentData = null;
  }
  deleteAppAttribute(id: any) {
    const params = { 'id': id };
    this.service.deleteAppAttribute(params).subscribe((data: any) => {
      if (data.success === '200') {
        //  alert('删除成功');
        this.refreshData();
      } else {
        alert('删除失败');
      }

    });
  }

  deleteExtend(data: any) {

    const _thiss = this;
    const title = '您确定要删除功能类别“' + data.name + '”吗？';
    this.confirmServ.confirm({
      nzTitle: title,
      nzContent: '',
      nzOnOk: () => {
        const code = data.code;
        const name = data.name;
        for (let i = _thiss._extendDate.length - 1; i >= 0; i--) {
          const p = _thiss._extendDate[i];
          if (p.code === code && p.name === name) {
            _thiss._extendDate.splice(i, 1);
          }
        }
      },
      nzOnCancel() { }
    });

  }
  editExtend(data: any) {
    this.isShowAddAppModal = true;
    this.isedit = true;
    this.currentData = data;
  }

  refreshData() {
    const params = this.queryParams || {};
    if (params.id) {
      this.service.getAppExtendAttributeByApp(params).subscribe((data: any) => {
        this._loading = false;
        this._extendDate = data.result;
        this.scrollSer.scrollToTop();
      });
    }
  }
  ngOnInit() {
    this.refreshData();
  }
}
