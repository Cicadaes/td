import { Component, Injector, OnInit, OnChanges } from '@angular/core';
import { GeoData } from './position-analysis.model';
import { PositionAnalysisService } from './position-analysis.service';
import { BaseComponent } from '../../common/base-component';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-position-analysis',
  templateUrl: './position-analysis.component.html',
  styleUrls: ['./position-analysis.component.less']
})
export class PositionAnalysisComponent extends BaseComponent implements OnInit, OnChanges {
  zoomName: string = 'world'; // 世界地图和中国地图切换
  searchName: string = null; // 搜索框内容
  worldMapInstance: any; // 世界地图实例，echarts
  chinaMapInstance: any; // 中国地图实例，inmap
  curNameList: any = GeoData.worldNameList; // 搜索下拉备选列表，根据地图类型切换

  worldZoom: number = 1.1; // 世界地图缩放比例
  worldCenter: any = [0.0, 20.0]; // 世界地图中心坐标

  chinaZoom: number = 1.2; // 世界地图缩放比例
  chinaCenter: any = ['103.824028', '36.065689']; // 中国地图中心坐标
  chinaZoomMin: any = 0.7;
  chinaZoomMax: any = 25;

  curTop10List: any = [];
  worldTop10List: any = [];
  chinaTop10List: any = [];

  searchShow: any = false; // 搜索面板显示
  topShow: any = true; // top10面板显示

  worldData: any; // 世界地图数据

  worldChartOption: any;

  worldZoomMin: any = 0.7;
  worldZoomMax: any = 10;
  chinaClick: any = 0;

  chinaData: any;
  subTitle: any = '';
  chinaMapParam: any = {
    url: '',
    param: null,
    type: 'chart',
    name: ''
  };

  constructor(private positionService: PositionAnalysisService, private injector: Injector) {
    super(injector);
    this.initRouterList('全量移动用户位置分析');
  }

  ngOnInit() {
    // 初始化地图div的高度
    this.resizeHeight();

    this.initWorldMapSimple();

    this.positionService.getChinaGeo().subscribe((response: any) => {
      this.chinaData = response;
    });

    // 窗口缩放监听
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(event => {
        this.resizeHeight();
        if (this.zoomName === 'world') {
          this.worldMapInstance.resize();
        }
      });
  }

