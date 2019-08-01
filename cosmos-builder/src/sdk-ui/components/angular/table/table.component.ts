import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';
import { PreviewMode, Communication, EventEmitter, EventType, DataStore, DomEvent, ComponentEvent } from "cosmos-td-sdk";

import { TableGraph } from './table.graph';

@Component({
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class TableComponent extends Communication implements OnInit, OnDestroy {

  @ViewChild('cmchart') cmchart: CosmosChartComponent;
  @ViewChild('cmtable') cmtable: any;

  public defaultData = [
    {
      '': '',

    }
  ];
  public data: any = this.defaultData;
  public dataObj: any = {
    data: {},
    style: {}
  };
  public originData: any = null;
  public sortValue: any = { key: null, value: null };
  public option: TableGraph;
  public style: any = {};

  public sortMap: any = {};
  public thead: any = [];
  public metrics: any; //选取特定维度

  public parameters: any = {
    page: 1,
    pageSize: 10,
  }


  public total: number = 0;
  public pageSizeSelector: any[] = [10, 20, 50, 100];

  constructor() {
    super();
    this.parameters.orderBy = [];
    this.data = this.defaultData;
    for (let key in this.data[0]) {
      this.thead.push({ th: key, sort: false });
    }
    this.total = this.data.length;
  }

  ngOnInit() {
    // DomEvent.fireEvent(this.cmtable.nativeElement, ComponentEvent.COMFILTERCHANGE, this.parameters);

  }


  public onDataChange(scope: string, data: any) {
    // 这里有个巨坑，暂时不解释
    // 创建一个新实例覆盖触发变更检测
    this.thead = [];
    if (data[0] && data[0].data && data[0].data.length > 0) {
      if (data[0].limit && data[0].limit.pageSize == this.parameters.pageSize) {

        this.total = data[0].total;
        // this.parameters.page = this.parameters.page > Math.ceil(this.total / this.pageSize) ? 1 : this.parameters.page;
        if (data[0]["interval"]) {
          for (let i = 0; i < data[0]["data"].length; i++) {
            data[0]["data"][i][data[0]["interval"]["field"]] = data[0]["data"][i][data[0]["interval"]["field"]].toString().slice(0, 4) + '-' + data[0]["data"][i][data[0]["interval"]["field"]].toString().slice(4, 6) + '-' + data[0]["data"][i][data[0]["interval"]["field"]].toString().slice(6);
          }
        }
        this.dataObj.data = data[0].data;
        this.option = new TableGraph(this.dataObj, scope)

        this.metrics = JSON.parse(JSON.stringify(data[0]["metrics"]));//拷贝选取特定维度数据
        this.data = this.option.data;
        this.originData = JSON.parse(JSON.stringify(this.data));//拷贝数据
        if (this.option.dimensions) {
          let hash: any = {};
          for (let item of this.option.dimensions) {
            if (!hash[item['value']]) {
              this.thead.push({ th: item['value'], sort: false })
              hash[item['value']] = 1;
            }
          }
        }

        this.getThead(data[0].data[0]);
        if (PreviewMode.getPreviewMode()) {
          this.parameters.orderBy = (this.parameters.orderBy.length > 0) ? this.parameters.orderBy : (this.option.sort ? this.option.sort : []);
        } else {
          this.parameters.orderBy = this.option.sort ? this.option.sort : [];
        }

        if (this.metrics && this.metrics.length == 1) {
          let len = this.parameters.orderBy.length;
          let metricLen = this.option.metrics.length;
          for (let i = 0; i < len; i++) {
            for (let j = 0; j < metricLen; j++) {
              if (this.parameters['orderBy'][i]['field'] == this.option.metrics[j]['value']) {
                this.parameters['orderBy'][i]['field'] = this.metrics[0];
                break;
              }
            }

          }
        }


        //排序
        if (this.parameters.orderBy) {
          for (let item of this.parameters.orderBy) {
            this.sortMap[item['field']] = (item['field'] == this.sortValue.key && this.tableSort) ? this.sortValue.value : null;
            for (let th of this.thead) {
              if (th.th == item.field) {
                th.sort = true;
                break;
              }
            }
          }
        }
        if (this.tableSort) {
          this.tableSort = false;
        }
      }
    } else {
      this.parameters.page = 1;
      this.parameters.pageSize = 10;
      this.total = this.data.length;
      this.data = this.defaultData;
      this.originData = null;
      for (let key in this.data[0]) {
        this.thead.push({ th: key, sort: false });
      }

    }
    if (JSON.stringify(this.style) != '{}') {
      setTimeout(() => {
        this.onStyleChange(scope, this.style)
      }, 0);

    }
    this.setDataPrecision({ decimals: "2" }); //千分位小数
  }

  public getThead(data: any) {
    if (data) {
      for (let key in data) {
        let len = this.thead.length;
        let isRepeat: boolean = false;
        for (let i = 0; i < len; i++) {
          if (this.thead[i]['th'] == key) {
            isRepeat = true;
            break;
          }
        }
        if (!isRepeat) {
          this.thead.push({ th: key, sort: false })
        }
      }
    }
  }

  public onStyleChange(scope: string, data: any) {
    if (scope) {
      this.dataObj.style = data;
      this.style = data;
      let thList = this.cmtable.nativeElement.querySelectorAll('th');
      let tdList = this.cmtable.nativeElement.querySelectorAll('tbody td');


      //表头背景
      this.setTableColor(thList, 'backgroundColor', data.tableColor.bg)

      //边框
      this.setTableColor(tdList, 'borderBottomColor', data.tableColor.style);

      //奇偶行背景
      this.setTableRowColor(tdList, { odd: data.tableColor.odd, even: data.tableColor.even }, thList.length);

      //表头字体
      this.setTableFontStyle(thList, data.tableName);

      //内容字体
      this.setTableFontStyle(tdList, data.tableValue);

      //小数精度
      // this.setDataPrecision({ decimals: data.tableValue.decimals });


    }
  }

  /**
   * 页码
   */
  pageIndexChange(index: any) {
    this.parameters.page = index;
    DomEvent.fireEvent(this.cmtable.nativeElement, ComponentEvent.COMFILTERCHANGE, {
      data: this.parameters,
      bubble: true,
      componentIsChange: true
    });
  }

  pageSizeChange(pagesize: any) {
    this.parameters.pageSize = pagesize;
    setTimeout(() => {
      DomEvent.fireEvent(this.cmtable.nativeElement, ComponentEvent.COMFILTERCHANGE, {
        data: this.parameters,
        bubble: true,
        componentIsChange: true
      });
    }, 200);

  }

  tableSort: boolean = false;
  /**
   * 排序
   * @param name 排序字段
   * @param value 排序类型
   */
  sort(field: any, value: any) {
    this.tableSort = true;
    for (let key in this.sortMap) {
      if (field == key) {
        this.sortValue.value = this.sortValue.value ? (this.sortValue.value == "ascend" ? "descend" : "ascend") : value;
        this.sortValue.key = key;
        let sort = (this.sortValue.value == "ascend" ? "asc" : "desc");
        this.sortMap[field] = this.sortValue.value;
        this.updateOrderBy({ field: key, order: sort })
      } else {
        this.sortMap[field] = null;
      }
    }
    DomEvent.fireEvent(this.cmtable.nativeElement, ComponentEvent.COMFILTERCHANGE, {
      data: this.parameters,
      bubble: true,
      componentIsChange: true
    });
  }

  /**
   * 更新排序字段
   * @param orderBy 排序对象
   */
  updateOrderBy(orderBy: any) {
    //删除
    let len = this.parameters.orderBy.length;
    for (let i = 0; i < len; i++) {
      if (this.parameters.orderBy[i]['field'] == orderBy['field']) {
        this.parameters.orderBy.splice(i, 1);
        break;
      }
    }
    this.parameters.orderBy.unshift(orderBy);
  }

  /**
   * 设置表格的颜色
   * @param lists 设置的元素
   * @param style 设置的样式属性
   */
  setTableColor(lists: any, style: any, value: any) {
    if (lists.length > 0) {
      //表头背景
      for (let i = 0; i < lists.length; i++) {
        lists[i].style[style] = value;
      }
    }
  }

  /**
   * 设置表格的奇偶行背景
   * @param lists 设置的元素
   * @param obj 设置的样式对象
   * @param colums 表格的列数
   */
  setTableRowColor(lists: any, obj: any, colums: number) {
    //奇偶行背景
    for (let j = 0; j < lists.length; j++) {
      let row = Math.ceil((j + 1) / colums);
      if (obj.even && row % 2 == 0) {//偶数
        lists[j].style.backgroundColor = obj.even;
      }
      if (obj.odd && row % 2 != 0) {
        lists[j].style.backgroundColor = obj.odd;
      }
    }
  }

  /**
   * 设置元素的字体样式
   * @param lists 设置的元素
   * @param style 设置的样式对象
   */
  setTableFontStyle(lists: any[] = [], style: any) {
    if (lists.length > 0) {
      for (let i = 0; i < lists.length; i++) {
        for (let key in style) {
          lists[i].style[key] = style[key];
        }
      }
    }

  }

  /**
   * 设置数据的精度
   * @param obj 精度
   */
  setDataPrecision(obj: any) {
    if (obj && obj.decimals != "auto" && this.originData) {
      this.data = JSON.parse(JSON.stringify(this.originData));
      for (let item of this.data) {
        for (let key in this.metrics) {
          if (!isNaN(Number(item[this.metrics[key]]))) {
            item[key] = Number(item[key]).toFixed(obj.decimals - 0);
            item[this.metrics[key]] = this.setPrecision(item[this.metrics[key]]);
          }
        }
      }
    }
  }
  /**
    * 设置数据的精度2位
    * @param obj 精度
    */
  setPrecision(obj: any, cont?: any) {
    if (cont) {
      if (!isNaN(Number(obj))) {
        obj = Number(obj);
        if (obj !== 0) {
          let content;
          content = this.Thousands(Number(obj.toFixed(2)));
          let m = (content + '').split(".");
          if (m.length != 1) {
            if (m[1].length != 2) {
              content = m[0] + "." + m[1] + "0";
            }
          }
          return content;
        }
      }
      return;
    } else {
      let ten: Number = 100000,
        cent: boolean = false;
      if (Number(obj) >= ten) {
        obj = obj / 10000;
        cent = true;
      }
      if (!isNaN(Number(obj))) {
        obj = Number(obj);
        let content;
        content = this.Thousands(Number(obj.toFixed(2)));
        let m = (content + '').split(".");
        if (m.length != 1) {
          if (m[1].length != 2) {
            content = m[0] + "." + m[1] + "0";
          }
        }
        if (content == "100,000") {
          return "10万";
        }
        if (cent) {
          cent = false;
          return content + "万";
        } else {
          return content;
        }

      }
      return;
    }

  }
  /**
   * 转为千分位
   * @param number 
   */
  Thousands(number: any) {
    if (number == 0) {
      return number;
    } else if (number == 0.0) {
      return number;
    }
    var num = number + "";
    num = num.replace(new RegExp(",", "g"), "");
    // 正负号处理
    var symble = "";
    if (/^([-+]).*$/.test(num)) {
      symble = num.replace(/^([-+]).*$/, "$1");
      num = num.replace(/^([-+])(.*)$/, "$2");
    }
    if (/^[0-9]+(\.[0-9]+)?$/.test(num)) {
      var num = num.replace(new RegExp("^[0]+", "g"), "");
      if (/^\./.test(num)) {
        num = "0" + num;
      }
      var decimal = num.replace(/^[0-9]+(\.[0-9]+)?$/, "$1");
      var integer = num.replace(/^([0-9]+)(\.[0-9]+)?$/, "$1");
      var re = /(\d+)(\d{3})/;
      while (re.test(integer)) {
        integer = integer.replace(re, "$1,$2");
      }
      return symble + integer + decimal;
    } else {
      return number;
    }
  }
  public onSizeChange() {
    // this.cmchart && this.cmchart.echarts && this.cmchart.echarts.resize()
  }

  public onVisualArea(scope: string, data?: any) {
    EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope, componentFilter: data });
  }

  ngOnDestroy() {

  }

}
