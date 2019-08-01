/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {DatasourceTemplate} from "./datasource.template";
import {Utils} from '../../../../public/scripts/utils';
import {DatasourceModel} from './datasource.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';


export class DatasourceComponent extends BaseComponent {
    private myChart: any = null;
    private chartData:any = null;
    private datasourceData:DatasourceModel = null;
    private echartData:any = null;
    private getSoreceData:any = null;
    private styleObj:any = null;

    constructor(){
        super();
        let template = new DatasourceTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.datasourceData = new DatasourceModel();
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
        if (this.myChart) this.myChart.resize();
    }

    public getconfiginformation(event:any,changeObj:any): void{
        $('#'+this.scopeID).find('div[commonChange]').html("testName");

        if(changeObj.result){
            $('#'+this.scopeID).find('textarea[commonConfigBody]').val(JSON.stringify(changeObj.result))
        }
    }

    public dataChange(data: any): void {
        $('#'+this.scopeID).find('textarea[commonConfigData]').val(JSON.stringify(data))
    }

    public styleChange(style: any): void {

    }

    public filterChange(event:any,data: any): void {
        for(let key in data){
            if(key == "filter"){
                this.postQuery['filters']=[
                    {"field":"project_type","operator":"=","value":"1"},
                    {'field':'date','operator':'>=','value':data[key].start},
                    {'field':'date','operator':'<=','value':data[key].end},
                ]
            }
        }
        $('#'+this.scopeID).find('textarea[commonConfigBody]').val(JSON.stringify(this.postQuery))
        this.postChange(this.postQuery);
    }


    public loadData(): void {

    }

    public get data():any{
        return this.chartData;
    }

    protected init(): void{
        //commonchange
        console.log(6666)
        this.commonChange();
    }



    private commonChange(){
        let _self = this;

        $('#'+_self.scopeID).find('div[commonConfigButton]').click((event:any)=>{
            _self.postQuery = $('#'+_self.scopeID).find('textarea[commonConfigBody]').val();

            if(_self.postQuery !== ""){
                _self.postQuery = JSON.parse(_self.postQuery)
            }else{
                _self.postQuery = {};
            }

            _self.postChange(_self.postQuery)
        });

    }

    private postChange(postQuery:any){
        let sendObj:Object = Object.assign(
            super.transformInput('scopeID',this.scopeID),
            super.transformInput('result',postQuery)
        );

        super.onChange(this,sendObj);
    }
}