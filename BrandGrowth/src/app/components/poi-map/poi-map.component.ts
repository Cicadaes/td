import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

import { CmMessageService } from 'ng-cosmos-td-ui';

import nzGlobalMonitor from '../../utils/nz-global-monitor';
// 地图配色文件
import { BAIDU_MAP_STYLE, BAIDU_MAP_DRAWING_STYLE } from '../../constants/map-info';

const _ = require('lodash');

@Component({
  selector: 'poi-map',
  templateUrl: './poi-map.component.html',
  styleUrls: ['./poi-map.component.less']
})
export class PoiMapComponent implements OnInit {
  @Input() selectedData: any[] = [];
  @Output() onClosePoiMap = new EventEmitter<any>();
  @Output() onSavePoiMap = new EventEmitter<any>();

  private poiName: string = ''; // 创建的POI 名称
  private markerRadius: number = 5; // 初始化半径为 5
  private selectedList: any[] = []; // 已选的标记区域

  constructor(
    private _message: CmMessageService,
  ) { }

  ngOnInit() {
    this.initMap();
  }

  private myMap: any = null; // 实例化地图
  private localSearch: any = null; // 地图检索
  private searchContent: any = ''; // 地图检索内容
  private searchOptions: any[] = []; // 检索后获得的POI数据
  initMap() {
    const self = this;
    // 实例化地图 报错没问题！
    const map = new window['BMap'].Map('poi-map-content-map', {
      minZoom: 12,
      maxZoom: 16,
      enableMapClick: false,
    });
    map.centerAndZoom('北京市', 12);
    //开启鼠标滚轮缩放
    map.enableScrollWheelZoom(true);
    // 更改地图底色
    map.setMapStyle({
      styleJson: BAIDU_MAP_STYLE,
    });
    // 城市控件
    const size = new window['BMap'].Size(16, 16);
    map.addControl(new window['BMap'].CityListControl({
      anchor: 'BMAP_ANCHOR_TOP_LEFT',
      offset: size,
    }));

    //添加检索功能组件
    self.localSearch = new window['BMap'].LocalSearch(map, {
      onSearchComplete(results: any) {//搜索完成后的回掉函数
        let s = [];
        if (results) {
          for (let i = 0; i < results.getCurrentNumPois(); i++) {
            let valuePoi = {
              value: results.getPoi(i).title,
              poi: JSON.stringify(results.getPoi(i).point),
            };
            s.push(valuePoi);
          }
        }
        self.searchOptions = s;
      }
    });

    // 地图拖拽事件
    map.addEventListener('dragging', (e: any) => {
      // 当POI弹窗存在时 修改弹窗位置
      if (this.poiMapModal) {
        const point = this.drawingManager.overlay.point ? this.drawingManager.overlay.point
         : this.drawingManager.overlay.getPath();
        this.onChangePoiModal(true, this.poiMapModalType, point);
      }
    });
    map.addEventListener('load', () => {
      self.myMap = map;
      this.initDraw();
    });
  }

