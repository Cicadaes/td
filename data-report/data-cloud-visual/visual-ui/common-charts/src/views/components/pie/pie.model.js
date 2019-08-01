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
var PieModel = (function (_super) {
    __extends(PieModel, _super);
    function PieModel() {
        var _this = _super.apply(this, arguments) || this;
        /** backgroundColor  */
        _this.backgroundColor = '#ffffff';
        // color = ['#b71c1c']
        _this.color = ['#EB8E4A', '#5AC99E', '#3399FF', '#0f9d58', '#ab47bc', '#00acc1', '#ff7043', '#9e9d24', '#5c6bc0', '#00838f', '#c4ccd3'];
        /** title  */
        /** title 是否显示标题组件  */
        _this.title_show = false;
        /** title 主标题文本，支持使用 \n 换行  */
        _this.title_text = 'Customized Pie';
        /** title 副标题文本，支持使用 \n 换行  */
        _this.title_subtext = '';
        /** title textStyle  文字颜色*/
        _this.title_textStyle_color = '#fff';
        /** title grid 组件离容器左侧的距离。  */
        _this.title_left = ''; //'left', 'center', 'right' , '20%'
        /** title grid 组件离容器上侧的距离  */
        _this.title_top = ''; //'top', 'middle', 'bottom'
        /** title 文本超链接  */
        _this.text_link = '';
        /** title 指定窗口打开主标题超链接  */
        _this.text_target = ''; //'self': 当前窗口打开  'blank':新窗口打开
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
        /** title 副标题文本超链接  */
        _this.text_sublink = '';
        /** title 指定窗口打开副标题超链接  */
        _this.text_subtarget = ''; //'self': 当前窗口打开  'blank':新窗口打开
        /** title subtextStyle 副标题设置*/
        /** title subtextStyle  文字颜色*/
        _this.title_subtextStyle_color = '#fff';
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
        /** legend  */
        /** legend 是否显示标题组件  */
        _this.legend_show = true;
        /** legend 组件的所有图形的z值。控制图形的前后顺序。*/
        _this.legend_z = 2;
        /** legend 图例组件离容器左侧的距离。*/
        _this.legend_left = 'center'; //'left', 'center', 'right'
        /** legend 图例组件离容器上侧的距离。*/
        _this.legend_top = 'bottom'; //'top', 'middle', 'bottom'
        /** legend 图例列表的布局朝向。*/
        _this.legend_orient = 'horizontal'; //'horizontal':水平  'vertical':垂直
        _this.legend_data = [''];
        /** legend 所有图形的zlevel*/
        _this.legend_zlevel = 0;
        /** legend 图例组件离容器右侧的距离。*/
        _this.legend_right = '';
        /** legend 图例组件离容器下侧的距离。*/
        _this.legend_bottom = '';
        /** legend 标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。*/
        _this.legend_padding = [15, 5]; // 支持[5, 10] [5,10,5,10]
        /** legend 图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。*/
        _this.legend_itemGap = 10;
        _this.legend_backgroundColor = 'transparent';
        _this.legend_textStyle_color = '#657180';
        _this.legend_textStyle_fontFamily = 'Microsoft YaHei';
        _this.legend_textStyle_fontSize = 12;
        _this.legend_itemHeight = 10;
        /** tooltip  */
        _this.tooltip_show = true;
        /** tooltip 触发类型*/
        _this.tooltip_trigger = 'item';
        /** tooltip 提示框浮层内容格式器，支持字符串模板和回调函数两种形式。*/
        _this.tooltip_formatter = "{a} <br/>{b} : {c} ({d}%)";
        /* tooltip 文字颜色 */
        _this.tooltip_textStyle_color = "#fff";
        /* tooltip 文字 */
        _this.tooltip_textStyle_fontFamily = 'sans-serif';
        /* tooltip 文字大小 */
        _this.tooltip_textStyle_fontSize = 14;
        /* tooltip 背景颜色 */
        _this.tooltip_backgroundColor = 'rgba(0,0,0,.2)';
        /** series */
        /** series  name*/
        _this.series_name = '访问来源';
        /** series  type*/
        _this.series_type = 'pie';
        /** series  饼图的半径，数组的第一项是内半径，第二项是外半径*/
        _this.series_radius = ['45%', '75%']; // ['50%', '50%']
        /** series 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。*/
        _this.series_center = ['50%', '50%'];
        _this.series_data = [{ value: 0 }];
        /** series 文字的颜色。*/
        _this.series_label_normal_formatter = '{d}%'; //模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。
        _this.series_label_normal_show = true;
        _this.series_label_normal_position = 'inside'; //'outside'饼图扇区外侧，通过视觉引导线连到相应的扇区。
        //'inside' 饼图扇区内部。
        // 'center'饼图扇区中心
        _this.series_label_normal_textStyle_color = '#fff';
        _this.series_label_normal_textStyle_fontFamily = 'Microsoft YaHei';
        /** series 初始值的动画效果。*/
        _this.series_animationType = 'expansion'; //'expansion' 默认研圆弧展开的效果 ,'scale' 缩放效果
        _this.series_itemStyle_normal_color = "#000";
        _this.series_itemStyle_normal_shadowBlur = 200;
        _this.series_itemStyle_normal_shadowColor = 'rgba(0, 0, 0, 0.5)';
        _this.series_roseType = 'area'; //'radius' 面积展现数据的百分比，半径展现数据的大小 'area' 所有扇区面积相同，仅通过半径展现数据大小。
        _this.visualMap_show = false;
        _this.visualMap_min = 60;
        _this.visualMap_max = 600;
        _this.visualMap_inRange_colorLightness = [0, 1];
        return _this;
    }
    return PieModel;
}(model_base_1.BaseModel));
exports.PieModel = PieModel;
//# sourceMappingURL=pie.model.js.map