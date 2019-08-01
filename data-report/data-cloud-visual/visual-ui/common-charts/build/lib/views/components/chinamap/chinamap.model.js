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
var ChinaMapModel = (function (_super) {
    __extends(ChinaMapModel, _super);
    function ChinaMapModel() {
        var _this = _super.apply(this, arguments) || this;
        /** backgroundColor  */
        _this.backgroundColor = '#ffffff';
        // color = ['#b71c1c']
        _this.color = ['#2d8cf0', '#51a2f7', '#5fa8f4', '#68adf5', '#81bcfb', '#93c5fc', '#aad1f9', '#b4d6f8', '#cde6ff', '#dbecfe'];
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
        _this.legend_top = 'top'; //'top', 'middle', 'bottom'
        /** legend 图例列表的布局朝向。*/
        _this.legend_orient = 'vertical'; //'horizontal':水平  'vertical':垂直
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
        _this.series_name = '';
        /** series  type*/
        _this.series_type = 'map';
        _this.series_mapType = 'china';
        _this.series_label_normal_show = false;
        _this.series_label_emphasis_show = false;
        _this.series_roam = false;
        _this.series_label_normal_textStyle_color = '#000';
        _this.series_label_normal_textStyle_fontFamily = "sans-serif";
        _this.series_data = [
            { name: '北京', value: 0 },
            { name: '天津', value: 0 },
            { name: '上海', value: 0 },
            { name: '重庆', value: 0 },
            { name: '河北', value: 0 },
            { name: '河南', value: 0 },
            { name: '云南', value: 0 },
            { name: '辽宁', value: 0 },
            { name: '黑龙江', value: 0 },
            { name: '湖南', value: 0 },
            { name: '安徽', value: 0 },
            { name: '山东', value: 0 },
            { name: '新疆', value: 0 },
            { name: '江苏', value: 0 },
            { name: '浙江', value: 0 },
            { name: '江西', value: 0 },
            { name: '湖北', value: 0 },
            { name: '广西', value: 0 },
            { name: '甘肃', value: 0 },
            { name: '山西', value: 0 },
            { name: '内蒙古', value: 0 },
            { name: '陕西', value: 0 },
            { name: '吉林', value: 0 },
            { name: '福建', value: 0 },
            { name: '贵州', value: 0 },
            { name: '广东', value: 0 },
            { name: '青海', value: 0 },
            { name: '西藏', value: 0 },
            { name: '四川', value: 0 },
            { name: '宁夏', value: 0 },
            { name: '海南', value: 0 },
            { name: '台湾', value: 0 },
            { name: '香港', value: 0 },
            { name: '澳门', value: 0 },
            { name: "南海诸岛",
                itemStyle: {
                    normal: { opacity: 0, label: { show: false }, borderWidth: "0", borderColor: "#10242b", areaStyle: { color: '#10242b' } },
                    emphasis: { opacity: 0, label: { show: false } }
                }, value: 0
            },
        ];
        _this.series_data_map = [
            { name: '北京', fullName: '北京', value: 0 },
            { name: '天津', fullName: '天津', value: 0 },
            { name: '上海', fullName: '上海', value: 0 },
            { name: '重庆', fullName: '重庆', value: 0 },
            { name: '河北', fullName: '河北省', value: 0 },
            { name: '河南', fullName: '河南省', value: 0 },
            { name: '云南', fullName: '云南省', value: 0 },
            { name: '辽宁', fullName: '辽宁省', value: 0 },
            { name: '黑龙江', fullName: '黑龙江省', value: 0 },
            { name: '湖南', fullName: '湖南省', value: 0 },
            { name: '安徽', fullName: '安徽省', value: 0 },
            { name: '山东', fullName: '山东省', value: 0 },
            { name: '新疆', fullName: '新疆维吾尔自治区', value: 0 },
            { name: '江苏', fullName: '江苏省', value: 0 },
            { name: '浙江', fullName: '浙江省', value: 0 },
            { name: '江西', fullName: '江西省', value: 0 },
            { name: '湖北', fullName: '湖北省', value: 0 },
            { name: '广西', fullName: '广西壮族自治区', value: 0 },
            { name: '甘肃', fullName: '甘肃省', value: 0 },
            { name: '山西', fullName: '山西省', value: 0 },
            { name: '内蒙古', fullName: '内蒙古自治区', value: 0 },
            { name: '陕西', fullName: '陕西省', value: 0 },
            { name: '吉林', fullName: '吉林省', value: 0 },
            { name: '福建', fullName: '福建省', value: 0 },
            { name: '贵州', fullName: '贵州省', value: 0 },
            { name: '广东', fullName: '广东省', value: 0 },
            { name: '青海', fullName: '青海省', value: 0 },
            { name: '西藏', fullName: '西藏自治区', value: 0 },
            { name: '四川', fullName: '四川省', value: 0 },
            { name: '宁夏', fullName: '宁夏回族自治区', value: 0 },
            { name: '海南', fullName: '海南省', value: 0 },
            { name: '台湾', fullName: '台湾省', value: 0 },
            { name: '香港', fullName: '香港特别行政区', value: 0 },
            { name: '澳门', fullName: '澳门特别行政区', value: 0 },
            { name: '南海诸岛', fullName: '南海诸岛', value: 0 },
        ];
        _this.visualMap_show = true;
        _this.visualMap_min = 0;
        _this.visualMap_max = 2500;
        _this.visualMap_left = 'left';
        _this.visualMap_top = 'bottom';
        _this.visualMap_text = ['高', '低'];
        _this.visualMap_calculable = true;
        _this.visualMap_controller_inRange_color = ['#EEF6FE', '#2D8CF0'];
        _this.visualMap_orient = 'vertical'; //水平（'horizontal'）或者竖直（'vertical'）
        _this.visualMap_itemWidth = 8;
        _this.visualMap_itemHeight = 80;
        _this.series_itemStyle_normal_areaColor = '#fff';
        // series_itemStyle_emphasis_areaColor = '#f00';
        _this.series_showLegendSymbol = false;
        _this.visualMap_inRange_colorLightness = [0, 1];
        _this.datasourceSelectData = {
            "1": [
                {
                    "id": "all",
                    "name": "全部品牌"
                },
                {
                    "id": "jack_jones",
                    "name": "Jack Jones"
                },
                {
                    "id": "vero_moda",
                    "name": "Vero Moda"
                },
                {
                    "id": "noly",
                    "name": "Only"
                },
                {
                    "id": "select",
                    "name": "Select"
                }
            ]
        };
        return _this;
    }
    return ChinaMapModel;
}(model_base_1.BaseModel));
exports.ChinaMapModel = ChinaMapModel;
//# sourceMappingURL=chinamap.model.js.map