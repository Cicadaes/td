import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ChinaMapChartService } from './china-map-chart.service';

@Component({
  selector: 'app-china-map-chart',
  templateUrl: './china-map-chart.component.html',
  styleUrls: ['./china-map-chart.component.css']
})
export class ChinaMapChartComponent implements OnInit {
  @Input() chart: any;
  @Input() dataRange: any;
  @Input() mapChinaCenter: any;
  @Input() mapZoom: any;
  @Input() searchName: any;
  //  @Output() onBack = new EventEmitter<any>();

  _option: any;
  _chartData: any;
  _chartDataTop10: any[];
  _seriesData: any[];
  _chartDataItemStyle: any[];
  _isLoading: boolean;
  _searchName: any = '';

  public colorForChina: any = [
    '#285FC6',
    '#0085E4',
    '#3399FF',
    '#37AEFF',
    '#63B1FB',
    '#85C1FB',
    '#A3D1FD',
    '#C3E1FD',
    '#E2F1FF',
    '#DBEDFD'
  ];
  _chart: any = {
    url: '',
    param: null,
    type: 'chart',
    name: ''
  };

  constructor(private service: ChinaMapChartService) {}

  _rebuildChartDataToMap() {
    if (this._chartData && this._chartData.data.length > 0) {
      this._seriesData = [];
      this._chartDataTop10 = [];
      this._chartDataItemStyle = [];
      for (let i = 0; i < this._chartData.data.length; i++) {
        if (i < 10) {
          this._chartDataTop10.push(this._chartData.data[i]);
          this._seriesData.push({
            name: this._chartData.data[i].objectName,
            value: this._chartData.data[i].rate,
            activeUsers: this._chartData.data[i].activeUsers || 0,
            num: i + 1,
            dataRange: this.dataRange,
            itemStyle: {
              areaStyle: this._chartData.data[i].rate > 0 ? this.colorForChina[i] : '#DBEDFD',
              color: this._chartData.data[i].rate > 0 ? this.colorForChina[i] : '#DBEDFD'
            }
          });
        } else {
          this._seriesData.push({
            name: this._chartData.data[i].objectName,
            value: this._chartData.data[i].rate,
            activeUsers: this._chartData.data[i].activeUsers || 0,
            num: i + 1,
            dataRange: this.dataRange,
            itemStyle: {
              areaStyle: '#DBEDFD',
              color: '#DBEDFD'
            }
          });
        }
        if (this._searchName.indexOf(this._seriesData[i].name) != -1) {
          this._seriesData[i].selected = true;
        }
      }
    }
  }

  _min(list: any[]) {
    let min = 0;
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].value < min) {
          min = list[i].value;
        }
      }
    }
    return min;
  }

  _max(list: any[]) {
    let max = 0;
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].value > max) {
          max = list[i].value;
        }
      }
    }
    return max;
  }

  // 初始化地图div的高度
  resizeHeight() {
    const divMain = document.getElementById('map-main');
    divMain.style.height = window.innerHeight - 56 + 'px';
  }

  queryData() {
    if (this.chart.url && this.chart.param) {
      this._isLoading = true;

      this.service.getDatas(this.chart.url, this.chart.param).subscribe((response: any) => {
        this._isLoading = false;
        if (response) {
          this._chartData = response;
          this._rebuildChartDataToMap();
          this.setOptions();
        }
      });
    }
  }

  setOptions() {
    this._option = {
      backgroundColor: 'rgba(248,248,248,0.8)',
      title: {
        text: 'China',
        subtext: '',
        show: false
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params, ticket, callback) {
          // // console.log(params)
          let res = '';
          if (params && params.data) {
            res += `No.${params.data.num}${params.name}`;
            res += `<br/>数量 ${params.data.activeUsers}`;
            res += `<br/>占比 ${params.data.value}%`;
            res += `<br/>${params.data.dataRange}`;
          }
          return res;
        },
        textStyle: {
          fontSize: 12
        }
      },
      // legend: {
      //     orient: 'vertical',
      //     left: 'left',
      //     //data:this._chartData.legend,
      //     show:false
      // },
      style: {
        normal: {
          borderWidth: 1,
          borderColor: '#FFFFFF',
          label: {
            show: true,
            font: '12px bold ',
            color: '#fff'
          }
        },
        mouseOver: {
          backgroundColor: 'rgba(248,217,146,1)',
          label: {
            show: true,
            font: '13px bold ',
            color: 'rgba(179,114,26,1)'
          }
        },
        selected: {
          backgroundColor: 'rgba(248,217,46,1)',
          label: {
            show: true,
            font: '13px bold ',
            color: 'rgba(179,114,26,1)'
          }
        }
      },
      // visualMap: {
      //     min: this._chartData._min || 0,
      //     max: this._chartData._max || 2000,
      //     left: 'left',
      //     top: 'bottom',
      //     text: ['高','低'],           // 文本，默认为数值文本
      //     calculable: true
      // },
      toolbox: {
        feature: {
          saveAsImage: {}
        },
        show: false
      },
      series: [
        {
          name: '中国',
          type: 'map',
          mapType: 'china',
          roam: true,
          label: {
            normal: {
              show: true,
              color: '#fff'
            },
            emphasis: {
              show: false
            }
          },
          zoom: this.mapZoom,
          center: this.mapChinaCenter,
          itemStyle: {
            borderColor: '#FFFFFF',
            color: '#fff',
            backgroundColor: 'rgba(248,217,146,1)'
          },
          scaleLimit: {
            min: 0.7,
            max: 25
          },
          data: this._seriesData
        }
      ]
    };
  }

  init() {
    this.queryData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.chart) {
      this._chart = changes.chart.currentValue;
      this.init();
    }

    if (changes.searchName) {
      this._searchName = changes.searchName.currentValue ? changes.searchName.currentValue : '';
      this._rebuildChartDataToMap();
      this.setOptions();
    }
    if (changes.mapZoom && changes.mapZoom.currentValue) {
      this.setOptions();
    }
  }

  ngOnInit(): void {}
}
