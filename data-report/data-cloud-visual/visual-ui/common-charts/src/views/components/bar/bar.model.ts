import {BaseModel} from "../../base/model.base";

/**
 * Created by zhaoxue on 2017-03-29.
 */

export class BarModel extends BaseModel{
    /** backgroundColor  */
    backgroundColor = '#fff';
    color = ['#3399ff','#ff8f00', '#f4b400', '#0f9d58', '#ab47bc','#00acc1',  '#ff7043', '#9e9d24','#5c6bc0', '#00838f', '#c4ccd3'];

    /** title  */

    /** title 是否显示标题组件  */
    title_show = false;
    /** title 主标题文本，支持使用 \n 换行  */
    title_text = 'Customized Pie';
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
    title_subtextStyle_color = '#fff';
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
    legend_left = 'center'; //'left', 'center', 'right'
    /** legend 图例组件离容器上侧的距离。*/
    legend_top = 15; //'top', 'middle', 'bottom'
    /** legend 图例组件离容器右侧的距离。*/
    legend_right = '';
    /** legend 图例组件离容器下侧的距离。*/
    legend_bottom = '';
    /** legend 图例列表的布局朝向。*/
    legend_orient = 'horizontal'; //'horizontal':水平  'vertical':垂直
    /** legend 标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。*/
    legend_padding = [15,5]; // 支持[5, 10] [5,10,5,10]
    /** legend 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。*/
    legend_itemGap = 10;
    legend_data = [{}];
    legend_backgroundColor = 'transparent';
    legend_itemHeight = 10;
    /** tooltip  */
    tooltip_show = true;
    /** tooltip 触发类型*/
    tooltip_trigger = 'axis';
    /** tooltip 提示框浮层内容格式器，支持字符串模板和回调函数两种形式。*/
    tooltip_formatter = "";
    /* tooltip 类型 */
    tooltip_axisPointer_type = 'shadow'; //'line' 直线指示器  'shadow' 阴影指示器  'cross' 十字准星指示器。其实是种简写，表示启用两个正交的轴的 axisPointer。
    /* tooltip 文字颜色 */
    tooltip_textStyle_color = "#76818e";
    /* tooltip 文字 */
    tooltip_textStyle_fontFamily = 'sans-serif';
    /* tooltip 文字大小 */
    tooltip_textStyle_fontSize = 14;
    /* tooltip 背景颜色 */
    tooltip_backgroundColor = 'rgba(255,255,255,.8)';
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
    xAxis_type = 'category';
    xAxis_name = "";
    xAxis_nameLocation = "middle";
    xAxis_nameGap = 30;
    /** xAxis  坐标轴两边留白策略*/
    xAxis_boundaryGap = true; //true false
    /** xAxis  data*/
     xAxis_data = [""];
    /** xAxis  axisLine 是否显示坐标轴轴线*/
    xAxis_axisLine_show = true;
    /** xAxis  axisLine 坐标轴线线的颜色*/
    xAxis_axisLine_lineStyle_color = '';
    /** xAxis  axisLine 坐标轴线线的寬度*/
    xAxis_axisLine_lineStyle_width = 0;
    /** xAxis  axisLine 坐标轴线线的类型*/
    xAxis_axisLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
    /** xAxis  axisTick 是否显示坐标轴刻度*/
    xAxis_axisTick_show = true;
    /** xAxis  axisTick 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐*/
    xAxis_axisTick_alignWithLabel = true;
    /** xAxis  axisTick 坐标轴刻度的长度*/
    xAxis_axisTick_length = 3;
    /** xAxis  axisTick 刻度线的颜色*/
    xAxis_axisTick_lineStyle_color = "#5e6679";
    /** xAxis  axisTick 坐标轴刻度线宽*/
    xAxis_axisTick_lineStyle_width = 1;
    /** xAxis  axisTick 坐标轴刻度线的类型*/
    xAxis_axisTick_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
    /** xAxis  label 是否显示刻度标签*/
    xAxis_axisLabel_show = true;
    /** xAxis  label 刻度标签与轴线之间的距离*/
    xAxis_axisLabel_margin = 8;
    /** xAxis  label 刻度标签文字的颜色*/
    xAxis_axisLabel_textStyle_color = "#5e6679";
    /** xAxis  label 文字的字体系列*/
    xAxis_axisLabel_textStyle_fontFamily = '微软雅黑';
    /** xAxis  label 文字的字体大小*/
    xAxis_axisLabel_textStyle_fontSize = 12;
    /** xAxis  splitLine 是否显示分隔线*/
    xAxis_splitLine_show = false;
    /** xAxis  splitLine 分隔线颜色，可以设置成单个颜色*/
    xAxis_splitLine_lineStyle_color = [''];
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
  
