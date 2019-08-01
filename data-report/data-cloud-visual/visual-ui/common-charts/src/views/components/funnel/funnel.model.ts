import {BaseModel} from "../../base/model.base";
/**
 * Created by zhaoxue on 2017-03-29.
 */

export class FunnelModel extends BaseModel{
    /** backgroundColor  */
    backgroundColor = '#fff';

    /** title  */

    /** title 是否显示标题组件  */
    title_show = true;
    /** title 主标题文本，支持使用 \n 换行  */
    title_text = '漏斗图';
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
    title_left = 'center'; //'left', 'center', 'right' , '20%'
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
    legend_left = 'center'; //'left', 'center', 'right'
    /** legend 图例组件离容器上侧的距离。*/
    legend_top = 30; //'top', 'middle', 'bottom'
    /** legend 图例组件离容器右侧的距离。*/
    legend_right = '';
    /** legend 图例组件离容器下侧的距离。*/
    legend_bottom = '';
    /** legend 图例列表的布局朝向。*/
    legend_orient = 'horizontal'; //'horizontal':水平  'vertical':垂直
    /** legend 标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。*/
    legend_padding = 20; // 支持[5, 10] [5,10,5,10]
    /** legend 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。*/
    legend_itemGap = 10;
    legend_data = [{
        name : "展现",
        icon : 'circle', //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
    },{
        name : "点击",
        icon : 'rect', //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
    },{
        name : "访问",
        icon : 'triangle', //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
    },{
        name : "咨询",
        icon : 'triangle', //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
    },{
        name : "订单",
        icon : 'triangle', //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
    }];
    legend_backgroundColor = 'transparent';

    /** tooltip  */
    tooltip_show = true;
    /** tooltip 触发类型*/
    tooltip_trigger = 'item';
    /** tooltip 提示框浮层内容格式器，支持字符串模板和回调函数两种形式。*/
    tooltip_formatter = "{a} <br/>{b} : {c}%";
    /* tooltip 类型 */
    tooltip_axisPointer_type = 'shadow'; //'line' 直线指示器  'shadow' 阴影指示器  'cross' 十字准星指示器。其实是种简写，表示启用两个正交的轴的 axisPointer。
    /* tooltip 文字颜色 */
    tooltip_textStyle_color = "#fff";
    /* tooltip 文字 */
    tooltip_textStyle_fontFamily = '微软雅黑';
    /* tooltip 文字大小 */
    tooltip_textStyle_fontSize = 14;
    /* tooltip 背景颜色 */
    tooltip_backgroundColor = 'rgba(0,0,0,.7)';
    /* tooltip 边框颜色 */
    tooltip_borderColor = '#e6e9ed';
    /* tooltip 边框大小 */
    tooltip_borderWidth = 1;
    /* tooltip padding */
    tooltip_padding = 10;

    /** xAxis */
    /** xAxis  x轴是否显示*/
    xAxis_show = true;
    /** xAxis  type*/
    xAxis_type = 'value';
    /** xAxis  坐标轴两边留白策略*/
    xAxis_boundaryGap = false; //true false
    /** xAxis  data*/
    xAxis_data = ['周一','周二','周三','周四','周五','周六','周日'];
    /** xAxis  axisLine 是否显示坐标轴轴线*/
    xAxis_axisLine_show = true;
    /** xAxis  axisLine 坐标轴线线的颜色*/
    xAxis_axisLine_lineStyle_color = '#e7e8eb';
    /** xAxis  axisLine 坐标轴线线的寬度*/
    xAxis_axisLine_lineStyle_width = 1;
    /** xAxis  axisLine 坐标轴线线的类型*/
    xAxis_axisLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
    /** xAxis  axisTick 是否显示坐标轴刻度*/
    xAxis_axisTick_show = false;
    /** xAxis  axisTick 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐*/
    xAxis_axisTick_alignWithLabel = true;
    /** xAxis  axisTick 坐标轴刻度的长度*/
    xAxis_axisTick_length = 5;
    /** xAxis  axisTick 刻度线的颜色*/
    xAxis_axisTick_lineStyle_color = "#000";
    /** xAxis  axisTick 坐标轴刻度线宽*/
    xAxis_axisTick_lineStyle_width = 1;
    /** xAxis  axisTick 坐标轴刻度线的类型*/
    xAxis_axisTick_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
    /** xAxis  label 是否显示刻度标签*/
    xAxis_axisLabel_show = true;
    /** xAxis  label 刻度标签与轴线之间的距离*/
    xAxis_axisLabel_margin = 8;
    /** xAxis  label 刻度标签文字的颜色*/
    xAxis_axisLabel_textStyle_color = "#8893a3";
    /** xAxis  label 文字的字体系列*/
    xAxis_axisLabel_textStyle_fontFamily = '微软雅黑';
    /** xAxis  label 文字的字体大小*/
    xAxis_axisLabel_textStyle_fontSize = 12;
    /** xAxis  splitLine 是否显示分隔线*/
    xAxis_splitLine_show = true;
    /** xAxis  splitLine 分隔线颜色，可以设置成单个颜色*/
    xAxis_splitLine_lineStyle_color = ['#eef0f4'];
    /** xAxis  splitLine 分隔线线宽*/
    xAxis_splitLine_lineStyle_width = 1;
    /** xAxis  splitLine 分隔线线的类型*/
    xAxis_splitLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
    /** xAxis  axisPointer 指示器类型*/
    xAxis_axisPointer_type = 'shadow'; //'line' 直线指示器 'shadow' 阴影指示器
    /** xAxis  axisPointer 是否显示文本标签*/
    xAxis_axisPointer_label_show = false;
    /** yAxis  y轴是否显示*/
    yAxis_show = true;
    /** yAxis  type*/
    yAxis_type = 'category';
    /** yAxis  axisLine 是否显示坐标轴轴线*/
    yAxis_axisLine_show = true;
    /** yAxis  axisLine 坐标轴线线的颜色*/
    yAxis_axisLine_lineStyle_color = '#e7e8eb';
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
    yAxis_axisTick_lineStyle_color = "#000";
    /** yAxis  axisTick 坐标轴刻度线宽*/
    yAxis_axisTick_lineStyle_width = 1;
    /** yAxis  axisTick 坐标轴刻度线的类型*/
    yAxis_axisTick_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
    /** yAxis  label 是否显示刻度标签*/
    yAxis_axisLabel_show = true;
    /** yAxis  label 刻度标签与轴线之间的距离*/
    yAxis_axisLabel_margin = 8;
    /** yAxis  label 刻度标签文字的颜色*/
    yAxis_axisLabel_textStyle_color = "#8893a3";
    /** yAxis  label 文字的字体系列*/
    yAxis_axisLabel_textStyle_fontFamily = '微软雅黑';
    /** yAxis  label 文字的字体大小*/
    yAxis_axisLabel_textStyle_fontSize = 12;
    /** yAxis  splitLine 是否显示分隔线*/
    yAxis_splitLine_show = false;
    /** yAxis  splitLine 分隔线颜色，可以设置成单个颜色*/
    yAxis_splitLine_lineStyle_color = ['#eef0f4'];
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
    yAxis_data = ['周一','周二','周三','周四','周五','周六','周日'];

