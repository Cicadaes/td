import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AddUserGroupAuthDialogService } from './add-user-group-auth-dialog.service';
import * as _ from 'lodash';

@Component({
  selector: 'add-user-group-auth-dialog',
  templateUrl: './add-user-group-auth-dialog.component.html',
  styleUrls: ['./add-user-group-auth-dialog.component.css']
})
export class AddUserGroupAuthDialogComponent {
  @Input() queryParams: any;
  @Input() userGroupAuth: any;
  @Input() isShow: boolean = false;
  @Output() onClose = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  // private _refresh: EventEmitter<any> = new EventEmitter<any>()

  // 刷新数据
  // @Input() set refresh(_refresh: EventEmitter<any>) {
  //   _refresh && _refresh.subscribe && _refresh.subscribe((data: any) => {
  //     this._refresh = _refresh
  //   })
  // }
  @Input() refresh: EventEmitter<any>;
  public toSubmit: EventEmitter<any> = new EventEmitter();


  params: any;
  checkUserGroups: any[];
  userGroupAuthFieldArray: any[] = [{
    id: 1,
    fieldName: 'name',
    fieldLabel: '名称',
    fieldType: 'input'
  }];

  isNeedSubmitUserGroupAuthFormData: boolean;
  isVisible = false;
  isConfirmLoading = false;
  search: any;

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

    if (changes.queryParams && changes.queryParams.currentValue) {
      this.params = changes.queryParams.currentValue;
    } else {
      this.params = {};
    }
  }

  onSearchUserGroupList(data: any) {
    this.queryParams = data;
    this.params = {};
    this.params = this.queryParams;
  }

  onSearch(value: any, type: any) {
    const that = this;
    if (type === 'click') {
        if (value) {
            value = value.replace(/(^\s*)|(\s*$)/g, '');
        }
        that.queryParams['name'] = value;
        that.params = _.assign({}, that.queryParams);
    } else {
        if (value.keyCode === 13) {
            if (that.search) {
                that.search = that.search.replace(/(^\s*)|(\s*$)/g, '');
            }
            that.queryParams['name'] = that.search;
            that.params = _.assign({}, that.queryParams);
        }
    }
  }

  onCheckUgUserGroups(data: any) {
    this.checkUserGroups = data;
  }

  handleOk = (e: any) => {
    this.search = null;
    const userGroupIdArr: any[] = [];
    this.checkUserGroups.forEach((userGroup: any, index: any) => {
      userGroupIdArr.push(userGroup.id);
    });
    this.params = {};
    this.params.roleId = this.queryParams.id;
    this.params.virtualroleIdList = userGroupIdArr;
    this.service.saveVirtualroleRoleRel(this.params).subscribe((data: any) => {
      this.isVisible = false;
      // this.refresh && this.refresh.emit({type: 0})
      this.refresh && this.refresh.emit({type: 1})
      this.onClose.emit(this.isVisible);
      this.onSubmit.emit(true);
    });
  }

  handleCancel = (e: any) => {
    this.isVisible = false;
    this.search = null;
    this.onClose.emit(this.isVisible);
  }

  constructor(private service: AddUserGroupAuthDialogService) {

  }

  ngOnInit() {

  }

}
