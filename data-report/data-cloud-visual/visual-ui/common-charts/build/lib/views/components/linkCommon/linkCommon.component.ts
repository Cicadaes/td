/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {LinkCommonTemplate} from "./linkCommon.template";
import {Utils} from '../../../../public/scripts/utils';
import {LinkCommonModel} from './linkCommon.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';


export class LinkCommonComponent extends BaseComponent {
    private myChart: any = null;
    private chartData:any = null;
    private linkCommonData:LinkCommonModel = null;
    private echartData:any = null;
    private getSoreceData:any = null;
    private eqType:number = null;
    private filterScopeIDObj:any = null;
    private filterListArray:any = [];
    private filterChooseObj:any = {};

    constructor(){
        super();
        let template = new LinkCommonTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.linkCommonData = new LinkCommonModel();
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

    }

    public getconfiginformation(event:any,changeObj:any): void{

    }

    public filterChange(event:any,data: any): void {

    }

    public dataChange(data: any): void {

    }

    public styleChange(style: any): void {
        for(let key in style){
            switch (key){
                case 'linkcommon_title_name':
                    $('#'+this.scopeID).find('a[conponentLinkCommon]').html(style[key])
                    break;
                case 'linkcommon_title_href':
                    $('#'+this.scopeID).find('a[conponentLinkCommon]').attr('href',style[key])
                    break;
            }
        }

    }

    public loadData(): void {

    }

    public get data():any{
        return this.chartData;
    }

    protected init(): void{
        //commonchange
        this.commonChange();
    }

    private commonChange(){
        let _self = this;

        $('#'+this.scopeID).find('div[conponentLinkCommon]').click((event:any)=>{

        });

    }

}