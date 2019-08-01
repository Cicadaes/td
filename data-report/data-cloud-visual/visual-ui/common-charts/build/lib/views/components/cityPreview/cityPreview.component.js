"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by tommy on 2017/10/16.
 */
var base_component_1 = require("../base.component");
var cityPreview_template_1 = require("./cityPreview.template");
var base_chart_1 = require("../../base/base.chart");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
var $ = require("jquery");
var CityPreviewComponent = (function (_super) {
    __extends(CityPreviewComponent, _super);
    function CityPreviewComponent() {
        var _this = _super.call(this) || this;
        _this.bmap = null;
        _this.chartData = null;
        _this.lineData = null;
        _this.echartData = null;
        _this.BMap = null;
        _this.getSoreceData = null;
        _this.styleObj = null;
        _this.setchangeObj = null;
        _this.dataFull = [];
        _this.body = {
            'dimensions': null,
            'metrics': null,
            'filters': null
        };
        _this.latValue = 0;
        _this.lngValue = 0;
        _this.zoomValue = 14;
        var template = new cityPreview_template_1.CityPreviewTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.lineData = {};
        _this.echartData = {};
        if (base_chart_1.BaseCharts.BMap) {
            _this.BMap = base_chart_1.BaseCharts.BMap;
        }
        return _this;
    }
    CityPreviewComponent.prototype.beforeShow = function () {
    };
    CityPreviewComponent.prototype.afterShow = function () {
        if (!this.bmap) {
            this.init();
        }
    };
    CityPreviewComponent.prototype.beforeDestory = function () {
    };
    CityPreviewComponent.prototype.afterDestory = function () {
    };
    CityPreviewComponent.prototype.resize = function () {
        //if (this.myChart) this.myChart.resize();
    };
    CityPreviewComponent.prototype.setHtmlObj = function (changeObj) {
    };
    CityPreviewComponent.prototype.getconfiginformation = function (event, changeObj) {
        this.setchangeObj = changeObj.result;
        this.setHtmlObj(changeObj.result);
        this.buildBody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
        var tmp = [
            {
                "project_name": "Baihuodalou_Xinshijie",
                "active_users": 31214,
                "radio_active_users": 16661,
                "longitude": "108.2788233556",
                "latitude": "22.8364929356"
            }
        ];
        this.zoom_const = 1;
        //this.draw(tmp, "active_users")
    };
    CityPreviewComponent.prototype.filterChange = function (event, data) {
        //this.body["filters"][1]["value"] = data["chart"][0]["project_name"];
        //this.mergeFilterObj = null
        var addObj = null;
        if (data.filter) {
            for (var i = 0; i < data.filter.length; i++) {
                var obj = data.filter[i];
                if (obj.field == "typeInOverall") {
                    addObj = {
                        "field": "project_type",
                        "operator": obj.operator,
                        "value": obj.value
                    };
                }
            }
            if (addObj) {
                data.filter.push(addObj);
            }
        }
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);
        // let projectId = data["chart"][0]["id"];
        // let city_project_map = window["city_project_map"];
        // let lat = 22.8164929356;
        // let lng = 108.2988233556;
        // if (city_project_map && city_project_map[projectId]) {
        //     if (city_project_map[projectId].latitude && city_project_map[projectId].longitude) {
        //         lat = city_project_map[projectId].latitude;
        //         lng = city_project_map[projectId].longitude;
        //     } else if (city_project_map[projectId].city && window["appConfig"].city_center_point) {
        //         let cityMap = window["appConfig"].city_center_point;
        //         let cityObj = cityMap[city_project_map[projectId].city];
        //         if (cityObj) {
        //             lat = cityObj.lat;
        //             lng = cityObj.lng;
        //         }
        //     }
        // }
        //
        // let point = new this.BMap.Point(lng, lat);
        // this.bmap.centerAndZoom(point, 14);
    };
    CityPreviewComponent.prototype.getZoomValue = function (data) {
        var latMax = 0;
        var lngMax = 0;
        var latMin = 9999;
        var lngMin = 9999;
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
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
        var zoom_lng_1 = 0.167876;
        var zoom_lng_2 = 0.679191;
        var zoom_lng_3 = 2.706702;
        var zoom_lng_4 = 10.716425;
        var zoom_lng_5 = 38.92868;
        var zoomLngValue = 14;
        var comp = lngMax - lngMin;
        if (comp < zoom_lng_1) {
            zoomLngValue = 14;
        }
        else if (comp < zoom_lng_2) {
            zoomLngValue = 12;
        }
        else if (comp < zoom_lng_3) {
            zoomLngValue = 10;
        }
        else if (comp < zoom_lng_4) {
            zoomLngValue = 8;
        }
        else if (comp < zoom_lng_5) {
            zoomLngValue = 6;
        }
        var zoom_lat_1 = 0.068682;
        var zoom_lat_2 = 0.295121;
        var zoom_lat_3 = 1.179063;
        var zoom_lat_4 = 4.612581;
        var zoom_lat_5 = 17.432626;
        var zoomLatValue = 14;
        var compLat = latMax - latMin;
        if (compLat < zoom_lat_1) {
            zoomLatValue = 14;
        }
        else if (compLat < zoom_lat_2) {
            zoomLatValue = 12;
        }
        else if (compLat < zoom_lat_3) {
            zoomLatValue = 10;
        }
        else if (compLat < zoom_lat_4) {
            zoomLatValue = 8;
        }
        else if (compLat < zoom_lat_5) {
            zoomLatValue = 6;
        }
        this.zoomValue = zoomLngValue < zoomLatValue ? zoomLngValue : zoomLatValue;
    };
    CityPreviewComponent.prototype.dataChange = function (data_in) {
        this.bmap.clearOverlays();
        var data_full = [];
        this.dataFull = [];
        if (data_in && data_in["环比阶段入店客流"] && data_in["环比阶段入店客流"].length > 0) {
            var data_2 = data_in["环比阶段入店客流"];
            for (var j = 0; j < data_2.length; j++) {
                data_2[j]['radio_active_users'] = data_2[j].active_users;
                data_in["环比阶段入店客流"][j]['radio_active_users'] = data_2[j]['radio_active_users'];
                delete data_2[j]["active_users"];
                delete data_in["环比阶段入店客流"][j]["active_users"];
            }
        }
        this.dataFull = data_in["本阶段入店客流"].concat(data_in["环比阶段入店客流"]);
        if (data_in && data_in["环比阶段入店客流"] && data_in["环比阶段入店客流"].length > 0) {
            var data_2 = data_in["环比阶段入店客流"];
            this.draw(data_2, "radio_active_users");
        }
        if (data_in && data_in["本阶段入店客流"] && data_in["本阶段入店客流"].length > 0) {
            var data_1 = data_in["本阶段入店客流"];
            for (var i = 0; i < data_1.length; i++) {
                var obj = data_1[i];
                data_full.push(obj);
                this.dataFull.push(obj);
            }
            this.draw(data_1, "active_users");
        }
        this.getZoomValue(data_full);
        var point = new this.BMap.Point(this.lngValue, this.latValue);
        this.bmap.centerAndZoom(point, this.zoomValue);
    };
    CityPreviewComponent.prototype.styleChange = function (style) {
    };
    CityPreviewComponent.prototype.buildBody = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "cityPreview";
    };
    CityPreviewComponent.prototype.loadData = function () {
    };
    Object.defineProperty(CityPreviewComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    CityPreviewComponent.prototype.draw = function (dataList, key) {
        for (var i = 0; i < dataList.length; i++) {
            var obj = dataList[i];
            this.addMapCircle(obj, key);
        }
    };
    CityPreviewComponent.prototype.addMapCircle = function (obj, key) {
        var that = this;
        var dateFilters = that.body["dateFilters"];
        var point = new this.BMap.Point(obj.longitude, obj.latitude);
        // 中心打个点
        var myIcon = new this.BMap.Icon("images/project_location.png", new this.BMap.Size(30, 30));
        var marker_center = new this.BMap.Marker(point, {
            icon: myIcon,
        });
        marker_center.project_name = obj.project_name;
        for (var i = 0; i < that.dataFull.length; i++) {
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
            var circle1 = new this.BMap.Circle(point, obj.active_users * this.zoom_const, {
                strokeColor: "rgba(255,136,134,1)",
                strokeWeight: 1,
                strokeOpacity: 1,
                fillColor: 'rgba(255,136,134,0.4)'
            });
            // this.bmap.removeOverlay(circle1);
            this.bmap.addOverlay(circle1);
        }
        else if (key == "radio_active_users") {
            var circle2 = new this.BMap.Circle(point, obj.radio_active_users * this.zoom_const, {
                strokeColor: "rgba(189,202,231,1)",
                strokeWeight: 1,
                strokeOpacity: 1,
                fillColor: 'rgba(189,202,231,0.4)'
            });
            //this.bmap.removeOverlay(circle2);
            this.bmap.addOverlay(circle2);
        }
        marker_center.addEventListener("mouseover", function (event) {
            var x = event.clientX;
            var y = event.clientY;
            var $div = $('#draw_div');
            var bounding = $("#PassengerDistribution_map_div")[0].getBoundingClientRect();
            var top = 0;
            var left = 0;
            if (bounding.top < 0) {
                top = y + bounding.top;
            }
            else {
                top = y - bounding.top;
            }
            left = x + 12 - bounding.left;
            var timeStr = "";
            for (var i = 0; i < dateFilters.length; i++) {
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
        marker_center.addEventListener("mouseout", function (a, b, c) {
            $('#draw_div').hide();
        });
    };
    CityPreviewComponent.prototype.init = function () {
        var _this = this;
        this.bmap = new this.BMap.Map('PassengerDistribution_map_div', {
            enableMapClick: false
        });
        var point = new this.BMap.Point(108.2988233556, 22.8164929356);
        this.bmap.centerAndZoom(point, 14);
        // $scope.bmap.disableDragging();
        // $scope.bmap.disableScrollWheelZoom();
        //this.bmap.enableScrollWheelZoom();
        this.bmap.disableDoubleClickZoom();
        $('#' + this.scopeID).find('.icon_location').click(function (event) {
            _this.bmap.centerAndZoom(new _this.BMap.Point(_this.lngValue, _this.latValue), _this.zoomValue);
            event.stopPropagation();
        });
        $('#' + this.scopeID).find('.icon_add').click(function (event) {
            var map_zoom = _this.bmap.getZoom();
            if (map_zoom >= 16) {
                return false;
            }
            _this.bmap.setZoom(map_zoom + 1);
            event.stopPropagation();
        });
        $('#' + this.scopeID).find('.icon_minus').click(function (event) {
            var map_zoom = _this.bmap.getZoom();
            if (map_zoom <= 6) {
                return false;
            }
            _this.bmap.setZoom(map_zoom - 1);
            event.stopPropagation();
        });
    };
    CityPreviewComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    CityPreviewComponent.prototype.mapBigger = function () {
        var map_zoom = this.bmap.getZoom();
        if (map_zoom >= 18) {
            return false;
        }
        this.bmap.setZoom(map_zoom + 1);
    };
    ;
    CityPreviewComponent.prototype.mapSmaller = function () {
        var map_zoom = this.bmap.getZoom();
        if (map_zoom <= 8) {
            return false;
        }
        this.bmap.setZoom(map_zoom - 1);
    };
    ;
    CityPreviewComponent.prototype.mapLocation = function () {
        this.bmap.centerAndZoom(new this.BMap.Point(this.lngValue, this.latValue), this.zoomValue);
    };
    ;
    return CityPreviewComponent;
}(base_component_1.BaseComponent));
exports.CityPreviewComponent = CityPreviewComponent;
//# sourceMappingURL=cityPreview.component.js.map