"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var model_base_1 = require("datwill-sdk/lib/views/base/model.base");
/**
 * Created by zhaoxue on 2017-03-29.
 */
var ScatterModel = (function (_super) {
    __extends(ScatterModel, _super);
    function ScatterModel() {
        var _this = _super.apply(this, arguments) || this;
        _this.echart_color = ['rgba(67,163,251,0.30)', 'rgba(150,208,47,0.30)', 'rgba(249,210,74,0.30)', 'rgba(250,164,73,0.30)', 'rgba(251,208,73,0.30)', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
        //数据
        _this.data = [];
        //模拟数据
        _this.data1 = [{
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
            }, {
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
            }, {
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
        ];
        //指标
        _this.indicators = [
            {
                name: "zhibiao1",
                list: [
                    { val: "入店客流", selected: 0, code: 'active_new_users' },
                    { val: "销售金额", selected: 0, code: 'active_old_users' },
                    { val: "客流3", selected: 0, code: 'zhibiao101' },
                    { val: "客流1", selected: 0, code: 'zhibiao101' },
                    { val: "客流2", selected: 0, code: 'zhibiao101' },
                    { val: "客流3", selected: 0, code: 'zhibiao101' }
                ]
            },
            {
                name: "zhibiao2",
                list: [
                    { val: "客流1", selected: 0, code: 'active_new_users' },
                    { val: "客流2", selected: 0, code: 'active_old_users' },
                    { val: "客流3", selected: 0, code: 'zhibiao203' },
                    { val: "客流1", selected: 0, code: 'zhibiao204' },
                    { val: "客流2", selected: 0, code: 'zhibiao205' },
                    { val: "客流3", selected: 0, code: 'zhibiao206' }
                ]
            },
            {
                name: "zhibiao3",
                list: [
                    { val: "客流1", selected: 0, code: 'active_new_users' },
                    { val: "客流2", selected: 0, code: 'active_old_users' },
                    { val: "客流3", selected: 0, code: 'zhibiao303' },
                    { val: "客流1", selected: 0, code: 'zhibiao304' },
                    { val: "客流2", selected: 0, code: 'zhibiao305' },
                    { val: "客流3", selected: 0, code: 'zhibiao306' }
                ]
            }
        ];
        //默认选中的指标
        _this.indicatorX = 'active_new_users';
        _this.indicatorY = 'active_old_users';
        _this.indicatorXName = '入店客流';
        _this.indicatorYName = '销售金额';
        /** backgroundColor  */
        _this.backgroundColor = '#fff';
        /** title  */
        /** title 是否显示标题组件  */
        _this.title_show = false;
        /** title 主标题文本，支持使用 \n 换行  */
        _this.title_text = '四象限图';
        /** title 文本超链接  */
        _this.text_link = '';
        /** title 指定窗口打开主标题超链接  */
        _this.text_target = ''; //'self': 当前窗口打开  'blank':新窗口打开
        /** title textStyle 主标题设置*/
        /** title textStyle  文字颜色*/
        _this.title_textStyle_color = '#76818e';
        /** title textStyle  文字字体风格*/
        _this.title_textStyle_fontStyle = ''; //'normal':默认  'italic':斜体  'oblique':倾斜
        /** title textStyle  文字字体的粗细*/
        _this.title_textStyle_fontWeight = ''; //'normal':默认 'bold':粗体  'bolder':更粗  'lighter' :更细
        /** title textStyle  文字字体系列*/
        _this.title_textStyle_fontFamily = '';
        /** title textStyle  文字字体大小*/
        _this.title_textStyle_fontSize = 18;
        /** title 文本水平对齐*/
        _this.title_textAlign = 'center'; // 'left', 'center', 'right'
        /** title 文本垂直对齐*/
        _this.title_textBaseline = 'top'; // 'top', 'middle', 'bottom'
        /** title 副标题文本，支持使用 \n 换行  */
        _this.title_subtext = '';
        /** title 副标题文本超链接  */
        _this.text_sublink = '';
        /** title 指定窗口打开副标题超链接  */
        _this.text_subtarget = ''; //'self': 当前窗口打开  'blank':新窗口打开
        /** title subtextStyle 副标题设置*/
        /** title subtextStyle  文字颜色*/
        _this.title_subtextStyle_color = '#76818e';
        /** title subtextStyle  文字字体风格*/
        _this.title_subtextStyle_fontStyle = ''; //'normal':默认  'italic':斜体  'oblique':倾斜
        /** title subtextStyle  文字字体的粗细*/
        _this.title_subtextStyle_fontWeight = ''; //'normal':默认 'bold':粗体  'bolder':更粗  'lighter' :更细
        /** title subtextStyle  文字字体系列*/
        _this.title_subtextStyle_fontFamily = '';
        /** title subtextStyle  文字字体大小*/
        _this.title_subtextStyle_fontSize = 12;
        /** title 标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。*/
        _this.title_padding = 5; // 支持[5, 10] [5,10,5,10]
        /** title 主副标题之间的间距*/
        _this.title_itemGap = 10;
        /** title 所有图形的zlevel*/
        _this.title_zlevel = 0;
        /** title 组件的所有图形的z值。控制图形的前后顺序。*/
        _this.title_z = 2;
        /** title grid 组件离容器左侧的距离。  */
        _this.title_left = 'left'; //'left', 'center', 'right' , '20%'
        /** title grid 组件离容器上侧的距离  */
        _this.title_top = ''; //'top', 'middle', 'bottom'
        /** title grid grid 组件离容器右侧的距离。  */
        _this.title_right = '';
        /** title grid 组件离容器下侧的距离  */
        _this.title_bottom = '';
        /** title 标题背景色*/
        _this.title_backgroundColor = '#00ff2a';
        /** title 标题的边框颜色*/
        _this.title_borderColor = '';
        /** title 标题的边框线宽*/
        _this.title_borderWidth = 0;
        /** legend  */
        /** legend 是否显示标题组件  */
        _this.legend_show = true;
        /** legend 所有图形的zlevel*/
        _this.legend_zlevel = 0;
        /** legend 组件的所有图形的z值。控制图形的前后顺序。*/
        _this.legend_z = 2;
        /** legend 图例组件离容器左侧的距离。*/
        _this.legend_left = 'right'; //'left', 'center', 'right'
        /** legend 图例组件离容器上侧的距离。*/
        _this.legend_top = 5; //'top', 'middle', 'bottom'
        /** legend 图例组件离容器右侧的距离。*/
        _this.legend_right = '10';
        /** legend 图例组件离容器下侧的距离。*/
        _this.legend_bottom = '';
        /** legend 图例列表的布局朝向。*/
        _this.legend_orient = 'horizontal'; //'horizontal':水平  'vertical':垂直
        /** legend 标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。*/
        _this.legend_padding = 5; // 支持[5, 10] [5,10,5,10]
        /** legend 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。*/
        _this.legend_itemGap = 10;
        _this.legend_data = ['ONLY', 'VERO MODA', 'JACK&JONES', 'SELECTED'];
        /** legend图例标记的图形的宽度*/
        _this.legend_itemWidth = 10;
        /** legend图例标记的图形的高度*/
        _this.legend_itemHeight = 10;
        _this.legend_backgroundColor = 'transparent';
        /** tooltip  */
        _this.tooltip_show = true;
        /** tooltip 触发类型*/
        _this.tooltip_trigger = 'item';
        /** tooltip 提示框浮层内容格式器，支持字符串模板和回调函数两种形式。*/
        _this.tooltip_formatter = "";
        /* tooltip 类型 */
        _this.tooltip_axisPointer_type = 'shadow'; //'line' 直线指示器  'shadow' 阴影指示器  'cross' 十字准星指示器。其实是种简写，表示启用两个正交的轴的 axisPointer。
        /* tooltip 文字颜色 */
        _this.tooltip_textStyle_color = "#fff";
        /* tooltip 文字 */
        _this.tooltip_textStyle_fontFamily = 'sans-serif';
        /* tooltip 文字大小 */
        _this.tooltip_textStyle_fontSize = 14;
        /* tooltip 背景颜色 */
        _this.tooltip_backgroundColor = 'rgba(0,0,0,.6)';
        /* tooltip 边框颜色 */
        _this.tooltip_borderColor = '#e6e9ed';
        /* tooltip 边框大小 */
        _this.tooltip_borderWidth = 1;
        /* tooltip padding */
        _this.tooltip_padding = 5;
        /** xAxis */
        /** xAxis  x轴是否显示*/
        _this.xAxis_show = true;
        /** xAxis  type*/
        _this.xAxis_type = 'value';
        /** xAxis  坐标轴两边留白策略*/
        _this.xAxis_boundaryGap = false; //true false
        /** xAxis  data*/
        // xAxis_data = ['周一','周二','周三','周四','周五','周六','周日'];
        /** xAxis  axisLine 是否显示坐标轴轴线*/
        _this.xAxis_axisLine_show = true;
        /** xAxis  axisLine 坐标轴线线的颜色*/
        _this.xAxis_axisLine_lineStyle_color = '#DDDEE1';
        /** xAxis  axisLine 坐标轴线线的寬度*/
        _this.xAxis_axisLine_lineStyle_width = 1;
        /** xAxis  axisLine 坐标轴线线的类型*/
        _this.xAxis_axisLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
        /** xAxis  axisTick 是否显示坐标轴刻度*/
        _this.xAxis_axisTick_show = true;
        /** xAxis  axisTick 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐*/
        _this.xAxis_axisTick_alignWithLabel = true;
        /** xAxis  axisTick 坐标轴刻度的长度*/
        _this.xAxis_axisTick_length = 5;
        /** xAxis  axisTick 刻度线的颜色*/
        _this.xAxis_axisTick_lineStyle_color = "#DDDEE1";
        /** xAxis  axisTick 坐标轴刻度线宽*/
        _this.xAxis_axisTick_lineStyle_width = 1;
        /** xAxis  axisTick 坐标轴刻度线的类型*/
        _this.xAxis_axisTick_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
        /** xAxis  label 是否显示刻度标签*/
        _this.xAxis_axisLabel_show = true;
        /** xAxis  label 刻度标签与轴线之间的距离*/
        _this.xAxis_axisLabel_margin = 8;
        /** xAxis  label 刻度标签文字的颜色*/
        _this.xAxis_axisLabel_textStyle_color = "#80848F";
        /** xAxis  label 文字的字体系列*/
        _this.xAxis_axisLabel_textStyle_fontFamily = 'HelveticaNeue';
        /** xAxis  label 文字的字体大小*/
        _this.xAxis_axisLabel_textStyle_fontSize = 12;
        /** xAxis  splitLine 是否显示分隔线*/
        _this.xAxis_splitLine_show = false;
        /** xAxis  splitLine 分隔线颜色，可以设置成单个颜色*/
        _this.xAxis_splitLine_lineStyle_color = ['#E9EAEC'];
        /** xAxis  splitLine 分隔线线宽*/
        _this.xAxis_splitLine_lineStyle_width = 1;
        /** xAxis  splitLine 分隔线线的类型*/
        _this.xAxis_splitLine_lineStyle_type = 'dashed'; //'solid' 'dashed' 'dotted'
        /** xAxis  axisPointer 指示器类型*/
        _this.xAxis_axisPointer_type = 'shadow'; //'line' 直线指示器 'shadow' 阴影指示器
        /** xAxis  axisPointer 是否显示文本标签*/
        _this.xAxis_axisPointer_label_show = false;
        /** yAxis  y轴是否显示*/
        _this.yAxis_show = true;
        /** yAxis  type*/
        _this.yAxis_type = 'value';
        /** yAxis  axisLine 是否显示坐标轴轴线*/
        _this.yAxis_axisLine_show = false;
        /** yAxis  axisLine 坐标轴线线的颜色*/
        _this.yAxis_axisLine_lineStyle_color = '#DDDEE1';
        /** yAxis  axisLine 坐标轴线线的寬度*/
        _this.yAxis_axisLine_lineStyle_width = 1;
        /** yAxis  axisLine 坐标轴线线的类型*/
        _this.yAxis_axisLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
        /** yAxis  axisTick 是否显示坐标轴刻度*/
        _this.yAxis_axisTick_show = false;
        /** yAxis  axisTick 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐*/
        _this.yAxis_axisTick_alignWithLabel = true;
        /** yAxis  axisTick 坐标轴刻度的长度*/
        _this.yAxis_axisTick_length = 5;
        /** yAxis  axisTick 刻度线的颜色*/
        _this.yAxis_axisTick_lineStyle_color = '#DDDEE1';
        /** yAxis  axisTick 坐标轴刻度线宽*/
        _this.yAxis_axisTick_lineStyle_width = 1;
        /** yAxis  axisTick 坐标轴刻度线的类型*/
        _this.yAxis_axisTick_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
        /** yAxis  label 是否显示刻度标签*/
        _this.yAxis_axisLabel_show = true;
        /** yAxis  label 刻度标签与轴线之间的距离*/
        _this.yAxis_axisLabel_margin = 8;
        /** yAxis  label 刻度标签文字的颜色*/
        _this.yAxis_axisLabel_textStyle_color = '#80848F';
        /** yAxis  label 文字的字体系列*/
        _this.yAxis_axisLabel_textStyle_fontFamily = 'HelveticaNeue';
        /** yAxis  label 文字的字体大小*/
        _this.yAxis_axisLabel_textStyle_fontSize = 12;
        /** yAxis  splitLine 是否显示分隔线*/
        _this.yAxis_splitLine_show = true;
        /** yAxis  splitLine 分隔线颜色，可以设置成单个颜色*/
        _this.yAxis_splitLine_lineStyle_color = ['#E9EAEC'];
        /** yAxis  splitLine 分隔线线宽*/
        _this.yAxis_splitLine_lineStyle_width = 1;
        /** yAxis  splitLine 分隔线线的类型*/
        _this.yAxis_splitLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
        /** yAxis  axisPointer */
        _this.yAxis_axisPointer_show = true;
        /** yAxis  axisPointer 是否显示文本标签*/
        _this.yAxis_axisPointer_label_show = false;
        /** yAxis  坐标轴两边留白策略*/
        _this.yAxis_boundaryGap = true; //true false
        /** yAxis  data*/
        _this.yAxis_data = '';
        /** yAxis  scale*/
        _this.yAxis_scale = false;
        /** series data*/
        _this.series = [
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
                        borderWidth: '1px',
                        borderColor: 'rgba(67,163,251,0.60)',
                        borderType: 'solid'
                    }
                },
                markLine: {
                    lineStyle: {
                        normal: {
                            type: 'solid',
                            color: '#BBBDC6',
                            width: 1
                        }
                    },
                    data: [
                        {
                            name: '平均值',
                            yAxis: '50'
                        }, {
                            name: '平均值',
                            xAxis: '20000'
                        }
                    ],
                    symbol: "circle",
                    symbolSize: [1, 1],
                    label: {
                        normal: {
                            show: false,
                        }
                    },
                    silent: true
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
                    label: {
                        normal: {
                            position: ['50%', '50%']
                        }
                    }
                }
            }, {
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
                        borderWidth: '1px',
                        borderColor: 'rgba(150,208,47,0.60)',
                        borderType: 'solid'
                    }
                },
                markLine: {
                    lineStyle: {
                        normal: {
                            type: 'solid',
                            color: '#BBBDC6',
                            width: 1
                        }
                    },
                    data: [
                        {
                            name: '平均值',
                            yAxis: '50'
                        }, {
                            name: '平均值',
                            xAxis: '20000'
                        }
                    ],
                    symbol: "circle",
                    symbolSize: [1, 1],
                    label: {
                        normal: {
                            show: false,
                        }
                    },
                    silent: true
                }
            },
            {
                name: 'JACK&JONES',
                data: _this.data[2],
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
                        borderWidth: '1px',
                        borderColor: 'rgba(249,210,74,0.60)',
                        borderType: 'solid'
                    }
                },
                markLine: {
                    lineStyle: {
                        normal: {
                            type: 'solid',
                            color: '#BBBDC6',
                            width: 1
                        }
                    },
                    data: [
                        {
                            name: '平均值',
                            yAxis: '50'
                        }, {
                            name: '平均值',
                            xAxis: '20000'
                        }
                    ],
                    symbol: "circle",
                    symbolSize: [1, 1],
                    label: {
                        normal: {
                            show: false,
                        }
                    },
                    silent: true
                }
            }, {
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
                        borderWidth: '1px',
                        borderColor: 'rgba(250,164,73,0.60)',
                        borderType: 'solid'
                    }
                },
                markLine: {
                    lineStyle: {
                        normal: {
                            type: 'solid',
                            color: '#BBBDC6',
                            width: 1
                        }
                    },
                    data: [
                        {
                            name: '平均值',
                            yAxis: '50'
                        }, {
                            name: '平均值',
                            xAxis: '20000'
                        }
                    ],
                    symbol: "circle",
                    symbolSize: [1, 1],
                    label: {
                        normal: {
                            show: false,
                        }
                    },
                    silent: true
                }
            }
        ];
        /** grid 是否显示直角坐标系网格*/
        _this.grid_show = true;
        /** grid grid 组件离容器左侧的距离*/
        _this.grid_left = '3%';
        /** grid grid 组件离容器右侧的距离*/
        _this.grid_right = 20;
        /** grid grid 组件离容器底侧的距离*/
        _this.grid_bottom = '3%';
        /** grid grid 区域是否包含坐标轴的刻度标签*/
        _this.grid_containLabel = true;
        /** grid 网格的边框颜色。支持的颜色格式同 backgroundColor*/
        _this.grid_borderColor = 'transparent';
        /** grid 网格的边框线宽*/
        _this.grid_borderWidth = 0;
        return _this;
    }
    return ScatterModel;
}(model_base_1.BaseModel));
exports.ScatterModel = ScatterModel;
//# sourceMappingURL=scatter.model.js.map