/**
 * Created by tommy on 2017/10/16.
 */
import {BaseComponent} from "../base.component";
import {StoreHeatmapTemplate} from "./storeHeatmap.template";
import {Utils} from '../../../../public/scripts/utils';
import {BaseCharts} from '../../base/base.chart';
import {DataSourceConfig} from "../../../dataSourceConfig";

import * as $ from 'jquery';

export class StoreHeatmapComponent extends BaseComponent {
    private bmap: any = null;
    private chartData: any = null;
    private lineData: any = null;
    private echartData: any = null;
    private BMap: any = null;
    private getSoreceData: any = null;
    private styleObj: any = null;
    private setchangeObj: any = null;
    private body: any = {
        'dimensions': null,
        'metrics': null,
        'filters': null
    };

    private h337: any = null;
    private heatmapInstance: any = null;
    private res_data: any = [{"x": 64, "y": 34}];

    private bg_width: any = null;
    private bg_height: any = null;
    private bg_zoom: any = null;

    constructor() {
        super();
        let template = new StoreHeatmapTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.lineData = {};
        this.echartData = {}
        if (BaseCharts.h337) {
            this.h337 = BaseCharts.h337;
        }
    }

    public beforeShow(): void {

    }

    public afterShow(): void {
        this.init();
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

        let per = 0.575;
        let originHeight = 736;
        let originWidth = 1280;

        let dom = $('#' + this.scopeID);
        this.bg_width = dom.width();
        this.bg_height = this.bg_width * per;
        this.bg_zoom = this.bg_width / originWidth;
        //0.575 = 736 / 1280;

        $('#map-canvas').width(this.bg_width);
        $('#map-canvas').height(this.bg_height);
        //height:660px; width:1147px;

        let dataLengthNew = 0;

        if (this.bg_height > originHeight) {
            //增加高度
            this.sendMessage({
                "op": "plus",
                "value": (this.bg_height - originHeight),
            });
        } else if (this.bg_height < originHeight) {
            //减少高度
            this.sendMessage({
                "op": "minus",
                "value": (originHeight - this.bg_height),
            });
        }

        this.heatmapInstance = this.h337.create({
            container: document.getElementById('map-canvas')
        });

        this.setchangeObj = changeObj.result;
        this.setHtmlObj(changeObj.result);

        this.buildBody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }

        this.draw(this.res_data);
    }

    public draw(res_data: any): void {

        let points = [];
        for (let i = 0; i < res_data.length; i++) {
            let obj: any = res_data[i]
            if (obj.x < 0 || obj.y < 0) {
                continue;
            }
            points.push({
                x: obj.x * this.bg_zoom * 50,
                y: this.bg_height - obj.y * this.bg_zoom * 50,
                value: 3,
                // radius: 10
            });
        }

        let data = {
            max: (res_data.length / 500) * 10,
            data: points
        };
        this.heatmapInstance.setData(data);

    }

    public buildBody(result: any): void {
        this.body = DataSourceConfig.getConfigByKey(result.dscKey);

        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "storeHeatmap";
    }

    public filterChange(event: any, data: any): void {
        this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body);

        if (data.filter) {
            for (let i = 0; i < data.filter.length; i++) {
                let obj = data.filter[i];
                if (obj.field == 'project_id') {

                    $.ajax({
                        url: '/wreport_new/api/projectPlaces/selectSingle?projectId=' + obj.value,
                        dataType: 'JSON',
                        contentType: 'application/json',
                        type: 'get',
                        success: function (data: any) {
                            if (data && data.picUrl) {
                                $("#backImg").attr('src', "/wreport_new/pic/" + data.picUrl);
                            }
                        },
                        error: function (data: any) {
                        },
                    })
                }
            }
        }
    }

    public dataChange(data: any): void {

        if (data && data.length > 0) {
            this.draw(data);
        } else {
            this.heatmapInstance.setData({
                data: []
            });
        }
    }

    public styleChange(style: any): void {

    }

    public loadData(): void {

    }

    public get data(): any {
        return this.chartData;
    }

    protected init(): void {

        this.renderTabHtml([{
            id: '1',
            name: '场地一'
        }, {
            id: '2',
            name: '场地二'
        }]);

        this.commonChange();
    }

    private postChange(postQuery: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', postQuery)
        );
        super.onChange(this, sendObj);
    }

    private sendMessage(changeObj: any) {
        let sendObj: Object = Object.assign(
            super.transformInput('scopeID', this.scopeID),
            super.transformInput('result', changeObj)
        );
        super.changeHeightBase(this, sendObj);
    }

    private commonChange() {
        // let _self = this;
        //
        // $('#' + this.scopeID).find('div[commonChange]').click((event: any) => {
        //     $('#' + this.scopeID).find("div[commonSelectList]").show();
        // });
        //
        // $('#' + this.scopeID).find('div[commonSelectList]').click((event: any) => {
        //
        //     $('#' + this.scopeID).find("div[commonChange]").html(event.target.innerText);
        //
        //     //this.hour_type = event.target.dataset.id;
        //
        //     $('#' + this.scopeID).find("div[commonSelectList]").hide();
        // })
    }

    //渲染html
    public renderTabHtml(data: any): void {
        let optionList: string = "";

        optionList += '<ul>';
        for (let item of data) {
            optionList += '<li data-id=' + item.id + '>' + item.name + '</li>';
        }
        optionList += '</ul>';
        //把第0项放入已选择框里
        $('#' + this.scopeID).find("div[commonChange]").html(data[0].name);
        $('#' + this.scopeID).find("div[commonSelectList]").html(optionList);
    }
}