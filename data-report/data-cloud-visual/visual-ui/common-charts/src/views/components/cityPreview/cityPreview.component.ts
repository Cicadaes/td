/**
 * Created by tommy on 2017/10/16.
 */
import {BaseComponent} from "../base.component";
import {CityPreviewTemplate} from "./cityPreview.template";
import {Utils} from '../../../../public/scripts/utils';
import {BaseCharts} from '../../base/base.chart';
import {DataSourceConfig} from "../../../dataSourceConfig";

import * as $ from 'jquery';

export class CityPreviewComponent extends BaseComponent {
    private bmap: any = null;
    private chartData: any = null;
    private lineData: any = null;
    private echartData: any = null;
    private BMap: any = null;
    private getSoreceData: any = null;
    private styleObj: any = null;
    private setchangeObj: any = null;
    private dataFull: any = [];
    private body: any = {
        'dimensions': null,
        'metrics': null,
        'filters': null
    };

    private latValue: any = 0;
    private lngValue: any = 0;
    private zoomValue: any = 14;
    private valueMax: any = 0;
    private zoomMap: any = {
        "6": 200000 / 0.57,
        "7": 100000 / 0.57,
        "8": 50000 / 0.57,
        "9": 25000 / 0.57,

        "10": 20000 / 0.91,
        "11": 10000 / 0.91,
        "12": 5000 / 0.91,

        "13": 2000 / 0.74,
        "14": 1000 / 0.74,
        "15": 500 / 0.74,

        "16": 200 / 0.59,
        "17": 100 / 0.59,
        "18": 50 / 0.59,

    };
    private dataIn: any;

    constructor() {
        super();
        let template = new CityPreviewTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.lineData = {};
        this.echartData = {}
        if (BaseCharts.BMap) {
            this.BMap = BaseCharts.BMap;
        }
    }

    public beforeShow(): void {

    }

    public afterShow(): void {
        if (!this.bmap) {
            this.init();
        }
    }

    public beforeDestory(): void {

    }

    public afterDestory(): void {

    }

    public resize(): void {
        //if (this.myChart) this.myChart.resize();
    }

    public setHtmlObj(changeObj: any): void {

    }

    public getconfiginformation(event: any, changeObj: any): void {
        this.setchangeObj = changeObj.result;
        this.setHtmlObj(changeObj.result);

        this.buildBody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }

