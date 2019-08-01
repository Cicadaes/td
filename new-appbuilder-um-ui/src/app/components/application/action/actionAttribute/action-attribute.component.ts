import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ActionAttributeService } from './action-attribute.service';
import { NzModalService } from 'ng-cosmos-ui';
import { ScrollToTopService } from '../../../../@themes/scroll-service';


@Component({
  selector: 'action-attribute',
  templateUrl: './action-attribute.component.html',
  styleUrls: ['./action-attribute.component.css']
})

export class ActionAttributeComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() action: any;
  @Input() isedit =  false;
  @Input() _dataSet: any;
  @Input() operation: string;
  @Output() onSearch = new EventEmitter<boolean>();
  currentData: any;
  isShowAddActionModal =  false;
  _loading = true;
  isShowAddAppModal =  false;

  constructor(private scrollSer: ScrollToTopService, private service: ActionAttributeService, private confirmServ: NzModalService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isShowAddActionModal) {
      //  alert(333);
      // this.refreshData();
    }
    if (!changes.isShow) {
      // alert(444);
      // this.refreshData();
    }
  }
  addActionAttribute = (e: any) => {
    this.isedit = false;
    this.showAddActionModal();
  }

  showAddActionModal() {
    this.isShowAddActionModal = true;
  }

  hideAddActionModal() {
    this.isShowAddActionModal = false;
    this.currentData = null;
  }
  deleteActionAttribute(id: any) {
    const params = { 'id': id };
    this.service.deleteActionAttribute(params).subscribe((data: any) => {
      if (data.success === '200') {
        //  alert('删除成功');
        // this.refreshData();
      } else {
        alert('删除失败');
      }

    });
  }

  deleteAttribute(data: any) {
    const _this1 = this;
    const title = '您确定要删除功能属性“' + data.name + '”吗？';
    this.confirmServ.confirm({
      nzTitle: title,
      nzContent: '',
      //  title: '提示',
      //  content: title,
      nzOnOk: () => {
        const key = data.key;
        const name = data.name;
        for (let i = _this1._dataSet.length - 1; i >= 0; i--) {
          const p = _this1._dataSet[i];
          if (p.key === key && p.name === name) {
            // this._dataSet.splice(i,1);
            _this1._dataSet[i].operation = 'delete';
          }
        }
      },
      nzOnCancel() { }
    });
  }
  editAttribute(data: any) {
    this.isShowAddActionModal = true;
    this.isedit = true;
    this.currentData = {
      data: data
    };
    for (let i = this._dataSet.length - 1; i >= 0; i--) {
      const p = this._dataSet[i];
      if (p.key === data.key && p.name === data.name) {
        // this._dataSet.splice(i,1);
        this._dataSet[i].update = true;
      }
    }

  }

  refreshData() {
    this.scrollSer.scrollToTop();

    //  let params = this.queryParams || {};
    this._loading = false;
  }
  ngOnInit() {
    this.refreshData();
  }
}
