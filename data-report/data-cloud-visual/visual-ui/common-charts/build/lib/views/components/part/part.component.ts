/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {PartTemplate} from "./part.template";
import {PartModel} from './part.model';
import * as $ from 'jquery';
import {DataSourceConfig} from "../../../dataSourceConfig";

export class PartComponent extends BaseComponent {
    private chartData: any = null;
    private container: any =null;
    private body:any={
        'filters':[]
    }
    private partdata:any;
    constructor() {
        super();
        let template = new PartTemplate(this.scopeID);
        //获得模板渲染后的节点
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
    public buildBody(result:any){
        this.body = DataSourceConfig.getConfigByKey(result.dscKey);
        this.body[ "charUUID"] = this.scopeID;
        this.body[ "requestTitle"] = "part";
        return this.body;
    }

    public getconfiginformation(event:any,changeObj:any): void{
        this.buildBody(changeObj.result);

        if(changeObj.result && changeObj.result.readyBuildQuery){
            this.postChange(this.body);
        }

    }

    public filterChange(event:any,data: any): void {
        this.body = DataSourceConfig.mergeBodyByFilter(this.body, data);
        this.postChange(this.body)
    }

    private postChange(postQuery:any){
        let sendObj:Object = Object.assign(
            super.transformInput('scopeID',this.scopeID),
            super.transformInput('result',postQuery)
        );
        super.onChange(this,sendObj);
    }

    public dataChange(data: any): void {
        this.partdata=data;
        this.init();
    }

    public loadData(): void {

    }
    public get data(): any {
        return this.chartData;
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


    protected init(): void {

        let arr=[],arr1,arr2,arr3,obj1={},obj2={},obj3={},partOne="",partTwo="",partThree="";
        for(let key in this.partdata){
            arr.push(key)
            arr1=arr.slice(0,1)
            arr2=arr.slice(1,3)
            arr3=arr.slice(3)
            for(let j=0;j<arr1.length;j++){             
                if(arr1[j]==key){
                    let value1 = this.partdata[key][0]['metric'];
                    let tipValue1 = this.partdata[key][0]['metric'];
                    if((this.partdata[key][0]['metric']).toString().indexOf("%") == -1){
                        value1 = this.addCompany(value1);
                        tipValue1 = (this.partdata[key][0]['metric']).toLocaleString();
                    }
                    let value2 = this.partdata[key][1]['metric'];
                    let tipValue2 = this.partdata[key][1]['metric'];
                    if((this.partdata[key][1]['metric']).toString().indexOf("%") == -1){
                        value2 = this.addCompany(value2);
                        tipValue2 = (this.partdata[key][1]['metric']).toLocaleString();
                    }
                   partOne+= '<div class="_child_list"><span><a>'+key+'</a></span><span><b title="'+tipValue1+'">'+value1+'</b><em>'+this.partdata[key][0].date+'</em></br><b title="'+tipValue2+'">'+value2+'</b>'+'<em>'+this.partdata[key][1].date+'</em></span></div>'
   
                }
            }
            for(let n=0;n<arr2.length;n++){
                if(arr2[n]==key){
                    let value1 = this.partdata[key][0]['metric'];
                    let tipValue1 = this.partdata[key][0]['metric'];
                    if((this.partdata[key][0]['metric']).toString().indexOf("%") == -1){
                        value1 = this.addCompany(value1);
                        tipValue1 = (this.partdata[key][0]['metric']).toLocaleString();
                    }
                    let value2 = this.partdata[key][1]['metric'];
                    let tipValue2 = this.partdata[key][1]['metric'];
                    if((this.partdata[key][1]['metric']).toString().indexOf("%") == -1){
                        value2 = this.addCompany(value2);
                        tipValue2 = (this.partdata[key][1]['metric']).toLocaleString();
                    }
                    partTwo+= '<div class="_child_list"><span><a>'+key+'</a></span><span><b title="'+tipValue1+'">'+value1+'</b><em>'+this.partdata[key][0].date+'</em></br><b title="'+tipValue2+'">'+value2+'</b>'+'<em>'+this.partdata[key][1].date+'</em></span></div>'
                }
            }
            for(let x=0;x<arr3.length;x++){
                if(arr3[x]==key){
                    let value1 = this.partdata[key][0]['metric'];
                    let tipValue1 = this.partdata[key][0]['metric'];
                    if((this.partdata[key][0]['metric']).toString().indexOf("%") == -1){
                        value1 = this.addCompany(value1);
                        tipValue1 = (this.partdata[key][0]['metric']).toLocaleString();
                    }
                    let value2 = this.partdata[key][1]['metric'];
                    let tipValue2 = this.partdata[key][1]['metric'];
                    if((this.partdata[key][1]['metric']).toString().indexOf("%") == -1){
                        value2 = this.addCompany(value2);
                        tipValue2 = (this.partdata[key][1]['metric']).toLocaleString();
                    }
                    partThree += '<div class="_child_list"><span><a>'+key+'</a></span><span><b title="'+tipValue1+'">'+value1+'</b><em>'+this.partdata[key][0].date+'</em></br><b title="'+tipValue2+'">'+value2+'</b>'+'<em>'+this.partdata[key][1].date+'</em></span></div>'

                }
            }
        }

        let  partContent='<div class="child">'+partOne+
            '</div>'+'<div class="child">'+partTwo+
            '</div>' +'<div class="child">'+partThree+
            '</div>'
        $(".tree").html(partContent)
        $("._child_list").each(function(){
            if(parseFloat($(this).find("b").eq(0).text())>=parseFloat($(this).find("b").eq(1).text())){
                $(this).find("b").eq(0).removeClass().addClass("up")
            }else{
                $(this).find("b").eq(0).removeClass().addClass("down")
            }
        })
    }




}