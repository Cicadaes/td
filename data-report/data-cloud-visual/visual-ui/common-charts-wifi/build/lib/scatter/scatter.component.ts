
/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {ScatterTemplate} from "./scatter.template";
import {Utils} from '../../public/scripts/utils';
import {ScatterModel} from './scatter.model';
import {BaseCharts} from 'datwill-sdk/lib/views/base/base.chart';
import * as $ from 'jquery';

export class ScatterComponent extends BaseComponent {
    private myChart: any = null;
    private chartData:any = null;
    private scatterData:ScatterModel = null;
    private echartData:any = null;
    private tableData:any = null;
    private seriesName:any = null;
    private seriesData:any = null;
    private averageX: any = null;
    private averageY: any = null;
    private settingObjCode: any = [];
    private oldValue: any = [];
    constructor(){
        super();       
        let template = new ScatterTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.scatterData = new ScatterModel();
        this.handleData(this.scatterData);
        this.echartData = {
            backgroundColor: this.scatterData.backgroundColor, //背景颜色

            title: {
                show: this.scatterData.title_show,
                text: this.scatterData.title_text,
                subtext: this.scatterData.title_subtext,
                left: this.scatterData.title_left,
                top: this.scatterData.title_top,
                textStyle: {
                    color: this.scatterData.title_textStyle_color
                }
            },

            legend: {  //设置图例
                show: this.scatterData.legend_show,
                z: this.scatterData.legend_z,
                left: this.scatterData.legend_left,
                top: this.scatterData.legend_top,
                orient: this.scatterData.legend_orient,
                data:this.scatterData.legend_data,
                itemWidth: this.scatterData.legend_itemWidth,
                itemHeight: this.scatterData.legend_itemHeight
            },          

            tooltip : {  // tooltip
                show: this.scatterData.tooltip_show,
                trigger: this.scatterData.tooltip_trigger,
                formatter: this.scatterData.tooltip_formatter,
                axisPointer: {
                    type: this.scatterData.tooltip_axisPointer_type
                },
                textStyle: {
                    color: this.scatterData.tooltip_textStyle_color,
                    fontFamily: this.scatterData.tooltip_textStyle_fontFamily,
                    fontSize: this.scatterData.tooltip_textStyle_fontSize,
                },
                backgroundColor: this.scatterData.tooltip_backgroundColor,
                borderColor: this.scatterData.tooltip_borderColor,
                borderWidth: this.scatterData.tooltip_borderWidth,
                padding: this.scatterData.tooltip_padding
            },

             //x轴
            xAxis:  {
                show: this.scatterData.xAxis_show,
                type: this.scatterData.xAxis_type,               
                boundaryGap: this.scatterData.xAxis_boundaryGap,               
                axisLine: {
                    show: this.scatterData.xAxis_axisLine_show,
                    lineStyle: {
                        color: this.scatterData.xAxis_axisLine_lineStyle_color,
                        width: this.scatterData.xAxis_axisLine_lineStyle_width,
                        type: this.scatterData.xAxis_axisLine_lineStyle_type,
                    },
                },
                //x轴刻度
                axisTick: {
                    show: this.scatterData.xAxis_axisTick_show,
                    alignWithLabel: this.scatterData.xAxis_axisTick_alignWithLabel,
                    length: this.scatterData.xAxis_axisTick_length,
                    lineStyle: {
                        color: this.scatterData.xAxis_axisTick_lineStyle_color,
                        width: this.scatterData.xAxis_axisTick_lineStyle_width,
                        type: this.scatterData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: this.scatterData.xAxis_axisLabel_show,
                    margin: this.scatterData.xAxis_axisLabel_margin,
                     // interval: 0,
                    rotate:0,
                    textStyle: {
                        color: this.scatterData.xAxis_axisLabel_textStyle_color,
                        fontFamily: this.scatterData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize:  this.scatterData.xAxis_axisLabel_textStyle_fontSize,
                    },
                },
                //区域中的分割线
                splitLine: {
                    show: this.scatterData.xAxis_splitLine_show,
                    lineStyle: {
                        color: this.scatterData.xAxis_splitLine_lineStyle_color,
                        width: this.scatterData.xAxis_splitLine_lineStyle_width,
                        type: this.scatterData.xAxis_splitLine_lineStyle_type
                    },
                }
                // axisPointer: {
                //     type: this.scatterData.xAxis_axisPointer_type,
                //     label: {
                //         show: this.scatterData.xAxis_axisPointer_label_show,
                //     }
                // }
            },


            //y轴
            yAxis: {
                show: this.scatterData.yAxis_show,
                type: this.scatterData.yAxis_type,
                scale:  this.scatterData.yAxis_scale,
                axisLine: {
                    show: this.scatterData.yAxis_axisLine_show
                    // lineStyle: {
                    //     color: this.scatterData.yAxis_axisLine_lineStyle_color,
                    //     width: this.scatterData.yAxis_axisLine_lineStyle_width,
                    //     type: this.scatterData.yAxis_axisLine_lineStyle_type,
                    // },
                },
                //y轴刻度
                axisTick: {
                    show: this.scatterData.yAxis_axisTick_show
                    // alignWithLabel: this.scatterData.yAxis_axisTick_alignWithLabel,
                    // length: this.scatterData.yAxis_axisTick_length,
                    // lineStyle: {
                    //     color: this.scatterData.yAxis_axisTick_lineStyle_color,
                    //     width: this.scatterData.yAxis_axisTick_lineStyle_width,
                    //     type: this.scatterData.yAxis_axisTick_lineStyle_type,
                    // }
                },
                //y轴label
                axisLabel: {
                    show: this.scatterData.yAxis_axisLabel_show,
                    margin: this.scatterData.yAxis_axisLabel_margin,
                    textStyle: {
                        color: this.scatterData.yAxis_axisLabel_textStyle_color,
                        fontFamily: this.scatterData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize:  this.scatterData.yAxis_axisLabel_textStyle_fontSize,
                    }                   
                },
                //区域中的分割线
                splitLine: {
                    show: this.scatterData.yAxis_splitLine_show,
                    lineStyle: {
                        color: this.scatterData.yAxis_splitLine_lineStyle_color,
                        width: this.scatterData.yAxis_splitLine_lineStyle_width,
                        type: this.scatterData.yAxis_splitLine_lineStyle_type
                    },
                }
                // axisPointer: {
                //     show: this.scatterData.yAxis_axisPointer_show,
                //     label: {
                //         show: this.scatterData.yAxis_axisPointer_label_show
                //     }
                // }
            },

            grid: {
                show: this.scatterData.grid_show,
                left: this.scatterData.grid_left,
                right: this.scatterData.grid_right,
                bottom: this.scatterData.grid_bottom,
                containLabel: this.scatterData.grid_containLabel,
                borderColor: this.scatterData.grid_borderColor,
                borderWidth: this.scatterData.grid_borderWidth
            },


            //象限图
           series : [{
                name: this.scatterData.series[0].name,
                type:this.scatterData.series[0].type,         
              
                symbolSize: this.scatterData.series[0].symbolSize,
                data: this.seriesData[0],
                label:this.scatterData.series[0].label,
            
                itemStyle: {
                    normal: {
                        color: this.scatterData.series[0].itemStyle.normal.color,
                        borderWidth: this.scatterData.series[0].itemStyle.normal.borderWidth,
                        borderColor: this.scatterData.series[0].itemStyle.normal.borderColor,
                        borderType: this.scatterData.series[0].itemStyle.normal.borderType
                    }
                },
                
                markLine: {
                    lineStyle: {
                        normal: {
                            type: this.scatterData.series[0]['markLine'].lineStyle.normal.type,
                            color: this.scatterData.series[0]['markLine'].lineStyle.normal.color,
                            width: this.scatterData.series[0]['markLine'].lineStyle.normal.width
                        }
                    },
                    data :[                      
                        {
                            name: this.scatterData.series[0]['markLine'].data[0].name,
                            yAxis: this.averageY                        
                        },{
                            name: this.scatterData.series[0]['markLine'].data[1].name,
                            xAxis: this.averageX
                        }
                    ],
                    symbol:this.scatterData.series[0]['markLine'].symbol,
                    symbolSize:this.scatterData.series[0]['markLine'].symbolSize,
                    label:{
                        normal:{
                            show:this.scatterData.series[0]['markLine'].label.normal.show                        
                        }
                    },
                     silent: this.scatterData.series[0]['markLine'].silent
                },
                markArea: {
                    silent: this.scatterData.series[0]['markArea'].silent,
                    itemStyle: {
                        normal: {
                            color: this.scatterData.series[0]['markArea'].itemStyle.normal.color,
                            borderWidth: this.scatterData.series[0]['markArea'].itemStyle.normal.borderWidth,
                            borderType: this.scatterData.series[0]['markArea'].itemStyle.normal.borderType
                        }
                    },
                    data: this.scatterData.series[0]['markArea'].data,
                    label:{
                        normal:{
                            position:this.scatterData.series[0]['markArea'].label.normal.position                    
                        }                    
                    }
                
               }
                
            }, {
                name: this.scatterData.series[1].name,
                type:this.scatterData.series[1].type,         
              
                symbolSize: this.scatterData.series[1].symbolSize,
                data: this.seriesData[1],
                label:this.scatterData.series[1].label,
            
                itemStyle: {
                    normal: {
                        color: this.scatterData.series[1].itemStyle.normal.color,
                        borderWidth: this.scatterData.series[1].itemStyle.normal.borderWidth,
                        borderColor: this.scatterData.series[1].itemStyle.normal.borderColor,
                        borderType: this.scatterData.series[1].itemStyle.normal.borderType
                    }
                },
                markLine: {
                    lineStyle: {
                        normal: {
                            type: this.scatterData.series[1]['markLine'].lineStyle.normal.type,
                            color: this.scatterData.series[1]['markLine'].lineStyle.normal.color,
                            width: this.scatterData.series[1]['markLine'].lineStyle.normal.width
                        }
                    },
                    data :[
                        {
                            name: this.scatterData.series[1]['markLine'].data[0].name,
                            yAxis: this.averageY                        
                        },{
                            name: this.scatterData.series[1]['markLine'].data[1].name,
                            xAxis: this.averageX
                        }
                    ],
                    symbol:this.scatterData.series[1]['markLine'].symbol,
                    symbolSize:this.scatterData.series[1]['markLine'].symbolSize,
                    label:{
                        normal:{
                            show:this.scatterData.series[1]['markLine'].label.normal.show                        
                        }
                    },
                     silent: this.scatterData.series[1]['markLine'].silent
                }                       
            }, {
                name: this.scatterData.series[2].name,
                type:this.scatterData.series[2].type,         
              
                symbolSize: this.scatterData.series[2].symbolSize,
                data: this.seriesData[2],
                label:this.scatterData.series[2].label,
            
                itemStyle: {
                    normal: {
                        color: this.scatterData.series[2].itemStyle.normal.color,
                        borderWidth: this.scatterData.series[2].itemStyle.normal.borderWidth,
                        borderColor: this.scatterData.series[2].itemStyle.normal.borderColor,
                        borderType: this.scatterData.series[2].itemStyle.normal.borderType
                    }
                },
                markLine: {
                    lineStyle: {
                        normal: {
                            type: this.scatterData.series[2]['markLine'].lineStyle.normal.type,
                            color: this.scatterData.series[2]['markLine'].lineStyle.normal.color,
                            width: this.scatterData.series[2]['markLine'].lineStyle.normal.width
                        }
                    },
                    data :[
                        {
                            name: this.scatterData.series[2]['markLine'].data[0].name,
                            yAxis: this.averageY                        
                        },{
                            name: this.scatterData.series[2]['markLine'].data[1].name,
                            xAxis: this.averageX
                        }
                    ],
                    symbol:this.scatterData.series[2]['markLine'].symbol,
                    symbolSize:this.scatterData.series[2]['markLine'].symbolSize,
                    label:{
                        normal:{
                            show:this.scatterData.series[2]['markLine'].label.normal.show                        
                        }
                    },
                     silent: this.scatterData.series[2]['markLine'].silent
                }                       
            },{
                name: this.scatterData.series[3].name,
                type:this.scatterData.series[3].type,         
              
                symbolSize: this.scatterData.series[3].symbolSize,
                data: this.seriesData[3],
                label:this.scatterData.series[3].label,
            
                itemStyle: {
                    normal: {
                        color: this.scatterData.series[3].itemStyle.normal.color,
                        borderWidth: this.scatterData.series[3].itemStyle.normal.borderWidth,
                        borderColor: this.scatterData.series[3].itemStyle.normal.borderColor,
                        borderType: this.scatterData.series[3].itemStyle.normal.borderType
                    }
                },
                markLine: {
                    lineStyle: {
                        normal: {
                            type: this.scatterData.series[3]['markLine'].lineStyle.normal.type,
                            color: this.scatterData.series[3]['markLine'].lineStyle.normal.color,
                            width: this.scatterData.series[3]['markLine'].lineStyle.normal.width
                        }
                    },
                    data :[
                        {
                            name: this.scatterData.series[3]['markLine'].data[0].name,
                            yAxis: this.averageY                        
                        },{
                            name: this.scatterData.series[3]['markLine'].data[1].name,
                            xAxis: this.averageX
                        }
                    ],
                    symbol:this.scatterData.series[3]['markLine'].symbol,
                    symbolSize:this.scatterData.series[3]['markLine'].symbolSize,
                    label:{
                        normal:{
                            show:this.scatterData.series[3]['markLine'].label.normal.show                        
                        }
                    },
                     silent: this.scatterData.series[3]['markLine'].silent
                }                       
            }
            ]
        }

    }

    public beforeShow(): void {

    }

    public afterShow(): void {

    }

    public beforeDestory(): void {

    }

    public afterDestory(): void {

    }

    public settingChange(event:any,target:any): void{

        //拿到配置的指标重新渲染  
        this.renderContainerXY(target.settingObj.result,target.settingObj.code);
        this.saveSettingObjCode(target.settingObj.code);
        this.setDefaltIndicators();

        //绑定事件
        this.eventBindHtml();                
    }

    //保存code
    public saveSettingObjCode(code:any){       
        this.settingObjCode[code.charAt(code.length -1) -1] = code;
    }

    public resize(): void {
        if (this.myChart) this.myChart.resize();
    }

    public dataChange(data: any): void {
        this.chartData = data;
        // var myChartData = this.myChart.getOption();       
        this.scatterData.data = data;
        
        //处理data
        this.handleData(this.scatterData);
        this.scatterData.legend_data = this.echartData.legend.data = this.seriesName;

        //重置图表配置的series
        let obj ={};
        $.extend(true,obj , this.echartData.series[0]);
        for(let i = 0; i < this.seriesData.length; i++){
            this.echartData.series[i] = {},
            $.extend(true, this.echartData.series[i] , obj);
            this.echartData.series[i].name = this.seriesName[i];
            this.echartData.series[i].data = this.seriesData[i];
            this.echartData.series[i]['itemStyle'].normal['color'] = this.scatterData.echart_color[i];
            this.echartData.series[i]['itemStyle'].normal['borderColor'] = this.scatterData.echart_color[i];   
            this.echartData.series[i]['markLine']['data'][0].yAxis = this.averageY;
            this.echartData.series[i]['markLine']['data'][1].xAxis = this.averageX;                  
        }
       
        //重新渲染象限图
        this.myChart.setOption(this.echartData); 

        //重新渲染表格      
        this.renderTables(this.tableData,5);
        
        //绑定事件
        this.eventBindHtml();

    }

    public styleChange(style: any): void {       
        // let changeStyle = Utils.addStyle(style);
        // Utils.mergeSourceData(changeStyle,this.echartData);
        // let newStyle = Utils.compareObj(changeStyle,this.echartData);
        // this.myChart.setOption(newStyle,true);
    }

    public loadData(): void {
        this.init();
    }

    public get data():any{
        return this.chartData;
    }

    //处理数据
    public handleData(json:any){
        //数据默认降序排列
        json.data.sort(function(a:any,b:any){
            return b[json.indicatorX] - a[json.indicatorX];
        })

        //获取几个数列
        this.getSeriesInfo(this.scatterData);

        //数据分区
        this.tableData = this.assortDataToQuadrant(json);

        //数据分类
        this.seriesData = this.makeDataToSeries(json);
    }

    //获取series数列对应的数组
    public getSeriesInfo(json:any){
        let hashtable = {};
        let seriesName = []
        for(let i = 0;i< json.data.length; i++){
            if(!hashtable[json.data[i].brand]){
                hashtable[json.data[i].brand] = 1;
                seriesName.push(json.data[i].brand); 
            }
        }
       this.seriesName = seriesName;
    }

     //将数据分区
    public assortDataToQuadrant(json:any){      
        let sumX :number = 0;
        let sumY :number = 0;
        json.data.forEach(function(obj:any){
            sumX += obj[json.indicatorX];
            sumY += obj[json.indicatorY];
        })
        this.averageX = sumX / json.data.length;
        this.averageY = sumY / json.data.length;

        let arr :any = [{
            head:['A区',json.indicatorXName,json.indicatorYName],
            data:[]
        },{
            head:['B区',json.indicatorXName,json.indicatorYName],
            data:[]
        },{
            head:['C区',json.indicatorXName,json.indicatorYName],
            data:[]
        },{
            head:['D区',json.indicatorXName,json.indicatorYName],
            data:[]
        }];
        let that = this;
        json.data.forEach(function(obj:any){
            if(obj[json.indicatorX] >= that.averageX && obj[json.indicatorY] >= that.averageY){
                //A区                
                arr[0].data.push(obj);
            }else if(obj[json.indicatorX] <= that.averageX && obj[json.indicatorY] >= that.averageY){
                //B区
                arr[1].data.push(obj);
            }else if(obj[json.indicatorX] <= that.averageX && obj[json.indicatorY] <= that.averageY){
                //C区
                arr[2].data.push(obj);
            }else if(obj[json.indicatorX] >= that.averageX && obj[json.indicatorY] <= that.averageY){
                //D区
                arr[3].data.push(obj);
            }
        })
        return arr;
    }

    //数据分类
    public makeDataToSeries(json:any){
        let arr: any = [];
        for(let i = 0; i < json.series.length; i++){
            arr.push([]);
        }

        for(let j = 0; j　< json.data.length; j++){
            for(let i=0; i <this.seriesName.length; i++){
                if(json.data[j].brand == this.seriesName[i]){              
                    let infoArr = []                  
                    infoArr[0] = json.data[j][json.indicatorX];
                    infoArr[1] = json.data[j][json.indicatorY];
                    infoArr[2] = json.data[j]['project_name'];                  
                    arr[i].push(infoArr);               
                }
            }
        }     

        return arr;
    }

    protected init(): void{
       
        //渲染xy轴指标数据源
        this.renderContainerXY(this.scatterData.indicators,null);

        // 基于准备好的dom，初始化echarts实例
        this.myChart = BaseCharts.echarts.init(this.element.querySelector("div[containerScatter]") as HTMLDivElement);
        // 绘制图表
        this.myChart.setOption(this.echartData);

        //渲染右侧表格
        this.renderTables(this.tableData,5);
       
        //绑定事件
        this.eventBindHtml();
    }

    //渲染xy轴指标数据源
    public renderContainerXY(data:any,code:any){      
        if(code && code.charAt(code.length -1) == '1'){
            let $container = $(this.element).find('div[name="indicatorX"]');
            $container.empty();
            this.renderListByArr( $container,data);
        }else if(code && code.charAt(code.length -1) == '2'){
            let $container = $(this.element).find('div[name="indicatorY"]');
            $container.empty();
            this.renderListByArr( $container,data);
        }  
    }

    //根据给的数组及code渲染下拉列表面板
    public renderListByArr(container:any,arr:any){
        let radioName = container.attr('name').charAt(container.attr('name').length - 1);
        let html =''
        for(let i =0;i < arr.length; i++){
            html += "<div class='itemBox'><span style='display:block'>" + arr[i].name +"</span><ul class='clrfix'>"
            for(let j=0; j < arr[i].list.length; j++){
                html += "<li class='fl'><input type='radio' id='" + arr[i].list[j].code + "' name='"+radioName+"' value='" + arr[i].list[j].code +"' /><label for='" + arr[i].list[j].code + "'>" + arr[i].list[j].val+"</label></li>"
            }
            html += "</div>"
        }
        container.append(html);
        return container;

    }


    //渲染右边表格区
    public renderTables(data:any,defaulsCount:any){
        $('#'+this.scopeID).find('div[containerRight]').empty();       
        let containerBox = '<div class="contentBox">';
        for(let i=0; i < data.length; i++){
            containerBox += '<div class="tableBox clrfix"><table index="'+ i +'"><thead><tr>';

            //生成thead
            for(let j = 0; j< data[i].head.length; j++){
                let sortable = ''
                if(j != 0){
                   let indicator = j==1 ? 'indicatorX' : 'indicatorY';
                   sortable = '<span class="sortable" colName=' + indicator + '><i class="triangleUp"></i><i class="triangleDown currentSort"></i></span>';
                }
                containerBox += '<th><div>' + data[i].head[j] + sortable + '</div></th>';
            }
           
            //生成tbody
            containerBox += '</tr></thead><tbody>';
            let index = 1
            let rowCount = data[i].data.length > 5? defaulsCount : data[i].data.length;
            for(let k=0; k < rowCount; k++){
                //生成tr         
                containerBox += '<tr><td><span>' + index + ' </span>' + data[i].data[k]['project_name'] + '</td><td>'+ data[i].data[k][this.scatterData.indicatorX] + '</td>' +  '<td>'+ data[i].data[k][this.scatterData.indicatorY] + '</td></tr>';                  
                index++;
            }
             //生成悬浮操作按钮
            containerBox += '<tbody></table><div class="operator" ><span class="toggleOpen open"></span><span class="download"></span></div></div>';           

        }
        
        containerBox += '</div>';
        $('#'+this.scopeID).find('div[containerRight]').append(containerBox);

    }

    //重新渲染tbody
    public renderTbody(data:any,table:any){
        $(table).find('tbody').empty();//清空

        //渲染tbody
       let tbody = '';
       let index = 1;
            for(let k=0; k< data.length; k++){
                tbody += '<tr>';
                //生成tr中的td           
                for(let key in data[k]){
                    if(key != 'brand'){
                        if(key == 'project_name'){
                           tbody += '<td><span>' + index + ' </span>' + data[k][key] + '</td>';
                           continue;
                        }
                        tbody += '<td>'+ data[k][key] +'</td>';                  
                    }                   
                }
                tbody += '</tr>';
                index++;
            }
            $(table).find('tbody').eq(0).append(tbody);

    }

    //初始化XY轴指标
    public setDefaltIndicators(){
        let $inputX = $(this.element).find('div[name="indicatorX"]').find('input').eq(0);
        let $inputY = $(this.element).find('div[name="indicatorY"]').find('input').eq(0);
        $inputX.prop('checked',true);
        $inputY.prop('checked',true);
      
        this.scatterData['indicatorXName'] = $inputX.siblings('label').text();
        this.scatterData['indicatorX'] = $inputX.val();
        $inputX.parents('.indicator').find('.indicatorBox > span').html(this.scatterData['indicatorXName']);
        this.scatterData['indicatorYName'] = $inputY.siblings('label').text();
        this.scatterData['indicatorY'] = $inputY.val();
        $inputY.parents('.indicator').find('.indicatorBox > span').html(this.scatterData['indicatorXName']);

        //当X、Y轴坐标都返回后触发onChange
        if(this.settingObjCode[0] && this.settingObjCode[1]){
            let codeArr = [{},{}];
            codeArr[0][this.settingObjCode[0]] = this.scatterData['indicatorX'];
            codeArr[1][this.settingObjCode[1]] = this.scatterData['indicatorY'];

            let sendObj:Object = Object.assign(                
                super.transformInput(this.settingObjCode[0].split('_')[0],codeArr),                                      
                super.transformInput('oldValue',[])
            );
                       
            super.onChange(this,sendObj);
        }
        this.oldValue['indicatorX'] = $inputX.val();
        this.oldValue['indicatorY'] = $inputY.val();
   }

    private eventBindHtml(){
        let that = this;     
        //解绑事件
        $('div[containerxy]','#'+that.scopeID).find('.indicatorBox').off('click');
        $('div[containerxy]','#'+that.scopeID).find('.indicatorItems').off('click');
        $('.contentBox','#'+that.scopeID).find('table').off('mouseenter');
        $('.contentBox','#'+that.scopeID).find('.tableBox').off('mouseleave');
        $('.contentBox','#'+that.scopeID).find('.toggleOpen').off('click');
        $('.contentBox','#'+that.scopeID).find('.sortable').off('click');

        //绑定事件     
        //1.显示隐藏指标面板
        $('div[containerxy]','#'+that.scopeID).find('.indicatorBox').on('click',function(e){
            $('.indicatorItems').hide();
            $(this).siblings('.indicatorItems').show();
            e.stopPropagation();
        })

        $(document).click(function(e){           
            $('.indicatorItems').hide();
        })

        //2.选中某个指标
        $('div[containerxy]','#'+that.scopeID).find('.indicatorItems').click((e:any)=>{
            let $target = $(e.target);
            if(e.target.nodeName == 'INPUT'){                
                 let indicator = $target.parents('.indicatorItems').attr('name');
                 that.scatterData[indicator] = $target.val();
                 that.scatterData[indicator+'Name'] = $target.siblings('label').text();
                 $target.parents('.indicator').find('.indicatorBox > span').html(that.scatterData[indicator+'Name']);
                 $('.indicatorItems').hide();

                 //请求数据，重新渲染
                 let codeArr = [{}];
                 let key = indicator == 'indicatorX'? 0 : 1;
                 codeArr[0][this.settingObjCode[key]] = this.scatterData[indicator];               

                 let sendObj:Object = Object.assign(
                    super.transformInput(that.settingObjCode[0].split('_')[0],codeArr),
                    super.transformInput('oldValue',[that.oldValue[indicator]])
                 );
                               
                 super.onChange(that,sendObj);
                 that.oldValue[indicator] = that.scatterData[indicator];
            }                                  
            e.stopPropagation();
        })      

        //3.鼠标进入表格；
        $('.contentBox','#'+that.scopeID).find('table').on('mouseenter',function(e){
            $('.operator').hide()
            $(this).siblings('.operator').show();                    
        });
         
        //4.鼠标离开
        $('.contentBox','#'+that.scopeID).find('.tableBox').on('mouseleave',function(e){
            $(this).find('.operator').hide();
        });

        //5.table展开、收起切换
        $('.contentBox','#'+that.scopeID).find('.toggleOpen').on('click',function(e){
            let index: number = 0;
            let tableData: any = null;
            if($(this).hasClass('open')){               
                $('.tableBox','#'+that.scopeID).find('.toggleOpen').removeClass('close');
                $('.tableBox','#'+that.scopeID).hide();
                $(this).parents('.tableBox').show();
                $(this).removeClass('open').addClass('close');
                //重新渲染当前表格全部数据
                index = Number($(this).parents('.tableBox').find('table').attr('index')) ;
                tableData = that.tableData[index].data;
            }else{                      
                $(this).removeClass('close').addClass('open');
                $('.tableBox','#'+that.scopeID).show();  
                //重新渲染当前表格默认部分数据
                index = Number($(this).parents('.tableBox').find('table').attr('index')) ;
                tableData = that.tableData[index].data.slice(0,5);
            }    
            that.renderTbody(tableData, $(this).parents('.tableBox').find('table'))
            // e.stopPropagation();    
        }) 

        //6.点击数据排序
        $('.contentBox','#'+that.scopeID).find('.sortable').on('click',function(e){
            let $table = $(this).parents('table');
            let index: number = 0;
            let tableData: any = null;           
            let $this = $(this);
            if($table.siblings('.operator').find('.toggleOpen').hasClass('open')){
                index = Number($table.attr('index'));
                tableData = that.tableData[index].data.slice(0,5);
            }else{
                index = Number($table.attr('index'));
                tableData = that.tableData[index].data.slice(0);
            }
            //排序
            if($(this).hasClass('sorted')){
                //降序
                tableData.sort(function(a:any,b:any){
                    return b[that.scatterData[$this.attr('colName')]] - a[that.scatterData[$this.attr('colName')]];
                })
                $(this).removeClass('sorted');
            }else{
                //升序
                tableData.sort(function(a:any,b:any){
                    return a[that.scatterData[$this.attr('colName')]] - b[that.scatterData[$this.attr('colName')]];
                })
                $(this).addClass('sorted');
            }
            
            that.renderTbody(tableData, $table);
        })

    }

}