"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var model_base_1 = require("../../base/model.base");
/**
 * Created by zhaoxue on 2017-03-29.
 */
var SelectLineModel = (function (_super) {
    __extends(SelectLineModel, _super);
    function SelectLineModel() {
        var _this = _super.apply(this, arguments) || this;
        /** backgroundColor  */
        _this.backgroundColor = 'transparent';
        _this.color = ['#43A3FB', '#96D02F', '#F9D24A', '#985FDE', '#FAA449', '#1FCE6D'];
        _this.textStyle_color = "#000";
        _this.textStyle_fontFamily = "Microsoft YaHei";
        _this.textStyle_fontSize = 12;
        _this.legend_textStyle_color = "#404560";
        /** title  */
        /** title 是否显示标题组件  */
        _this.title_show = false;
        /** title 主标题文本，支持使用 \n 换行  */
        _this.title_text = 'Customized Pie';
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
        _this.legend_left = ''; //'left', 'center', 'right'
        /** legend 图例组件离容器上侧的距离。*/
        _this.legend_top = 15; //'top', 'middle', 'bottom'
        /** legend 图例组件离容器右侧的距离。*/
        _this.legend_right = '40';
        /** legend 图例组件离容器下侧的距离。*/
        _this.legend_bottom = '';
        /** legend 图例列表的布局朝向。*/
        _this.legend_orient = 'horizontal'; //'horizontal':水平  'vertical':垂直
        /** legend 标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。*/
        _this.legend_padding = [15, 5]; // 支持[5, 10] [5,10,5,10]
        /** legend 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。*/
        _this.legend_itemGap = 10;
        _this.legend_data = [{}];
        _this.legend_backgroundColor = 'transparent';
        _this.legend_itemHeight = 4;
        _this.legend_itemWidth = 16;
        _this.legend_textStyle_fontFamily = "HelveticaNeue";
        _this.legend_textStyle_fontSize = 12;
        /** tooltip  */
        _this.tooltip_show = true;
        /** tooltip 触发类型*/
        _this.tooltip_trigger = 'axis';
        /** tooltip 提示框浮层内容格式器，支持字符串模板和回调函数两种形式。*/
        _this.tooltip_formatter = "";
        /* tooltip 类型 */
        _this.tooltip_axisPointer_type = ''; //'line' 直线指示器  'shadow' 阴影指示器  'cross' 十字准星指示器。其实是种简写，表示启用两个正交的轴的 axisPointer。
        /* tooltip 文字颜色 */
        _this.tooltip_textStyle_color = "#ffffff";
        /* tooltip 文字 */
        _this.tooltip_textStyle_fontFamily = 'PingFangSC-Medium';
        /* tooltip 文字大小 */
        _this.tooltip_textStyle_fontSize = 14;
        /* tooltip 背景颜色 */
        _this.tooltip_backgroundColor = 'rgba(28,36,56,.8)';
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
        _this.xAxis_type = 'category';
        _this.xAxis_name = "";
        _this.xAxis_nameLocation = "middle";
        _this.xAxis_nameGap = 30;
        /** xAxis  坐标轴两边留白策略*/
        _this.xAxis_boundaryGap = false; //true false
        /** xAxis  data*/
        _this.xAxis_data = [""];
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
        _this.xAxis_splitLine_lineStyle_color = ['#DDDEE1'];
        /** xAxis  splitLine 分隔线线宽*/
        _this.xAxis_splitLine_lineStyle_width = 1;
        /** xAxis  splitLine 分隔线线的类型*/
        _this.xAxis_splitLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
        /** xAxis  axisPointer 指示器类型*/
        _this.xAxis_axisPointer_type = 'line'; //'line' 直线指示器 'shadow' 阴影指示器
        /** xAxis  axisPointer 是否显示文本标签*/
        _this.xAxis_axisPointer_label_show = false;
        /** yAxis  y轴是否显示*/
        _this.yAxis_show = true;
        /** yAxis  type*/
        _this.yAxis_type = 'value';
        _this.yAxis_name = "";
        _this.yAxis_nameLocation = "end";
        _this.yAxis_nameGap = 15;
        _this.yAxis_nameRotate = 0;
        _this.yAxis_min = null;
        _this.yAxis_max = null;
        /** yAxis  axisLine 是否显示坐标轴轴线*/
        _this.yAxis_axisLine_show = false;
        /** yAxis  axisLine 坐标轴线线的颜色*/
        _this.yAxis_axisLine_lineStyle_color = '#DDDEE1';
        /** yAxis  axisLine 坐标轴线线的寬度*/
        _this.yAxis_axisLine_lineStyle_width = 0;
        /** yAxis  axisLine 坐标轴线线的类型*/
        _this.yAxis_axisLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
        /** yAxis  axisTick 是否显示坐标轴刻度*/
        _this.yAxis_axisTick_show = true;
        /** yAxis  axisTick 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐*/
        _this.yAxis_axisTick_alignWithLabel = true;
        /** yAxis  axisTick 坐标轴刻度的长度*/
        _this.yAxis_axisTick_length = 3;
        /** yAxis  axisTick 刻度线的颜色*/
        _this.yAxis_axisTick_lineStyle_color = "#5f6679";
        /** yAxis  axisTick 坐标轴刻度线宽*/
        _this.yAxis_axisTick_lineStyle_width = 1;
        /** yAxis  axisTick 坐标轴刻度线的类型*/
        _this.yAxis_axisTick_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
        /** yAxis  label 是否显示刻度标签*/
        _this.yAxis_axisLabel_show = true;
        /** yAxis  label 刻度标签与轴线之间的距离*/
        _this.yAxis_axisLabel_margin = 8;
        /** yAxis  label 刻度标签文字的颜色*/
        _this.yAxis_axisLabel_textStyle_color = "#80848F";
        /** yAxis  label 文字的字体系列*/
        _this.yAxis_axisLabel_textStyle_fontFamily = 'HelveticaNeue';
        /** yAxis  label 文字的字体大小*/
        _this.yAxis_axisLabel_textStyle_fontSize = 12;
        /** yAxis  splitLine 是否显示分隔线*/
        _this.yAxis_splitLine_show = true;
        /** yAxis  splitLine 分隔线颜色，可以设置成单个颜色*/
        _this.yAxis_splitLine_lineStyle_color = ['#ebeef2'];
        /** yAxis  splitLine 分隔线线宽*/
        _this.yAxis_splitLine_lineStyle_width = 1;
        /** yAxis  splitLine 分隔线线的类型*/
        _this.yAxis_splitLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
        /** yAxis  axisPointer */
        _this.yAxis_axisPointer_show = true;
        /** yAxis  axisPointer 是否显示文本标签*/
        _this.yAxis_axisPointer_label_show = false;
        /** yAxis  series 系列名称*/
        _this.series_name = '邮件营销';
        /** yAxis  series 類型*/
        _this.series_type = 'line';
        /** yAxis  series 数据堆叠*/
        _this.series_stack = '总量';
        /** yAxis  series 是否平滑曲线显示*/
        _this.series_smooth = true;
        /** yAxis  series 标记的图形*/
        _this.series_symbol = 'emptyCircle'; //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
        /** yAxis  series 标记的大小*/
        _this.series_symbolSize = 6;
        /** yAxis  series 是否显示 symbol, 如果 false 则只有在 tooltip hover 的时候显示*/
        _this.series_showSymbol = false;
        _this.series_label_normal_show = false;
        /** yAxis  series 线的颜色*/
        _this.series_lineStyle_normal_color = "#43a3fb";
        /** yAxis  series 线宽*/
        _this.series_lineStyle_normal_width = 2;
        /** yAxis  series 线的类型*/
        _this.series_lineStyle_normal_type = 'solid'; //'solid' 'dashed' 'dotted'
        /** series 线颜色*/
        _this.series_itemStyle_normal_color = "#43a3fb";
        /** yAxis  series 边框的颜色*/
        _this.series_itemStyle_normal_bordercolor = "#43a3fb";
        /** yAxis  series 边框宽*/
        _this.series_itemStyle_normal_borderwidth = 1;
        /** yAxis  series 边框的类型*/
        _this.series_itemStyle_normal_bordertype = 'solid'; //'solid' 'dashed' 'dotted'
        /** yAxis  series 填充额颜色*/
        _this.series_areaStyle_normal_color = "transparent";
        /** yAxis  series 图形透明度*/
        _this.series_areaStyle_normal_opacity = 1;
        /** yAxis  series data*/
        _this.series_data = [{}];
        /** grid 是否显示直角坐标系网格*/
        _this.grid_show = true;
        /** grid grid 组件离容器左侧的距离*/
        _this.grid_left = '30';
        /** grid grid 组件离容器右侧的距离*/
        _this.grid_right = '40';
        /** grid grid 组件离容器底侧的距离*/
        _this.grid_bottom = '10%';
        /** grid grid 区域是否包含坐标轴的刻度标签*/
        _this.grid_containLabel = true;
        /** grid 网格的边框颜色。支持的颜色格式同 backgroundColor*/
        _this.grid_borderColor = 'transparent';
        /** grid 网格的边框线宽*/
        _this.grid_borderWidth = 1;
        _this.grid_backgroundColor = 'transparent';
        _this.datasourceSelectKlData = {
            "1": [
                {
                    "id": "front_users",
                    "name": "周边客流"
                },
                {
                    "id": "active_users",
                    "name": "入店客流"
                },
                {
                    "id": "active_new_users",
                    "name": "入店新客"
                },
                {
                    "id": "active_old_users",
                    "name": "入店老客"
                },
                {
                    "id": "stay_users",
                    "name": "停留客流"
                },
                {
                    "id": "jump_users",
                    "name": "跳出客流"
                },
                {
                    "id": "ROUND(sum(active_users)/sum(front_users)*100,2)",
                    "name": "入店率"
                },
                {
                    "id": "ROUND(sum(jump_users)/sum(active_users)*100,2)",
                    "name": "跳出率"
                },
                {
                    "id": "ROUND(sum(stay_users)/sum(active_users)*100,2)",
                    "name": "停留率"
                },
                // {
                //     "id": "member_count",
                //     "name": "会员到访"
                // },
                // {
                //     "id": "potential_count",
                //     "name": "潜客到访"
                // },
                {
                    "id": "member_count",
                    "name": "手机号认证数"
                },
                {
                    "id": "potential_count",
                    "name": "微信认证数"
                }
            ],
            "2": [
                {
                    "id": "round(sum(active_duration)/sum(active_times),1)",
                    "name": "入店平均停留时长"
                },
                {
                    "id": "high_stay_users",
                    "name": "高活跃客流"
                },
                {
                    "id": "middle_stay_users",
                    "name": "中活跃客流"
                },
                {
                    "id": "low_stay_users",
                    "name": "低活跃客流"
                },
                {
                    "id": "sleep_stay_users",
                    "name": "沉睡客流"
                }
            ]
        };
        _this.datasourceSelectXsData = {
            "1": [
                {
                    "id": "sales_amount",
                    "name": "销售金额"
                },
                {
                    "id": "vip_sales_amount",
                    "name": "会员销售金额"
                },
                {
                    "id": "non_vip_sales_amount",
                    "name": "非会员销售金额"
                }
            ],
            "2": [
                {
                    "id": "order_count",
                    "name": "订单数"
                },
                {
                    "id": "vip_order_count",
                    "name": "会员订单数"
                },
                {
                    "id": "non_vip_order_count",
                    "name": "非会员订单数"
                },
                {
                    "id": "ROUND(sum(sales_count)/sum(order_count),1)",
                    "name": "IPC"
                }
            ],
            "3": [
                {
                    "id": "ROUND(sum(sales_amount)/sum(order_count),1)",
                    "name": "VPC"
                },
                {
                    "id": "ROUND(sum(vip_sales_amount)/sum(vip_order_count),1)",
                    "name": "会员VPC"
                },
                {
                    "id": "ROUND(sum(non_vip_sales_amount)/sum(non_vip_order_count),1)",
                    "name": "非会员VPC"
                }
            ],
            "4": [
                {
                    "id": "sales_count",
                    "name": "销件数"
                },
                {
                    "id": "ROUND(sum(sales_amount)/sum(sales_count),1)",
                    "name": "件单价"
                }
            ],
            "5": [
                {
                    "id": "ROUND(sum(order_count_gt1)/sum(order_count)*100,2)",
                    "name": "关联销售订单占比"
                },
                {
                    "id": "ROUND(sum(vip_order_count_gt1)/sum(vip_order_count)*100,2)",
                    "name": "会员关联销售订单占比"
                },
                {
                    "id": "ROUND(sum(non_vip_order_count_gt1)/sum(non_vip_order_count)*100,2)",
                    "name": "非会员关联销售订单占比"
                }
            ]
        };
        return _this;
    }
    return SelectLineModel;
}(model_base_1.BaseModel));
exports.SelectLineModel = SelectLineModel;
//# sourceMappingURL=selectLine.model.js.map