    /** series 系列名称*/
    series_name = '漏斗图';
    /** series 類型*/
    series_type = 'funnel';
    /** series 数据堆叠*/
    series_stack = '';
    /** series 是否平滑曲线显示*/
    series_smooth = false;
    /** series 标记的图形*/
    series_symbol = 'circle' //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
    /** series 标记的大小*/
    series_symbolSize = 6;
    /** series 是否显示 symbol, 如果 false 则只有在 tooltip hover 的时候显示*/
    series_showSymbol = true;
    /** series 线的颜色*/
    series_lineStyle_normal_color = "#007eff";
    /** series 线宽*/
    series_lineStyle_normal_width = 2;
    /** series 线的类型*/
    series_lineStyle_normal_type ='solid'; //'solid' 'dashed' 'dotted'
    /** series 线颜色*/
    series_itemStyle_normal_color = "#43a3fb";
    /** series 边框的颜色*/
    series_itemStyle_normal_bordercolor = "#fff";
    /** series 边框宽*/
    series_itemStyle_normal_borderwidth = 1;
    /** series 边框的类型*/
    series_itemStyle_normal_bordertype ='solid'; //'solid' 'dashed' 'dotted'
    /** series 填充额颜色*/
    series_areaStyle_normal_color = "transparent";
    /** series 图形透明度*/
    series_areaStyle_normal_opacity = '';
    /** series data*/
    series_data = [
        {
            value:60,
            name:'访问',
            itemStyle: {
                normal: {
                    color: '#b6ff06'
                }
            }
        },
        {
            value:80,
            name:'点击',
            itemStyle: {
                normal: {
                    color: '#06ff9e'
                }
            }
        },
        {
            value:100,
            name:'展现',
            itemStyle: {
                normal: {
                    color: '#68b5fb'
                }
            }
        },
        {
            value:40,
            name:'咨询',
            itemStyle: {
                normal: {
                    color: '#ffae00'
                }
            }
        },
        {
            value:20,
            name:'订单',
            itemStyle: {
                normal: {
                    color: '#ff5400'
                }
            }
        }
        ]

    /** series 柱条的宽度，不设时自适应。支持设置成相对于类目宽度的百分比。*/
    series_barWidth = '50%';
    /** series 柱条的最大宽度，不设时自适应。支持设置成相对于类目宽度的百分比。*/
    series_barMaxWidth = '';
    /** series 柱条最小高度，可用于防止某数据项的值过小而影响交互。*/
    series_barMinHeight = 0
    /** series 柱间距离，可设固定值（如 20）或者百分比（如 '30%'，表示柱子宽度的 30%）。*/
    series_barGap = '100%';

    /** grid 是否显示直角坐标系网格*/
    grid_show = true;
    /** grid grid 组件离容器左侧的距离*/
     grid_left = '5%';
    /** grid grid 组件离容器右侧的距离*/
    grid_right = '5%';
    /** grid grid 组件离容器底侧的距离*/
    grid_bottom = '10%';
    /** grid grid 区域是否包含坐标轴的刻度标签*/
    grid_containLabel = true;
    /** grid 网格的边框颜色。支持的颜色格式同 backgroundColor*/
    grid_borderColor = 'transparent';
    /** grid 网格的边框线宽*/
    grid_borderWidth = 0;
}
