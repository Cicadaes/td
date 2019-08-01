/**
 * Created by tommy on 2017/9/21.
 */

import {DemoData} from './demoData';

export class DemoDataFunc {

    static reportJsonData: any = DemoData.reportJsonData;

    static groupMap = {
        //13 过滤器
        '13': ['OverallFilter', 'CellsFilter', 'ProvinceFilter', 'FirstCityfilter', 'PartnerFilter', 'Cityfilter'],
        // 过滤器
        '0': ['Datasource', 'TabFilter', 'linkCommon', 'RFMFilter', 'SelectFilter', 'TabOptions'],
        //12 日期
        '12': ['filter', 'DayCalendarFilter', 'MonthCalendarFilter', 'SingleCalendarFilter', 'Dateformat', 'RectFunnel'],
        //1 折线图
        '1': ['Area', 'TabArea', 'Line', 'SelectedLine', 'LineBar'],
        //2 条图
        '2': ['Strip', 'Bar', 'StackedBar', 'BarXy', 'ManyFilterBar', 'CityHorizontalBar'],
        //3 饼图
        '3': ['Pie', 'PieBar'],
        //4 表格
        '4': ['Table', 'LifeCycleList'],
        //5 地图
        '5': ['ChinaMap', 'CityPreview', 'StoreHeatmap'],
        //6 统计
        '6': ['Priview', 'IndexPriview', 'Part', 'PassengerFlowPriview'],
        //7 散点图
        '7': ['Scatter'],
        //8 雷达图
        '8': ['Radar2'],
        //9 文本
        '9': ['Font'],
        //10 图片
        '10': ['Upload'],
        //11 图形
        '11': ['Banner', 'Circle'],

    };

    public static getGroupData(): any {
        return DemoData.groupJsonData;
    }

    public static getDataByGroupId(groupId: string): any {
        let list = this.groupMap[groupId];
        if (list) {
            let returnList = [];
            for (let i = 0; i < list.length; i++) {
                let key = list[i];
                let obj = this.reportJsonData[key];
                if (key == 'linkCommon') {
                    obj.view = this.reportJsonData['base_view_config_linkCommon_filter'].view;
                } else {
                    obj.view = this.reportJsonData['base_view_config'].view;
                }
                returnList.push(obj);
            }
            return returnList;
        } else {
            return [];
        }
    }

    public static getStyleView(viewtype: string): any {
        let view = null;
        if (viewtype == '34') {
            view = this.deepClone(this.reportJsonData['base_view_config_linkCommon_filter'].view);
        } else {
            view = this.deepClone(this.reportJsonData['base_view_config'].view);
        }
        return view.fieldTabs[0].fieldGroups;
    }

    public static getDataSourceView(viewtype: string): any {
        let view = null;
        if (viewtype == '34') {
            view = this.deepClone(this.reportJsonData['base_view_config_linkCommon_filter'].view);
        } else {
            view = this.deepClone(this.reportJsonData['base_view_config'].view);
        }
        return view.fieldTabs[1].fieldGroups;
    }

    public static deepClone(obj: any): any {
        let cloneObj = JSON.parse(JSON.stringify(obj));
        return cloneObj;
    }
}