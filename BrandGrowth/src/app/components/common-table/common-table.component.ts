import { Component, OnInit, Input, Output, EventEmitter, ContentChild, TemplateRef,OnChanges } from '@angular/core';

@Component({
  selector: 'common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.less']
})
export class CommonTableComponent implements OnInit {

  @Input() cardTitle: string = '';          // 表格的标题
  @Input() styleConfig: any = {};           // 自定义表格样式
  @Input() data: any = [];                  // 表格数据
  @Input() columns: any = [];               // 表头数据
  @Input() showCheckBox: boolean = true;    // 第一列联动的选择框的显示与隐藏
  @Input() isPagination: boolean = true;    // 是否显示分页

  // 自定义分页
  @ContentChild('costomPagination') _costomPaginationContent: TemplateRef<void>;

  // checkbox被选中时，抛出含有checked:boolean字段的数组
  @Output() checkedItemChange = new EventEmitter<any>();

  _allChecked = false;              // 是否全都被选中
  _indeterminate = false;           // 设置 indeterminate 状态，只负责样式控制 checkbox 不是全选的样式
  _disabledButton = true;           // 被禁用的项
  _checkedNumber = 0;               // 被选择的项的数目
  _displayData: Array<any> = [];    // 被添加checked字段的数组，checked用来表示是否被选中

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(){
    this._indeterminate = false;   
  }
  /**
   * 将对象的键的集合转化为数组
   */
  getKeys(): string[] {
    let keys: string[] = [];
    this.columns.map((item: any) => {
      keys.push(item.key)
    })
    return keys;
  }

  /**
   * 当_displayData改变时触发
   * @param 相当于_displayData
   */
  _displayDataChange($event: any): void {
    this._displayData = $event;
   
  }

  /**
   * 每次checked信息有变化时，刷新状态
   */
  _refreshStatus(): void {
    // 抛出列表信息
    this.checkedItemChange.emit(this._displayData);
    const allChecked = this._displayData.every(value => value.checked === true);
    const allUnChecked = this._displayData.every(value => !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
    this._disabledButton = !this.data.some((value: any) => value.checked);
    this._checkedNumber = this.data.filter((value: any) => value.checked).length;
  }

  /**
   * 是否选择全部
   * @param value 是否选中全部
   */
  _checkAll(value: any): void {
    if (value) {
      this._displayData.forEach(data => data.checked = true);
    } else {
      this._displayData.forEach(data => data.checked = false);
    }
    this._refreshStatus();
  }
}
