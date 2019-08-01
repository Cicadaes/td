/**
 * Created by tommy on 2017/9/21.
 */

export class DemoData {

    public static groupJsonData: any = [
        {
            "id": 13,
            "groupName": "过滤器"
        },
        {
            "id": 0,
            "groupName": "组件"
        },
        {
            "id": 12,
            "groupName": "日期"
        },
        {
            "id": 1,
            "groupName": "折线图"
        },
        {
            "id": 2,
            "groupName": "条图"
        },
        {
            "id": 3,
            "groupName": "饼图"
        },
        {
            "id": 4,
            "groupName": "表格"
        },
        {
            "id": 5,
            "groupName": "地图 "
        },
        {
            "id": 6,
            "groupName": "统计"
        },
        {
            "id": 7,
            "groupName": "散点图"
        },
        {
            "id": 8,
            "groupName": "子弹图"
        },
        {
            "id": 9,
            "groupName": "文本"
        },
        {
            "id": 10,
            "groupName": "图片"
        },
        {
            "id": 11,
            "groupName": "图形"
        },

    ];

    public static reportJsonData: any = {
        'base_view_config': {
            "view": {
                "id": null,
                "toolTip": null,
                "fieldTabs": [
                    {
                        "name": "style",
                        "fieldGroups": [
                            {
                                "name": "一级标题配置",
                                "scripts": null,
                                "fields": [
                                    {
                                        "code": "title_font",
                                        "name": "是否显示表头",
                                        "description": null,
                                        "valueType": 9,
                                        "value": null,
                                        "defaultValue": false,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 14,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "iconClass": "icons_svg color_format",
                                        "childrenFields": [
                                            {
                                                "code": "title_name",
                                                "name": "标题名称",
                                                "description": null,
                                                "valueType": 8,
                                                "value": {
                                                    "titleValue": false,
                                                    "textValue": null
                                                },
                                                "defaultValue": {
                                                    "titleValue": false,
                                                    "textValue": null
                                                },
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 26,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": null,
                                                "childrenFields": []
                                            }, {
                                                "code": "chart_download",
                                                "name": "下载设置",
                                                "description": null,
                                                "valueType": 9,
                                                "value": false,
                                                "defaultValue": false,
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 14,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": null,
                                                "childrenFields": []
                                            }, {
                                                "code": "chart_help",
                                                "name": "帮助设置",
                                                "description": null,
                                                "valueType": 8,
                                                "value": {
                                                    "titleValue": false,
                                                    "textValue": null
                                                },
                                                "defaultValue": {
                                                    "titleValue": false,
                                                    "textValue": null
                                                },
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 26,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": null,
                                                "childrenFields": []
                                            }
                                        ]
                                    }
                                ]
                            }, {
                                "name": "二级标题配置",
                                "scripts": null,
                                "fields": [
                                    {
                                        "code": "title_second_font",
                                        "name": "标题名称",
                                        "description": null,
                                        "valueType": 6,
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
                                        "childrenFields": []
                                    }

                                ]
                            }, {
                                "name": "配置信息",
                                "scripts": null,
                                "fields": [
                                    {
                                        "code": "configure_style",
                                        "name": "配置",
                                        "description": null,
                                        "valueType": 6,
                                        "value": [
                                            {
                                                "name": "",
                                                "id": ""
                                            }
                                        ],
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 25,
                                        "viewMetaData": null,
                                        "multipleMaxNumber": 1,
                                        "verifyRule": null,
                                        "iconClass": null,
                                        "childrenFields": []
                                    }
                                ]
                            },
                            {
                                "name": "图表样式配置",
                                "scripts": null,
                                "fields": [
                                    {
                                        "code": "component_width",
                                        "name": "图表宽度",
                                        "description": null,
                                        "valueType": 2,
                                        "value": 300,
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 1,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "childrenFields": []
                                    }, {
                                        "code": "component_height",
                                        "name": "图表高度",
                                        "description": null,
                                        "valueType": 2,
                                        "value": 300,
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 1,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "childrenFields": []
                                    }, {
                                        "code": "component_x",
                                        "name": "图表x坐标",
                                        "description": null,
                                        "valueType": 2,
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
                                        "childrenFields": []
                                    }, {
                                        "code": "component_y",
                                        "name": "图表y坐标",
                                        "description": null,
                                        "valueType": 2,
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
                                        "childrenFields": []
                                    }

                                ]
                            },
                            {
                                "name": "背景和边框",
                                "scripts": null,
                                "fields": [
                                    {
                                        "code": "backgroundColor",
                                        "name": "背景颜色",
                                        "description": null,
                                        "valueType": 1,
                                        "value": "#fff",
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "iconClass": "icons_svg chartbg_format",
                                        "viewType": 15,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "childrenFields": []
                                    },
                                    {
                                        "code": "borderRadius",
                                        "name": "边框圆角设置",
                                        "description": null,
                                        "valueType": 3,
                                        "value": '',
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
                            }
                        ]
                    },
                    {
                        "name": "data",
                        "fieldGroups": [
                            {
                                "id": null,
                                "name": "基本信息",
                                "scripts": null,
                                "fields": [
                                    {
                                        "id": null,
                                        "code": "dataSource",
                                        "name": "数据源",
                                        "fieldAliasName": null,
                                        "description": null,
                                        "valueType": 6,
                                        "multipleMaxNumber": 1,
                                        "value": null,
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": [
                                            {
                                                "id": 1,
                                                "name": "TD_DC_ATEST",
                                                "dataSourceConnectionId": 1,
                                                "dataSourceConnectionName": "visual-test",
                                                "adapterName": "mysqlAdapter",
                                                "mappedDataSource": "TD_DC_ATEST",
                                                "description": null,
                                                "tenantId": null,
                                                "creator": null,
                                                "createBy": null,
                                                "createTime": "2017-05-28 03:20:42",
                                                "updater": null,
                                                "updateBy": null,
                                                "updateTime": "2017-08-11 06:21:50"
                                            }
                                        ],
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 24,
                                        "viewMetaData": {
                                            "action": "callBack",
                                            "postEvent": {
                                                "actionValue": "report/dataSources/id/metaData",
                                                "action": "callBack",
                                                "actionParams": ["datasource_id"],
                                                "postEvent": "datasource-reload | metadata-render"
                                            }
                                        },
                                        "verifyRule": null,
                                        "iconClass": null,
                                        "childrenFields": []
                                    }
                                ]
                            },
                            {
                                "id": null,
                                "name": "配置信息",
                                "scripts": null,
                                "fields": [
                                    {
                                        "id": null,
                                        "code": "configure",
                                        "name": "配置",
                                        "fieldAliasName": null,
                                        "description": null,
                                        "valueType": 6,
                                        "multipleMaxNumber": 1,
                                        "value": [
                                            {
                                                "name": "",
                                                "id": ""
                                            }
                                        ],
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 25,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "iconClass": null,
                                        "childrenFields": []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },

        'base_view_config_linkCommon_filter': {
            "view": {
                "id": null,
                "toolTip": null,
                "fieldTabs": [
                    {
                        "name": "style",
                        "fieldGroups": [
                            {
                                "name": "一级标题配置",
                                "scripts": null,
                                "fields": [
                                    {
                                        "code": "title_font",
                                        "name": "是否显示表头",
                                        "description": null,
                                        "valueType": 9,
                                        "value": null,
                                        "defaultValue": false,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 14,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "iconClass": "icons_svg color_format",
                                        "childrenFields": [
                                            {
                                                "code": "title_name",
                                                "name": "标题名称",
                                                "description": null,
                                                "valueType": 8,
                                                "value": {
                                                    "titleValue": false,
                                                    "textValue": null
                                                },
                                                "defaultValue": {
                                                    "titleValue": false,
                                                    "textValue": null
                                                },
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 26,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": null,
                                                "childrenFields": []
                                            }, {
                                                "code": "chart_download",
                                                "name": "下载设置",
                                                "description": null,
                                                "valueType": 9,
                                                "value": false,
                                                "defaultValue": false,
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 14,
                                                "viewMetaData": null,
                                                "verifyRule": null,
                                                "iconClass": null,
                                                "childrenFields": []
                                            }, {
                                                "code": "chart_help",
                                                "name": "帮助设置",
                                                "description": null,
                                                "valueType": 8,
                                                "value": {
                                                    "titleValue": false,
                                                    "textValue": null
                                                },
                                                "defaultValue": {
                                                    "titleValue": false,
                                                    "textValue": null
                                                },
                                                "minValue": null,
                                                "maxValue": null,
                                                "optionValues": null,
                                                "requried": 0,
                                                "helpInfo": null,
                                                "viewType": 26,
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
                                "name": "链接标题设置",
                                "scripts": null,
                                "fields": [
                                    {
                                        "code": "linkcommon_title_name",
                                        "name": "标题名称",
                                        "description": null,
                                        "valueType": 6,
                                        "value": '',
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
                                    }, {
                                        "code": "linkcommon_title_href",
                                        "name": "设置连接",
                                        "description": null,
                                        "valueType": 6,
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
                            }, {
                                "name": "配置信息",
                                "scripts": null,
                                "fields": [
                                    {
                                        "code": "configure_style",
                                        "name": "配置",
                                        "description": null,
                                        "valueType": 6,
                                        "value": [
                                            {
                                                "name": "",
                                                "id": ""
                                            }
                                        ],
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 25,
                                        "viewMetaData": null,
                                        "multipleMaxNumber": 1,
                                        "verifyRule": null,
                                        "iconClass": null,
                                        "childrenFields": []
                                    }
                                ]
                            }, {
                                "name": "图表样式配置",
                                "scripts": null,
                                "fields": [
                                    {
                                        "code": "component_width",
                                        "name": "图表宽度",
                                        "description": null,
                                        "valueType": 2,
                                        "value": 80,
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 1,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "childrenFields": []
                                    }, {
                                        "code": "component_height",
                                        "name": "图表高度",
                                        "description": null,
                                        "valueType": 2,
                                        "value": 44,
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 1,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "childrenFields": []
                                    }, {
                                        "code": "component_x",
                                        "name": "图表x坐标",
                                        "description": null,
                                        "valueType": 2,
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
                                        "childrenFields": []
                                    }, {
                                        "code": "component_y",
                                        "name": "图表y坐标",
                                        "description": null,
                                        "valueType": 2,
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
                                        "childrenFields": []
                                    }

                                ]
                            },
                            {
                                "name": "背景和边框",
                                "scripts": null,
                                "fields": [
                                    {
                                        "code": "backgroundColor",
                                        "name": "背景颜色",
                                        "description": null,
                                        "valueType": 1,
                                        "value": "#f8f8f9",
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "iconClass": "icons_svg chartbg_format",
                                        "viewType": 15,
                                        "viewMetaData": null,
                                        "verifyRule": null,
                                        "childrenFields": []
                                    },
                                    {
                                        "code": "borderRadius",
                                        "name": "边框圆角设置",
                                        "description": null,
                                        "valueType": 3,
                                        "value": '',
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
                            }
                        ]
                    },
                    {
                        "name": "data",
                        "fieldGroups": [
                            {
                                "name": "配置信息",
                                "scripts": null,
                                "fields": [
                                    {
                                        "code": "configure",
                                        "name": "配置",
                                        "description": null,
                                        "valueType": 6,
                                        "value": [
                                            {
                                                "name": "",
                                                "id": ""
                                            }
                                        ],
                                        "defaultValue": null,
                                        "minValue": null,
                                        "maxValue": null,
                                        "optionValues": null,
                                        "requried": 0,
                                        "helpInfo": null,
                                        "viewType": 25,
                                        "viewMetaData": null,
                                        "multipleMaxNumber": 1,
                                        "verifyRule": null,
                                        "iconClass": null,
                                        "childrenFields": []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },

        //测试数据源 Datasource 22
        'Datasource': {
            "id": 791,
            "name": "数据源",
            "description": "数据源",
            "iconPath": null,
            "iconData": null,
            "type": 22,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        },
        //测试过滤器 TabFilter 24
        'TabFilter': {
            "id": 791,
            "name": "TabFilter",
            "description": "TabFilter",
            "iconPath": null,
            "iconData": null,
            "type": 24,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        },
        //测试过滤器 filter 666
        'filter': {
            "id": 791,
            "name": "时间过滤器",
            "description": "时间过滤器",
            "iconPath": null,
            "iconData": null,
            "type": 28,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        },
        //测试过滤器 LinkCommon 34
        'linkCommon': {
            "id": 791,
            "name": "linkCommon",
            "description": "linkCommon",
            "iconPath": null,
            "iconData": null,
            "type": 34,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        },
        //aaa OverallFilter 25
        'OverallFilter': {
            "id": 791,
            "name": "全局Filter",
            "description": "全局Filter",
            "iconPath": null,
            "iconData": null,
            "type": 25,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        },

        //Cityfilter 36
        'Cityfilter': {
            "id": 791,
            "name": "同城Filter",
            "description": "同城Filter",
            "iconPath": null,
            "iconData": null,
            "type": 36,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        },
        //FirstCityfilter 39
        'FirstCityfilter': {
            "id": 791,
            "name": "一线城市Filter",
            "description": "一线城市Filter",
            "iconPath": null,
            "iconData": null,
            "type": 21,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        },
        // 组织机构过滤器 35
        'CellsFilter': {
            "id": 791,
            "name": "组织机构Filter",
            "description": "组织机构Filter",
            "iconPath": null,
            "iconData": null,
            "type": 35,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        },
        // RFM过滤器 39
        'RFMFilter': {
            "id": 791,
            "name": "RFMFilter",
            "description": "RFMFilter",
            "iconPath": null,
            "iconData": null,
            "type": 39,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        },
        // 下拉框过滤器 41
        'SelectFilter': {
            "id": 791,
            "name": "SelectFilter",
            "description": "SelectFilter",
            "iconPath": null,
            "iconData": null,
            "type": 41,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        },
        // 天过滤器 42
        'DayCalendarFilter': {
            "id": 791,
            "name": "日过滤器",
            "description": "日过滤器",
            "iconPath": null,
            "iconData": null,
            "type": 42,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        },
        // 月过滤器 43
        'MonthCalendarFilter': {
            "id": 791,
            "name": "月过滤器",
            "description": "月过滤器",
            "iconPath": null,
            "iconData": null,
            "type": 43,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        },
        // 单日历过滤器 44
        'SingleCalendarFilter': {
            "id": 791,
            "name": "单日历过滤器",
            "description": "单日历过滤器",
            "iconPath": null,
            "iconData": null,
            "type": 44,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        },
        // 单日历过滤器 44
        'TabOptions': {
            "id": 791,
            "name": "切换分页过滤器",
            "description": "切换分页过滤器",
            "iconPath": null,
            "iconData": null,
            "type": 45,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        },
        //四象限图 Scatter 16
        'Scatter': {
            "id": 791,
            "name": "四象限图",
            "description": "四象限图",
            "iconPath": null,
            "iconData": null,
            "type": 16,
            "groupId": 7,
            "orderNum": 16,
            "view": {}
        },
        //图片 Upload 3
        'Upload': {
            "id": 784,
            "name": "图片",
            "description": "图片",
            "iconPath": null,
            "iconData": null,
            "type": 3,
            "groupId": 10,
            "orderNum": 3,
            "view": {}
        },
        //圆形 Circle 13
        'Circle': {
            "id": 801,
            "name": "圆形",
            "description": "圆形",
            "iconPath": null,
            "iconData": null,
            "type": 13,
            "groupId": 11,
            "orderNum": 13,
            "view": {}
        },
        //地图 ChinaMap 9
        'ChinaMap': {
            "id": 800,
            "name": "地图",
            "description": "地图",
            "iconPath": null,
            "iconData": null,
            "type": 9,
            "groupId": 5,
            "orderNum": 9,
            "view": {}
        },
        //带下拉框时序图 SelectedLine 17
        'SelectedLine': {
            "id": 791,
            "name": "带下拉框时序图",
            "description": "带下拉框时序图",
            "iconPath": null,
            "iconData": null,
            "type": 17,
            "groupId": 1,
            "orderNum": 17,
            "view": {}
        },
        //折柱混合 lineBar 38
        'LineBar': {
            "id": 7904,
            "name": "折柱混合图",
            "description": "折柱混合图",
            "iconPath": null,
            "iconData": null,
            "type": 38,
            "groupId": 1,
            "orderNum": 38,
            "view": {}
        },
        //文字 Font 1
        'Font': {
            "id": 785,
            "name": "文字",
            "description": "文字",
            "iconPath": null,
            "iconData": null,
            "type": 1,
            "groupId": 9,
            "orderNum": 1,
            "view": {}
        },
        //时间 Dateformat 8
        'Dateformat': {
            "id": 786,
            "name": "时间",
            "description": "时间",
            "iconPath": null,
            "iconData": null,
            "type": 8,
            "groupId": 12,
            "orderNum": 8,
            "view": {}
        },
        //条图 Strip 7
        'Strip': {
            "id": 787,
            "name": "条图",
            "description": "条图",
            "iconPath": null,
            "iconData": null,
            "type": 7,
            "groupId": 2,
            "orderNum": 7,
            "view": {}
        },
        //城市级别条图 CityHorizontalBar 41
        'CityHorizontalBar': {
            "id": 787,
            "name": "城市四个条图",
            "description": "城市四个条图",
            "iconPath": null,
            "iconData": null,
            "type": 48,
            "groupId": 2,
            "orderNum": 7,
            "view": {}
        },

        //柱图 Bar 5
        'Bar': {
            "id": 788,
            "name": "柱图",
            "description": "柱图",
            "iconPath": null,
            "iconData": null,
            "type": 5,
            "groupId": 2,
            "orderNum": 5,
            "view": {}
        },
        //柱图x轴指标 BarXy 20
        'BarXy': {
            "id": 791,
            "name": "柱图x轴指标",
            "description": "柱图x轴指标",
            "iconPath": null,
            "iconData": null,
            "type": 20,
            "groupId": 2,
            "orderNum": 5,
            "view": {}
        },
        //柱图x轴指标 BarXy 20
        'ManyFilterBar': {
            "id": 791,
            "name": "多店柱图",
            "description": "多店柱图",
            "iconPath": null,
            "iconData": null,
            "type": 32,
            "groupId": 2,
            "orderNum": 5,
            "view": {}
        },
        //概览 Priview 11
        'Priview': {
            "id": 789,
            "name": "概览",
            "description": "概览",
            "iconPath": null,
            "iconData": null,
            "type": 11,
            "groupId": 6,
            "orderNum": 11,
            "view": {}
        },
        //横向多段条图 StackedBar 15
        'StackedBar': {
            "id": 791,
            "name": "横向多段条图",
            "description": "横向多段条图",
            "iconPath": null,
            "iconData": null,
            "type": 15,
            "groupId": 2,
            "orderNum": 15,
            "view": {}
        },
        //矩形 Banner 12
        'Banner': {
            "id": 782,
            "name": "矩形",
            "description": "矩形",
            "iconPath": null,
            "iconData": null,
            "type": 12,
            "groupId": 11,
            "orderNum": 12,
            "view": {}
        },
        //线图 Line 6
        'Line': {
            "id": 790,
            "name": "线图",
            "description": "线图",
            "iconPath": null,
            "iconData": null,
            "type": 6,
            "groupId": 1,
            "orderNum": 6,
            "view": {}
        },
        //组合概览 IndexPriview 30
        'IndexPriview': {
            "id": 791,
            "name": "组合概览",
            "description": "组合概览",
            "iconPath": null,
            "iconData": null,
            "type": 30,
            "groupId": 6,
            "orderNum": 30,
            "view": {}
        },

        //指标概览 PassengerFlowPriview 31
        'PassengerFlowPriview': {
            "id": 791,
            "name": "指标概览",
            "description": "指标概览",
            "iconPath": null,
            "iconData": null,
            "type": 31,
            "groupId": 6,
            "orderNum": 31,
            "view": {}
        },

        //表格 Table 2
        'Table': {
            "id": 791,
            "name": "表格",
            "description": "表格",
            "iconPath": null,
            "iconData": null,
            "type": 2,
            "groupId": 4,
            "orderNum": 2,
            "view": {}
        },
        'LifeCycleList': {
            "id": 791,
            "name": "人群流转列表",
            "description": "人群流转列表",
            "iconPath": null,
            "iconData": null,
            "type": 47,
            "groupId": 4,
            "orderNum": 47,
            "view": {}
        },
        //销售树概览 Part 19
        'Part': {
            "id": 791,
            "name": "销售树概览",
            "description": "销售树概览",
            "iconPath": null,
            "iconData": null,
            "type": 19,
            "groupId": 6,
            "orderNum": 19,
            "view": {}
        },
        //面积图 Area 10
        'Area': {
            "id": 783,
            "name": "面积图",
            "description": "面积图",
            "iconPath": null,
            "iconData": null,
            "type": 10,
            "groupId": 1,
            "orderNum": 10,
            "view": {}
        },
        //面积图 Area 10
        'TabArea': {
            "id": 783,
            "name": "带标签的面积图",
            "description": "带标签的面积图",
            "iconPath": null,
            "iconData": null,
            "type": 46,
            "groupId": 1,
            "orderNum": 46,
            "view": {}
        },
        //饼图 Pie 4
        'Pie': {
            "id": 799,
            "name": "饼图",
            "description": "饼图",
            "iconPath": null,
            "iconData": null,
            "type": 4,
            "groupId": 3,
            "orderNum": 4,
            "view": {}
        },
        //饼图 Pie 4
        'PieBar': {
            "id": 799,
            "name": "饼图条图",
            "description": "饼图条图",
            "iconPath": null,
            "iconData": null,
            "type": 40,
            "groupId": 3,
            "orderNum": 4,
            "view": {}
        },
        //矩形漏斗图 RectFunnel 14
        'RectFunnel': {
            "id": 791,
            "name": "矩形漏斗图",
            "description": "矩形漏斗图",
            "iconPath": null,
            "iconData": null,
            "type": 14,
            "groupId": 1,
            "orderNum": 10,
            "view": {}
        },

        //雷达图2 Radar2 18
        'Radar2': {
            "id": 791,
            "name": "雷达图2",
            "description": "雷达图2",
            "iconPath": null,
            "iconData": null,
            "type": 18,
            "groupId": 3,
            "orderNum": 4,
            "view": {}
        },

        //城市概览 CityPreview 29
        'CityPreview': {
            "id": 791,
            "name": "城市概览",
            "description": "城市概览",
            "iconPath": null,
            "iconData": null,
            "type": 29,
            "groupId": 3,
            "orderNum": 4,
            "view": {}
        },
        //店铺热力图 StoreHeatmap 33
        'StoreHeatmap': {
            "id": 791,
            "name": "店铺热力图",
            "description": "店铺热力图",
            "iconPath": null,
            "iconData": null,
            "type": 33,
            "groupId": 3,
            "orderNum": 4,
            "view": {}
        },
        //店铺热力图 StoreHeatmap 33
        'ProvinceFilter': {
            "id": 791,
            "name": "省份Filter",
            "description": "省份Filter",
            "iconPath": null,
            "iconData": null,
            "type": 37,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        },
        'PartnerFilter': {
            "id": 791,
            "name": "合作商Filter",
            "description": "合作商Filter",
            "iconPath": null,
            "iconData": null,
            "type": 23,
            "groupId": 0,
            "orderNum": 6,
            "view": {}
        }
    };
}
