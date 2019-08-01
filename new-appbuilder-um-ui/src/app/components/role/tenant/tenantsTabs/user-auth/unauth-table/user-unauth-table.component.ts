import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { RolesService } from '../../../../roles.service';
import { ScrollToTopService } from '../../../../../../@themes/scroll-service';

@Component({
  selector: 'user-unauth-table',
  templateUrl: './user-unauth-table.component.html',
  styleUrls: ['./user-unauth-table.component.css']
})

export class UserUnauthTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() queryParams: any = {};
  @Input() userId = 0;
  @Input() roleId = 0;
  @Input() isReloadData = false;
  @Input() isSuper = true;
  @Input() isNeedSubmit = false;

  @Input() set toSubmit(_toSubmit: EventEmitter<any>) {
    _toSubmit && _toSubmit.subscribe && _toSubmit.subscribe((data: any) => {
      this.submit()
    })
  }

  @Output() onSubmit = new EventEmitter<any[]>();

  isShowAddUserAuthModal = false;
  currentUserAuth: any;
  _allChecked: boolean;
  _disabledButton = true;
  _indeterminate = false;
  _checkedNumber = 0;

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = false;
  _sortValue: any = null;
  userRadioId: any = 0;


  _checkAll = (isCheckAll: any) => {
    this._dataSet.forEach((ug: any) => ug.checked = isCheckAll);
    this._allChecked = isCheckAll;
    this._refreshStatus();
  }

  _refreshStatus() {
    const allChecked = this._dataSet.every((value: any) => value.checked === true);
    const allUnChecked = this._dataSet.every((value: any) => !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
    this._disabledButton = !this._dataSet.some((value: any) => value.checked);
    this._checkedNumber = this._dataSet.filter((value: any) => value.checked).length;
  }

  constructor(private scrollSer: ScrollToTopService, private service: RolesService) {

  }

  checkedOne(data: any) {
    this.userRadioId = data.userId;
  }

  sort(value: any) {
    this._sortValue = value;
    this.refreshData();
  }

  reset() {
    this.refreshData(true);
  }

  showAddUserAuthModal(userAuth: any) {
    this.currentUserAuth = userAuth;
    this.isShowAddUserAuthModal = true;
  }

  hideAddUserAuthModal(params: any) {
    this.isShowAddUserAuthModal = false;
  }

  refreshData(reset = false) {
    this.scrollSer.scrollToTop();
    if (reset) {
      this._current = 1;
    }

    const params = this.queryParams || {};
    params.page = this._current;
    params.rows = this._pageSize;

    this._loading = true;
    this.service.queryUnauthUserByPage(params).then((data: any) => {
      if (data.success === true) {
        this._total = data.total;
        this._dataSet = data.data;
      }
      this.isReloadData = false;
      this.isNeedSubmit = false;
      this._loading = false;
      const allChecked = this._dataSet.every((value: any) => value.checked === true);
      // const allUnChecked = this._dataSet.every((value:any) => !value.checked);
      this._allChecked = allChecked;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (key === 'queryParams' && changes.queryParams.currentValue != null) {
        this.queryParams = changes.queryParams.currentValue || {};
        this.reset();
      } else if (key === 'isReloadData' && changes.isReloadData.currentValue != null) {
        this.isReloadData = changes.isReloadData.currentValue || false;
        if (this.isReloadData === true) {
          this.reset();
        }
      } else if (key === 'isNeedSubmit' && changes.isNeedSubmit.currentValue != null) {
        // this.isNeedSubmit = changes.isNeedSubmit.currentValue || {};
        // if (this.isNeedSubmit === true) {
        //     let checkSet: any[] = [];
        //     this._dataSet.forEach((user:any, index:any) => {
        //         if(user.checked){
        //             user.createUserId = this.userId;
        //             user.updateUserId = this.userId;
        //             user.vroleId = this.roleId;
        //             checkSet.push(user);
        //         }
        //     })
        //     if (checkSet.length> 0) {
        //         this.onSubmit.emit(checkSet);
        //     }
        //     this.isNeedSubmit = false;
        // }
      }
    }
    this.isNeedSubmit = false;
  }

  ngOnInit() {
    this.reset();
  }

  ngOnDestroy() {
    this.isReloadData = false;
  }

  /**
   * 提交
   * @return {[type]} [description]
   */
  private submit() {
    const checkSet: any[] = [];
    this._dataSet.forEach((user: any, index: any) => {
      if (user.userId === this.userRadioId) {
        user.createUserId = this.userId;
        user.updateUserId = this.userId;
        user.vroleId = this.roleId;
        checkSet.push(user);
      }
    });
    // if (checkSet.length > 0) {
    this.onSubmit.emit(checkSet);
    // }
  }
}
