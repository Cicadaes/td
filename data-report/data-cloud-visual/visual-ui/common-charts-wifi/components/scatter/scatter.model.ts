import {BaseModel} from "datwill-sdk/lib/views/base/model.base";

/**
 * Created by zhaoxue on 2017-03-29.
 */



export class ScatterModel extends BaseModel{
    echart_color = ['rgba(67,163,251,0.30)','rgba(150,208,47,0.30)', 'rgba(249,210,74,0.30)', 'rgba(250,164,73,0.30)', 'rgba(251,208,73,0.30)','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
    //数据
    data:any = [];
    
    //模拟数据
    data1 = [{
        "brand": "JACK&JONES",
        "project_name": "ONLY retail project_name1",
        "active_new_users": 7000,
        "active_old_users": 4800
    },
    {
        "brand": "JACK&JONES",
        "project_name": "ONLY retail project_name2",
        "active_new_users": 8000,
        "active_old_users": 4700
    },
    {
        "brand": "ONLY",
        "project_name": "ONLY retail project_name1",
        "active_new_users": 16000,
        "active_old_users": 11200
    },
    {
        "brand": "ONLY",
        "project_name": "ONLY retail project_name2",
        "active_new_users": 4000,
        "active_old_users": 3200
    },
    {
        "brand": "SELECTED",
        "project_name": "ONLY retail project_name1",
        "active_new_users": 12000,
        "active_old_users": 8000
    },
    {
        "brand": "VERO MODA",
        "project_name": "ONLY retail project_name1",
        "active_new_users": 8000,
        "active_old_users": 4800
    },
    {
        "brand": "VERO MODA",
        "project_name": "ONLY retail project_name2",
        "active_new_users": 8111,
        "active_old_users": 4100
    },{
        "brand": "JACK&JONES",
        "project_name": "ONLY retail project_name1",
        "active_new_users": 7400,
        "active_old_users": 5800
    },
    {
        "brand": "JACK&JONES",
        "project_name": "ONLY retail project_name2",
        "active_new_users": 5000,
        "active_old_users": 6700
    },
    {
        "brand": "ONLY",
        "project_name": "ONLY retail project_name1",
        "active_new_users": 5600,
        "active_old_users": 4500
    },
    {
        "brand": "ONLY",
        "project_name": "ONLY retail project_name2",
        "active_new_users": 5200,
        "active_old_users": 3200
    },
    {
        "brand": "SELECTED",
        "project_name": "ONLY retail project_name1",
        "active_new_users": 1100,
        "active_old_users": 2300
    },
    {
        "brand": "VERO MODA",
        "project_name": "ONLY retail project_name1",
        "active_new_users": 2300,
        "active_old_users": 4220
    },
    {
        "brand": "VERO MODA",
        "project_name": "ONLY retail project_name2",
        "active_new_users": 3900,
        "active_old_users": 6000
    },{
        "brand": "JACK&JONES",
        "project_name": "ONLY retail project_name1",
        "active_new_users": 6400,
        "active_old_users": 6800
    },
    {
        "brand": "JACK&JONES",
        "project_name": "ONLY retail project_name2",
        "active_new_users": 4800,
        "active_old_users": 2700
    },
    {
        "brand": "ONLY",
        "project_name": "ONLY retail project_name1",
        "active_new_users": 8300,
        "active_old_users": 5200
    },
    {
        "brand": "ONLY",
        "project_name": "ONLY retail project_name2",
        "active_new_users": 4500,
        "active_old_users": 3100
    },
    {
        "brand": "SELECTED",
        "project_name": "ONLY retail project_name1",
        "active_new_users": 3500,
        "active_old_users": 2300
    },
    {
        "brand": "VERO MODA",
        "project_name": "ONLY retail project_name1",
        "active_new_users": 1300,
        "active_old_users": 2220
    },
    {
        "brand": "VERO MODA",
        "project_name": "ONLY retail project_name2",
        "active_new_users": 3300,
        "active_old_users": 6600
    },
    {
        "brand": "JACK&JONES",
        "project_name": "ONLY retail project_name2",
        "active_new_users": 1000,
        "active_old_users": 2700
    },
    {
        "brand": "ONLY",
        "project_name": "ONLY retail project_name1",
        "active_new_users": 4000,
        "active_old_users": 1200
    },
    {
        "brand": "ONLY",
        "project_name": "ONLY retail project_name2",
        "active_new_users": 6000,
        "active_old_users": 2200
    },
    {
        "brand": "SELECTED",
        "project_name": "ONLY retail project_name1",
        "active_new_users": 2000,
        "active_old_users": 2000
    }
]
    //指标
    indicators = [
            {
                name:"zhibiao1",               
                list:[
                    {val:"入店客流",selected:0,code:'active_new_users'},
                    {val:"销售金额",selected:0,code:'active_old_users'},
                    {val:"客流3",selected:0,code:'zhibiao101'},
                    {val:"客流1",selected:0,code:'zhibiao101'},
                    {val:"客流2",selected:0,code:'zhibiao101'},
                    {val:"客流3",selected:0,code:'zhibiao101'}
                    ]
            },
            {
                name:"zhibiao2",              
                list:[
                    {val:"客流1",selected:0,code:'active_new_users'},
                    {val:"客流2",selected:0,code:'active_old_users'},
                    {val:"客流3",selected:0,code:'zhibiao203'},
                    {val:"客流1",selected:0,code:'zhibiao204'},
                    {val:"客流2",selected:0,code:'zhibiao205'},
                    {val:"客流3",selected:0,code:'zhibiao206'}
                    ]
            },
            {
                name:"zhibiao3",
                list:[
                    {val:"客流1",selected:0,code:'active_new_users'},
                    {val:"客流2",selected:0,code:'active_old_users'},
                    {val:"客流3",selected:0,code:'zhibiao303'},
                    {val:"客流1",selected:0,code:'zhibiao304'},
                    {val:"客流2",selected:0,code:'zhibiao305'},
                    {val:"客流3",selected:0,code:'zhibiao306'}
                    ]
            }
    ];

    //默认选中的指标
    indicatorX = 'active_new_users';
    indicatorY = 'active_old_users';
    indicatorXName = '入店客流';
    indicatorYName = '销售金额';


    /** backgroundColor  */
    backgroundColor = '#fff';

    /** title  */

    /** title 是否显示标题组件  */
    title_show = false;
    /** title 主标题文本，支持使用 \n 换行  */
    title_text = '四象限图';
    /** title 文本超链接  */
    text_link = '';
    /** title 指定窗口打开主标题超链接  */
    text_target = ''; //'self': 当前窗口打开  'blank':新窗口打开
    /** title textStyle 主标题设置*/
    /** title textStyle  文字颜色*/
    title_textStyle_color = '#76818e';
    /** title textStyle  文字字体风格*/
    title_textStyle_fontStyle = ''; //'normal':默认  'italic':斜体  'oblique':倾斜
    /** title textStyle  文字字体的粗细*/
    title_textStyle_fontWeight = ''; //'normal':默认 'bold':粗体  'bolder':更粗  'lighter' :更细
    /** title textStyle  文字字体系列*/
    title_textStyle_fontFamily = '';
    /** title textStyle  文字字体大小*/
    title_textStyle_fontSize = 18;
    /** title 文本水平对齐*/
    title_textAlign = 'center'; // 'left', 'center', 'right'
    /** title 文本垂直对齐*/
    title_textBaseline = 'top'; // 'top', 'middle', 'bottom'
    /** title 副标题文本，支持使用 \n 换行  */
    title_subtext = '';
    /** title 副标题文本超链接  */
    text_sublink = '';
    /** title 指定窗口打开副标题超链接  */
    text_subtarget = ''; //'self': 当前窗口打开  'blank':新窗口打开
    /** title subtextStyle 副标题设置*/
    /** title subtextStyle  文字颜色*/
    title_subtextStyle_color = '#76818e';
    /** title subtextStyle  文字字体风格*/
    title_subtextStyle_fontStyle = ''; //'normal':默认  'italic':斜体  'oblique':倾斜
    /** title subtextStyle  文字字体的粗细*/
    title_subtextStyle_fontWeight = ''; //'normal':默认 'bold':粗体  'bolder':更粗  'lighter' :更细
    /** title subtextStyle  文字字体系列*/
    title_subtextStyle_fontFamily = '';
    /** title subtextStyle  文字字体大小*/
    title_subtextStyle_fontSize = 12;
    /** title 标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。*/
    title_padding = 5; // 支持[5, 10] [5,10,5,10]
    /** title 主副标题之间的间距*/
    title_itemGap = 10;
    /** title 所有图形的zlevel*/
    title_zlevel = 0;
    /** title 组件的所有图形的z值。控制图形的前后顺序。*/
    title_z = 2;
    /** title grid 组件离容器左侧的距离。  */
    title_left = 'left'; //'left', 'center', 'right' , '20%'
    /** title grid 组件离容器上侧的距离  */
    title_top = ''; //'top', 'middle', 'bottom'
    /** title grid grid 组件离容器右侧的距离。  */
    title_right = '';
    /** title grid 组件离容器下侧的距离  */
    title_bottom = '';
    /** title 标题背景色*/
    title_backgroundColor = '#00ff2a';
    /** title 标题的边框颜色*/
    title_borderColor = '';
    /** title 标题的边框线宽*/
    title_borderWidth = 0;


    /** legend  */
    /** legend 是否显示标题组件  */
    legend_show = true;
    /** legend 所有图形的zlevel*/
    legend_zlevel = 0;
    /** legend 组件的所有图形的z值。控制图形的前后顺序。*/
    legend_z = 2;
    /** legend 图例组件离容器左侧的距离。*/
    legend_left = 'right'; //'left', 'center', 'right'
    /** legend 图例组件离容器上侧的距离。*/
    legend_top = 5; //'top', 'middle', 'bottom'
    /** legend 图例组件离容器右侧的距离。*/
    legend_right = '10';
    /** legend 图例组件离容器下侧的距离。*/
    legend_bottom = '';
    /** legend 图例列表的布局朝向。*/
    legend_orient = 'horizontal'; //'horizontal':水平  'vertical':垂直
    /** legend 标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。*/
    legend_padding = 5; // 支持[5, 10] [5,10,5,10]
    /** legend 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。*/
    legend_itemGap = 10;
    legend_data = ['ONLY', 'VERO MODA','JACK&JONES','SELECTED'];
    /** legend图例标记的图形的宽度*/
    legend_itemWidth = 10;  
    /** legend图例标记的图形的高度*/
    legend_itemHeight = 10;  

    legend_backgroundColor = 'transparent';

    /** tooltip  */
    tooltip_show = true;
    /** tooltip 触发类型*/
    tooltip_trigger = 'item';
    /** tooltip 提示框浮层内容格式器，支持字符串模板和回调函数两种形式。*/
    tooltip_formatter = "";
    /* tooltip 类型 */
    tooltip_axisPointer_type = 'shadow'; //'line' 直线指示器  'shadow' 阴影指示器  'cross' 十字准星指示器。其实是种简写，表示启用两个正交的轴的 axisPointer。
    /* tooltip 文字颜色 */
    tooltip_textStyle_color = "#fff";
    /* tooltip 文字 */
    tooltip_textStyle_fontFamily = 'sans-serif';
    /* tooltip 文字大小 */
    tooltip_textStyle_fontSize = 14;
    /* tooltip 背景颜色 */
    tooltip_backgroundColor = 'rgba(0,0,0,.6)';
    /* tooltip 边框颜色 */
    tooltip_borderColor = '#e6e9ed';
    /* tooltip 边框大小 */
    tooltip_borderWidth = 1;
    /* tooltip padding */
    tooltip_padding = 5;

    /** xAxis */
    /** xAxis  x轴是否显示*/
    xAxis_show = true;
    /** xAxis  type*/
    xAxis_type = 'value';
    /** xAxis  坐标轴两边留白策略*/
    xAxis_boundaryGap = false; //true false
    /** xAxis  data*/
    // xAxis_data = ['周一','周二','周三','周四','周五','周六','周日'];
    /** xAxis  axisLine 是否显示坐标轴轴线*/
    xAxis_axisLine_show = true;
    /** xAxis  axisLine 坐标轴线线的颜色*/
    xAxis_axisLine_lineStyle_color = '#DDDEE1';
    /** xAxis  axisLine 坐标轴线线的寬度*/
    xAxis_axisLine_lineStyle_width = 1;
    /** xAxis  axisLine 坐标轴线线的类型*/
    xAxis_axisLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
    /** xAxis  axisTick 是否显示坐标轴刻度*/
    xAxis_axisTick_show = true;
    /** xAxis  axisTick 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐*/
    xAxis_axisTick_alignWithLabel = true;
    /** xAxis  axisTick 坐标轴刻度的长度*/
    xAxis_axisTick_length = 5;
    /** xAxis  axisTick 刻度线的颜色*/
    xAxis_axisTick_lineStyle_color = "#DDDEE1";
    /** xAxis  axisTick 坐标轴刻度线宽*/
    xAxis_axisTick_lineStyle_width = 1;
    /** xAxis  axisTick 坐标轴刻度线的类型*/
    xAxis_axisTick_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
    /** xAxis  label 是否显示刻度标签*/
    xAxis_axisLabel_show = true;
    /** xAxis  label 刻度标签与轴线之间的距离*/
    xAxis_axisLabel_margin = 8;
    /** xAxis  label 刻度标签文字的颜色*/
    xAxis_axisLabel_textStyle_color = "#80848F";
    /** xAxis  label 文字的字体系列*/
    xAxis_axisLabel_textStyle_fontFamily = 'HelveticaNeue';
    /** xAxis  label 文字的字体大小*/
    xAxis_axisLabel_textStyle_fontSize = 12;
    /** xAxis  splitLine 是否显示分隔线*/
    xAxis_splitLine_show = false;
    /** xAxis  splitLine 分隔线颜色，可以设置成单个颜色*/
    xAxis_splitLine_lineStyle_color = ['#E9EAEC'];
    /** xAxis  splitLine 分隔线线宽*/
    xAxis_splitLine_lineStyle_width = 1;
    /** xAxis  splitLine 分隔线线的类型*/
    xAxis_splitLine_lineStyle_type = 'dashed'; //'solid' 'dashed' 'dotted'
    /** xAxis  axisPointer 指示器类型*/
    xAxis_axisPointer_type = 'shadow'; //'line' 直线指示器 'shadow' 阴影指示器
    /** xAxis  axisPointer 是否显示文本标签*/
    xAxis_axisPointer_label_show = false;
    /** yAxis  y轴是否显示*/
    yAxis_show = true;
    /** yAxis  type*/
    yAxis_type = 'value';
    /** yAxis  axisLine 是否显示坐标轴轴线*/
    yAxis_axisLine_show = false;
    /** yAxis  axisLine 坐标轴线线的颜色*/
    yAxis_axisLine_lineStyle_color = '#DDDEE1';
    /** yAxis  axisLine 坐标轴线线的寬度*/
    yAxis_axisLine_lineStyle_width = 1;
    /** yAxis  axisLine 坐标轴线线的类型*/
    yAxis_axisLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
    /** yAxis  axisTick 是否显示坐标轴刻度*/
    yAxis_axisTick_show = false;
    /** yAxis  axisTick 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐*/
    yAxis_axisTick_alignWithLabel = true;
    /** yAxis  axisTick 坐标轴刻度的长度*/
    yAxis_axisTick_length = 5;
    /** yAxis  axisTick 刻度线的颜色*/
    yAxis_axisTick_lineStyle_color = '#DDDEE1';
    /** yAxis  axisTick 坐标轴刻度线宽*/
    yAxis_axisTick_lineStyle_width = 1;
    /** yAxis  axisTick 坐标轴刻度线的类型*/
    yAxis_axisTick_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
    /** yAxis  label 是否显示刻度标签*/
    yAxis_axisLabel_show = true;
    /** yAxis  label 刻度标签与轴线之间的距离*/
    yAxis_axisLabel_margin = 8;
    /** yAxis  label 刻度标签文字的颜色*/
    yAxis_axisLabel_textStyle_color = '#80848F';
    /** yAxis  label 文字的字体系列*/
    yAxis_axisLabel_textStyle_fontFamily = 'HelveticaNeue';
    /** yAxis  label 文字的字体大小*/
    yAxis_axisLabel_textStyle_fontSize = 12;
    /** yAxis  splitLine 是否显示分隔线*/
    yAxis_splitLine_show = true;
    /** yAxis  splitLine 分隔线颜色，可以设置成单个颜色*/
    yAxis_splitLine_lineStyle_color = ['#E9EAEC'];
    /** yAxis  splitLine 分隔线线宽*/
    yAxis_splitLine_lineStyle_width = 1;
    /** yAxis  splitLine 分隔线线的类型*/
    yAxis_splitLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
    /** yAxis  axisPointer */
    yAxis_axisPointer_show = true;
    /** yAxis  axisPointer 是否显示文本标签*/
    yAxis_axisPointer_label_show = false;
    /** yAxis  坐标轴两边留白策略*/
    yAxis_boundaryGap = true; //true false
    /** yAxis  data*/
    yAxis_data = '';
    /** yAxis  scale*/
    yAxis_scale = false;

    /** series data*/
    series = [
        {
        name: 'ONLY',
        data: '',
        type: 'scatter',
        symbolSize: 10,
        label: {
            emphasis: {
                show: true,
                formatter: '{a}',
                position: 'top'
            }
        },
        itemStyle: {
            normal: {               
                color: 'rgba(67,163,251,0.30)',              
                borderWidth:'1px',
                borderColor:'rgba(67,163,251,0.60)',
                borderType:'solid'
            }
        },
        markLine : {//标线
                lineStyle: {
                    normal: {
                        type: 'solid',
                        color: '#BBBDC6',
                        width: 1
                    }
                },
                data : [
                   {
                        name: '平均值',
                        yAxis: '50'                   
                   },{
                        name: '平均值',
                        xAxis: '20000'     
                   }                  
                ],
                symbol:"circle",
                symbolSize:[1,1],
                label:{
                    normal:{
                        show:false,                        
                    }
                },
                silent:true
            },
        markArea: {
            silent: true,
            itemStyle: {
                normal: {
                    color: 'transparent',
                    borderWidth: 0,
                    borderType: 'dashed'
                }
            },
            // data: [[{
            //     name: 'B区',
            //     xAxis: '0',
            //     yAxis: '0'
            // }, {
            //     xAxis: 'average',
            //     yAxis: 'average'
            // }],[{
            //     name: 'A区',
            //     xAxis: '30000',
            //     yAxis: '73'
            // }, {
            //     xAxis: '70000',
            //     yAxis: '80'
            // }]],
            label:{
                normal:{
                    position:['50%','50%']                     
                }                    
            }
            
        }
    },{
        name: 'VERO MODA',
        data: '',
        type: 'scatter',
        symbolSize: 10,
        label: {
            emphasis: {
                show: true,
                formatter: '{a}',
                position: 'top'
            }
        },
        itemStyle: {
            normal: {            
                color: 'rgba(150,208,47,0.30)',        
                borderWidth:'1px',
                borderColor:'rgba(150,208,47,0.60)',
                borderType:'solid'
            }
        },
        markLine : {//标线
                lineStyle: {
                    normal: {
                        type: 'solid',
                        color: '#BBBDC6',
                        width: 1
                    }
                },
                data : [
                    {
                        name: '平均值',
                        yAxis: '50'                   
                    },{
                        name: '平均值',
                        xAxis: '20000'     
                    }                             
                ],
                symbol:"circle",
                symbolSize:[1,1],
                label:{
                    normal:{
                        show:false,                        
                    }
                },
                silent:true
            }
    },
    {
        name: 'JACK&JONES',
        data: this.data[2],
        type: 'scatter',
        symbolSize: 10,
        label: {
            emphasis: {
                show: true,
                formatter: '{a}',
                position: 'top'
            }
        },
        itemStyle: {
            normal: {                             
                color: 'rgba(249,210,74,0.30)', 
                borderWidth:'1px',
                borderColor:'rgba(249,210,74,0.60)',
                borderType:'solid'            
            }
        },
        markLine : {//标线
                lineStyle: {
                    normal: {
                        type: 'solid',
                        color: '#BBBDC6',
                        width: 1
                    }
                },
                data : [
                    {
                        name: '平均值',
                        yAxis: '50'                   
                    },{
                        name: '平均值',
                        xAxis: '20000'     
                    }       
                ],
                symbol:"circle",
                symbolSize:[1,1],
                label:{
                    normal:{
                        show:false,                        
                    }
                },
                silent:true
            }
    },{
        name: 'SELECTED',
        data: '',
        type: 'scatter',
        symbolSize: 10,
        label: {
            emphasis: {
                show: true,
                formatter: '{a}',
                position: 'top'
            }
        },
        itemStyle: {
            normal: {
                color: 'rgba(250,164,73,0.30)',              
                borderWidth:'1px',
                borderColor:'rgba(250,164,73,0.60)',
                borderType:'solid'  
            }
        },
        markLine : {//标线
                lineStyle: {
                    normal: {
                        type: 'solid',
                        color: '#BBBDC6',
                        width: 1
                    }
                },
                data : [
                    {
                        name: '平均值',
                        yAxis: '50'                   
                    },{
                        name: '平均值',
                        xAxis: '20000'     
                    }       
                ],
                symbol:"circle",
                symbolSize:[1,1],
                label:{
                    normal:{
                        show:false,                        
                    }
                },
                silent:true
            }
    }];

   
    /** grid 是否显示直角坐标系网格*/
    grid_show = true;
    /** grid grid 组件离容器左侧的距离*/
    grid_left = '3%';
    /** grid grid 组件离容器右侧的距离*/
    grid_right = 20;
    /** grid grid 组件离容器底侧的距离*/
    grid_bottom = '3%';
    /** grid grid 区域是否包含坐标轴的刻度标签*/
    grid_containLabel = true;
    /** grid 网格的边框颜色。支持的颜色格式同 backgroundColor*/
    grid_borderColor = 'transparent';
    /** grid 网格的边框线宽*/
    grid_borderWidth = 0;

    
}
