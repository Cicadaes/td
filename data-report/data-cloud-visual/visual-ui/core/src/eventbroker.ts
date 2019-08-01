/**
 * Created by zhaoxue on 2017-09-11.
 */
import * as $ from 'jquery';
import {EventEmitter} from "./events/emitter.event";
import {EventType} from "./events/type.event";

export class EventBroker{
    private chartDataArr:Array<any> = [];
    private chartDataObject:any = {
        "name": "第1页",
        "editbool": false,
        "backgroundColor": "",
        "backgroundImage": "",
        "zIndex": 0,
        "size": {
            "width": 1379,
            "height": 775
        },
        "components": [
            {
                "chart": {
                    "uuid": "drf2jh2j5tskbbda",
                    "type": "6",
                    "dataSourceId": 1,
                    "styleConfigDefinitionId": 790,
                    "dataSourceConfigDefinitionId": 0,
                    "style": {
                        "parameters": [
                            {
                                "id": null,
                                "name": "线图",
                                "scripts": null,
                                "fields": [
                                    {
                                        "id": 112060,
                                        "code": "lineStyle",
                                        "name": "线条样式",
                                        "fieldAliasName": null,
                                        "description": "线条样式",
                                        "valueType": 1,
                                        "multipleMaxNumber": null,
                                        "value": null,
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 20,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "iconClass": "icons_svg color_format",
                                        "childrenFields": [
                                            {
                                                "id": 112061,
                                                "code": "series_0_lineStyle_normal_width",
                                                "name": "线条粗细",
                                                "fieldAliasName": null,
                                                "description": "线条粗细",
                                                "valueType": 1,
                                                "multipleMaxNumber": null,
                                                "value": "1",
                                                "defaultValue": "1",
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": [
                                                    "1",
                                                    "2",
                                                    "3",
                                                    "4",
                                                    "5"
                                                ],
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 2,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": "icons_svg line_format",
                                                "childrenFields": []
                                            }
                                        ]
                                    },
                                    {
                                        "id": 112062,
                                        "code": "series_show",
                                        "name": "显示",
                                        "fieldAliasName": null,
                                        "description": "显示",
                                        "valueType": 1,
                                        "multipleMaxNumber": null,
                                        "value": null,
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 20,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "iconClass": null,
                                        "childrenFields": [
                                            {
                                                "id": 112063,
                                                "code": "series_0_showSymbol",
                                                "name": "显示点",
                                                "fieldAliasName": null,
                                                "description": "显示点",
                                                "valueType": 9,
                                                "multipleMaxNumber": null,
                                                "value": true,
                                                "defaultValue": true,
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": [
                                                    true,
                                                    false
                                                ],
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 14,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": null,
                                                "childrenFields": []
                                            },
                                            {
                                                "id": 112064,
                                                "code": "series_0_label_normal_show",
                                                "name": "显示数据标签",
                                                "fieldAliasName": null,
                                                "description": "显示数据标签",
                                                "valueType": 9,
                                                "multipleMaxNumber": null,
                                                "value": false,
                                                "defaultValue": false,
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": [
                                                    true,
                                                    false
                                                ],
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 14,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": null,
                                                "childrenFields": []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "id": null,
                                "name": "图例",
                                "scripts": null,
                                "fields": [
                                    {
                                        "id": 112065,
                                        "code": "legend",
                                        "name": "legend",
                                        "fieldAliasName": null,
                                        "description": null,
                                        "valueType": 1,
                                        "multipleMaxNumber": null,
                                        "value": null,
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 18,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "iconClass": null,
                                        "childrenFields": [
                                            {
                                                "id": 112066,
                                                "code": "legend_show",
                                                "name": "无",
                                                "fieldAliasName": null,
                                                "description": null,
                                                "valueType": 9,
                                                "multipleMaxNumber": null,
                                                "value": false,
                                                "defaultValue": false,
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": [
                                                    true,
                                                    false
                                                ],
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 14,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": null,
                                                "childrenFields": []
                                            },
                                            {
                                                "id": 112067,
                                                "code": "legend_left",
                                                "name": "右对齐",
                                                "fieldAliasName": null,
                                                "description": null,
                                                "valueType": 1,
                                                "multipleMaxNumber": null,
                                                "value": "center",
                                                "defaultValue": "center",
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 13,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": null,
                                                "childrenFields": []
                                            },
                                            {
                                                "id": 112068,
                                                "code": "legend_bottom",
                                                "name": "底端对齐",
                                                "fieldAliasName": null,
                                                "description": null,
                                                "valueType": 1,
                                                "multipleMaxNumber": null,
                                                "value": null,
                                                "defaultValue": null,
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 13,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": null,
                                                "childrenFields": []
                                            },
                                            {
                                                "id": 112069,
                                                "code": "legend_top",
                                                "name": "顶端对齐",
                                                "fieldAliasName": null,
                                                "description": null,
                                                "valueType": 1,
                                                "multipleMaxNumber": null,
                                                "value": "top",
                                                "defaultValue": "top",
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 13,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": null,
                                                "childrenFields": []
                                            }
                                        ]
                                    },
                                    {
                                        "id": 112070,
                                        "code": "fontStyle",
                                        "name": null,
                                        "fieldAliasName": null,
                                        "description": null,
                                        "valueType": 1,
                                        "multipleMaxNumber": null,
                                        "value": null,
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 20,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "iconClass": null,
                                        "childrenFields": [
                                            {
                                                "id": 112071,
                                                "code": "legend_textStyle_color",
                                                "name": "图例文本颜色",
                                                "fieldAliasName": null,
                                                "description": null,
                                                "valueType": 1,
                                                "multipleMaxNumber": null,
                                                "value": "#76818E",
                                                "defaultValue": "#76818E",
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 15,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": "icon_svg text_format",
                                                "childrenFields": []
                                            },
                                            {
                                                "id": 112072,
                                                "code": "legend_textStyle_fontFamily",
                                                "name": "图例字体",
                                                "fieldAliasName": null,
                                                "description": null,
                                                "valueType": 1,
                                                "multipleMaxNumber": null,
                                                "value": "微软雅黑",
                                                "defaultValue": "微软雅黑",
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": [
                                                    "微软雅黑",
                                                    "宋体",
                                                    "黑体",
                                                    "微软简综艺",
                                                    "楷体",
                                                    "隶书",
                                                    "华文行楷",
                                                    "华文隶书"
                                                ],
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 2,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": "icon_svg front_format",
                                                "childrenFields": []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "id": null,
                                "name": "坐标轴",
                                "scripts": null,
                                "fields": [
                                    {
                                        "id": 112073,
                                        "code": "yAxis_name",
                                        "name": "显示坐标Y轴标题",
                                        "fieldAliasName": null,
                                        "description": "显示坐标轴标题",
                                        "valueType": 9,
                                        "multipleMaxNumber": null,
                                        "value": false,
                                        "defaultValue": false,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": [
                                            true,
                                            false
                                        ],
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 14,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "iconClass": null,
                                        "childrenFields": []
                                    },
                                    {
                                        "id": 112074,
                                        "code": "yAxis_value",
                                        "name": "Y轴值",
                                        "fieldAliasName": null,
                                        "description": "Y轴值",
                                        "valueType": 1,
                                        "multipleMaxNumber": null,
                                        "value": null,
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 20,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "iconClass": null,
                                        "childrenFields": [
                                            {
                                                "id": 112075,
                                                "code": "yAxis_min",
                                                "name": "Y轴最小值",
                                                "fieldAliasName": null,
                                                "description": "轴最小值",
                                                "valueType": 3,
                                                "multipleMaxNumber": null,
                                                "value": null,
                                                "defaultValue": null,
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 1,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": null,
                                                "childrenFields": []
                                            },
                                            {
                                                "id": 112076,
                                                "code": "yAxis_max",
                                                "name": "Y轴最大值",
                                                "fieldAliasName": null,
                                                "description": "轴最大值",
                                                "valueType": 3,
                                                "multipleMaxNumber": null,
                                                "value": null,
                                                "defaultValue": null,
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 1,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": null,
                                                "childrenFields": []
                                            }
                                        ]
                                    },
                                    {
                                        "id": 112077,
                                        "code": "xAxis_name",
                                        "name": "显示坐标X轴标题",
                                        "fieldAliasName": null,
                                        "description": "显示坐标轴标题",
                                        "valueType": 9,
                                        "multipleMaxNumber": null,
                                        "value": false,
                                        "defaultValue": false,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": [
                                            true,
                                            false
                                        ],
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 14,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "iconClass": null,
                                        "childrenFields": []
                                    }
                                ]
                            },
                            {
                                "id": null,
                                "name": "网格",
                                "scripts": null,
                                "fields": [
                                    {
                                        "id": 112078,
                                        "code": "grid",
                                        "name": "网格",
                                        "fieldAliasName": null,
                                        "description": "网格",
                                        "valueType": 1,
                                        "multipleMaxNumber": null,
                                        "value": null,
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 20,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "iconClass": null,
                                        "childrenFields": [
                                            {
                                                "id": 112079,
                                                "code": "xAxis_axisLine_lineStyle_color",
                                                "name": "坐标轴颜色",
                                                "fieldAliasName": null,
                                                "description": "坐标轴颜色",
                                                "valueType": 1,
                                                "multipleMaxNumber": null,
                                                "value": "#5e6679",
                                                "defaultValue": "#5e6679",
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 15,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": "icons_svg axis_format",
                                                "childrenFields": []
                                            },
                                            {
                                                "id": 112080,
                                                "code": "xAxis_splitLine_lineStyle_color",
                                                "name": "网格颜色",
                                                "fieldAliasName": null,
                                                "description": "网格颜色",
                                                "valueType": 1,
                                                "multipleMaxNumber": null,
                                                "value": "#EBEEF2",
                                                "defaultValue": "#EBEEF2",
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 15,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": "icons_svg grid_format",
                                                "childrenFields": []
                                            },
                                            {
                                                "id": 112081,
                                                "code": "textStyle_fontFamily",
                                                "name": "字体系列",
                                                "fieldAliasName": null,
                                                "description": "字体系列",
                                                "valueType": 1,
                                                "multipleMaxNumber": null,
                                                "value": "微软雅黑",
                                                "defaultValue": "微软雅黑",
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": [
                                                    "微软雅黑",
                                                    "宋体",
                                                    "黑体",
                                                    "微软简综艺",
                                                    "楷体",
                                                    "隶书",
                                                    "华文行楷",
                                                    "华文隶书"
                                                ],
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 2,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": "icon_svg front_format",
                                                "childrenFields": []
                                            },
                                            {
                                                "id": 112082,
                                                "code": "grid_backgroundColor",
                                                "name": "图表背景",
                                                "fieldAliasName": null,
                                                "description": "图表背景",
                                                "valueType": 1,
                                                "multipleMaxNumber": null,
                                                "value": "transparent",
                                                "defaultValue": "transparent",
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": [
                                                    "#EB8E4A",
                                                    "#5AC99E",
                                                    "#3399FF",
                                                    "#0f9d58",
                                                    "#ab47bc",
                                                    "#00acc1",
                                                    "#ff7043",
                                                    "#9e9d24",
                                                    "#5c6bc0",
                                                    "#00838f",
                                                    "#c4ccd3"
                                                ],
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 15,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": "icons_svg chartbg_format",
                                                "childrenFields": []
                                            },
                                            {
                                                "id": 112083,
                                                "code": "grid_borderColor",
                                                "name": "图表边框颜色",
                                                "fieldAliasName": null,
                                                "description": "图表边框颜色",
                                                "valueType": 1,
                                                "multipleMaxNumber": null,
                                                "value": "#FFFFFF",
                                                "defaultValue": "#FFFFFF",
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 15,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": "icons_svg color_format",
                                                "childrenFields": []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "id": null,
                                "name": "背景和边框",
                                "scripts": null,
                                "fields": [
                                    {
                                        "id": 112084,
                                        "code": "backgroundBorder",
                                        "name": "背景颜色",
                                        "fieldAliasName": null,
                                        "description": null,
                                        "valueType": 1,
                                        "multipleMaxNumber": null,
                                        "value": null,
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 20,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "iconClass": null,
                                        "childrenFields": [
                                            {
                                                "id": 112085,
                                                "code": "backgroundColor",
                                                "name": "背景颜色",
                                                "fieldAliasName": null,
                                                "description": null,
                                                "valueType": 1,
                                                "multipleMaxNumber": null,
                                                "value": "#000",
                                                "defaultValue": null,
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 15,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": "icons_svg chartbg_format",
                                                "childrenFields": []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "data": {
                            "series_0_lineStyle_normal_width": "1",
                            "series_0_showSymbol": true,
                            "series_0_label_normal_show": false,
                            "yAxis_name": false,
                            "yAxis_min": null,
                            "yAxis_max": null,
                            "xAxis_name": false,
                            "xAxis_axisLine_lineStyle_color": "#5e6679",
                            "xAxis_splitLine_lineStyle_color": "#EBEEF2",
                            "textStyle_fontFamily": "微软雅黑",
                            "grid_backgroundColor": "transparent",
                            "grid_borderColor": "#FFFFFF",
                            "backgroundColor": null,
                            "series_1_lineStyle_normal_width": "1",
                            "series_2_lineStyle_normal_width": "1",
                            "series_3_lineStyle_normal_width": "1",
                            "series_4_lineStyle_normal_width": "1",
                            "series_1_showSymbol": true,
                            "series_2_showSymbol": true,
                            "series_3_showSymbol": true,
                            "series_4_showSymbol": true,
                            "series_1_label_normal_show": false,
                            "series_2_label_normal_show": false,
                            "series_3_label_normal_show": false,
                            "series_4_label_normal_show": false,
                            "yAxis_axisLine_lineStyle_color": "#5e6679",
                            "yAxis_splitLine_lineStyle_color": "#EBEEF2"
                        },
                        "box": {
                            "size": {
                                "width": 224,
                                "height": 224
                            },
                            "point": {
                                "x": 246.74,
                                "y": 37.96
                            },
                            "layer": 1
                        }
                    },
                    "dataSource": {
                        "parameters": [
                            {
                                "id": null,
                                "name": "基本信息",
                                "scripts": null,
                                "fields": [
                                    {
                                        "id": 112086,
                                        "code": "dataSource",
                                        "name": "数据源",
                                        "fieldAliasName": null,
                                        "description": null,
                                        "valueType": 6,
                                        "multipleMaxNumber": 1,
                                        "value": [
                                            {
                                                "name": "TD_DC_ATEST",
                                                "id": 1
                                            }
                                        ],
                                        "defaultValue": [
                                            {
                                                "name": "TD_DC_ATEST",
                                                "id": 1
                                            }
                                        ],
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": [
                                            {
                                                "name": "TD_DC_ATEST",
                                                "id": 1
                                            },
                                            {
                                                "name": "fpd_account_user_total",
                                                "id": 3
                                            },
                                            {
                                                "name": "fpd_market_trade",
                                                "id": 4
                                            },
                                            {
                                                "name": "market_trade_money",
                                                "id": 5
                                            },
                                            {
                                                "name": "market_trade_times",
                                                "id": 6
                                            },
                                            {
                                                "name": "moneybox_trade_cash",
                                                "id": 7
                                            },
                                            {
                                                "name": "moneybox_trade_product",
                                                "id": 8
                                            },
                                            {
                                                "name": "moneybox_trade_times",
                                                "id": 9
                                            },
                                            {
                                                "name": "map",
                                                "id": 10
                                            },
                                            {
                                                "name": "user_profile",
                                                "id": 11
                                            },
                                            {
                                                "name": "kylin_test",
                                                "id": 72
                                            },
                                            {
                                                "name": "queryEngine",
                                                "id": 83
                                            },
                                            {
                                                "name": "test2",
                                                "id": 94
                                            },
                                            {
                                                "name": "testsql1",
                                                "id": 98
                                            },
                                            {
                                                "name": "ruobin.yang",
                                                "id": 100
                                            },
                                            {
                                                "name": "ruobin.yang_test_01",
                                                "id": 101
                                            },
                                            {
                                                "name": "ruobin.yang_test2",
                                                "id": 102
                                            },
                                            {
                                                "name": "MysqlTest",
                                                "id": 118
                                            },
                                            {
                                                "name": "MysqlDEMO",
                                                "id": 120
                                            },
                                            {
                                                "name": "MysqlDemo2",
                                                "id": 121
                                            },
                                            {
                                                "name": "MysqlDemo3",
                                                "id": 122
                                            },
                                            {
                                                "name": "mysqlDemo4",
                                                "id": 123
                                            },
                                            {
                                                "name": "数据源1",
                                                "id": 124
                                            }
                                        ],
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 24,
                                        "viewMetaData": "{\"action\":\"callBack\",\"postEvent\":{\"actionValue\":\"report/dataSources/id/metaData\",\"action\":\"callBack\",\"actionParams\":[\"datasource_id\"],\"postEvent\":\"datasource-reload | metadata-render\"}}",
                                        "verifyRule": "this.dimension_1.multipleMaxNumber = 1;this.metric.multipleMaxNumber = 100",
                                        "iconClass": null,
                                        "childrenFields": []
                                    }
                                ]
                            },
                            {
                                "id": null,
                                "name": "参数信息",
                                "scripts": null,
                                "fields": [
                                    {
                                        "id": 112087,
                                        "code": "dimension_0",
                                        "name": "维度",
                                        "fieldAliasName": "date",
                                        "description": null,
                                        "valueType": 6,
                                        "multipleMaxNumber": 1,
                                        "value": [
                                            {
                                                "name": "name",
                                                "id": "name"
                                            }
                                        ],
                                        "defaultValue": [
                                            {
                                                "name": "name",
                                                "id": "name"
                                            }
                                        ],
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": [
                                            {
                                                "name": "name",
                                                "id": "name"
                                            },
                                            {
                                                "name": "create_time",
                                                "id": "create_time"
                                            },
                                            {
                                                "name": "create_dt",
                                                "id": "create_dt"
                                            }
                                        ],
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 24,
                                        "viewMetaData": "{\"actionValue\":\"report/dataSources/id/data\",\"action\":\"callBack\",\"actionParams\":[\"datasource_id\",\"dimensions\",\"metrics\",\"filters\"],\"postEvent\":\"datasource-render\"}",
                                        "verifyRule": null,
                                        "iconClass": null,
                                        "childrenFields": []
                                    },
                                    {
                                        "id": 112088,
                                        "code": "dimension_1",
                                        "name": "细分维度",
                                        "fieldAliasName": "name",
                                        "description": null,
                                        "valueType": 6,
                                        "multipleMaxNumber": 1,
                                        "value": null,
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": [
                                            {
                                                "name": "name",
                                                "id": "name"
                                            },
                                            {
                                                "name": "create_time",
                                                "id": "create_time"
                                            },
                                            {
                                                "name": "create_dt",
                                                "id": "create_dt"
                                            }
                                        ],
                                        "requried": 1,
                                        "helpInfo": null,
                                        "viewType": 24,
                                        "viewMetaData": "{\"actionValue\":\"report/dataSources/id/data\",\"action\":\"callBack\",\"actionParams\":[\"datasource_id\",\"dimensions\",\"metrics\",\"filters\"],\"postEvent\":\"datasource-render\"}",
                                        "verifyRule": "var dimension_1_length = (this.dimension_1.value==null||this.dimension_1.value=='')?0:this.dimension_1.value.length;this.metric.multipleMaxNumber = dimension_1_length>=1?1:100",
                                        "iconClass": null,
                                        "childrenFields": []
                                    },
                                    {
                                        "id": 112089,
                                        "code": "metric",
                                        "name": "指标",
                                        "fieldAliasName": "value",
                                        "description": null,
                                        "valueType": 1,
                                        "multipleMaxNumber": 100,
                                        "value": null,
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 25,
                                        "viewMetaData": "{\"actionValue\":\"report/dataSources/id/data\",\"action\":\"callBack\",\"actionParams\":[\"datasource_id\",\"dimensions\",\"metrics\",\"filters\"],\"postEvent\":\"datasource-render\"}",
                                        "verifyRule": "var metric_length = (this.metric.value==null||this.metric.value=='')?0:this.metric.value.length;this.dimension_1.multipleMaxNumber = metric_length>=2?0:1",
                                        "iconClass": null,
                                        "childrenFields": []
                                    }
                                ]
                            },
                            {
                                "id": null,
                                "name": "默认日期范围",
                                "scripts": null,
                                "fields": [
                                    {
                                        "id": 112090,
                                        "code": "date",
                                        "name": "日期",
                                        "fieldAliasName": null,
                                        "description": null,
                                        "valueType": 8,
                                        "multipleMaxNumber": null,
                                        "value": {
                                            "start": "2017-08-20T03:45:32.000Z",
                                            "end": "2017-09-20T03:45:32.000Z",
                                            "status": 1
                                        },
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 22,
                                        "viewMetaData": "{\"actionValue\":\"report/dataSources/id/data\",\"action\":\"callBack\",\"actionParams\":[\"datasource_id\",\"dimensions\",\"metrics\",\"filters\"],\"postEvent\":\"datasource-render\"}",
                                        "verifyRule": null,
                                        "iconClass": null,
                                        "childrenFields": []
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        ]
    };
    private querySetting:any = null;


    constructor(){
        EventEmitter.register(EventType.COMONCHANGE, this.onChange, this);
        EventEmitter.register(EventType.GETALLCHILDREN, this.getAllChildren, this);
    }

    public initData(data:any){
        // this.chartDataObject = data.components;
    }

    private getAllChildren(event:any, data:any){

        if(this.chartDataArr.length > 0){
            for(let item of this.chartDataArr){
                if(item.scopeID == data.scopeID){
                    item.result = data.result;
                    item.datasourceId = data.datasourceId;
                    return;
                }
            }
        }
        this.chartDataArr.push({
            datasourceId : data.datasourceId,
            scopeID : data.scopeID,
            result : data.result
        })

    }


    //切换时
    public onChange(event:any,target:any,changeObj:Object){
        this.buildQueryChartData(target,changeObj)
    }

    //对比返回
    public buildQueryChartData(target:any,changeObj:Object){
        for(let item of this.chartDataArr){
            if(item.scopeID == target.scopeID){
                this.postSettingData(target,item,changeObj)
                break;
            }
        }
    }

    public buildQuery(target:any,item:any,changeObj:Object){
        let filterQuery:Object = null,
            chartQuery:Object = null;
        //获取filter的query
        filterQuery = this.buildFilterQuery();

        //获取图表的query
        chartQuery = target.buildQuery(item,changeObj);

        return (<any>Object).assign(chartQuery,filterQuery);
    }

    private buildFilterQuery():any{
        return null;
    }


    //对应成功发送post请求成功后返回数据
    public postSettingData(target:any,item:any,changeObj:Object){
        
        let _self = this;
        $.ajax({
            url: 'http://172.23.6.2:9097/visual-web/report/dataSources/id/data',
            // url: 'http://172.30.117.37:9090/visual-web-local/report/dataSources/id/data',
            dataType: 'JSON',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(_self.buildQuery(target,item,changeObj)),
            success: function (data:any) {
                EventEmitter.trigger(EventType.DATACHANGE,
                    {
                        scopeID: target.scopeID,
                        result: data
                    });
            },
            error: function (data:any) {
                alert('请求失败' + data)
            },
            beforeSend: function () {
                alert('正在加载中...');
            }
        })
    }

}