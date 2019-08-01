import { 
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'table-move',
  templateUrl: './table-move.component.html',
  styleUrls: ['./table-move.component.less'],
})
export class TableMoveComponent implements OnChanges, OnInit {

  // 表格头部信息
  @Input() tableColumns: any[] = [];
  // 表格内容信息
  @Input() tableData: any[] = [];
  // 设置表格可视区域
  private _height: number = 240;
  @Input() 
  set tableHeight(value: number) {
    this._height = value;
  }
  get tableHeight() {
    return this._height;
  }


  private _tableColumns: any[] = [];
  setColumnsData(value: any) {
    this._tableColumns = value
  }

  private _tableData: any[] = [];
  setTableData(value: any) {
    this._tableData = value;
  }

  constructor() { }

  /* 
   * 生命周期
   */

  ngOnChanges(changes: SimpleChanges) {
    const changesColumn = changes.tableColumns;
    const value = changesColumn.currentValue;
    if (value !== undefined && value !== null) {
      this.setColumnsData(value);
    }

    const changesData = changes.tableData;
    const data = changesData.currentValue;
    if (data !== undefined && data !== null) {
      this.setTableData(data);
    }
  }

  ngOnInit() {
  }

}
