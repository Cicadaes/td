"use strict";
var pie_component_1 = require("./pie/pie.component");
var line_component_1 = require("./line/line.component");
var bar_component_1 = require("./bar/bar.component");
var area_component_1 = require("./area/area.component");
var strip_component_1 = require("./strip/strip.component");
var chinamap_component_1 = require("./chinamap/chinamap.component");
var banner_component_1 = require("./banner/banner.component");
var circle_component_1 = require("./circle/circle.component");
var priview_component_1 = require("./priview/priview.component");
var font_component_1 = require("./font/font.component");
var table_component_1 = require("./table/table.component");
var part_component_1 = require("./part/part.component");
var indexPriview_component_1 = require("./indexPriview/indexPriview.component");
var dateformat_component_1 = require("./dateformat/dateformat.component");
var funnel_component_1 = require("./funnel/funnel.component");
var radar_component_1 = require("./radar/radar.component");
var test_component_1 = require("./test/test.component");
var upload_component_1 = require("./upload/upload.component");
var scatter_component_1 = require("./scatter/scatter.component");
var stackedBar_component_1 = require("./stackedBar/stackedBar.component");
var selectLine_component_1 = require("./selectLine/selectLine.component");
var filter_component_1 = require("./filter/filter.component");
/**
 * Created by wangshouyun on 09/05/2017.
 */
var BaseComponentList = (function () {
    function BaseComponentList() {
    }
    BaseComponentList.getComponentByType = function (chartType) {
        switch (chartType) {
            case "1":
                return new font_component_1.FontComponent();
            case "2":
                return new table_component_1.TableComponent();
            case "3":
                return new upload_component_1.UploadComponent();
            case "4":
                return new pie_component_1.PieComponent();
            case "5":
                return new bar_component_1.BarComponent();
            case "6":
                return new line_component_1.LineComponent();
            case "7":
                return new strip_component_1.StripComponent();
            case "8":
                return new dateformat_component_1.DateformatComponent();
            case "9":
                return new chinamap_component_1.ChinaMapComponent();
            case "10":
                return new area_component_1.AreaComponent();
            case "11":
                return new priview_component_1.PriviewComponent();
            case "12":
                return new banner_component_1.BannerComponent();
            case "13":
                return new circle_component_1.CircleComponent();
            case "14":
                return new part_component_1.PartComponent();
            case "15":
                return new stackedBar_component_1.StackedBarComponent();
            case "17":
                return new selectLine_component_1.SelectedLineComponent();
            case "30":
                return new indexPriview_component_1.IndexPriviewComponent();
            case "Area":
                return new area_component_1.AreaComponent();
            case "Banner":
                return new banner_component_1.BannerComponent();
            case "Bar":
                return new bar_component_1.BarComponent();
            case "ChinaMap":
                return new chinamap_component_1.ChinaMapComponent();
            case "Circle":
                return new circle_component_1.CircleComponent();
            case "Dateformat":
                return new dateformat_component_1.DateformatComponent();
            case "Font":
                return new font_component_1.FontComponent();
            case "Funnel":
                return new funnel_component_1.FunnelComponent();
            case "Line":
                return new line_component_1.LineComponent();
            case "Pie":
                return new pie_component_1.PieComponent();
            case "Priview":
                return new priview_component_1.PriviewComponent();
            case "Radar":
                return new radar_component_1.RadarComponent();
            case "Strip":
                return new strip_component_1.StripComponent();
            case "Table":
                return new table_component_1.TableComponent();
            case "Test":
                return new test_component_1.TestComponent();
            case "Upload":
                return new upload_component_1.UploadComponent();
            case "16":
                return new scatter_component_1.ScatterComponent();
            case "Filter":
                return new filter_component_1.FilterComponent();
            case "StackedBar":
                return new stackedBar_component_1.StackedBarComponent();
        }
        return null;
    };
    return BaseComponentList;
}());
exports.BaseComponentList = BaseComponentList;
//# sourceMappingURL=base.list.js.map