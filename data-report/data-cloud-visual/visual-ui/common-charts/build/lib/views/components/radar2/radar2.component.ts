/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {Radar2Template} from "./radar2.template";
import {Utils} from '../../../../public/scripts/utils';
import {Radar2Model} from './radar2.model';
import {BaseCharts} from '../../base/base.chart';
import * as $ from 'jquery';
import {DataSourceConfig} from "../../../dataSourceConfig";

export class Radar2Component extends BaseComponent {
    private myChart: any = null;
    private chartData:any = null;
    private radarData:Radar2Model = null;
    private echartData:any = null;
    private body: any = null;
    private clearEchartData:any = null;
    constructor(){
        super();

        let template = new Radar2Template(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.radarData = new Radar2Model();
        this.echartData = {
            backgroundColor: this.radarData.backgroundColor, //背景颜色

            title: {
                show: this.radarData.title_show,
                text: this.radarData.title_text,
                subtext: this.radarData.title_subtext,
                left: this.radarData.title_left,
                top: this.radarData.title_top,
                textStyle: {
                    color: this.radarData.title_textStyle_color
                }
            },

            legend: {  //设置图例
                show: this.radarData.legend_show,
                z: this.radarData.legend_z,
                left: this.radarData.legend_left,
                top: this.radarData.legend_top,
                orient: this.radarData.legend_orient,
                data:this.radarData.legend_data,
            },

            //雷达图
            radar: {
                shape: this.radarData.radar_shape,
                center: this.radarData.radar_center,
                radius: this.radarData.radar_radius,
                indicator: this.radarData.radar_indicator,
            },

            tooltip : {  // tooltip
                show: this.radarData.tooltip_show,
                trigger: this.radarData.tooltip_trigger,
                formatter: this.radarData.tooltip_formatter,
                axisPointer: {
                    type: this.radarData.tooltip_axisPointer_type,
                },
                textStyle: {
                    color: this.radarData.tooltip_textStyle_color,
                    fontFamily: this.radarData.tooltip_textStyle_fontFamily,
                    fontSize: this.radarData.tooltip_textStyle_fontSize,
                },
                backgroundColor: this.radarData.tooltip_backgroundColor,
                borderColor: this.radarData.tooltip_borderColor,
                borderWidth: this.radarData.tooltip_borderWidth,
                padding: this.radarData.tooltip_padding,
            },

            grid: {
                show: this.radarData.grid_show,
                left: this.radarData.grid_left,
                right: this.radarData.grid_right,
                bottom: this.radarData.grid_bottom,
                containLabel: this.radarData.grid_containLabel,
                borderColor: this.radarData.grid_borderColor,
                borderWidth: this.radarData.grid_borderWidth
            },


            //线图
           series : [{
                name: this.radarData.series_name,
                type:this.radarData.series_type,
                stack: this.radarData.series_stack,
                smooth: this.radarData.series_smooth, //折线曲线
                symbol: this.radarData.series_symbol,
                symbolSize: this.radarData.series_symbolSize,
                showSymbol: this.radarData.series_showSymbol,


                lineStyle: {
                    normal: {
                        color: this.radarData.series_lineStyle_normal_color,
                        width: this.radarData.series_lineStyle_normal_width,
                        type: this.radarData.series_lineStyle_normal_type
                    },
                },
                itemStyle: {
                    normal: {
                        color: this.radarData.series_itemStyle_normal_color,
                        borderColor: this.radarData.series_itemStyle_normal_bordercolor,
                        borderWidth: this.radarData.series_itemStyle_normal_borderwidth,
                        borderType: this.radarData.series_itemStyle_normal_bordertype,
                    },
                },
                areaStyle: {
                    normal: {
                        type: this.radarData.series_areaStyle_normal_type,
                        // color: this.radarData.series_areaStyle_normal_color,
                        opacity: this.radarData.series_areaStyle_normal_opacity
                    },
                },
                data:this.radarData.series_data
            }
            ]
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
        if (this.myChart) this.myChart.resize();
    }

    public getconfiginformation(event:any,changeObj:any): void{
        this.body = this.buildbody(changeObj.result);
        if(changeObj.result && changeObj.result.readyBuildQuery){
            this.postChange(this.body);
        }
            
    }

      //buildbody
    public buildbody(result: any) {
        this.body = DataSourceConfig.getConfigByKey(result.dscKey);

        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "radar2";
        return this.body;
    }

    //渲染下拉框
    public renderSelectLine(data:any){       

        for(let key in data){                     
            let selectHtml = '<div class="chart-selectline fl"><div class="chart-selectline-title">' + data[key][0]['name']  + '</div>';
            
            if( key != '1'){
                selectHtml += '<div class="chart-selectline-list hide" type="0"><ul>'
                for(let i = 0; i < data[key].length; i++){
                    selectHtml += '<li code="'+ data[key][i]['id'] +'" type="'+ key +'">' + data[key][i]['name'] + '</li>';
                }
                selectHtml += '</ul></div>';
            }
           
            selectHtml += '</div>';

            $('div[radarContainer]','#'+this.scopeID).append(selectHtml);
        }       
    }

     //处理数据
    public handleData(json:any){

        

        let total:any[]=[];
        let dataArr:any[]=[[]];
        let max:any[]=[[]];
        let originalData = [{}];
        $.extend(true,originalData,json); 
        // //图例legend_data
        this.clearEchartData.legend['data'] = [];

        for(let i = 0; i < json.length; i++){
           this.clearEchartData.legend['data'][i] = {
                name : json[i][this.body.dimensions[0]['field']],
                icon : 'rect',
                textStyle: {
                    color: this.radarData.color[i]
                }
           };
            // total[i] = 0;
            // dataArr[i] = [];
            for(let key in originalData[i]){
                //if(key == "rateMap"){
                    //total[i] =  total[i] + originalData[i][key];
                    //dataArr[i].push(originalData[i][key]);
                    //originalData[i][key] = 
               //}
            }
            
        }


        // 处理没有可比性的数值
        // for(let k = 0; k < originalData.length; k++){
        //     max[k] = Math.max.apply(Math, dataArr[k]);
        //     for(let key in originalData[k]){
        //         for(let i= 0; i < this.radarData.dimensionData["3"].length; i++){
        //             if(key.indexOf(this.radarData.dimensionData["3"][i].name) != -1){
        //                 total[k] = total[k] - originalData[k][key];
        //                 originalData[k][key] = (max[k]/100*originalData[k][key]).toFixed(2);
        //                 total[k] = total[k] +  Number(originalData[k][key]);
        //             }
        //         }

        //         for(let j= 0; j < this.radarData.dimensionData["4"].length; j++){
        //             if(key.indexOf(this.radarData.dimensionData["4"][j].name) != -1){
        //                 total[k] = total[k] - originalData[k][key];
        //                 originalData[k][key] = Number((total[k]/(this.body.metrics.length-1)).toFixed(2));
        //             }
        //         }               
        //     }
        // }
        

        //数列series_data
        let obj ={};
        let that = this;
        $.extend(true,obj , this.clearEchartData.series[0]['data'][0]); 
        this.clearEchartData['tooltip']['formatter'] = function (params:any) {
            let formatterHtml = "";
            for(let i = 0; i < json.length; i++){
                if(json[i]["project_name"] == params["name"]){
                    for(let key in json[i]){
                        if(key == "curMap"){
                            let oneobj = {};
                            oneobj = json[i]["curMap"];
                            for(let oneKey in oneobj){
                                for(let j = 0; j < that.body['metrics'].length; j++){
                                    if(oneKey == that.body['metrics'][j]['alias']){
                                        formatterHtml += oneKey + " : " + (oneobj[oneKey]).toLocaleString() + '<br>';
                                    }
                                }
                            }
                        } 
                    }
                }
            }    
            return params["name"] + '<br>' + formatterHtml;  
        }

        for(let m = 0; m < json.length; m++){
            this.clearEchartData.series[0]['data'][m] = {};
            $.extend(true, this.clearEchartData.series[0]['data'][m] , obj);
            this.clearEchartData.series[0]['data'][m]['value'] = [];
            this.clearEchartData.radar['indicator'] = [];
            this.clearEchartData.series[0].lineStyle['normal']['color'] = this.radarData.color[m];
            this.clearEchartData.series[0].itemStyle['normal']['color'] = this.radarData.color[m];
            this.clearEchartData.series[0]['data'][m]['name'] =  this.clearEchartData.legend['data'][m]['name'];
            for(let k = 0; k < this.body.metrics.length; k++){
                this.clearEchartData.series[0]['data'][m]['value'].push(originalData[m]["rateMap"][this.body['metrics'][k]['alias']]);
                this.clearEchartData.series[0]['data'][m].lineStyle['normal']['color'] = this.radarData.color[m];
                this.clearEchartData.series[0]['data'][m].itemStyle['normal']['color'] = this.radarData.color[m];
                this.clearEchartData.radar['indicator'][k] = {};
                this.clearEchartData.radar['indicator'][k]['name'] = this.body['metrics'][k]['alias'];
                this.clearEchartData.radar['indicator'][k]['color'] = 'transparent';
            }
        }
        let valueArr:any = [];
        for(let n = 0; n < this.clearEchartData.series[0]['data'].length; n++){  
            if(this.clearEchartData.series[0]['data'][n]['value']){
                valueArr = valueArr.concat(this.clearEchartData.series[0]['data'][n]['value']);
            }                                 
        }

         for(let l = 0; l < this.clearEchartData.radar['indicator'].length; l++){          
            this.clearEchartData.radar['indicator'][l]['max'] = 100;                              
        }
       
        console.log("=====>this.clearEchartData",JSON.stringify(this.clearEchartData))

    }

    public dataChange(data: any): void {
        this.myChart.clear();
        this.chartData = data;  
        this.clearEchartData = {};
        $.extend(true, this.clearEchartData, this.echartData);
        this.handleData(data);
        this.myChart.setOption(this.clearEchartData);
        
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

    public styleChange(style: any): void {

    }

    public loadData(): void {

    }

    public get data():any{
        return this.chartData;
    }

    protected init(): void{
        // 基于准备好的dom，初始化echarts实例
        this.myChart = BaseCharts.echarts.init(document.querySelector('div[radarChart]') as HTMLDivElement);             

        //初始化下拉框
        this.renderSelectLine(this.radarData.dimensionData);

        //绑定事件
        this.eventBindHtml();
    }

    protected eventBindHtml(){
        let that = this;   

        //显示、隐藏下拉框
        $('.chart-selectline-title','#'+that.scopeID).on('click',function(e){
            let $target = $(e.target);
            let $chartSelectlineList = $target.siblings('.chart-selectline-list');
            if($chartSelectlineList.hasClass('hide')){
                $('.chart-selectline-list').removeClass('open').addClass('hide');
                $chartSelectlineList.removeClass('hide').addClass('open');
            }else if($chartSelectlineList.hasClass('open')){
                $('.chart-selectline-list').removeClass('open').addClass('hide');
            }

            e.stopPropagation();

        })

        $(document).click(function(e){           
            $('.chart-selectline-list').removeClass('open').addClass('hide');
        })

        //选择下拉列表
        $('.chart-selectline-list','#'+that.scopeID).on('click','li',(e)=>{
            let $target = $(e.target);
            let type = Number($target.attr('type'));
            $target.parents('.chart-selectline').find('.chart-selectline-title').html($target.html());

            //重新buildbody,onchange
            that.body.metrics[type-1] =  {
                "field": $target.attr('code'),
                "alias": $target.html()
            }

            let sendObj:Object = Object.assign(
                super.transformInput('scopeID',that.scopeID),
                super.transformInput('result',that.body)
            );
            super.onChange(that,sendObj);      

        })
      
        //点击帮助
        $('.funnelHelp','#'+that.scopeID).on('click',function(e){

             e.stopPropagation();

        })


    }


}