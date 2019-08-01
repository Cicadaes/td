import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { AppExtendService } from './app-extend.service';
import { NzModalService } from 'ng-cosmos-ui';
import { ScrollToTopService } from '../../../../@themes/scroll-service';

@Component({
  selector: 'app-extend',
  templateUrl: './app-extend.component.html',
  styleUrls: ['./app-extend.component.css']
})

export class AppExtendComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() app: any;
  isShowAddAppModal = false;

  _dataSet: any = [];
  _loading = true;
  @Input() isedit = false;
  currentData: any;
  @Input() appCode: any;

  @Output() onRefresh = new EventEmitter();

  constructor(private scrollSer: ScrollToTopService, private service: AppExtendService, private confirmServ: NzModalService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isShowAddAppModal) {
      this.refreshData();
    }
    if (!changes.isShow) {
      this.refreshData();
    }
  }
  addAppAttribute = (e: any) => {
    this.showAddAppModal();
  }

  showAddAppModal() {
    this.isShowAddAppModal = true;
  }

  hideAddAppModal() {
    this.isShowAddAppModal = false;
    this.isedit = false;
    this.currentData = null;
    this.refreshData();
  }
  deleteAppAttribute(data: any) {
    const _thiss = this;
    const title = '您确定要删除功能类别“' + data.name + '”吗？';
    this.confirmServ.confirm({
      nzTitle: title,
      nzContent: '',
      nzOnOk: () => {
        const params = { 'id': data.id };
        _thiss.service.deleteAppAttribute(params).subscribe((data1: any) => {
          if (data1.success == '200') {
            _thiss.refreshData();
          } else if (data1.success == '500') {
            _thiss.confirmServ.warning({
              nzTitle: data1.result || '删除失败',
              nzContent: ''
            });
          }

        });
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
    this.onRefresh.emit();
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
