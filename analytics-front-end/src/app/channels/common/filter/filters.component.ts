import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'common-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.less']
})
export class filtersComponent implements OnInit {
  height: boolean; //是否隐藏
  dimensionOptions: any = []; //属性
  dimension: any; //默认属性
  conditionoptions: any = []; // 运算符
  _filter: any; //默认运算符
  _seeAbout: boolean; //是否查询

  public options1: any = [
    {
      label: '等于',
      value: 'in'
    },
    {
      label: '不等于',
      value: 'not in'
    }
  ];
  public options2: any = [
    {
      label: '等于',
      value: '='
    },
    {
      label: '不等于',
      value: '!='
    },
    {
      label: '包含',
      value: 'in'
    },
    {
      label: '不包含',
      value: '不包含'
    }
  ];
  public options3: any = [
    {
      label: '等于',
      value: '='
    },
    {
      label: '大于',
      value: '>'
    },
    {
      label: '大于等于',
      value: '>='
    },
    {
      label: '小于',
      value: '<'
    },
    {
      label: '小于等于',
      value: '<='
    },
    {
      label: '在区间',
      value: '在区间'
    }
  ];

  selectedValue = 'lucy';
  value: string;
  listOfOption = [];
  listOfSelectedValue = ['a10', 'c12'];
  ngOnInit() {
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }
    this.listOfOption = children;

    this.conditionoptions = this.options3;
  }
  changeDimension(data: any) {
    this._seeAbout = true;
  }
  changeCondition2(data: any) {
    this._seeAbout = true;
  }
  @Input()
  set _height(data: any) {
    // if (data) {
    this.height = data;
    // }
    // else {
    //   this;
    //   this.height = data;
    // }
  }
  @Output() query = new EventEmitter();
  /**
   * 查询
   * @param data
   */
  public inquire(data: any) {
    if (data) {
      this.query.emit(data);
    }
  }
  /**
   * 查询
   */
  seeAbout() {
    if (this._seeAbout) {
      this.inquire(true);
    }
    this._seeAbout = false;
  }
}