   yAxis_name = "";
    yAxis_nameLocation = "end";
    yAxis_nameGap = 15;
    yAxis_nameRotate= 0;
    yAxis_min:any = null;
    yAxis_max:any = null;
   
    /** yAxis  axisLine 是否显示坐标轴轴线*/
    yAxis_axisLine_show = true;
    /** yAxis  axisLine 坐标轴线线的颜色*/
    yAxis_axisLine_lineStyle_color = '';
    /** yAxis  axisLine 坐标轴线线的寬度*/
    yAxis_axisLine_lineStyle_width = 0;
    /** yAxis  axisLine 坐标轴线线的类型*/
    yAxis_axisLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
    /** yAxis  axisTick 是否显示坐标轴刻度*/
    yAxis_axisTick_show = true;
    /** yAxis  axisTick 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐*/
    yAxis_axisTick_alignWithLabel = true;
    /** yAxis  axisTick 坐标轴刻度的长度*/
    yAxis_axisTick_length = 3;
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
    yAxis_axisLabel_textStyle_color = "#5e6679";
    /** yAxis  label 文字的字体系列*/
    yAxis_axisLabel_textStyle_fontFamily = '微软雅黑';
    /** yAxis  label 文字的字体大小*/
    yAxis_axisLabel_textStyle_fontSize = 12;
    /** yAxis  splitLine 是否显示分隔线*/
    yAxis_splitLine_show = true;
    /** yAxis  splitLine 分隔线颜色，可以设置成单个颜色*/
    yAxis_splitLine_lineStyle_color = [''];
    /** yAxis  splitLine 分隔线线宽*/
    yAxis_splitLine_lineStyle_width = 1;
    /** yAxis  splitLine 分隔线线的类型*/
    yAxis_splitLine_lineStyle_type = 'solid'; //'solid' 'dashed' 'dotted'
    /** yAxis  axisPointer */
    yAxis_axisPointer_show = false;
    /** yAxis  axisPointer 是否显示文本标签*/
    yAxis_axisPointer_label_show = false;
  
    /** series 系列名称*/
    series_name = '邮件营销';
    /** series 類型*/
    series_type = 'bar';
    /** series 数据堆叠*/
    series_stack = '总量';
    /** series 是否平滑曲线显示*/
    series_smooth = true;
    /** series 标记的图形*/
    series_symbol = 'roundRect' //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
    /** series 标记的大小*/
    series_symbolSize = 6;
    /** series 是否显示 symbol, 如果 false 则只有在 tooltip hover 的时候显示*/
    series_showSymbol = true;
    /** series 线的颜色*/
    series_lineStyle_normal_color = "#000";
    /** series 线宽*/
    series_lineStyle_normal_width = 2;
    /** series 线的类型*/
    series_lineStyle_normal_type ='solid'; //'solid' 'dashed' 'dotted'
    /** series 线颜色*/
    series_itemStyle_normal_color = "#43a3fb";
    /** series 边框的颜色*/
    series_itemStyle_normal_bordercolor = "transparent";
    /** series 边框宽*/
    series_itemStyle_normal_borderwidth = 0;
    /** series 边框的类型*/
    series_itemStyle_normal_bordertype =''; //'solid' 'dashed' 'dotted'
    /** series 填充额颜色*/
    series_areaStyle_normal_color = "transparent";
    /** series 图形透明度*/
    series_areaStyle_normal_opacity = '';
    /** series data*/
    series_data = [{}];
    

    /** series 柱条的宽度，不设时自适应。支持设置成相对于类目宽度的百分比。*/
    series_barWidth = '';
    /** series 柱条的最大宽度，不设时自适应。支持设置成相对于类目宽度的百分比。*/
    series_barMaxWidth = '';
    /** series 柱条最小高度，可用于防止某数据项的值过小而影响交互。*/
    series_barMinHeight = 0
    /** series 柱间距离，可设固定值（如 20）或者百分比（如 '30%'，表示柱子宽度的 30%）。*/
    series_barGap = '';


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
