"use strict";
/**
 * Created by wangshouyun on 2017/4/26.
 */
//import ECharts = require('echarts');
//  require('echarts/map/js/china.js');
//
var BaseCharts = (function () {
    function BaseCharts() {
    }
    return BaseCharts;
}());
//public static echarts: any = ECharts;
//public static echarts_map: any = require('echarts/map/js/china.js');
BaseCharts.echarts = window['echarts'] ? window['echarts'] : null;
BaseCharts.BMap = window['BMap'] ? window['BMap'] : null;
BaseCharts.h337 = window['h337'] ? window['h337'] : null;
exports.BaseCharts = BaseCharts;
//# sourceMappingURL=base.chart.js.map