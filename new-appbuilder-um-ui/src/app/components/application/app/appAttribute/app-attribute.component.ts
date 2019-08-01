import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { AppAttributeService } from './app-attribute.service';
import { NzModalService } from 'ng-cosmos-ui';
import { ScrollToTopService } from '../../../../@themes/scroll-service';


@Component({
  selector: 'app-attribute',
  templateUrl: './app-attribute.component.html',
  styleUrls: ['./app-attribute.component.css']
})

export class AppAttributeComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() app: any;
  isShowAddAppModal = false;

  _dataSet: any = [];
  _loading = true;
  @Input() isedit = false;
  currentData: any;
  @Input() appCode: any;

  @Output() onRefresh = new EventEmitter()

  constructor(private scrollSer: ScrollToTopService, private service: AppAttributeService, private confirmServ: NzModalService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isShowAddAppModal || !changes.isShow) {
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
              nzContent: '',
              nzOnCancel() { }
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

    this.onRefresh.emit();

    const params = this.queryParams || {};
    if (params.id) {
      this.service.getAttribute(params).subscribe((data: any) => {
        console.log('重新获取attr', data);
        this._loading = false;
        this._dataSet = data.result;
        this.scrollSer.scrollToTop();
      });
    }
  }
  ngOnInit() {
    this.refreshData();
  }
}
