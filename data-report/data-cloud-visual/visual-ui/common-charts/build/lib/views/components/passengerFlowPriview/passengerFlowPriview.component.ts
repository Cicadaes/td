/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {PassengerFlowPriviewTemplate} from "./passengerFlowPriview.template";
import {PassengerFlowPriviewModel} from './passengerFlowPriview.model';
import * as $ from 'jquery';
import {DataSourceConfig} from "../../../dataSourceConfig";

export class PassengerFlowPriviewComponent extends BaseComponent {
    private chartData: any = null;
    private container: any = null;
    private Data: any = null;
    private changeObj: any = null;
    private body: any = {
        'filters': []
    }
    private dataLength: any = 1;//对比数据的个数
    private height_const = 176;//对比中的一个高度

    constructor() {
        super();

        let template = new PassengerFlowPriviewTemplate(this.scopeID);
        this.element = this.render(template);
    }

    public beforeShow(): void {

    }

    public afterShow(): void {

    }

    public beforeDestory(): void {

    }

    public afterDestory(): void {

    }

    public resize(): void {

    }

    public buildbody(result: any) {
        this.body = DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "passengerFlowPriview";
        return this.body;
    }

    public getconfiginformation(event: any, changeObj: any): void {
        this.body = this.buildbody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    }

    public dataChange(data: any): void {
        this.Data = data;
        console.log(data)
        this.initHtml();

        //根据对比数据个数，进行高度缩放，传送增量数据
        let dataLengthNew = 0;
        for (let key in data) {
            dataLengthNew++;
        }

        if (dataLengthNew > this.dataLength) {
            //增加高度
            this.sendMessage({
                "op": "plus",
                "value": (dataLengthNew - this.dataLength) * this.height_const,
            });
        } else if (dataLengthNew < this.dataLength) {
            //减少高度
            this.sendMessage({
                "op": "minus",
                "value": (this.dataLength - dataLengthNew) * this.height_const,
            });
        }

        this.dataLength = dataLengthNew;
    }

    public filterChange(event: any, data: any): void {
        this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body)
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

    public styleChange(style: any): void {
    }

    public loadData(): void {

    }

    public get data(): any {
        return this.chartData;

    }

    protected init(): void {
    }

    private addCompany (data: any): any {
        let projectCount = data;
        if(projectCount >= 1000 && projectCount < 1000000){
            if(projectCount < 100000){
                projectCount = projectCount.toLocaleString();
            }else {
                projectCount = (projectCount/1000).toFixed(1) + "k";
            }
        }else if(projectCount >= 1000000 && projectCount < 100000000){
            projectCount = (projectCount/1000000).toFixed(1) + "mil";
        }else if (projectCount >= 100000000){
            projectCount = (projectCount/100000000).toFixed(1).toLocaleString() + "bil";
        }
        return projectCount;
    }


    protected initHtml(): void {
        let html = "", htmlWap = "", arr = [];
        if ((typeof this.Data) === 'object') {
            for (let key in this.Data) {
                let obj = this.Data[key];
                arr = [];
                html = "";
                for (let one in obj) {
                    let total = this.addCompany(obj[one].total);
                    html += '<div class="indexPriview passengerFlowPriview">' +
                        '<p>' + one + '</p><ul class="data">' +
                        '<li><b title="'+(obj[one].total).toLocaleString()+'">' + total + '</b><span>' + obj[one].time + '</span></li>' +
                        '</ul></div>'
                    arr.push(one)
                }

                htmlWap += '<div class="indexPriviewWap"><div class="component_title clrfix"><div class="left" componentTitleFont>指标概览</div><b class="projectTitName">' + key + '</b><span class="funnelHelp fl"></span><span class="downloadBtn"></span></div>' + html + '</div>'

            }

        } else {
            htmlWap = ""
        }
        $('#' + this.scopeID).html(htmlWap)
        let len = arr.length;
        $(".indexPriview").css("width", (100 / len) + "%")

    }

}
