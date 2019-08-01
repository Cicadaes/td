import {BaseModel} from "../../base/model.base";
/**
 * Created by zhaoxue on 2017-03-29.
 */

export class PieBarModel extends BaseModel{
    /** backgroundColor  */
    backgroundColor = '#ffffff';
    // color = ['#b71c1c']
    color = ['#43A3FB','#96D02F', '#F9D24A', '#985FDE', '#ab47bc','#00acc1',  '#ff7043', '#9e9d24','#5c6bc0', '#00838f', '#c4ccd3'];

    /** title  */

    /** title 是否显示标题组件  */
    title_show = false;
    /** title 主标题文本，支持使用 \n 换行  */
    title_text = 'Customized Pie';
    /** title 副标题文本，支持使用 \n 换行  */
    title_subtext = '';
    /** title textStyle  文字颜色*/
    title_textStyle_color = '#fff';
    /** title grid 组件离容器左侧的距离。  */
    title_left = ''; //'left', 'center', 'right' , '20%'
    /** title grid 组件离容器上侧的距离  */
    title_top = ''; //'top', 'middle', 'bottom'
    /** title 文本超链接  */
    text_link = '';
    /** title 指定窗口打开主标题超链接  */
    text_target = ''; //'self': 当前窗口打开  'blank':新窗口打开
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


    /** legend  */
    /** legend 是否显示标题组件  */
    legend_show = false;
    /** legend 组件的所有图形的z值。控制图形的前后顺序。*/
    legend_z = 2;
    /** legend 图例组件离容器左侧的距离。*/
    legend_left = 'right'; //'left', 'center', 'right'
    /** legend 图例组件离容器上侧的距离。*/
    legend_top = 'middle'; //'top', 'middle', 'bottom'
    /** legend 图例列表的布局朝向。*/
    legend_orient = 'vertical'; //'horizontal':水平  'vertical':垂直

    legend_data = [''];
    /** legend 所有图形的zlevel*/
    legend_zlevel = 0;
    /** legend 图例组件离容器右侧的距离。*/
    legend_right = '';
    /** legend 图例组件离容器下侧的距离。*/
    legend_bottom = '';
    /** legend 标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。*/
    legend_padding = [15,5]; // 支持[5, 10] [5,10,5,10]
    /** legend 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。*/
    legend_itemGap = 10;
    legend_backgroundColor = 'transparent';
    legend_textStyle_color = '#000000';
    legend_textStyle_fontFamily = 'Microsoft YaHei';
    legend_textStyle_fontSize = 12;
    legend_itemHeight = 10;

    /** tooltip  */
    tooltip_show = true;
    /** tooltip 触发类型*/
    tooltip_trigger = 'item';
    /** tooltip 提示框浮层内容格式器，支持字符串模板和回调函数两种形式。*/
    tooltip_formatter = "{a} <br/>{b} : {c} ({d}%)";
    /* tooltip 文字颜色 */
    tooltip_textStyle_color = "#fff";
    /* tooltip 文字 */
    tooltip_textStyle_fontFamily = 'PingFangSC-Medium';
    /* tooltip 文字大小 */
    tooltip_textStyle_fontSize = 14;
    /* tooltip 背景颜色 */
    tooltip_backgroundColor = 'rgba(28,36,56,.8)';

    /** series */
    /** series  name*/
    series_name = '价值分类';
    /** series  type*/
    series_type = 'pie';
    /** series  饼图的半径，数组的第一项是内半径，第二项是外半径*/
    series_radius = ['55%', '70%']; // ['50%', '50%']
    /** series 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。*/
    series_center = ['50%', '50%'];
    series_data = [{value:0}];
    /** series 文字的颜色。*/
    series_label_normal_formatter = '{d} %'; //模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。
    series_label_normal_show = false;
    series_label_normal_position = 'inside';//'outside'饼图扇区外侧，通过视觉引导线连到相应的扇区。
                                            //'inside' 饼图扇区内部。
                                            // 'center'饼图扇区中心
    series_label_normal_textStyle_color = '#fff';
    series_label_normal_textStyle_fontFamily = 'Microsoft YaHei';
    /** series 初始值的动画效果。*/
    series_animationType = 'expansion'; //'expansion' 默认研圆弧展开的效果 ,'scale' 缩放效果
    series_itemStyle_normal_color = "#000";
    series_itemStyle_normal_shadowBlur = 200;
    series_itemStyle_normal_shadowColor = 'rgba(0, 0, 0, 0.5)';
    series_roseType = 'area';//'radius' 面积展现数据的百分比，半径展现数据的大小 'area' 所有扇区面积相同，仅通过半径展现数据大小。

    visualMap_show = false;
    visualMap_min = 60;
    visualMap_max = 600;
    visualMap_inRange_colorLightness = [0, 1]

}
