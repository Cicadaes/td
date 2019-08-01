"use strict";
var area_component_1 = require("./area/area.component");
var banner_component_1 = require("./banner/banner.component");
var bar_component_1 = require("./bar/bar.component");
var barXy_component_1 = require("./barXy/barXy.component");
var cellsFilter_component_1 = require("./cellsFilter/cellsFilter.component");
var chinamap_component_1 = require("./chinamap/chinamap.component");
var circle_component_1 = require("./circle/circle.component");
var cityFilter_component_1 = require("./cityFilter/cityFilter.component");
var cityHorizontalBar_component_1 = require("./cityHorizontalBar/cityHorizontalBar.component");
var cityPreview_component_1 = require("./cityPreview/cityPreview.component");
var datasource_component_1 = require("./datasource/datasource.component");
var dateformat_component_1 = require("./dateformat/dateformat.component");
var dayCalendarFilter_component_1 = require("./DayCalendarFilter/dayCalendarFilter.component");
var filter_component_1 = require("./filter/filter.component");
var firstCityFilter_component_1 = require("./firstCityFilter/firstCityFilter.component");
var font_component_1 = require("./font/font.component");
var funnel_component_1 = require("./funnel/funnel.component");
var indexPriview_component_1 = require("./indexPriview/indexPriview.component");
var lifeCycleList_component_1 = require("./lifeCycleList/lifeCycleList.component");
var lineBar_component_1 = require("./lineBar/lineBar.component");
var line_component_1 = require("./line/line.component");
var linkCommon_component_1 = require("./linkCommon/linkCommon.component");
var manyFilterBar_component_1 = require("./manyFilterBar/manyFilterBar.component");
var monthCalendarFilter_component_1 = require("./MonthCalendarFilter/monthCalendarFilter.component");
var overallFilter_component_1 = require("./overallFilter/overallFilter.component");
var part_component_1 = require("./part/part.component");
var partnerFilter_component_1 = require("./partnerFilter/partnerFilter.component");
var passengerFlowPriview_component_1 = require("./passengerFlowPriview/passengerFlowPriview.component");
var PieBar_component_1 = require("./pieBar/PieBar.component");
var pie_component_1 = require("./pie/pie.component");
var priview_component_1 = require("./priview/priview.component");
var provinceFilter_component_1 = require("./provinceFilter/provinceFilter.component");
var radar2_component_1 = require("./radar2/radar2.component");
var radar_component_1 = require("./radar/radar.component");
var rectFunnel_component_1 = require("./rectFunnel/rectFunnel.component");
var rfmFilter_component_1 = require("./rfmFilter/rfmFilter.component");
var scatter_component_1 = require("./scatter/scatter.component");
var selectLine_component_1 = require("./selectLine/selectLine.component");
var selectFilter_component_1 = require("./selectFilter/selectFilter.component");
var singleCalendarFilter_component_1 = require("./SingleCalendarFilter/singleCalendarFilter.component");
var stackedBar_component_1 = require("./stackedBar/stackedBar.component");
var storeHeatmap_component_1 = require("./storeHeatmap/storeHeatmap.component");
var strip_component_1 = require("./strip/strip.component");
var tabArea_component_1 = require("./tabArea/tabArea.component");
var tabFilter_component_1 = require("./tabFilter/tabFilter.component");
var table_component_1 = require("./table/table.component");
var tabOptions_component_1 = require("./tabOptions/tabOptions.component");
var upload_component_1 = require("./upload/upload.component");
/**t
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
                return new rectFunnel_component_1.RectFunnelComponent();
            case "15":
                return new stackedBar_component_1.StackedBarComponent();
            case "16":
                return new scatter_component_1.ScatterComponent();
            case "17":
                return new selectLine_component_1.SelectedLineComponent();
            case "18":
                return new radar2_component_1.Radar2Component();
            case "19":
                return new part_component_1.PartComponent();
            case "20":
                return new barXy_component_1.BarXyComponent();
            case '21':
                return new firstCityFilter_component_1.FirstCityFilterComponent();
            case "22":
                return new datasource_component_1.DatasourceComponent();
            case '23':
                return new partnerFilter_component_1.PartnerFilterComponent();
            case "24":
                return new tabFilter_component_1.TabFilterComponent();
            case "25":
                return new overallFilter_component_1.OverallFilterComponent();
            case "26":
                return new funnel_component_1.FunnelComponent();
            case "27":
                return new radar_component_1.RadarComponent();
            case "28":
                return new filter_component_1.FilterComponent();
            case "29":
                return new cityPreview_component_1.CityPreviewComponent();
            case "30":
                return new indexPriview_component_1.IndexPriviewComponent();
            case "31":
                return new passengerFlowPriview_component_1.PassengerFlowPriviewComponent();
            case "32":
                return new manyFilterBar_component_1.ManyFilterBarComponent();
            case "33":
                return new storeHeatmap_component_1.StoreHeatmapComponent();
            case "34":
                return new linkCommon_component_1.LinkCommonComponent();
            case '35':
                return new cellsFilter_component_1.CellsFilterComponent();
            case "36":
                return new cityFilter_component_1.CityFilterComponent();
            case '37':
                return new provinceFilter_component_1.ProvinceFilterComponent();
            case '38':
                return new lineBar_component_1.LineBarComponent();
            case '39':
                return new rfmFilter_component_1.RFMFilterComponent();
            case '40':
                return new PieBar_component_1.PieBarComponent();
            case '41':
                return new selectFilter_component_1.SelectFilterComponent();
            case '42':
                return new dayCalendarFilter_component_1.DayCalendarFilterComponent();
            case '43':
                return new monthCalendarFilter_component_1.MonthCalendarFilterComponent();
            case '44':
                return new singleCalendarFilter_component_1.SingleCalendarFilterComponent();
            case '45':
                return new tabOptions_component_1.TabOptionsComponent();
            case '46':
                return new tabArea_component_1.TabAreaComponent();
            case '47':
                return new lifeCycleList_component_1.LifeCycleListComponent();
            case '48':
                return new cityHorizontalBar_component_1.CityHorizontalBarComponent();
        }
        return null;
    };
    return BaseComponentList;
}());
exports.BaseComponentList = BaseComponentList;
//# sourceMappingURL=base.list.js.map