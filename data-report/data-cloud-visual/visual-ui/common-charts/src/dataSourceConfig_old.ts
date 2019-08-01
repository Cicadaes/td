/**
 * Created by tommy on 2017/9/21.
 */

export class DataSourceConfig {
    //集团概览 运营概览-客流指标  运营概览-销售指标  运营概览-转化漏斗 运营概览-停留分布
    static staticData_a: any = [
        {
            "index": "a_1",
            "datasource_id": 13,
            "dateDimensions": [
                {
                    "field": "date"
                }
            ],
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name"
                }
            ],
            "metrics": [
                {
                    "field": "active_users",
                    "alias": "value"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "6"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "asc"
                },
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "settingZero": true,
            "dateGranularity": 0
        },
        {
            "index": "a_2",
            "datasource_id": 13,
            "dateDimensions": [
                {
                    "field": "date"
                }
            ],
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name"
                }
            ],
            "metrics": [
                {
                    "field": "sales_amount",
                    "alias": "value"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "6"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "asc"
                },
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "settingZero": true,
            "dateGranularity": 0
        },
        {
            "index": "a_3",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name"
                }
            ],
            "metrics": [
                {
                    "field": "front_users",
                    "alias": "店前"
                },
                {
                    "field": "active_users",
                    "alias": "入店"
                },
                {
                    "field": "stay_users",
                    "alias": "停留"
                },
                {
                    "field": "receipt_count",
                    "alias": "转化"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "6"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "dateGranularity": 0
        },
        {
            "index": "a_4",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name"
                }
            ],
            "metrics": [
                {
                    "field": "interval_2",
                    "alias": "0-1min"
                },
                {
                    "field": "interval_5",
                    "alias": "1-5min"
                },
                {
                    "field": "interval_10",
                    "alias": "5-15min"
                },
                {
                    "field": "interval_15",
                    "alias": ">15min"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "6"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "dateGranularity": 0
        },
        {
            "index": "a_5",
            "datasource_id": 13,
            "dateDimensions": [
                {
                    "field": "date"
                }
            ],
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name",
                    "limit": 4
                }
            ],
            "metrics": [
                {
                    "field": "active_users",
                    "alias": "value"
                }
            ],
            "filters": [
                {
                    "field": "city_level",
                    "operator": "=",
                    "value": "1"
                },
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "3"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "asc"
                },
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "settingZero": true,
            "dateGranularity": 0
        },
        {
            "index": "a_6",
            "datasource_id": 13,
            "dateDimensions": [
                {
                    "field": "date"
                }
            ],
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name",
                    "limit": 4
                }
            ],
            "metrics": [
                {
                    "field": "sales_amount",
                    "alias": "value"
                }
            ],
            "filters": [
                {
                    "field": "city_level",
                    "operator": "=",
                    "value": "1"
                },
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "3"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "asc"
                },
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "settingZero": true,
            "dateGranularity": 0
        },
        {
            "index": "a_7",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name",
                    "limit": 4
                }
            ],
            "metrics": [
                {
                    "field": "front_users",
                    "alias": "店前"
                },
                {
                    "field": "active_users",
                    "alias": "入店"
                },
                {
                    "field": "stay_users",
                    "alias": "停留"
                },
                {
                    "field": "receipt_count",
                    "alias": "转化"
                }
            ],
            "filters": [
                {
                    "field": "city_level",
                    "operator": "=",
                    "value": "1"
                },
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "3"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "dateGranularity": 0
        },
        {
            "index": "a_8",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name",
                    "limit": 4
                }
            ],
            "metrics": [
                {
                    "field": "interval_2",
                    "alias": "0-1min"
                },
                {
                    "field": "interval_5",
                    "alias": "1-5min"
                },
                {
                    "field": "interval_10",
                    "alias": "5-15min"
                },
                {
                    "field": "interval_15",
                    "alias": ">15min"
                }
            ],
            "filters": [
                {
                    "field": "city_level",
                    "operator": "=",
                    "value": "1"
                },
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "3"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "dateGranularity": 0
        },
        {
            "index": "a_9",
            "datasource_id": 13,
            "dateDimensions": [
                {
                    "field": "date"
                }
            ],
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name",
                    "limit": 4
                }
            ],
            "metrics": [
                {
                    "field": "active_users",
                    "alias": "value"
                }
            ],
            "filters": [
                {
                    "field": "city",
                    "operator": "=",
                    "value": "上海市"
                },
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "4"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "asc"
                },
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "settingZero": true,
            "dateGranularity": 0
        },
        {
            "index": "a_10",
            "datasource_id": 13,
            "dateDimensions": [
                {
                    "field": "date"
                }
            ],
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name",
                    "limit": 4
                }
            ],
            "metrics": [
                {
                    "field": "sales_amount",
                    "alias": "value"
                }
            ],
            "filters": [
                {
                    "field": "city",
                    "operator": "=",
                    "value": "上海市"
                },
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "4"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "asc"
                },
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "settingZero": true,
            "dateGranularity": 0
        },
        {
            "index": "a_11",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name",
                    "limit": 4
                }
            ],
            "metrics": [
                {
                    "field": "front_users",
                    "alias": "店前"
                },
                {
                    "field": "active_users",
                    "alias": "入店"
                },
                {
                    "field": "stay_users",
                    "alias": "停留"
                },
                {
                    "field": "receipt_count",
                    "alias": "转化"
                }
            ],
            "filters": [
                {
                    "field": "city",
                    "operator": "=",
                    "value": "上海市"
                },
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "4"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "dateGranularity": 0
        },
        {
            "index": "a_12",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name",
                    "limit": 4
                }
            ],
            "metrics": [
                {
                    "field": "interval_2",
                    "alias": "1-5min"
                },
                {
                    "field": "interval_5",
                    "alias": "5-15min"
                },
                {
                    "field": "interval_10",
                    "alias": "15-30min"
                },
                {
                    "field": "interval_15",
                    "alias": ">30min"
                }
            ],
            "filters": [
                {
                    "field": "city",
                    "operator": "=",
                    "value": "上海市"
                },
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "4"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "dateGranularity": 0
        },
        {
            "index": "a_13",
            "datasource_id": 13,
            "dateDimensions": [
                {
                    "field": "date"
                }
            ],
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name",
                    "limit": 4
                }
            ],
            "metrics": [
                {
                    "field": "active_users",
                    "alias": "value"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "8"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "asc"
                },
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "settingZero": true,
            "dateGranularity": 0
        },
        {
            "index": "a_14",
            "datasource_id": 13,
            "dateDimensions": [
                {
                    "field": "date"
                }
            ],
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name",
                    "limit": 4
                }
            ],
            "metrics": [
                {
                    "field": "sales_amount",
                    "alias": "value"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "8"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "asc"
                },
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "settingZero": true,
            "dateGranularity": 0
        },
        {
            "index": "a_15",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name",
                    "limit": 4
                }
            ],
            "metrics": [
                {
                    "field": "front_users",
                    "alias": "店前"
                },
                {
                    "field": "active_users",
                    "alias": "入店"
                },
                {
                    "field": "stay_users",
                    "alias": "停留"
                },
                {
                    "field": "receipt_count",
                    "alias": "转化"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "8"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "dateGranularity": 0
        },
        {
            "index": "a_16",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "project_name",
                    "alias": "name",
                    "limit": 4
                }
            ],
            "metrics": [
                {
                    "field": "interval_2",
                    "alias": "1-5min"
                },
                {
                    "field": "interval_5",
                    "alias": "5-15min"
                },
                {
                    "field": "interval_10",
                    "alias": "15-30min"
                },
                {
                    "field": "interval_15",
                    "alias": ">30min"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "8"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "name",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "dateGranularity": 0
        }
    ];
    //集团概览 概览  四象限分布图
    static staticData_a_2: any = [
        {
            "index": "a_21",
            "datasource_id": 14,
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "6"
                }
            ]
        },
        {
            "index": "a_22",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "brand"
                },
                {
                    "field": "project_name"
                }
            ],
            "metrics": [
                {
                    "field": "front_users",
                    "alias": "xValue"
                },
                {
                    "field": "active_users",
                    "alias": "yValue"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "5"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "limit": [
                -1
            ],
            "dateGranularity": 0
        },
        {
            "index": "a_23",
            "datasource_id": 14,
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "3"
                }
            ]
        },
        {
            "index": "a_24",
            "datasource_id": 14,
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "9"
                }
            ]
        },
        {
            "index": "a_25",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "brand"
                },
                {
                    "field": "project_name"
                }
            ],
            "metrics": [
                {
                    "field": "front_users",
                    "alias": "xValue"
                },
                {
                    "field": "active_users",
                    "alias": "yValue"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "10"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "limit": [
                -1
            ],
            "dateGranularity": 0
        },
        {
            "index": "a_26",
            "datasource_id": 17,
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "1"
                }
            ]
        },
        {
            "index": "a_27",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "brand"
                },
                {
                    "field": "project_name"
                }
            ],
            "metrics": [
                {
                    "field": "active_users",
                    "alias": "value"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "4"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "limit": [
                -1
            ],
            "dateGranularity": 0
        },
        {
            "index": "a_28",
            "datasource_id": 17,
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "7"
                }
            ]
        },
        {
            "index": "a_29",
            "datasource_id": 17,
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "8"
                }
            ]
        },
        {
            "index": "a_30",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "brand"
                },
                {
                    "field": "project_name"
                }
            ],
            "metrics": [
                {
                    "field": "front_users",
                    "alias": "xValue"
                },
                {
                    "field": "active_users",
                    "alias": "yValue"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "8"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "limit": [
                -1
            ],
            "dateGranularity": 0
        },
        {
            "index": "a_31",
            "datasource_id": 17,
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "7"
                }
            ]
        },
        {
            "index": "a_32",
            "datasource_id": 17,
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "8"
                }
            ]
        },
        {
            "index": "a_33",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "project_name"
                }
            ],
            "metrics": [
                {
                    "field": "active_users"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "9"
                },
                {
                    "field": "brand",
                    "operator": "=",
                    "value": "%%"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "active_users",
                    "function": "DESC"
                },
                {
                    "field": "project_name",
                    "function": "ASC"
                }
            ],
            "dateGranularity": 0
        },
        {
            "index": "a_34",
            "datasource_id": 24,
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "3"
                },
                {
                    "field": "brand",
                    "operator": "=",
                    "value": "%%"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "limit": [
                1,
                10
            ],
            "dateGranularity": 0
        },
        {
            "index": "a_35",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "project_name"
                }
            ],
            "metrics": [
                {
                    "field": "active_users"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "13"
                },
                {
                    "field": "channel",
                    "operator": "=",
                    "value": "%%"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "active_users",
                    "function": "DESC"
                },
                {
                    "field": "project_name",
                    "function": "ASC"
                }
            ],
            "dateGranularity": 0
        },
        {
            "index": "a_36",
            "datasource_id": 24,
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "14"
                },
                {
                    "field": "channel",
                    "operator": "=",
                    "value": "%%"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "limit": [
                1,
                10
            ],
            "dateGranularity": 0
        }
    ];
    //运营概览
    static staticData_b: any = [
        {
            "index": "b_1",
            "datasource_id": 19,
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "1"
                },
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7194"
                }
            ]
        },
        {
            "index": "b_2",
            "datasource_id": 21,
            "filters": [
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "6015"
                },
                {
                    "field": "start_date",
                    "operator": ">=",
                    "value": "2017-01-01"
                },
                {
                    "field": "end_date",
                    "operator": "<=",
                    "value": "2017-12-31"
                }
            ],
            "limit": [
                1,
                5
            ]
        },
        {
            "index": "b_3",
            "datasource_id": 38,
            "dimensions": [
                {
                    "field": "brand"
                },
                {
                    "field": "project_name"
                }
            ],
            "metrics": [
                {
                    "field": "front_users",
                    "alias": "xValue"
                },
                {
                    "field": "active_users",
                    "alias": "yValue"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "1"
                },
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7200"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "limit": [
                -1
            ],
            "dateGranularity": 0
        },
        {
            "index": "b_4",
            "datasource_id": 34,
            "dimensions": [
                {
                    "field": "x"
                },
                {
                    "field": "y"
                }
            ],
            "filters": [
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7200"
                },
                {
                    "field": "in_room",
                    "operator": "=",
                    "value": 1
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "asc"
                }
            ],
            "limit": [
                -1
            ],
            "dateGranularity": 0
        },
        {
            "index": "b_5",
            "datasource_id": 35,
            "dimensions": [
                {
                    "field": "project_id"
                },
                {
                    "field": "pic_url"
                }
            ],
            "filters": [
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7187"
                }
            ]
        },
        {
            "index": "b_6",
            "datasource_id": 19,
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "11"
                },
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "8279"
                }
            ]
        },
        {
            "index": "b_7",
            "datasource_id": 32,
            "dimensions": [
                {
                    "field": "project_name"
                },
                {
                    "field": "longitude"
                },
                {
                    "field": "latitude"
                }
            ],
            "metrics": [
                {
                    "field": "active_users"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "1"
                },
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "8279"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "dateGranularity": 0
        },
        {
            "index": "b_11",
            "datasource_id": 19,
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "5"
                },
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "8253"
                }
            ]
        },
        {
            "index": "b_12",
            "datasource_id": 32,
            "dimensions": [
                {
                    "field": "project_name"
                },
                {
                    "field": "longitude"
                },
                {
                    "field": "latitude"
                }
            ],
            "metrics": [
                {
                    "field": "active_users"
                }
            ],
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "1"
                },
                {
                    "field": "region",
                    "operator": "=",
                    "value": "华北_JJ"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "dateGranularity": 0
        },
        {
            "index": "b_16",
            "datasource_id": 19,
            "filters": [
                {
                    "field": "project_type",
                    "operator": "=",
                    "value": "6"
                },
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "8263"
                }
            ]
        }
    ];
    //后面的
    static staticData_c: any = [
        {
            "index": "c_0",
            "datasource_id": 18,
            "filters": [
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7194"
                },
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7199"
                }
            ]
        },
        {
            "index": "c_1",
            "datasource_id": 33,
            "dimensions": [
                {
                    "field": "date"
                },
                {
                    "field": "name"
                }
            ],
            "metrics": [
                {
                    "field": "active_hour_users",
                    "alias": "value"
                }
            ],
            "filters": [
                {
                    "field": "project_id",
                    "operator": "in",
                    "value": "36873"
                },
                {
                    "field": "date",
                    "operator": "=",
                    "value": "2017-11-17"
                }
            ],
            "settingZero": true
        },
        {
            "index": "c_2",
            "datasource_id": 20,
            "dimensions": [
                {
                    "field": "hour",
                    "alias": "date"
                },
                {
                    "field": "project_name",
                    "alias": "name"
                }
            ],
            "metrics": [
                {
                    "field": "active_hour_users",
                    "alias": "value"
                }
            ],
            "filters": [
                {
                    "field": "date",
                    "operator": "=",
                    "value": "2017-11-17"
                },
                {
                    "field": "project_id",
                    "operator": "in",
                    "value": "36873,33439"
                }
            ],
            "groupBy": [
                {
                    "field": "hour",
                    "function": "noFunction"
                },
                {
                    "field": "project_name",
                    "function": "noFunction"
                }
            ],
            "orderBy": [
                {
                    "field": "CAST(hour AS SIGNED)",
                    "function": "asc"
                }
            ]
        },
        {
            "index": "c_3",
            "datasource_id": 13,
            "dateDimensions": [
                {
                    "field": "date"
                }
            ],
            "metrics": [
                {
                    "field": "active_new_users",
                    "alias": "新客"
                },
                {
                    "field": "active_old_users",
                    "alias": "老客"
                }
            ],
            "filters": [
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7194"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "asc"
                }
            ],
            "dateGranularity": 0,
            "settingZero": true
        },
        {
            "index": "c_4",
            "datasource_id": 22,
            "dateDimensions": [
                {
                    "field": "date",
                    "alias": "时间"
                }
            ],
            "metrics": [
                {
                    "field": "active_old_users",
                    "alias": "入店老客"
                }
            ],
            "filters": [
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7194"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "desc"
                }
            ],
            "limit": [
                1,
                10
            ],
            "dateGranularity": 0
        },
        {
            "index": "c_5",
            "datasource_id": 29,
            "metrics": [
                {
                    "field": "duration_new_5"
                },
                {
                    "field": "duration_new_15"
                },
                {
                    "field": "duration_new_30"
                },
                {
                    "field": "duration_new_60"
                },
                {
                    "field": "duration_old_5"
                },
                {
                    "field": "duration_old_15"
                },
                {
                    "field": "duration_old_30"
                },
                {
                    "field": "duration_old_60"
                }
            ],
            "filters": [
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7194"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "asc"
                }
            ],
            "dateGranularity": 0
        },
        {
            "index": "c_6",
            "datasource_id": 29,
            "metrics": [
                {
                    "field": "high_active_5"
                },
                {
                    "field": "high_active_15"
                },
                {
                    "field": "high_active_30"
                },
                {
                    "field": "high_active_60"
                },
                {
                    "field": "middle_active_5"
                },
                {
                    "field": "middle_active_15"
                },
                {
                    "field": "middle_active_30"
                },
                {
                    "field": "middle_active_60"
                },
                {
                    "field": "low_active_5"
                },
                {
                    "field": "low_active_15"
                },
                {
                    "field": "low_active_30"
                },
                {
                    "field": "low_active_60"
                },
                {
                    "field": "sleep_active_5"
                },
                {
                    "field": "sleep_active_15"
                },
                {
                    "field": "sleep_active_30"
                },
                {
                    "field": "sleep_active_60"
                }
            ],
            "filters": [
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7194"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "asc"
                }
            ],
            "dateGranularity": 0
        },
        {
            "index": "c_7",
            "datasource_id": 29,
            "dateDimensions": [
                {
                    "field": "date"
                }
            ],
            "metrics": [
                {
                    "field": "active_duration/active_times",
                    "function": "noFunction",
                    "alias": "入店客群"
                },
                {
                    "field": "new_active_duration/new_active_time",
                    "function": "noFunction",
                    "alias": "入店新客"
                },
                {
                    "field": "old_active_duration/old_active_time",
                    "function": "noFunction",
                    "alias": "入店老客"
                }
            ],
            "filters": [
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7194"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "asc"
                }
            ],
            "dateGranularity": 0
        },
        {
            "index": "c_8",
            "datasource_id": 31,
            "dateDimensions": [
                {
                    "field": "date",
                    "alias": "时间"
                }
            ],
            "metrics": [
                {
                    "field": "active_users",
                    "alias": "入店客流"
                },
                {
                    "field": "active_new_users",
                    "alias": "入店新客"
                },
                {
                    "field": "active_old_users",
                    "alias": "入店老客"
                }
            ],
            "filters": [
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7194"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "DESC"
                }
            ],
            "limit": [
                1,
                100
            ],
            "dateGranularity": 0
        },
        {
            "index": "c_9",
            "datasource_id": 29,
            "metrics": [
                {
                    "field": "time_old_1"
                },
                {
                    "field": "time_old_2"
                },
                {
                    "field": "time_old_3"
                },
                {
                    "field": "time_old_5"
                }
            ],
            "filters": [
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7194"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "asc"
                }
            ],
            "dateGranularity": 0
        },
        {
            "index": "c_10",
            "datasource_id": 29,
            "dateDimensions": [
                {
                    "field": "date"
                }
            ],
            "metrics": [
                {
                    "field": "visit_cycle"
                }
            ],
            "filters": [
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7194"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-10"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "asc"
                }
            ],
            "dateGranularity": 1
        },
        {
            "index": "c_11",
            "datasource_id": 30,
            "dateDimensions": [
                {
                    "field": "date",
                    "alias": "时间"
                }
            ],
            "metrics": [
                {
                    "field": "visit_cycle",
                    "alias": "入店老客"
                }
            ],
            "filters": [
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7194"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "orderBy": [
                {
                    "field": "date",
                    "function": "desc"
                }
            ],
            "limit": [
                1,
                10
            ],
            "dateGranularity": 0
        },
        {
            "index": "c_12",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "project_name"
                }
            ],
            "metrics": [
                {
                    "field": "front_users",
                    "alias": "周边客流"
                },
                {
                    "field": "active_users",
                    "alias": "入店客流"
                },
                {
                    "field": "stay_users",
                    "alias": "停留客流"
                },
                {
                    "field": "receipt_count",
                    "alias": "转化客流"
                }
            ],
            "filters": [
                {
                    "field": "project_id",
                    "operator": "in",
                    "value": "7195,7196,7197,7198,7199,7200,7201,7202,7203"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "limit": [
                1,
                4
            ],
            "orderBy": [
                {
                    "field": "project_name",
                    "function": "desc"
                }
            ],
            "dateGranularity": 0
        },
        {
            "index": "c_13",
            "datasource_id": 25,
            "filters": [
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7194"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "dateGranularity": 0
        },
        {
            "index": "c_14",
            "datasource_id": 15,
            "dimensions": [
                {
                    "field": "crowd_name",
                    "alias": "date"
                },
                {
                    "field": "distance",
                    "alias": "name"
                }
            ],
            "metrics": [
                {
                    "field": "metric_value",
                    "alias": "value"
                }
            ],
            "filters": [
                {
                    "field": "hour_type",
                    "operator": "=",
                    "value": "2"
                },
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "3"
                }
            ],
            "dateFilters": [
                {
                    "field": "end_date",
                    "operator": "=",
                    "value": "2017-10"
                }
            ],
            "dateGranularity": 1
        },
        {
            "index": "c_15",
            "datasource_id": 16,
            "dimensions": [
                {
                    "field": "area_name"
                }
            ],
            "metrics": [
                {
                    "field": "metric_value"
                }
            ],
            "filters": [
                {
                    "field": "area_type",
                    "operator": "=",
                    "value": "2"
                },
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "6047"
                }
            ],
            "dateFilters": [
                {
                    "field": "end_date",
                    "operator": "=",
                    "value": "2017-10"
                }
            ],
            "limit": [
                1,
                10
            ],
            "orderBy": [
                {
                    "field": "metric_value",
                    "function": "desc"
                }
            ],
            "dateGranularity": 1
        },
        {
            "index": "c_16",
            "datasource_id": 26,
            "dimensions": [
                {
                    "field": "area_name",
                    "alias": "地区"
                }
            ],
            "metrics": [
                {
                    "field": "AU",
                    "alias": "入店客流"
                },
                {
                    "field": "NU",
                    "alias": "入店新客"
                },
                {
                    "field": "OU",
                    "alias": "入店老客"
                },
                {
                    "field": "SU",
                    "alias": "停留客流"
                },
                {
                    "field": "JU",
                    "alias": "跳出客流"
                },
                {
                    "field": "HU",
                    "alias": "高活跃客流"
                },
                {
                    "field": "MU",
                    "alias": "中活跃客流"
                },
                {
                    "field": "LU",
                    "alias": "低活跃客流"
                },
                {
                    "field": "SLU",
                    "alias": "沉睡客流"
                }
            ],
            "filters": [
                {
                    "field": "area_type",
                    "operator": "=",
                    "value": "2"
                },
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "7194"
                }
            ],
            "orderBy": [
                {
                    "field": "入店客流",
                    "function": "DESC"
                }
            ],
            "limit": [
                1,
                10
            ],
            "dateFilters": [
                {
                    "field": "end_date",
                    "operator": "=",
                    "value": "2017-10"
                }
            ],
            "dateGranularity": 1
        },
        {
            "index": "c_17",
            "datasource_id": 13,
            "dimensions": [
                {
                    "field": "project_name"
                }
            ],
            "metrics": [
                {
                    "field": "sales_amount",
                    "alias": "销售金额"
                },
                {
                    "field": "vip_sales_amount",
                    "alias": "会员销售金额"
                },
                {
                    "field": "non_vip_sales_amount",
                    "alias": "非会员销售金额"
                },
                {
                    "field": "order_count",
                    "alias": "订单数"
                },
                {
                    "field": "ROUND(sum(order_count_gt1)/sum(order_count)*100,2)",
                    "alias": "关联销售订单占比"
                },
                {
                    "field": "ROUND(sum(sales_amount)/sum(order_count)*100,2)",
                    "alias": "VPC"
                }
            ],
            "filters": [
                {
                    "field": "project_id",
                    "operator": "in",
                    "value": "7194,7195,7196"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "dateGranularity": 0
        },
        {
            "index": "c_18",
            "datasource_id": 23,
            "dateDimensions": [
                {
                    "field": "date",
                    "alias": "日期"
                }
            ],
            "metrics": [
                {
                    "field": "sales_amount",
                    "alias": "销售金额"
                },
                {
                    "field": "vip_sales_amount",
                    "alias": "会员成交金额"
                },
                {
                    "field": "non_vip_sales_amount",
                    "alias": "非会员成交金额"
                }
            ],
            "filters": [
                {
                    "field": "project_id",
                    "operator": "=",
                    "value": "1545"
                }
            ],
            "dateFilters": [
                {
                    "field": "date",
                    "operator": ">=",
                    "value": "2017-11-01"
                },
                {
                    "field": "date",
                    "operator": "<=",
                    "value": "2017-11-30"
                }
            ],
            "limit": [
                1,
                10
            ],
            "dateGranularity": 0
        }
    ];

    static staticDataMap: any = null;

    //格式化日期
    static getFormatDate(n: any) {
        var n = n;
        var d = new Date();
        var year = d.getFullYear();
        var mon = d.getMonth() + 1;
        var day = d.getDate();
        if (day <= n) {
            if (mon > 1) {
                mon = mon - 1;
            } else {
                year = year - 1;
                mon = 12;
            }
        }
        d.setDate(d.getDate() - n);
        year = d.getFullYear();
        mon = d.getMonth() + 1;
        day = d.getDate();
        var s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);

        return s;
    }

    public static getConfigByKey(key: string): any {
        if (!this.staticDataMap) {
            this.staticDataMap = {};
            for (let i = 0; i < this.staticData_a.length; i++) {
                let obj = this.staticData_a[i];
                this.staticDataMap[obj.index] = obj;
            }
            for (let i = 0; i < this.staticData_a_2.length; i++) {
                let obj = this.staticData_a_2[i];
                this.staticDataMap[obj.index] = obj;
            }
            for (let i = 0; i < this.staticData_b.length; i++) {
                let obj = this.staticData_b[i];
                this.staticDataMap[obj.index] = obj;
            }
            for (let i = 0; i < this.staticData_c.length; i++) {
                let obj = this.staticData_c[i];
                this.staticDataMap[obj.index] = obj;
            }
        }
        if (this.staticDataMap && this.staticDataMap[key]) {
            let result = JSON.parse(JSON.stringify(this.staticDataMap[key]));
            delete result.index;
            for (let onekey in result) {
                if (onekey == "dateFilters") {
                    let arr = result[onekey];
                    for (let j = 0; j < arr.length; j++) {
                        let datavalue = arr[j]["value"];
                        let datavaluelenght = arr[j]["value"].split("-");
                        if (datavaluelenght.length > 2) {
                            if (arr[j]["operator"] == "<=") {
                                arr[j]["value"] = this.getFormatDate(1);
                            } else if (arr[j]["operator"] == ">=") {
                                arr[j]["value"] = this.getFormatDate(30)
                            }
                        }
                    }
                }
            }
            return result;
        } else {
            return {"index": key};
        }
    }

    public static mergeBodyByFilter(bodyOrigin: any, data: any): any {
        if (data && data.filter) {
            for (let i = 0; i < data.filter.length; i++) {
                let item = data.filter[i];
                for (let j = 0; j < bodyOrigin.filters.length; j++) {
                    let itemOrigin = bodyOrigin.filters[j];
                    if (item.field == itemOrigin.field) {
                        itemOrigin.field = item.field;
                        itemOrigin.operator = item.operator;
                        itemOrigin.value = item.value;
                    }
                }
            }
        }

        if (data && data.date) {
            for (let i = 0; i < data.date.length; i++) {
                let item = data.date[i];
                if (bodyOrigin.filters) {
                    for (let j = 0; j < bodyOrigin.filters.length; j++) {
                        let itemOrigin = bodyOrigin.filters[j];
                        if (item.field == itemOrigin.field && item.operator == itemOrigin.operator) {
                            itemOrigin.field = item.field;
                            itemOrigin.operator = item.operator;
                            itemOrigin.value = item.value;
                        }
                    }
                }

                if (bodyOrigin.dateFilters) {
                    for (let j = 0; j < bodyOrigin.dateFilters.length; j++) {
                        let itemOrigin = bodyOrigin.dateFilters[j];
                        if (item.field == itemOrigin.field && item.operator == itemOrigin.operator) {
                            itemOrigin.field = item.field;
                            itemOrigin.operator = item.operator;
                            itemOrigin.value = item.value;
                        }
                    }

                    //只为来源分析图表使用，todo
                    if (bodyOrigin.dateFilters[0].field == "end_date") {
                        if (item.field == "date" && item.operator == "<=") {
                            bodyOrigin.dateFilters[0].value = item.value;
                        }
                    }
                }

            }
        }

        if (data && data.dateType) {
            let dateTypeMap = {
                "day": 0,
                "month": 1,
                "week": 2,
            };
            bodyOrigin["dateGranularity"] = dateTypeMap[data.dateType];
        }
        return bodyOrigin;
    }

}