  // 初始化绘制工具
  private drawingManager: any = {
    DRAWINGMODELTYPES: ['BMAP_DRAWING_MARKER', 'BMAP_DRAWING_POLYGON'],
    obj: null,
    selectedType: '',
    overlay: null,
  };
  initDraw() {
    //实例化鼠标绘制工具
    const drawingManager = new window['BMapLib'].DrawingManager(this.myMap, {
      isOpen: false, //是否开启绘制模式
      enableDrawingTool: false, //是否显示工具栏
      drawingToolOptions: {
        anchor: 'BMAP_ANCHOR_TOP_RIGHT', //位置
        offset: new window['BMap'].Size(5, 5), //偏离值
      },
      circleOptions: BAIDU_MAP_DRAWING_STYLE, //圆的样式
      polygonOptions: BAIDU_MAP_DRAWING_STYLE, //多边形的样式
    });

    // 添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', (e: any) => {
      const polygon = e.overlay; // 覆盖物的信息 
      const type = e.drawingMode; // 当前绘制的类型
      if (type === 'marker') {
        this.onChangePoiModal(true, type, polygon.point);
        const circle = this.drawCircle(polygon.point);
        this.drawCircleInfo = {
          markerPoint: polygon,
          circle,
        };
        this.myMap.addOverlay(circle); // 圆
      } else if (type === 'polygon') {
        // 获取多边形坐标点集合
        const pointList = polygon.getPath();
        // 当绘制的点少于两个时，围栏不成立
        if (pointList.length > 2) {
          this.onChangePoiModal(true, type, pointList);
        } else {
          this.clearDraw();
        }
      }
      this.drawingManager.overlay = polygon;
      this.drawingManager.obj.close();
      this.drawingManager.selectedType = '';
    });
    this.drawingManager.obj = drawingManager;
    if (this.selectedData.length > 0) {
      this.selectedList = this.selectedData.map((item: any) => {
        const type = item.name === 'circle';
        let overlay: any = null;
        if (type) {
          const marker = new window['BMap'].Marker(item.ps[0]);
          overlay = {
            markerPoint: marker,
            circle: this.drawCircle(item.ps[0], item.range * 1000),
          };
          this.myMap.addOverlay(marker);
          this.myMap.addOverlay(overlay.circle);
        } else {
          overlay = this.drawPolygon(item.ps);
          this.myMap.addOverlay(overlay);
        }
        const info = this.setDrawItemInfo(item.customName, item.name, item.ps, overlay, item.range);
        return info;
      });
    }
  }

  /**
   * 设置绘制类型
   * @param {[String]} type [当前绘制的图形类型]
   */
  setDrawingModeType(type: any) {
    // 初始化绘制操作
    this.clearDraw();
    this.drawingManager.selectedType = type;
    this.openPolygon();
  }

  // 开启绘制
  openPolygon() {
    const type = this.drawingManager.selectedType === this.drawingManager.DRAWINGMODELTYPES[0] ?
      window['BMAP_DRAWING_MARKER'] : window['BMAP_DRAWING_POLYGON'];
    this.drawingManager.obj.open();
    this.drawingManager.obj.setDrawingMode(type);
  }

  // 初始化覆盖物相关参数
  clearDraw() {
    // 删除未保存的图形
    if (this.drawingManager.overlay && !this.drawingManager.overlay.data && !this.editPoiItemInfo) {
      this.myMap.removeOverlay(this.drawingManager.overlay);

      if (this.drawCircleInfo) {
        this.myMap.removeOverlay(this.drawCircleInfo.markerPoint);
        this.myMap.removeOverlay(this.drawCircleInfo.circle);
      }
    }
    
    this.poiName = '';
    this.markerRadius = 5;
    this.editPoiItemInfo = null;
    this.oldOverlayInfo = null;
    this.drawingManager.selectedType = '';
    this.drawingManager.overlay = null;
    this.onChangePoiModal(false);
  }
  
  /**
   * 绘制圆
   * @param center [当前选择的点的坐标]
   * @param radius [绘制圆的半径，默认为5000]
   */
  drawCircle(center: any, radius: number = 5000) {
    return new window['BMap'].Circle(center, radius, BAIDU_MAP_DRAWING_STYLE);
  }

  /**
   * 修改圆形半径
   * @param value [修改绘制的圆形半径] 
   */
  private drawCircleInfo: any = null;
  onRadiusChange(value: number) {
    const radius = value * 1000;
    this.drawCircleInfo.circle.setRadius(radius);
  }

  /**
   * 绘制多边形
   * @param points [多边形坐标点集合]
   */
  drawPolygon(points: any) {
    return new window['BMap'].Polygon(points, BAIDU_MAP_DRAWING_STYLE);
  }

  /**
   * POI名称修改的事件
   * @param value [填写的内容]
   */
  onChangePoiName(value: any) {
    this.requiredMessage = this.poiName === '';
  }

  // 保存当前POI图形
  private requiredMessage: boolean = false; // 判断POI名称是否填写
  saveDrawInfo() {
    if (this.poiName === '') {
      this.requiredMessage = this.poiName === '';
      return;
    }
    // 创建图形
    if (!this.editPoiItemInfo) {
      const flag = this.poiMapModalType === 'marker';
      const type = flag ? 'circle' : 'polygon';
      const ps = flag ? [this.drawingManager.overlay.point] : this.drawingManager.overlay.getPath();
      const overlay = flag ? this.drawCircleInfo : this.drawingManager.overlay;
      const range = flag ? this.markerRadius : 0;
      const drawInfo = this.setDrawItemInfo(this.poiName, type, ps, overlay, range);
      this.selectedList.push(drawInfo);
    } else { // 编辑图形
      const info = this.editPoiItemInfo;
      const flag = info.name === 'circle';
      const range = flag ? this.markerRadius : 0;
      const overlay = flag ? this.drawCircleInfo : this.drawingManager.overlay;
      this.selectedList = this.selectedList.map((item: any) => {
        let data = item;
        if (data.id === info.id) {
          const drawInfo = this.setDrawItemInfo(this.poiName, info.name, info.ps, overlay, range, info.id);
          data = _.merge({}, drawInfo);
        }
        return data;
      });
    }
    this.drawingManager.overlay = null;
    this.drawCircleInfo = null;
    this.clearDraw();
  }

  // 取消对当前图形的操作
  cancel() {
    if (this.oldOverlayInfo) {
      if (this.oldOverlayInfo.markerPoint) {
        this.myMap.addOverlay(this.oldOverlayInfo.markerPoint);
        this.myMap.addOverlay(this.oldOverlayInfo.circle);
      } else {
        this.myMap.addOverlay(this.oldOverlayInfo);
      }
    }
    this.editPoiItemInfo = null;
    this.clearDraw()
  }

  /**
   * 整合图形数据
   * @param name [图形的名称]
   * @param type [图形类型]
   * @param ps [图形的坐标点集合]
   * @param overlay [图形的实例overlay]
   * @param range [图形半径]
   */
  private poiItemId: number = 0; // poi数据的id项
  private editPoiItemInfo: any = null; // 编辑的图形信息
  private oldOverlayInfo: any = null; // 编辑之前的图形实例
  setDrawItemInfo(name: string, type: string, ps: any, overlay: any, range: number = 0, id?: string) {
    const flag = type === 'circle';
    const info = {
      id: id || `poiId_${this.poiItemId}`,
      customName: name,
      type: flag ? 1 : 2,
      name: type,
      range,
      ps,
      overlay,
    };
    // 添加点击事件 开启编辑图形状态
    const overlayEvent = flag ? info.overlay.circle : info.overlay;
    if (id) {
      overlayEvent.removeEventListener('click');
    }
    overlayEvent.addEventListener('click', (e: any) => {
      let o: any = null;
      // 编辑时删除之前的图形实例，在地图上绘制新的图形实例进行编辑
      this.oldOverlayInfo = info.overlay;
      if (flag) {
        this.myMap.removeOverlay(info.overlay.markerPoint);
        this.myMap.removeOverlay(info.overlay.circle);
        const markerPoint = new window['BMap'].Marker(info.overlay.markerPoint.point);
        const circle = this.drawCircle(info.overlay.circle.getCenter(), info.overlay.circle.getRadius());
        this.myMap.addOverlay(markerPoint);
        this.myMap.addOverlay(circle);
        o = {
          markerPoint,
          circle,
        };
      } else {
        this.myMap.removeOverlay(info.overlay);
        const p = this.drawPolygon(info.overlay.getPath());
        this.myMap.addOverlay(p);
        o = p;
      }
      // 显示编辑提示框
      if (!this.poiMapModal) {
        this.editPoiItemInfo = info;
        this.poiName = name;
        this.markerRadius = range;
        this.drawCircleInfo = flag ? o : null;
        this.drawingManager.overlay = flag ? o.markerPoint : o;
        const point = flag ? o.circle.point : o.getPath();
        let modalType = flag ? 'marker' : type;
        this.onChangePoiModal(true, modalType, point);
      }
    });
    if (!id) {
      this.poiItemId ++;
    }
    return info;
  }

  /**
   * [放大缩小地图级别]
   * @param {[Boolean]} type [true=放大 | false=缩小]
   */
  setScale(type: boolean) {
    let level = this.myMap.getZoom();
    type ? this.myMap.setZoom(++level) : this.myMap.setZoom(--level);
  }

  /**
   * 地图检索操作
   * @param value [搜索的内容]
   **/
  onSearchMap(value: any) {
    this.localSearch.search(value);
  }

  /**
   * 搜索后点击绘制的图形
   * @param info [搜索后选择的数据]
   */
  onSearchDraw(info: any) {
    if (!info) return;
    this.clearDraw();
    const marker = new window['BMap'].Marker(JSON.parse(info.poi));
    const circle = this.drawCircle(JSON.parse(info.poi));
    this.drawCircleInfo = {
      markerPoint: marker,
      circle,
    };
    this.myMap.addOverlay(marker);
    this.myMap.addOverlay(circle);
    this.poiName = info.value;
    this.poiMapModalType = 'marker';
    this.drawingManager.overlay = marker;
    this.onChangePoiModal(true, 'marker', circle.point);
  }

  /** 
   * POI地图弹窗操作
   * @param flag [弹窗显示隐藏]
   * @param type [当前绘制类型, 默认为空]
   **/
  private poiMapModal: boolean = false; // POI地图弹窗
  private poiMapModalType: string = ''; // 当前绘制类型
  private poiMapModalPosition: any = {}; // 弹窗定位
  onChangePoiModal(flag: boolean, type: string = '', position?: any) {
    let poi = {
      top: '0',
      left: '0',
    };
    if (flag) {
      const point = type === 'marker' ?
        {
          lng: position.lng,
          lat: position.lat
        } : {
          lng: position[0].lng,
          lat: position[0].lat
        };
      const pixel= this.myMap.pointToPixel(new window['BMap'].Point(point.lng, point.lat));
      const top = pixel.y - 100 < 0 ? 0 : pixel.y - 100;
      const left = pixel.x + 16 > 900 ? pixel.x - 376 : pixel.x + 16;
      poi = {
        top: `${top}px`,
        left: `${left}px`,
      };
    }
    this.poiMapModal = flag;
    this.poiMapModalType = flag ? type : '';
    this.poiMapModalPosition = poi;
  }

  /**
   * 已选标签点击事件
   * @param index [当前点击的tag 索引]
   */
  onClickTag(item: any) {
    const point = new window['BMap'].Point(item.ps[0].lng, item.ps[0].lat);
    this.myMap.panTo(point);
  }

  /**
   * 已选标签删除事件
   * @param index [当前删除的tag 索引]
   */
  onDeleteTag(index: number) {
    const list = this.selectedList;
    const data = list.filter((v: any, i: number) => i !== index);
    const item = list.filter((v: any, i: number) => i === index)[0];
    
    if (item.name === 'polygon') {
      this.myMap.removeOverlay(item.overlay);
    } else if (item.name === 'circle') {
      this.myMap.removeOverlay(item.overlay.markerPoint);
      this.myMap.removeOverlay(item.overlay.circle);
    }
    this.selectedList = data;
  }

  // 关闭POI地图
  closePoiMap() {
    this.clearDraw();
    this.selectedList = [];
    this.onClosePoiMap.emit()
  }

  // 保存POI地图数据
  savePoiData() {
    const list = this.selectedList.map((x: any) => {
      return {
        customName: x.customName,
        type: x.type,
        name: x.name,
        range: x.range,
        ps: x.ps,
      };
    });
    this.onSavePoiMap.emit(list);
  }
}
