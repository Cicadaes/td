/**
 * Created by wangshouyun on 2017/4/26.
 */
//import ECharts = require('echarts');
//  require('echarts/map/js/china.js');
//
export class BaseCharts {
    //public static echarts: any = ECharts;
    //public static echarts_map: any = require('echarts/map/js/china.js');
    public static echarts: any = window['echarts'] ? window['echarts'] : null;
    public static BMap: any = window['BMap'] ? window['BMap'] : null;
    public static h337: any = window['h337'] ? window['h337'] : null;
}