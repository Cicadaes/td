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
var FunnelModel = (function (_super) {
    __extends(FunnelModel, _super);
    function FunnelModel() {
        var _this = _super.apply(this, arguments) || this;
        /** backgroundColor  */
        _this.backgroundColor = '#fff';
        /** title  */
        /** title 是否显示标题组件  */
        _this.title_show = true;
        /** title 主标题文本，支持使用 \n 换行  */
        _this.title_text = '漏斗图';
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
        _this.title_left = 'center'; //'left', 'center', 'right' , '20%'
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
        _this.legend_left = 'center'; //'left', 'center', 'right'
        /** legend 图例组件离容器上侧的距离。*/
        _this.legend_top = 30; //'top', 'middle', 'bottom'
        /** legend 图例组件离容器右侧的距离。*/
        _this.legend_right = '';
        /** legend 图例组件离容器下侧的距离。*/
        _this.legend_bottom = '';
        /** legend 图例列表的布局朝向。*/
        _this.legend_orient = 'horizontal'; //'horizontal':水平  'vertical':垂直
        /** legend 标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。*/
        _this.legend_padding = 20; // 支持[5, 10] [5,10,5,10]
        /** legend 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。*/
        _this.legend_itemGap = 10;
        _this.legend_data = [{
                name: "展现",
                icon: 'circle',
            }, {
                name: "点击",
                icon: 'rect',
            }, {
                name: "访问",
                icon: 'triangle',
            }, {
                name: "咨询",
                icon: 'triangle',
            }, {
                name: "订单",
                icon: 'triangle',
            }];
        _this.legend_backgroundColor = 'transparent';
        /** tooltip  */
        _this.tooltip_show = true;
        /** tooltip 触发类型*/
        _this.tooltip_trigger = 'item';
        /** tooltip 提示框浮层内容格式器，支持字符串模板和回调函数两种形式。*/
        _this.tooltip_formatter = "{a} <br/>{b} : {c}%";
        /* tooltip 类型 */
        _this.tooltip_axisPointer_type = 'shadow'; //'line' 直线指示器  'shadow' 阴影指示器  'cross' 十字准星指示器。其实是种简写，表示启用两个正交的轴的 axisPointer。
        /* tooltip 文字颜色 */
        _this.tooltip_textStyle_color = "#fff";
        /* tooltip 文字 */
        _this.tooltip_textStyle_fontFamily = '微软雅黑';
        /* tooltip 文字大小 */
        _this.tooltip_textStyle_fontSize = 14;
        /* tooltip 背景颜色 */
        _this.tooltip_backgroundColor = 'rgba(0,0,0,.7)';
        /* tooltip 边框颜色 */
        _this.tooltip_borderColor = '#e6e9ed';
        /* tooltip 边框大小 */
        _this.tooltip_borderWidth = 1;
        /* tooltip padding */
        _this.tooltip_padding = 10;
        /** xAxis */
        /** xAxis  x轴是否显示*/
        _this.xAxis_show = true;
        /** xAxis  type*/
        _this.xAxis_type = 'value';
        /** xAxis  坐标轴两边留白策略*/
        _this.xAxis_boundaryGap = false; //true false
        /** xAxis  data*/
        _this.xAxis_data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        /** xAxis  axisLine 是否显示坐标轴轴线*/
        _this.xAxis_axisLine_show = true;
        /** xAxis  axisLine 坐标轴线线的颜色*/
        _this.xAxis_axisLine_lineStyle_color = '#e7e8eb';
        /** xAxis  axisLine 坐标轴线线的寬度*/
        _this.xAxis_axisLine_lineStyle_width = 1;
        /** xAxis  axisLine 坐标轴线线的类型*/
        _this.xAxis_axisLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
        /** xAxis  axisTick 是否显示坐标轴刻度*/
        _this.xAxis_axisTick_show = false;
        /** xAxis  axisTick 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐*/
        _this.xAxis_axisTick_alignWithLabel = true;
        /** xAxis  axisTick 坐标轴刻度的长度*/
        _this.xAxis_axisTick_length = 5;
        /** xAxis  axisTick 刻度线的颜色*/
        _this.xAxis_axisTick_lineStyle_color = "#000";
        /** xAxis  axisTick 坐标轴刻度线宽*/
        _this.xAxis_axisTick_lineStyle_width = 1;
        /** xAxis  axisTick 坐标轴刻度线的类型*/
        _this.xAxis_axisTick_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
        /** xAxis  label 是否显示刻度标签*/
        _this.xAxis_axisLabel_show = true;
        /** xAxis  label 刻度标签与轴线之间的距离*/
        _this.xAxis_axisLabel_margin = 8;
        /** xAxis  label 刻度标签文字的颜色*/
        _this.xAxis_axisLabel_textStyle_color = "#8893a3";
        /** xAxis  label 文字的字体系列*/
        _this.xAxis_axisLabel_textStyle_fontFamily = '微软雅黑';
        /** xAxis  label 文字的字体大小*/
        _this.xAxis_axisLabel_textStyle_fontSize = 12;
        /** xAxis  splitLine 是否显示分隔线*/
        _this.xAxis_splitLine_show = true;
        /** xAxis  splitLine 分隔线颜色，可以设置成单个颜色*/
        _this.xAxis_splitLine_lineStyle_color = ['#eef0f4'];
        /** xAxis  splitLine 分隔线线宽*/
        _this.xAxis_splitLine_lineStyle_width = 1;
        /** xAxis  splitLine 分隔线线的类型*/
        _this.xAxis_splitLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
        /** xAxis  axisPointer 指示器类型*/
        _this.xAxis_axisPointer_type = 'shadow'; //'line' 直线指示器 'shadow' 阴影指示器
        /** xAxis  axisPointer 是否显示文本标签*/
        _this.xAxis_axisPointer_label_show = false;
        /** yAxis  y轴是否显示*/
        _this.yAxis_show = true;
        /** yAxis  type*/
        _this.yAxis_type = 'category';
        /** yAxis  axisLine 是否显示坐标轴轴线*/
        _this.yAxis_axisLine_show = true;
        /** yAxis  axisLine 坐标轴线线的颜色*/
        _this.yAxis_axisLine_lineStyle_color = '#e7e8eb';
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
        _this.yAxis_axisTick_lineStyle_color = "#000";
        /** yAxis  axisTick 坐标轴刻度线宽*/
        _this.yAxis_axisTick_lineStyle_width = 1;
        /** yAxis  axisTick 坐标轴刻度线的类型*/
        _this.yAxis_axisTick_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
        /** yAxis  label 是否显示刻度标签*/
        _this.yAxis_axisLabel_show = true;
        /** yAxis  label 刻度标签与轴线之间的距离*/
        _this.yAxis_axisLabel_margin = 8;
        /** yAxis  label 刻度标签文字的颜色*/
        _this.yAxis_axisLabel_textStyle_color = "#8893a3";
        /** yAxis  label 文字的字体系列*/
        _this.yAxis_axisLabel_textStyle_fontFamily = '微软雅黑';
        /** yAxis  label 文字的字体大小*/
        _this.yAxis_axisLabel_textStyle_fontSize = 12;
        /** yAxis  splitLine 是否显示分隔线*/
        _this.yAxis_splitLine_show = false;
        /** yAxis  splitLine 分隔线颜色，可以设置成单个颜色*/
        _this.yAxis_splitLine_lineStyle_color = ['#eef0f4'];
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
        _this.yAxis_data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        /** series 系列名称*/
        _this.series_name = '漏斗图';
        /** series 類型*/
        _this.series_type = 'funnel';
        /** series 数据堆叠*/
        _this.series_stack = '';
        /** series 是否平滑曲线显示*/
        _this.series_smooth = false;
        /** series 标记的图形*/
        _this.series_symbol = 'circle'; //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
        /** series 标记的大小*/
        _this.series_symbolSize = 6;
        /** series 是否显示 symbol, 如果 false 则只有在 tooltip hover 的时候显示*/
        _this.series_showSymbol = true;
        /** series 线的颜色*/
        _this.series_lineStyle_normal_color = "#007eff";
        /** series 线宽*/
        _this.series_lineStyle_normal_width = 2;
        /** series 线的类型*/
        _this.series_lineStyle_normal_type = 'solid'; //'solid' 'dashed' 'dotted'
        /** series 线颜色*/
        _this.series_itemStyle_normal_color = "#43a3fb";
        /** series 边框的颜色*/
        _this.series_itemStyle_normal_bordercolor = "#fff";
        /** series 边框宽*/
        _this.series_itemStyle_normal_borderwidth = 1;
        /** series 边框的类型*/
        _this.series_itemStyle_normal_bordertype = 'solid'; //'solid' 'dashed' 'dotted'
        /** series 填充额颜色*/
        _this.series_areaStyle_normal_color = "transparent";
        /** series 图形透明度*/
        _this.series_areaStyle_normal_opacity = '';
        /** series data*/
        _this.series_data = [
            {
                value: 60,
                name: '访问',
                itemStyle: {
                    normal: {
                        color: '#b6ff06'
                    }
                }
            },
            {
                value: 80,
                name: '点击',
                itemStyle: {
                    normal: {
                        color: '#06ff9e'
                    }
                }
            },
            {
                value: 100,
                name: '展现',
                itemStyle: {
                    normal: {
                        color: '#68b5fb'
                    }
                }
            },
            {
                value: 40,
                name: '咨询',
                itemStyle: {
                    normal: {
                        color: '#ffae00'
                    }
                }
            },
            {
                value: 20,
                name: '订单',
                itemStyle: {
                    normal: {
                        color: '#ff5400'
                    }
                }
            }
        ];
        /** series 柱条的宽度，不设时自适应。支持设置成相对于类目宽度的百分比。*/
        _this.series_barWidth = '50%';
        /** series 柱条的最大宽度，不设时自适应。支持设置成相对于类目宽度的百分比。*/
        _this.series_barMaxWidth = '';
        /** series 柱条最小高度，可用于防止某数据项的值过小而影响交互。*/
        _this.series_barMinHeight = 0;
        /** series 柱间距离，可设固定值（如 20）或者百分比（如 '30%'，表示柱子宽度的 30%）。*/
        _this.series_barGap = '100%';
        /** grid 是否显示直角坐标系网格*/
        _this.grid_show = true;
        /** grid grid 组件离容器左侧的距离*/
        _this.grid_left = '5%';
        /** grid grid 组件离容器右侧的距离*/
        _this.grid_right = '5%';
        /** grid grid 组件离容器底侧的距离*/
        _this.grid_bottom = '10%';
        /** grid grid 区域是否包含坐标轴的刻度标签*/
        _this.grid_containLabel = true;
        /** grid 网格的边框颜色。支持的颜色格式同 backgroundColor*/
        _this.grid_borderColor = 'transparent';
        /** grid 网格的边框线宽*/
        _this.grid_borderWidth = 0;
        return _this;
    }
    return FunnelModel;
}(model_base_1.BaseModel));
exports.FunnelModel = FunnelModel;
//# sourceMappingURL=funnel.model.js.map