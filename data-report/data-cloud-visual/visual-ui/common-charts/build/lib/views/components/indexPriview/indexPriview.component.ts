import {BaseComponent} from "../base.component";
import {IndexPriviewTemplate} from "./indexPriview.template";
import {IndexPriviewModel} from './indexPriview.model';
import * as $ from 'jquery';
import {DataSourceConfig} from "../../../dataSourceConfig";

export class IndexPriviewComponent extends BaseComponent {
    private chartData: any = null;
    private container: any = null;
    private Data: any = null;
    private changeObj: any = null;
    private body: any = {
        'filters': [],
        "settingZero": true
    }
    private dataLength: any = 4;//对比数据的个数
    private height_const = 31;//对比中的一个高度

    constructor() {
        super();

        let template = new IndexPriviewTemplate(this.scopeID);
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

    public buildBody(result: any) {
        this.body = DataSourceConfig.getConfigByKey(result.dscKey);
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "indexPriview";
        return this.body;
    }

    public getconfiginformation(event: any, changeObj: any): void {
        this.buildBody(changeObj.result);
        if (changeObj.result && changeObj.result.readyBuildQuery) {
            this.postChange(this.body);
        }
    }

    public dataChange(data: any): void {
        this.Data = data;
        this.initHtml();

        //根据对比数据个数，进行高度缩放，传送增量数据
        let dataLengthNew = 0;
        if (data["近7日入店客流"] && data["近7日入店客流"].project) {
            let list = data["近7日入店客流"].project;
            for (let i = 0; i < list.length; i++) {
                let obj = list[i];
                dataLengthNew++;
            }
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

    private addCompany(data: any): any {
        let projectCount = data;
        let reg = /%+/;
        if (!reg.test(projectCount)) {
            if (projectCount >= 1000 && projectCount < 1000000) {
                if (projectCount < 100000) {
                    projectCount = projectCount.toLocaleString();
                } else {
                    projectCount = (projectCount / 1000).toFixed(1) + "k";
                }
            } else if (projectCount >= 1000000 && projectCount < 100000000) {
                projectCount = (projectCount / 1000000).toFixed(1) + "mil";
            } else if (projectCount >= 100000000) {
                projectCount = (projectCount / 100000000).toFixed(1).toLocaleString() + "bil";
            }
        }

        return projectCount;
    }

    protected initHtml(): void {
        let html = "", arr = [], project = "";
        if ((typeof this.Data) === 'object') {
            for (let key in this.Data) {
                let projectHtml = "", project = "";
                let total = this.addCompany(this.Data[key].total.total);
                let beforeTotal = this.addCompany(this.Data[key].before.before_total);
                if (this.Data[key].project.length <= 0) {

                    project = '<p class="dataNull">暂无数据</p>'
                } else {

                    for (let i = 0; i < this.Data[key].project.length; i++) {
                        let projectCount = this.addCompany(this.Data[key].project[i].project_count);
                        // let projectCount = this.Data[key].project[i].project_count;
                        // let reg=/%+/;
                        // if(!reg.test(projectCount)){
                        //     if(projectCount >= 1000 && projectCount < 1000000){
                        //         if(projectCount < 100000){
                        //             projectCount = projectCount.toLocaleString();
                        //         }else {
                        //             projectCount = projectCount/1000 + "K";
                        //         }
                        //     }else if(projectCount >= 1000000 && projectCount < 100000000){
                        //         projectCount = projectCount/1000000 + "M";
                        //     }else if (projectCount >= 100000000){
                        //         projectCount = (projectCount/100000000).toLocaleString() + "B";
                        //     }
                        // }
                        if (this.Data[key].project[i].percentage) {
                            projectHtml += '<li><b title = "' + this.Data[key].project[i].project_name + '">' + this.Data[key].project[i].project_name + '</b><span title = "' + this.Data[key].project[i].project_count.toLocaleString() + '">' + projectCount + '</span><strong title = "' + this.Data[key].project[i].percentage + '">' + this.Data[key].project[i].percentage + '</strong></li>'
                        } else {

                            //if (this.Data[key].project[i].percentage) {
                            projectHtml += '<li><b title = "' + this.Data[key].project[i].project_name + '">' + this.Data[key].project[i].project_name + '</b><span title = "' + this.Data[key].project[i].project_count.toLocaleString() + '" >' + projectCount + '</span><strong></strong></li>'
                            //} else {
                            //projectHtml += '<li><b title = "'+this.Data[key].project[i].project_name+'">' + this.Data[key].project[i].project_name + '</b><span>' + this.Data[key].project[i].project_count + '</span></li>'
                            //if (!this.Data[key].project[i].project_count && !this.Data[key].project[i].percentage) {
                            // projectHtml = ''
                            //}
                            //}

                        }
                    }
                }
                let pro;

                if (projectHtml != "") {

                    pro = projectHtml
                } else {
                    pro = project;
                }
                html += '<div class="indexPriview">' +
                    '<p>' + key + '</p><ul class="data">' +
                    '<li><b title = "' + this.Data[key].total.total.toLocaleString() + '">' + total + '</b><span>' + this.Data[key].total.time + '</span></li>' +
                    '<li><b title = "' + this.Data[key].before.before_total.toLocaleString() + '">' + beforeTotal + '</b><span>' + this.Data[key].before.before_time + '</span></li>' +
                    '</ul><ul class="type">' + pro + '</ul></div>'

                arr.push(key)
            }

        } else {
            html = ""
        }
        $('#' + this.scopeID).html(html)
        let len = arr.length;
        $(".indexPriview").css("width", (100 / len) + "%")

    }

}
