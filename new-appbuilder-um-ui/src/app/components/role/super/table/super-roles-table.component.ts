import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { RolesService } from '../../roles.service';
import { ScrollToTopService } from '../../../../@themes/scroll-service';

@Component({
  selector: 'super-roles-table',
  templateUrl: './super-roles-table.component.html',
  styleUrls: ['./super-roles-table.component.css']
})

export class SuperRolesTableComponent implements OnInit, OnChanges {
  /*@Input() queryParams : any;*/
  @Input() userId: number;
  isShowRoleModal = false;
  currentRole: any;

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = false;
  _sortValue: any = null;

  constructor(private scrollSer: ScrollToTopService, private service: RolesService) {
  }

  sort(value: any) {
    this._sortValue = value;
    this.refreshData();
  }

  reset() {
    this.refreshData(true);
  }

  showRoleModal(role: any) {
    this.currentRole = role;
    this.isShowRoleModal = true;
  }

  hideRoleModal(params: any) {
    this.isShowRoleModal = false;
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    /*this.queryParams.tenantId = 0;*/

    /*this._dataSet = [{
        id:1,
        tenantId:0,
        name:'超级管理员',
        type:2,
        code:'',
        parent_id:0,
        desc:'超级管理员，初始化脚本初始进去的，不可修改，文案待定',
        status:1,
        create_user_id:0,
        update_user_id:0
    },{
        id:2,
        tenantId:0,
        name:'运营人员',
        type:2,
        code:'',
        parent_id:0,
        desc:'运营人员，初始化脚本初始进去的，不可修改，文案待定',
        status:1,
        create_user_id:0,
        update_user_id:0
    }];*/

    /*        let params = this.queryParams ||{};
            params.page=this._current;
            params.rows=this._pageSize;*/

    this._loading = true;
    /*this.service.getSuperRoles().subscribe((data: any) => {
        if (data.success == true) {
           // this._total = 200;
            this._dataSet = data.data;
        }
        this._loading = false;
    });*/
    this.service.getSuperRoles().then((response: any) => {
      if (response.success === true) {
        // this._total = 200;
        this._dataSet = response.data;
        this.scrollSer.scrollToTop();
      }
      this._loading = false;
    }).catch((err: any) => {
      console.log(err);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    /*this.queryParams = changes.queryParams.currentValue || {};
    this.reset();*/
    this.reset();
  }

  ngOnInit() {
    this.reset();
  }
}
