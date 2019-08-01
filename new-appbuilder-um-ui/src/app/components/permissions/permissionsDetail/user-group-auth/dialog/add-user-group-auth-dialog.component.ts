import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AddUserGroupAuthDialogService } from './add-user-group-auth-dialog.service';

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
  @Input() refresh: EventEmitter<any>

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
  onSearch(value: any) {
    this.queryParams = { "name": value };
    this.params = {};
    this.params = this.queryParams;
  }

  onCheckUgUserGroups(data: any) {
    this.checkUserGroups = data;
  }

  handleOk = (e: any) => {
    let userGroupIdArr: any[] = [];
    this.checkUserGroups.forEach((userGroup: any, index: any) => {
      userGroupIdArr.push(userGroup.id);
    })
    this.params = {};
    this.params.roleId = this.queryParams.id;
    this.params.virtualroleIdList = userGroupIdArr;
    this.service.saveVirtualroleRoleRel(this.params).subscribe((data: any) => {
      this.isVisible = false;
      // this.refresh && this.refresh.emit({type: 0})
      this.refresh && this.refresh.emit({ type: 1 })
      this.onClose.emit(this.isVisible);
      this.onSubmit.emit(true);
    });
  }

  handleCancel = (e: any) => {
    this.isVisible = false;
    this.onClose.emit(this.isVisible);
  }

  constructor(private service: AddUserGroupAuthDialogService) {

  }

  ngOnInit() {

  }

}