        let tmp = [
            {
                "project_name": "Baihuodalou_Xinshijie",
                "active_users": 31214,
                "radio_active_users": 16661,
                "longitude": "108.2788233556",
                "latitude": "22.8364929356"
            }
        ];
    }

    public filterChange(event: any, data: any): void {
        let addObj: any = null;
        if (data.filter) {
            for (let i = 0; i < data.filter.length; i++) {
                let obj = data.filter[i];
                if (obj.field == "typeInOverall") {
                    addObj = {
                        "field": "project_type",
                        "operator": obj.operator,
                        "value": obj.value
                    }
                }
            }
            if (addObj) {
                data.filter.push(addObj);
            }
        }

        this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);

    }

    public getZoomValue(data: any): void {
        let latMax = 0;
        let lngMax = 0;
        let latMin = 9999;
        let lngMin = 9999;

        for (let i = 0; i < data.length; i++) {
            let obj = data[i];

            if (obj.active_users && obj.active_users > this.valueMax) {
                this.valueMax = obj.active_users;
            }
            if (obj.radio_active_users && obj.radio_active_users > this.valueMax) {
                this.valueMax = obj.radio_active_users;
            }

            if (obj.longitude && obj.latitude) {
                obj.longitude = parseFloat(obj.longitude);
                obj.latitude = parseFloat(obj.latitude);
                if (obj.longitude > lngMax) {
                    lngMax = obj.longitude;
                }
                if (obj.latitude > latMax) {
                    latMax = obj.latitude;
                }
                if (obj.longitude < lngMin) {
                    lngMin = obj.longitude;
                }
                if (obj.latitude < latMin) {
                    latMin = obj.latitude;
                }
            }
        }
        this.latValue = latMin + (latMax - latMin) / 2;
        this.lngValue = lngMin + (lngMax - lngMin) / 2;

        let zoom_lng_1 = 0.167876;
        let zoom_lng_2 = 0.679191;
        let zoom_lng_3 = 2.706702;
        let zoom_lng_4 = 10.716425;
        let zoom_lng_5 = 38.92868;

        let zoomLngValue = 14;
        let comp = lngMax - lngMin;
        if (comp < zoom_lng_1) {
            zoomLngValue = 14;
        } else if (comp < zoom_lng_2) {
            zoomLngValue = 12;
        } else if (comp < zoom_lng_3) {
            zoomLngValue = 10;
        } else if (comp < zoom_lng_4) {
            zoomLngValue = 8;
        } else if (comp < zoom_lng_5) {
            zoomLngValue = 6;
        }

        let zoom_lat_1 = 0.068682;
        let zoom_lat_2 = 0.295121;
        let zoom_lat_3 = 1.179063;
        let zoom_lat_4 = 4.612581;
        let zoom_lat_5 = 17.432626;

        let zoomLatValue = 14;
        let compLat = latMax - latMin;
        if (compLat < zoom_lat_1) {
            zoomLatValue = 14;
        } else if (compLat < zoom_lat_2) {
            zoomLatValue = 12;
        } else if (compLat < zoom_lat_3) {
            zoomLatValue = 10;
        } else if (compLat < zoom_lat_4) {
            zoomLatValue = 8;
        } else if (compLat < zoom_lat_5) {
            zoomLatValue = 6;
        }

        this.zoomValue = zoomLngValue < zoomLatValue ? zoomLngValue : zoomLatValue;

    }

    public dataChange(data_in: any): void {
        this.bmap.clearOverlays();
        let data_full: any = [];
        this.dataFull = [];
        if (data_in && data_in["环比阶段入店客流"] && data_in["环比阶段入店客流"].length > 0) {
            let data_2 = data_in["环比阶段入店客流"];
            for (let j = 0; j < data_2.length; j++) {
                data_2[j]['radio_active_users'] = data_2[j].active_users;
                data_in["环比阶段入店客流"][j]['radio_active_users'] = data_2[j]['radio_active_users'];
                delete data_2[j]["active_users"];
                delete data_in["环比阶段入店客流"][j]["active_users"];
            }
        }
        this.dataFull = data_in["本阶段入店客流"].concat(data_in["环比阶段入店客流"]);
        this.getZoomValue(this.dataFull);

        this.dataIn = data_in;
        this.refreshData();
    }

    public refreshData() {
        this.bmap.clearOverlays();
        let data_in = this.dataIn;
        if (data_in && data_in["环比阶段入店客流"] && data_in["环比阶段入店客流"].length > 0) {
            let data_2 = data_in["环比阶段入店客流"];
            this.draw(data_2, "radio_active_users");
        }

        if (data_in && data_in["本阶段入店客流"] && data_in["本阶段入店客流"].length > 0) {
            let data_1 = data_in["本阶段入店客流"];
            this.draw(data_1, "active_users");
        }

        let point = new this.BMap.Point(this.lngValue, this.latValue);
        this.bmap.centerAndZoom(point, this.zoomValue);
    }

    public styleChange(style: any): void {

    }

    public buildBody(result: any): void {

        this.body = DataSourceConfig.getConfigByKey(result.dscKey);

        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "cityPreview";
    }

    public loadData(): void {

    }

    public get data(): any {
        return this.chartData;
    }

    public draw(dataList: any, key: any): void {
        for (let i = 0; i < dataList.length; i++) {
            let obj = dataList[i];
            this.addMapCircle(obj, key);
        }
    }

    public addMapCircle(obj: any, key: any): void {
        let that = this;
        let dateFilters = that.body["dateFilters"];

        let point = new this.BMap.Point(obj.longitude, obj.latitude);

        // 中心打个点
        let myIcon = new this.BMap.Icon("images/project_location.png", new this.BMap.Size(30, 30));
        let marker_center = new this.BMap.Marker(point, {
            icon: myIcon,
            //title: obj.project_name,
        });
        marker_center.project_name = obj.project_name;
        for (let i = 0; i < that.dataFull.length; i++) {
            if (that.dataFull[i].project_name == obj.project_name) {
                if (that.dataFull[i].active_users != undefined) {
                    marker_center.active_users = that.dataFull[i].active_users;
                }

                if (that.dataFull[i].radio_active_users != undefined) {
                    marker_center.radio_active_users = that.dataFull[i].radio_active_users;
                }
            }
        }

        this.bmap.addOverlay(marker_center);

        // 添加圆
        if (key == "active_users") {
            let radius = obj.active_users / this.valueMax * this.zoomMap[this.zoomValue];
            let circle1 = new this.BMap.Circle(point, radius, {
                strokeColor: "rgba(255,136,134,1)",
                strokeWeight: 1,
                strokeOpacity: 1,
                fillColor: 'rgba(255,136,134,0.4)'
            });
            // this.bmap.removeOverlay(circle1);
            this.bmap.addOverlay(circle1);
        } else if (key == "radio_active_users") {
            let radius = obj.radio_active_users / this.valueMax * this.zoomMap[this.zoomValue];
            let circle2 = new this.BMap.Circle(point, radius, {
                strokeColor: "rgba(189,202,231,1)",
                strokeWeight: 1,
                strokeOpacity: 1,
                fillColor: 'rgba(189,202,231,0.4)'
            });
            //this.bmap.removeOverlay(circle2);
            this.bmap.addOverlay(circle2);
        }

        marker_center.addEventListener("mouseover", function (event: any) {
            let x = event.clientX;
            let y = event.clientY;
            let $div = $('#draw_div');
            let bounding = $("#PassengerDistribution_map_div")[0].getBoundingClientRect();
            let top = 0;
            let left = 0;
            if (bounding.top < 0) {
                top = y + bounding.top;
            } else {
                top = y - bounding.top;
            }
            left = x + 12 - bounding.left;
            let timeStr = "";
            for (let i = 0; i < dateFilters.length; i++) {
                timeStr += dateFilters[i]["value"];
                if (i != dateFilters.length - 1) {
                    timeStr = timeStr + " ~ ";
                }
            }
            $(".draw_div_tit").html(marker_center.project_name);
            $(".draw_div_top").find("b").html(timeStr);
            $(".draw_div_traffic_mom").find("b").html(marker_center.radio_active_users);
            $(".draw_div_traffic_flow").find("b").html(marker_center.active_users);
            $div.css({
                top: top + 'px',
                left: left + 'px',
                position: 'absolute'
            }).show();

        });

        marker_center.addEventListener("mouseout", function (a: any, b: any, c: any) {
            $('#draw_div').hide();
        });
    }

    protected init(): void {

        this.bmap = new this.BMap.Map('PassengerDistribution_map_div', {
            enableMapClick: false
        });

        let point = new this.BMap.Point(108.2988233556, 22.8164929356);
        this.bmap.centerAndZoom(point, 14);
        // $scope.bmap.disableDragging();
        // $scope.bmap.disableScrollWheelZoom();
        //this.bmap.enableScrollWheelZoom();
        this.bmap.disableDoubleClickZoom();

        $('#' + this.scopeID).find('.icon_location').click((event: any) => {
            this.bmap.centerAndZoom(new this.BMap.Point(this.lngValue, this.latValue), this.zoomValue);
            event.stopPropagation();
        });

        $('#' + this.scopeID).find('.icon_add').click((event: any) => {
            var map_zoom = this.bmap.getZoom();
            if (map_zoom >= 16) {
                return false;
            }
            this.bmap.setZoom(map_zoom + 1);
            this.zoomValue = map_zoom + 1;
            this.refreshData();
            event.stopPropagation();
        });

        $('#' + this.scopeID).find('.icon_minus').click((event: any) => {
            var map_zoom = this.bmap.getZoom();
            if (map_zoom <= 6) {
                return false;
            }
            this.bmap.setZoom(map_zoom - 1);
            this.zoomValue = map_zoom - 1;
            this.refreshData();
            event.stopPropagation();
        });
    }

    private postChange(postQuery: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', postQuery)
        );
        super.onChange(this, sendObj);
    }

    private mapBigger() {
        var map_zoom = this.bmap.getZoom();
        if (map_zoom >= 18) {
            return false;
        }
        this.bmap.setZoom(map_zoom + 1);
        this.zoomValue = map_zoom + 1;
        this.refreshData();
    };

    private mapSmaller() {
        var map_zoom = this.bmap.getZoom();
        if (map_zoom <= 8) {
            return false;
        }
        this.bmap.setZoom(map_zoom - 1);
        this.zoomValue = map_zoom - 1;
        this.refreshData();
    };

    private mapLocation() {
        this.bmap.centerAndZoom(new this.BMap.Point(this.lngValue, this.latValue), this.zoomValue);
    };
}