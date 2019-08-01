import { Component, OnInit, Input, Output } from '@angular/core';
import { retentionModel } from './retention.model';
import { format } from 'date-fns';

@Component({
  selector: 'app-retention',
  templateUrl: './retention.component.html',
  styleUrls: ['./retention.component.less']
})
export class RetentionComponent implements OnInit {
  retentionModel: retentionModel = new retentionModel();
  retentionHeaders: any = this.retentionModel.retentionHeaders; //留存率headerconter
  retentionTable: any = []; //留存率数据
  retentionloading: boolean; //图表数据加载loading
  _retentionTable: any = []; //留存率暂存数据
  _color: any = []; //留存渲染颜色
  Option: any = []; //留存与颜色对应数据
  constructor() {}

  ngOnInit() {}
  @Input()
  set retention(data: any) {
    if (data && data.length) {
      this._retentionTable = data;
      this.keepFilter(data);
    } else {
      this.retentionTable = [];
    }
  }
  @Input()
  set _retentionloading(data: any) {
    this.retentionloading = data;
  }
  /**
   * 留存组件过滤
   * @param data
   */
  keepFilter(data: any) {
    this.Option = [];
    data.forEach(item => {
      for (let value in item) {
        if (value !== 'keep' && value !== 'starttime_day') {
          this.Option.push(Number(item[value]));
        }
      }
    });
    this.Option = this.sortArr(this.Option);
    this._color = this.retentionModel.radientColor('#ffffff', '#2185F0', this.Option.length);
    this.keepAssignment(this._color);
  }
  /**
   * 留存赋值
   * @param cont
   */
  keepAssignment(cont: any) {
    this._retentionTable.forEach((item: any, index: any) => {
      for (let value in item) {
        if (value !== 'keep' && value !== 'starttime_day') {
          this._retentionTable[index][value + 'bgcolor'] = this.getBgColor(this.Option, item[value]);
          this._retentionTable[index][value + 'color'] = this.getFontColor(this.Option, item[value]);
          this._retentionTable[index][value] = this._retentionTable[index][value] + '%';
        } else if (value == 'starttime_day') {
          this._retentionTable[index]['starttime_day'] = format(
            new Date(this._retentionTable[index]['starttime_day']),
            'YYYY-MM-DD'
          );
        }
      }
    });
    this.retentionTable = this._retentionTable;
    console.log(this._retentionTable);
  }
  /**
   * 获取背景
   * @param value 每格的值
   */
  getBgColor(cont: any, value: any) {
    for (let i = 0; i < cont.length; i++) {
      if (cont[i] == value) {
        return this._color[i];
      }
    }
  }
  /**
   * 获取字体颜色
   * @param  value 每格的值
   */
  public getFontColor(cont: any, value: any) {
    let arr = [];
    for (let i = 0; i < cont.length; i++) {
      arr.push(Number(cont[i]));
    }
    if (value >= arr[Math.round(arr.length / 2)]) {
      return '#ffffff';
    } else {
      return '#333333';
    }
  }
  /**
   * 数组排序去重
   * @param array 存储数据的数组
   */
  public sortArr(array: any) {
    var i = 0,
      len = array.length,
      j,
      d;
    for (; i < len; i++) {
      for (j = 0; j < len; j++) {
        if (array[i] < array[j]) {
          d = array[j];
          array[j] = array[i];
          array[i] = d;
        }
      }
    }
    let len1 = array.length;
    for (let i = 0; i < len1; i++) {
      for (let j = i + 1; j < len1; j++) {
        if (array[i] == array[j]) {
          array.splice(j, 1);
          len1--;
          j--;
        }
      }
    }
    return array;
  }
}