  toThousands(numIn: any) {
    let num = (numIn || 0).toString(),
      result = '';
    while (num.length > 3) {
      // result = ',' + num.slice(-3) + result;
      result = `,${num.slice(-3) + result}`;

      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return result;
  }

  // 初始化地图div的高度
  resizeHeight() {
    const divMain = document.getElementById('map-main');
    divMain.style.height = '${window.innerHeight - 56}px';
  }

  onDataChange(event) {
    const startDateTip = event.dateParam.startDateTip;
    const endDateTip = event.dateParam.endDateTip;
    this.subTitle = `${startDateTip}~${endDateTip}`;
    if (event.zoomName) {
      this.changeZoomName(event.zoomName);
    }

    if (this.zoomName === 'world') {
      this.requestWorldData(event.dateParam);

      // 恢复中心点和缩放
      if (event.zoomName) {
        this.worldMapInstance.setOption({
          series: [
            {
              zoom: 1.1,
              center: this.worldCenter
            }
          ]
        });
      }
    } else {
      this.requestChinaData(event.dateParam);
    }
  }

  // 切换地图
  changeZoomName(zoomName) {
    this.searchName = null;
    this.zoomName = zoomName;
    if (zoomName === 'world') {
      this.curNameList = GeoData.worldNameList;
      this.curTop10List = this.worldTop10List;
      this.chinaZoom = 1.2;
    } else {
      this.curNameList = GeoData.chinaNameList;
      this.curTop10List = this.chinaTop10List;
      this.worldZoom = 1.1;
    }
  }

  // 选择搜索结果
  selectHit(name: string) {
    if (this.zoomName === 'world') {
      // 中文翻译成英文
      this.worldZoom = 1.1;
      const tmpName = GeoData.nameMap2[name] || name;
      for (let i = 0; i < this.worldData.length; i++) {
        const obj = this.worldData[i];
        if (obj.name === tmpName || obj.name === GeoData.nameMapForWorldReverse[tmpName]) {
          obj.selected = true;
        } else {
          obj.selected = false;
        }
      }

      const center = GeoData.worldCenterMap[name] || this.worldCenter;
      this.worldMapInstance.setOption({
        series: [
          {
            zoom: name ? 8 : this.worldZoom,
            center: center,
            data: this.worldData
          }
        ]
      });
      // 恢复中心点和缩放
      if (!name) {
        this.worldMapInstance.setOption({
          series: [
            {
              zoom: 1.1,
              center: [0.0, 20.0]
            }
          ]
        });
      }
    } else {
      const center = GeoData.chinaCenterMap[name] || ['103.824028', '36.065689'];
      this.chinaZoom = name ? (name === '香港' || name === '澳门' ? 25 : 7) : 1.2;
      this.chinaCenter = center;
      this.searchName = name;
    }
  }

  // 世界地图缩放
  zoomWorld(num: number) {
    const curOption = this.worldMapInstance.getOption();
    this.worldZoom = this.zoomName === 'world' ? curOption.series['0'].zoom : 1.1;
    if (this.worldZoom <= this.worldZoomMin && num === -1) {
      return;
    }
    if (this.worldZoom >= this.worldZoomMax && num === 1) {
      return;
    }
    if (this.zoomName === 'world') {
      this.chinaZoom = 1.2;
      if (num === 1) {
        this.worldZoom *= 1.21;
      } else if (num === -1) {
        this.worldZoom /= 1.21;
      } else if (num === 0) {
        this.worldZoom = 1.331;
      }
      this.worldMapInstance.setOption({
        series: [
          {
            zoom: this.worldZoom
            // center: this.worldCenter,
          }
        ]
      });
    } else if (this.zoomName === 'china') {
      this.worldZoom = 1.1;
      if (num === 1) {
        this.chinaZoom *= 1.21;
      } else if (num === -1) {
        this.chinaZoom /= 1.21;
      } else if (num === 0) {
        this.chinaZoom = 1.331;
      }
    }
  }

  // 初始化世界地图
  initWorldMapSimple() {
    // 初始化世界地图
    const echarts = window['echarts'];

    // 基于准备好的dom，初始化echarts实例
    this.worldMapInstance = echarts.init(document.getElementById('world-map'));

    const _that = this;
    this.worldMapInstance.on('click', function(params) {
      if (params.name === 'China') {
        _that.chinaClick++;
      }
    });

    // 初始化世界地图 end
    this.worldChartOption = {
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          return `NO.${params.data ? params.data.index : ''} ${
            params.data ? params.data.objectName : params.name
          }<br/>数量 ${params.value ? _that.toThousands(params.value) : 0}<br/>占比 ${
            params.data ? params.data.rate : '0.0'
          } %<br/>${_that.subTitle}`;
        },
        textStyle: {
          fontSize: 12
        },
        padding: 8
      },
      series: [
        {
          name: 'World',
          type: 'map',
          zoom: this.worldZoom,
          center: this.worldCenter,
          mapType: 'world',
          roam: 'move',
          emphasis: {
            label: {
              show: true,
              formatter: function(obj) {
                return obj.data.objectName || obj.data.name;
              }
            }
          },
          itemStyle: {
            borderColor: '#FFFFFF'
          },
          scaleLimit: {
            min: this.worldZoomMin,
            max: this.worldZoomMax
          },
          nameMap: GeoData.nameMapForWorld,
          selectedMode: 'single',
          data: []
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    this.worldMapInstance.setOption(this.worldChartOption);
  }

  // 查询世界地图数据
  requestWorldData(dateParam: any) {
    // 请求世界地图数据，返回后加载世界地图
    this.positionService.countryList(dateParam).subscribe(
      (response: any) => {
        let maxValue = 0;
        const dataTmp = [];
        for (let i = 0; i < response.data.length; i++) {
          const obj = response.data[i];
          dataTmp.push({
            name: obj.echartObjectName,
            value: obj.activeUsers || 0,
            rate: obj.rate,
            index: i + 1,
            objectName: obj.objectName
          });
          if (obj.activeUsers > maxValue) {
            maxValue = obj.activeUsers;
          }
        }

        // 将未映射的名称加入列表，用于检索高亮显示(可能是echarts的一个bug)
        for (const key in GeoData.nameMapForWorld) {
          if (GeoData.nameMapForWorld.hasOwnProperty(key)) {
            dataTmp.push({
              name: key,
              value: 0,
              rate: 0,
              index: 0
            });
          }
        }

        const top10Tmp = [];
        for (let i = 0; i < dataTmp.length; i++) {
          const obj = dataTmp[i];
          if (!obj.name) {
            continue;
          }
          if (top10Tmp.length < 10) {
            top10Tmp.push({
              name: obj.objectName || obj.name,
              value: obj.value,
              rate: obj.rate
            });
          }
        }
        this.curTop10List = top10Tmp;
        this.worldTop10List = top10Tmp;

        this.worldData = dataTmp;
        this.changeWorldMap(dataTmp, maxValue);
        this.selectHit(this.searchName);
      },
      error => {
        // console.log('oops', error);
      }
    );
  }

  // 查询中国地图数据
  requestChinaData(dateParam: any) {
    this.chinaMapParam = {
      url: this.positionService.provinceListUrl,
      param: dateParam,
      type: 'chart',
      name: ''
    };
    this.positionService.provinceList(dateParam).subscribe((response: any) => {
      let maxValue = 0;
      const dataMap = {};
      const chinaRateMap = {};
      const indexMap = {};
      for (let i = 0; i < response.data.length; i++) {
        const obj = response.data[i];
        dataMap[obj.echartObjectName] = obj.activeUsers;
        chinaRateMap[obj.echartObjectName] = obj.rate;
        indexMap[obj.echartObjectName] = i + 1;

        if (obj.activeUsers > maxValue) {
          maxValue = obj.activeUsers;
        }
      }

      const top10Tmp = [];
      for (let i = 0; i < response.data.length; i++) {
        const obj = response.data[i];
        if (!obj.objectName) {
          continue;
        }
        if (top10Tmp.length < 10) {
          top10Tmp.push({
            name: obj.objectName,
            value: obj.activeUsers,
            rate: obj.rate
          });
        }
      }
      this.curTop10List = top10Tmp;
      this.chinaTop10List = top10Tmp;

      this.changeChinaMap(dataMap, chinaRateMap, maxValue, indexMap);
      this.selectHit(this.searchName);
    });
  }

  // 更新世界地图
  changeWorldMap(data: any, maxValue: number) {
    const curOption = this.worldMapInstance.getOption();

    if (curOption) {
      this.worldZoom = curOption.series['0'].zoom;
      this.worldCenter = curOption.series['0'].center;
    }
    const length = data.length;
    for (let i = 0; i < length; i++) {
      data[i]['itemStyle'] = {};
      if (data[i].index <= 10 && data[i].value > 0) {
        data[i].itemStyle['areaColor'] = GeoData.colorForWorld[data[i].index - 1];
        data[i].itemStyle['color'] = GeoData.colorForWorld[data[i].index - 1];
      } else {
        data[i].itemStyle['areaColor'] = GeoData.colorForWorld[0];
        data[i].itemStyle['color'] = GeoData.colorForWorld[9];
      }
    }

    this.worldChartOption.series[0].data = data;
    this.worldChartOption.series[0].zoom = this.worldZoom;
    this.worldChartOption.series[0].center = this.worldCenter;

    // 使用刚指定的配置项和数据显示图表。
    this.worldMapInstance.setOption(this.worldChartOption);
  }

  // 更新中国地图
  changeChinaMap(dataMap: any, chinaRateMap: any, maxValue: any, indexMap: any) {
    const splitList = [];
    if (maxValue === 0) {
      splitList.push({
        start: 0,
        end: 1,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        backgroundColor: '#DBEDFD'
      });
    } else {
      for (const key in dataMap) {
        if (dataMap.hasOwnProperty(key)) {
          let bg = '#DBEDFD';
          if (indexMap[key] <= 10) {
            if (dataMap[key] > 0) {
              bg = GeoData.colorForChina[10 - indexMap[key]];
            }
          }
          splitList.push({
            start: dataMap[key],
            end: this.chinaTop10List[indexMap[key]]
              ? indexMap[key] - 2 > 0
                ? this.chinaTop10List[indexMap[key] - 2].value
                : dataMap[key] + 1
              : dataMap[key] + 1,
            borderColor: '#FFFFFF',
            borderWidth: 1,
            backgroundColor: bg
          });
        }
      }
    }

    if (this.chinaData && this.chinaData.length > 0) {
      for (let i = 0; i < this.chinaData.length; i++) {
        const obj = this.chinaData[i];
        obj.count = dataMap[obj.name] || 0;
        obj.rate = chinaRateMap[obj.name] || '0.0';
        obj.index = indexMap[obj.name];
      }
    }
  }
}
