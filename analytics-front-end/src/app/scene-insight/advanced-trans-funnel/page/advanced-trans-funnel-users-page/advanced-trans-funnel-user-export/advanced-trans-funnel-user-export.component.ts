import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AdvancedTransFunnelService } from '../../../advanced-trans-funnel.service';
import { Globals } from '../../../../../utils/globals';
import { BaseComponent } from '../../../../../common/base-component';

@Component({
  selector: 'app-advanced-trans-funnel-user-export',
  templateUrl: './advanced-trans-funnel-user-export.component.html',
  styleUrls: ['./advanced-trans-funnel-user-export.component.less']
})
export class AdvancedTransFunnelUserExportComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() isShow: boolean;
  @Input() initData: any;
  @Output() onClose = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  _isVisible = false;
  _isSubmit = false;
  _isReloadTable: boolean;

  _allTableColumns: any[];
  _selectedTableColumns: any[] = [];

  _systemError: any = {
    error: false,
    msg: ''
  };

  _initData: any;
  _isShowTooltip: boolean;

  showModal = () => {
    this._isVisible = true;
    this._isSubmit = false;
    this._isReloadTable = false;
  };

  _hideDialog() {
    this._isVisible = false;
    this._isSubmit = true;
    this._isReloadTable = true;
    this.onClose.emit(this._isVisible);
    this.onSubmit.emit(this._selectedTableColumns);
    this.globals.resetBodyStyle();
  }

  goPage(hash: string) {
    this.commonService.goPage(hash);
  }

  buildSelectedColumns() {
    if (this._allTableColumns) {
      for (const o in this._allTableColumns) {
        const fields = this._allTableColumns[o];
        if (fields && fields.length > 0) {
          for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (field.selected) {
              this._selectedTableColumns.push(field);
            }
          }
        }
      }
    }
  }

  handleOk = (e: any) => {
    this._selectedTableColumns = [];
    this.buildSelectedColumns();
    if (this._selectedTableColumns.length === 0) {
      this.message.create('warning', '请选择需要导出的用户属性');
      /*this._systemError = {
                error: true,
                msg: '请选择需要导出的用户属性'
            };*/
      return false;
    }
    this._isShowTooltip = true;
    this._hideDialog();
  };

  handleCancel = (e: any) => {
    this.globals.resetBodyStyle();
    this._isVisible = false;
    this.onClose.emit(this._isVisible);
  };

  constructor(private service: AdvancedTransFunnelService, public globals: Globals, private injector: Injector) {
    super(injector);
  }

  queryAllTableColumns() {
    this.service.queryTableColumns().subscribe((response: any) => {
      if (response) {
        this._allTableColumns = response.list;
        //        this.initTableColumns();
        this.onSubmit.emit(this._selectedTableColumns);
      }
      console.dir([response]);
    });
  }

  initTableColumns() {
    let length = 0;
    if (this._allTableColumns) {
      for (const o in this._allTableColumns) {
        const fields = this._allTableColumns[o];
        if (fields && fields.length > 0) {
          for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (length < 6) {
              field.selected = true;
              this._selectedTableColumns.push(field);
              length++;
            } else {
              break;
            }
          }
        }
      }
    }
  }

  checkChange(tag: any, group: any): void {
    tag.selected = !tag.selected;
    console.dir(tag);
    this._systemError = {
      error: false,
      msg: ''
    };
    this._checkSelectCheckAll(tag, group);
  }

  _onSearch(value: any, group: any) {
    this._filterValues(value, group);
  }

  _filterValues(value: any, group: any) {
    if (group && group.value && group.value.length > 0) {
      const values = group.value;
      for (let i = 0; i < values.length; i++) {
        const obj = values[i];
        if (obj.displayname && obj.displayname.indexOf(value) !== -1) {
          obj.isHide = false;
        } else {
          obj.isHide = true;
        }
      }
    }
  }

  _checkSelectCheckAll(tag: any, group: any) {
    console.dir([tag, group]);
    let isSelectAll = true;
    if (group && group.value && group.value.length > 0) {
      const values = group.value;
      for (let i = 0; i < values.length; i++) {
        const obj = values[i];
        if (!obj.selected) {
          isSelectAll = false;
          break;
        }
      }
    }
    group.checkAll = isSelectAll;
  }

  _onCheckAllValue(value: any, group: any) {
    console.dir([value, group]);
    if (group && group.value && group.value.length > 0) {
      const values = group.value;
      for (let i = 0; i < values.length; i++) {
        const obj = values[i];
        if (value) {
          obj.selected = true;
        } else {
          obj.selected = false;
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isShow && changes.isShow.currentValue) {
      this._isVisible = changes.isShow.currentValue;
    }
    if (this._isVisible) {
      this.showModal();
    }
    if (changes.initData && changes.initData.currentValue) {
      this._initData = changes.initData.currentValue;
    }
  }

  ngOnInit() {
    this.queryAllTableColumns();
  }
}
