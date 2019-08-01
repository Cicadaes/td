/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {TabOptionsTemplate} from "./tabOptions.template";
import {Utils} from '../../../../public/scripts/utils';
import {TabOptionsModel} from './tabOptions.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';


export class TabOptionsComponent extends BaseComponent {
    private myChart: any = null;
    private chartData:any = null;
    private tabOptionsData:TabOptionsModel = null;
    private echartData:any = null;
    private getSoreceData:any = null;
    private eqType:number = null;
    private filterScopeIDObj:any = null;
    private filterListArray:any = [];
    private filterChooseObj:any = {};
    private tabReadyBuildQuery:any = false;


    constructor(){
        super();
        let template = new TabOptionsTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.tabOptionsData = new TabOptionsModel();
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

    public getconfiginformation(event:any,changeObj:any): void{
        if(!this.isEmptyObject(changeObj.result)){
            this.decideTabOptions(changeObj.result);
        }else{
            return;
        }
    }

    // 判断是tab还是接收filter控制
    private decideTabOptions(changeObj:any){
        if(changeObj['tabOptions'] !== undefined){
            //渲染html
            this.renderHtml(changeObj['tabOptions'],changeObj['selected']);
        }
    }

    public filterChange(event:any,data: any): void {

    }

    public dataChange(data: any): void {

    }

    public styleChange(style: any): void {

    }

    public loadData(): void {
        this.init();
    }

    public get data():any{
        return this.chartData;
    }

    protected init(): void{
        //commonchange
        this.commonChange();
    }

    private renderHtml(data:any,selected:number): void{
        let optionList:string = "";

        optionList += '<ul>';
        for(let i=0; i<data.length; i++){
            optionList += '<li data-type='+data[i].type+'>' + data[i].project_name + '</li>';
        }
        optionList += '</ul>';

        $('#'+this.scopeID).find("div[conponentTabFilter]").html(optionList);
        //设置html选中的值
        $('#'+this.scopeID).find("li").eq(selected).addClass('tabFilter_choose');
    }

    private commonChange(){
        let _self = this;

        $('#'+_self.scopeID).find('div[conponentTabFilter]').click((event:any)=>{
            $('#'+_self.scopeID).find("li").removeClass('tabFilter_choose');

            let $target = event.target;
            _self.eqType = parseInt($target.attributes[0].value)
            $('#'+this.scopeID).find("li").eq(_self.eqType).addClass('tabFilter_choose');

            super.onRender(this,_self.eqType);

        });

    }

}