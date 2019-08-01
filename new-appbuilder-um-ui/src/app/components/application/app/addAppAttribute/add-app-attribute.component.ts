import { Component, OnInit, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { AddAppAttributeService } from './add-app-attribute.service';
import { NzModalService } from 'ng-cosmos-ui';
import { ScrollToTopService } from '../../../../@themes/scroll-service';

@Component({
  selector: 'add-app-attribute',
  templateUrl: './add-app-attribute.component.html',
  styleUrls: ['./add-app-attribute.component.css']
})

export class AddAppAttributeComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() app: any;
  isShowAddAppModal = false;

  @Input() _dataSet: any = [];
  @Input() isedit = false;
  currentData: any;
  _loading = true;

  constructor(private scrollSer: ScrollToTopService, private service: AddAppAttributeService, private confirmServ: NzModalService) {

  }

  submitAddAppModal(data: any) {
    this._dataSet = data;
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
  addAppAttribute = (e: any) => {
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

  deleteAttribute(data: any) {

    const _thiss = this;
    const title = '您确定要删除功能类别“' + data.name + '”吗？';
    this.confirmServ.confirm({
      nzTitle: title,
      nzContent: '',
      nzOnOk: () => {
        const code = data.code;
        const name = data.name;
        for (let i = _thiss._dataSet.length - 1; i >= 0; i--) {
          const p = _thiss._dataSet[i];
          if (p.code === code && p.name === name) {
            _thiss._dataSet.splice(i, 1);
          }
        }
      },
      nzOnCancel() { }
    });

  }
  editAttribute(data: any) {
    this.isShowAddAppModal = true;
    this.isedit = true;
    this.currentData = data;
  }

  refreshData() {
    this.scrollSer.scrollToTop();
    const params = this.queryParams || {};
    if (params.id) {
      this.service.getAttribute(params).subscribe((data: any) => {
        this._loading = false;
        this._dataSet = data.result;
      });
    }
  }
  ngOnInit() {
    this.refreshData();
  }
}
