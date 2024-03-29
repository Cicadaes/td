"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by zhaoxue on 2017/3/28.
 */
var base_component_1 = require("../base.component");
var scatter_template_1 = require("./scatter.template");
var scatter_model_1 = require("./scatter.model");
var base_chart_1 = require("datwill-sdk/lib/views/base/base.chart");
var $ = require("jquery");
var ScatterComponent = (function (_super) {
    __extends(ScatterComponent, _super);
    function ScatterComponent() {
        var _this = _super.call(this) || this;
        _this.myChart = null;
        _this.chartData = null;
        _this.scatterData = null;
        _this.echartData = null;
        _this.tableData = null;
        _this.seriesName = null;
        _this.seriesData = null;
        _this.averageX = null;
        _this.averageY = null;
        _this.settingObjCode = [];
        _this.oldValue = [];
        var template = new scatter_template_1.ScatterTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.scatterData = new scatter_model_1.ScatterModel();
        _this.handleData(_this.scatterData);
        _this.echartData = {
            backgroundColor: _this.scatterData.backgroundColor,
            title: {
                show: _this.scatterData.title_show,
                text: _this.scatterData.title_text,
                subtext: _this.scatterData.title_subtext,
                left: _this.scatterData.title_left,
                top: _this.scatterData.title_top,
                textStyle: {
                    color: _this.scatterData.title_textStyle_color
                }
            },
            legend: {
                show: _this.scatterData.legend_show,
                z: _this.scatterData.legend_z,
                left: _this.scatterData.legend_left,
                top: _this.scatterData.legend_top,
                orient: _this.scatterData.legend_orient,
                data: _this.scatterData.legend_data,
                itemWidth: _this.scatterData.legend_itemWidth,
                itemHeight: _this.scatterData.legend_itemHeight
            },
            tooltip: {
                show: _this.scatterData.tooltip_show,
                trigger: _this.scatterData.tooltip_trigger,
                formatter: _this.scatterData.tooltip_formatter,
                axisPointer: {
                    type: _this.scatterData.tooltip_axisPointer_type
                },
                textStyle: {
                    color: _this.scatterData.tooltip_textStyle_color,
                    fontFamily: _this.scatterData.tooltip_textStyle_fontFamily,
                    fontSize: _this.scatterData.tooltip_textStyle_fontSize,
                },
                backgroundColor: _this.scatterData.tooltip_backgroundColor,
                borderColor: _this.scatterData.tooltip_borderColor,
                borderWidth: _this.scatterData.tooltip_borderWidth,
                padding: _this.scatterData.tooltip_padding
            },
            //x轴
            xAxis: {
                show: _this.scatterData.xAxis_show,
                type: _this.scatterData.xAxis_type,
                boundaryGap: _this.scatterData.xAxis_boundaryGap,
                axisLine: {
                    show: _this.scatterData.xAxis_axisLine_show,
                    lineStyle: {
                        color: _this.scatterData.xAxis_axisLine_lineStyle_color,
                        width: _this.scatterData.xAxis_axisLine_lineStyle_width,
                        type: _this.scatterData.xAxis_axisLine_lineStyle_type,
                    },
                },
                //x轴刻度
                axisTick: {
                    show: _this.scatterData.xAxis_axisTick_show,
                    alignWithLabel: _this.scatterData.xAxis_axisTick_alignWithLabel,
                    length: _this.scatterData.xAxis_axisTick_length,
                    lineStyle: {
                        color: _this.scatterData.xAxis_axisTick_lineStyle_color,
                        width: _this.scatterData.xAxis_axisTick_lineStyle_width,
                        type: _this.scatterData.xAxis_axisTick_lineStyle_type,
                    }
                },
                //x轴label
                axisLabel: {
                    show: _this.scatterData.xAxis_axisLabel_show,
                    margin: _this.scatterData.xAxis_axisLabel_margin,
                    // interval: 0,
                    rotate: 0,
                    textStyle: {
                        color: _this.scatterData.xAxis_axisLabel_textStyle_color,
                        fontFamily: _this.scatterData.xAxis_axisLabel_textStyle_fontFamily,
                        fontSize: _this.scatterData.xAxis_axisLabel_textStyle_fontSize,
                    },
                },
                //区域中的分割线
                splitLine: {
                    show: _this.scatterData.xAxis_splitLine_show,
                    lineStyle: {
                        color: _this.scatterData.xAxis_splitLine_lineStyle_color,
                        width: _this.scatterData.xAxis_splitLine_lineStyle_width,
                        type: _this.scatterData.xAxis_splitLine_lineStyle_type
                    },
                }
            },
            //y轴
            yAxis: {
                show: _this.scatterData.yAxis_show,
                type: _this.scatterData.yAxis_type,
                scale: _this.scatterData.yAxis_scale,
                axisLine: {
                    show: _this.scatterData.yAxis_axisLine_show
                },
                //y轴刻度
                axisTick: {
                    show: _this.scatterData.yAxis_axisTick_show
                },
                //y轴label
                axisLabel: {
                    show: _this.scatterData.yAxis_axisLabel_show,
                    margin: _this.scatterData.yAxis_axisLabel_margin,
                    textStyle: {
                        color: _this.scatterData.yAxis_axisLabel_textStyle_color,
                        fontFamily: _this.scatterData.yAxis_axisLabel_textStyle_fontFamily,
                        fontSize: _this.scatterData.yAxis_axisLabel_textStyle_fontSize,
                    }
                },
                //区域中的分割线
                splitLine: {
                    show: _this.scatterData.yAxis_splitLine_show,
                    lineStyle: {
                        color: _this.scatterData.yAxis_splitLine_lineStyle_color,
                        width: _this.scatterData.yAxis_splitLine_lineStyle_width,
                        type: _this.scatterData.yAxis_splitLine_lineStyle_type
                    },
                }
            },
            grid: {
                show: _this.scatterData.grid_show,
                left: _this.scatterData.grid_left,
                right: _this.scatterData.grid_right,
                bottom: _this.scatterData.grid_bottom,
                containLabel: _this.scatterData.grid_containLabel,
                borderColor: _this.scatterData.grid_borderColor,
                borderWidth: _this.scatterData.grid_borderWidth
            },
            //象限图
            series: [{
                    name: _this.scatterData.series[0].name,
                    type: _this.scatterData.series[0].type,
                    symbolSize: _this.scatterData.series[0].symbolSize,
                    data: _this.seriesData[0],
                    label: _this.scatterData.series[0].label,
                    itemStyle: {
                        normal: {
                            color: _this.scatterData.series[0].itemStyle.normal.color,
                            borderWidth: _this.scatterData.series[0].itemStyle.normal.borderWidth,
                            borderColor: _this.scatterData.series[0].itemStyle.normal.borderColor,
                            borderType: _this.scatterData.series[0].itemStyle.normal.borderType
                        }
                    },
                    markLine: {
                        lineStyle: {
                            normal: {
                                type: _this.scatterData.series[0]['markLine'].lineStyle.normal.type,
                                color: _this.scatterData.series[0]['markLine'].lineStyle.normal.color,
                                width: _this.scatterData.series[0]['markLine'].lineStyle.normal.width
                            }
                        },
                        data: [
                            {
                                name: _this.scatterData.series[0]['markLine'].data[0].name,
                                yAxis: _this.averageY
                            }, {
                                name: _this.scatterData.series[0]['markLine'].data[1].name,
                                xAxis: _this.averageX
                            }
                        ],
                        symbol: _this.scatterData.series[0]['markLine'].symbol,
                        symbolSize: _this.scatterData.series[0]['markLine'].symbolSize,
                        label: {
                            normal: {
                                show: _this.scatterData.series[0]['markLine'].label.normal.show
                            }
                        },
                        silent: _this.scatterData.series[0]['markLine'].silent
                    },
                    markArea: {
                        silent: _this.scatterData.series[0]['markArea'].silent,
                        itemStyle: {
                            normal: {
                                color: _this.scatterData.series[0]['markArea'].itemStyle.normal.color,
                                borderWidth: _this.scatterData.series[0]['markArea'].itemStyle.normal.borderWidth,
                                borderType: _this.scatterData.series[0]['markArea'].itemStyle.normal.borderType
                            }
                        },
                        data: _this.scatterData.series[0]['markArea'].data,
                        label: {
                            normal: {
                                position: _this.scatterData.series[0]['markArea'].label.normal.position
                            }
                        }
                    }
                }, {
                    name: _this.scatterData.series[1].name,
                    type: _this.scatterData.series[1].type,
                    symbolSize: _this.scatterData.series[1].symbolSize,
                    data: _this.seriesData[1],
                    label: _this.scatterData.series[1].label,
                    itemStyle: {
                        normal: {
                            color: _this.scatterData.series[1].itemStyle.normal.color,
                            borderWidth: _this.scatterData.series[1].itemStyle.normal.borderWidth,
                            borderColor: _this.scatterData.series[1].itemStyle.normal.borderColor,
                            borderType: _this.scatterData.series[1].itemStyle.normal.borderType
                        }
                    },
                    markLine: {
                        lineStyle: {
                            normal: {
                                type: _this.scatterData.series[1]['markLine'].lineStyle.normal.type,
                                color: _this.scatterData.series[1]['markLine'].lineStyle.normal.color,
                                width: _this.scatterData.series[1]['markLine'].lineStyle.normal.width
                            }
                        },
                        data: [
                            {
                                name: _this.scatterData.series[1]['markLine'].data[0].name,
                                yAxis: _this.averageY
                            }, {
                                name: _this.scatterData.series[1]['markLine'].data[1].name,
                                xAxis: _this.averageX
                            }
                        ],
                        symbol: _this.scatterData.series[1]['markLine'].symbol,
                        symbolSize: _this.scatterData.series[1]['markLine'].symbolSize,
                        label: {
                            normal: {
                                show: _this.scatterData.series[1]['markLine'].label.normal.show
                            }
                        },
                        silent: _this.scatterData.series[1]['markLine'].silent
                    }
                }, {
                    name: _this.scatterData.series[2].name,
                    type: _this.scatterData.series[2].type,
                    symbolSize: _this.scatterData.series[2].symbolSize,
                    data: _this.seriesData[2],
                    label: _this.scatterData.series[2].label,
                    itemStyle: {
                        normal: {
                            color: _this.scatterData.series[2].itemStyle.normal.color,
                            borderWidth: _this.scatterData.series[2].itemStyle.normal.borderWidth,
                            borderColor: _this.scatterData.series[2].itemStyle.normal.borderColor,
                            borderType: _this.scatterData.series[2].itemStyle.normal.borderType
                        }
                    },
                    markLine: {
                        lineStyle: {
                            normal: {
                                type: _this.scatterData.series[2]['markLine'].lineStyle.normal.type,
                                color: _this.scatterData.series[2]['markLine'].lineStyle.normal.color,
                                width: _this.scatterData.series[2]['markLine'].lineStyle.normal.width
                            }
                        },
                        data: [
                            {
                                name: _this.scatterData.series[2]['markLine'].data[0].name,
                                yAxis: _this.averageY
                            }, {
                                name: _this.scatterData.series[2]['markLine'].data[1].name,
                                xAxis: _this.averageX
                            }
                        ],
                        symbol: _this.scatterData.series[2]['markLine'].symbol,
                        symbolSize: _this.scatterData.series[2]['markLine'].symbolSize,
                        label: {
                            normal: {
                                show: _this.scatterData.series[2]['markLine'].label.normal.show
                            }
                        },
                        silent: _this.scatterData.series[2]['markLine'].silent
                    }
                }, {
                    name: _this.scatterData.series[3].name,
                    type: _this.scatterData.series[3].type,
                    symbolSize: _this.scatterData.series[3].symbolSize,
                    data: _this.seriesData[3],
                    label: _this.scatterData.series[3].label,
                    itemStyle: {
                        normal: {
                            color: _this.scatterData.series[3].itemStyle.normal.color,
                            borderWidth: _this.scatterData.series[3].itemStyle.normal.borderWidth,
                            borderColor: _this.scatterData.series[3].itemStyle.normal.borderColor,
                            borderType: _this.scatterData.series[3].itemStyle.normal.borderType
                        }
                    },
                    markLine: {
                        lineStyle: {
                            normal: {
                                type: _this.scatterData.series[3]['markLine'].lineStyle.normal.type,
                                color: _this.scatterData.series[3]['markLine'].lineStyle.normal.color,
                                width: _this.scatterData.series[3]['markLine'].lineStyle.normal.width
                            }
                        },
                        data: [
                            {
                                name: _this.scatterData.series[3]['markLine'].data[0].name,
                                yAxis: _this.averageY
                            }, {
                                name: _this.scatterData.series[3]['markLine'].data[1].name,
                                xAxis: _this.averageX
                            }
                        ],
                        symbol: _this.scatterData.series[3]['markLine'].symbol,
                        symbolSize: _this.scatterData.series[3]['markLine'].symbolSize,
                        label: {
                            normal: {
                                show: _this.scatterData.series[3]['markLine'].label.normal.show
                            }
                        },
                        silent: _this.scatterData.series[3]['markLine'].silent
                    }
                }
            ]
        };
        return _this;
    }
    ScatterComponent.prototype.beforeShow = function () {
    };
    ScatterComponent.prototype.afterShow = function () {
    };
    ScatterComponent.prototype.beforeDestory = function () {
    };
    ScatterComponent.prototype.afterDestory = function () {
    };
    ScatterComponent.prototype.settingChange = function (event, target) {
        //拿到配置的指标重新渲染  
        this.renderContainerXY(target.settingObj.result, target.settingObj.code);
        this.saveSettingObjCode(target.settingObj.code);
        this.setDefaltIndicators();
        //绑定事件
        this.eventBindHtml();
    };
    //保存code
    ScatterComponent.prototype.saveSettingObjCode = function (code) {
        this.settingObjCode[code.charAt(code.length - 1) - 1] = code;
    };
    ScatterComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    ScatterComponent.prototype.dataChange = function (data) {
        this.chartData = data;
        // var myChartData = this.myChart.getOption();       
        this.scatterData.data = data;
        //处理data
        this.handleData(this.scatterData);
        this.scatterData.legend_data = this.echartData.legend.data = this.seriesName;
        //重置图表配置的series
        var obj = {};
        $.extend(true, obj, this.echartData.series[0]);
        for (var i = 0; i < this.seriesData.length; i++) {
            this.echartData.series[i] = {},
                $.extend(true, this.echartData.series[i], obj);
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
        this.renderTables(this.tableData, 5);
        //绑定事件
        this.eventBindHtml();
    };
    ScatterComponent.prototype.styleChange = function (style) {
        // let changeStyle = Utils.addStyle(style);
        // Utils.mergeSourceData(changeStyle,this.echartData);
        // let newStyle = Utils.compareObj(changeStyle,this.echartData);
        // this.myChart.setOption(newStyle,true);
    };
    ScatterComponent.prototype.loadData = function () {
        this.init();
    };
    Object.defineProperty(ScatterComponent.prototype, "data", {
        get: function () {
            return this.chartData;
        },
        enumerable: true,
        configurable: true
    });
    //处理数据
    ScatterComponent.prototype.handleData = function (json) {
        //数据默认降序排列
        json.data.sort(function (a, b) {
            return b[json.indicatorX] - a[json.indicatorX];
        });
        //获取几个数列
        this.getSeriesInfo(this.scatterData);
        //数据分区
        this.tableData = this.assortDataToQuadrant(json);
        //数据分类
        this.seriesData = this.makeDataToSeries(json);
    };
    //获取series数列对应的数组
    ScatterComponent.prototype.getSeriesInfo = function (json) {
        var hashtable = {};
        var seriesName = [];
        for (var i = 0; i < json.data.length; i++) {
            if (!hashtable[json.data[i].brand]) {
                hashtable[json.data[i].brand] = 1;
                seriesName.push(json.data[i].brand);
            }
        }
        this.seriesName = seriesName;
    };
    //将数据分区
    ScatterComponent.prototype.assortDataToQuadrant = function (json) {
        var sumX = 0;
        var sumY = 0;
        json.data.forEach(function (obj) {
            sumX += obj[json.indicatorX];
            sumY += obj[json.indicatorY];
        });
        this.averageX = sumX / json.data.length;
        this.averageY = sumY / json.data.length;
        var arr = [{
                head: ['A区', json.indicatorXName, json.indicatorYName],
                data: []
            }, {
                head: ['B区', json.indicatorXName, json.indicatorYName],
                data: []
            }, {
                head: ['C区', json.indicatorXName, json.indicatorYName],
                data: []
            }, {
                head: ['D区', json.indicatorXName, json.indicatorYName],
                data: []
            }];
        var that = this;
        json.data.forEach(function (obj) {
            if (obj[json.indicatorX] >= that.averageX && obj[json.indicatorY] >= that.averageY) {
                //A区                
                arr[0].data.push(obj);
            }
            else if (obj[json.indicatorX] <= that.averageX && obj[json.indicatorY] >= that.averageY) {
                //B区
                arr[1].data.push(obj);
            }
            else if (obj[json.indicatorX] <= that.averageX && obj[json.indicatorY] <= that.averageY) {
                //C区
                arr[2].data.push(obj);
            }
            else if (obj[json.indicatorX] >= that.averageX && obj[json.indicatorY] <= that.averageY) {
                //D区
                arr[3].data.push(obj);
            }
        });
        return arr;
    };
    //数据分类
    ScatterComponent.prototype.makeDataToSeries = function (json) {
        var arr = [];
        for (var i = 0; i < json.series.length; i++) {
            arr.push([]);
        }
        for (var j = 0; j < json.data.length; j++) {
            for (var i = 0; i < this.seriesName.length; i++) {
                if (json.data[j].brand == this.seriesName[i]) {
                    var infoArr = [];
                    infoArr[0] = json.data[j][json.indicatorX];
                    infoArr[1] = json.data[j][json.indicatorY];
                    infoArr[2] = json.data[j]['project_name'];
                    arr[i].push(infoArr);
                }
            }
        }
        return arr;
    };
    ScatterComponent.prototype.init = function () {
        //渲染xy轴指标数据源
        this.renderContainerXY(this.scatterData.indicators, null);
        // 基于准备好的dom，初始化echarts实例
        this.myChart = base_chart_1.BaseCharts.echarts.init(this.element.querySelector("div[containerScatter]"));
        // 绘制图表
        this.myChart.setOption(this.echartData);
        //渲染右侧表格
        this.renderTables(this.tableData, 5);
        //绑定事件
        this.eventBindHtml();
    };
    //渲染xy轴指标数据源
    ScatterComponent.prototype.renderContainerXY = function (data, code) {
        if (code && code.charAt(code.length - 1) == '1') {
            var $container = $(this.element).find('div[name="indicatorX"]');
            $container.empty();
            this.renderListByArr($container, data);
        }
        else if (code && code.charAt(code.length - 1) == '2') {
            var $container = $(this.element).find('div[name="indicatorY"]');
            $container.empty();
            this.renderListByArr($container, data);
        }
    };
    //根据给的数组及code渲染下拉列表面板
    ScatterComponent.prototype.renderListByArr = function (container, arr) {
        var radioName = container.attr('name').charAt(container.attr('name').length - 1);
        var html = '';
        for (var i = 0; i < arr.length; i++) {
            html += "<div class='itemBox'><span style='display:block'>" + arr[i].name + "</span><ul class='clrfix'>";
            for (var j = 0; j < arr[i].list.length; j++) {
                html += "<li class='fl'><input type='radio' id='" + arr[i].list[j].code + "' name='" + radioName + "' value='" + arr[i].list[j].code + "' /><label for='" + arr[i].list[j].code + "'>" + arr[i].list[j].val + "</label></li>";
            }
            html += "</div>";
        }
        container.append(html);
        return container;
    };
    //渲染右边表格区
    ScatterComponent.prototype.renderTables = function (data, defaulsCount) {
        $('#' + this.scopeID).find('div[containerRight]').empty();
        var containerBox = '<div class="contentBox">';
        for (var i = 0; i < data.length; i++) {
            containerBox += '<div class="tableBox clrfix"><table index="' + i + '"><thead><tr>';
            //生成thead
            for (var j = 0; j < data[i].head.length; j++) {
                var sortable = '';
                if (j != 0) {
                    var indicator = j == 1 ? 'indicatorX' : 'indicatorY';
                    sortable = '<span class="sortable" colName=' + indicator + '><i class="triangleUp"></i><i class="triangleDown currentSort"></i></span>';
                }
                containerBox += '<th><div>' + data[i].head[j] + sortable + '</div></th>';
            }
            //生成tbody
            containerBox += '</tr></thead><tbody>';
            var index = 1;
            var rowCount = data[i].data.length > 5 ? defaulsCount : data[i].data.length;
            for (var k = 0; k < rowCount; k++) {
                //生成tr         
                containerBox += '<tr><td><span>' + index + ' </span>' + data[i].data[k]['project_name'] + '</td><td>' + data[i].data[k][this.scatterData.indicatorX] + '</td>' + '<td>' + data[i].data[k][this.scatterData.indicatorY] + '</td></tr>';
                index++;
            }
            //生成悬浮操作按钮
            containerBox += '<tbody></table><div class="operator" ><span class="toggleOpen open"></span><span class="download"></span></div></div>';
        }
        containerBox += '</div>';
        $('#' + this.scopeID).find('div[containerRight]').append(containerBox);
    };
    //重新渲染tbody
    ScatterComponent.prototype.renderTbody = function (data, table) {
        $(table).find('tbody').empty(); //清空
        //渲染tbody
        var tbody = '';
        var index = 1;
        for (var k = 0; k < data.length; k++) {
            tbody += '<tr>';
            //生成tr中的td           
            for (var key in data[k]) {
                if (key != 'brand') {
                    if (key == 'project_name') {
                        tbody += '<td><span>' + index + ' </span>' + data[k][key] + '</td>';
                        continue;
                    }
                    tbody += '<td>' + data[k][key] + '</td>';
                }
            }
            tbody += '</tr>';
            index++;
        }
        $(table).find('tbody').eq(0).append(tbody);
    };
    //初始化XY轴指标
    ScatterComponent.prototype.setDefaltIndicators = function () {
        var $inputX = $(this.element).find('div[name="indicatorX"]').find('input').eq(0);
        var $inputY = $(this.element).find('div[name="indicatorY"]').find('input').eq(0);
        $inputX.prop('checked', true);
        $inputY.prop('checked', true);
        this.scatterData['indicatorXName'] = $inputX.siblings('label').text();
        this.scatterData['indicatorX'] = $inputX.val();
        $inputX.parents('.indicator').find('.indicatorBox > span').html(this.scatterData['indicatorXName']);
        this.scatterData['indicatorYName'] = $inputY.siblings('label').text();
        this.scatterData['indicatorY'] = $inputY.val();
        $inputY.parents('.indicator').find('.indicatorBox > span').html(this.scatterData['indicatorXName']);
        //当X、Y轴坐标都返回后触发onChange
        if (this.settingObjCode[0] && this.settingObjCode[1]) {
            var codeArr = [{}, {}];
            codeArr[0][this.settingObjCode[0]] = this.scatterData['indicatorX'];
            codeArr[1][this.settingObjCode[1]] = this.scatterData['indicatorY'];
            var sendObj = Object.assign(_super.prototype.transformInput.call(this, this.settingObjCode[0].split('_')[0], codeArr), _super.prototype.transformInput.call(this, 'oldValue', []));
            _super.prototype.onChange.call(this, this, sendObj);
        }
        this.oldValue['indicatorX'] = $inputX.val();
        this.oldValue['indicatorY'] = $inputY.val();
    };
    ScatterComponent.prototype.eventBindHtml = function () {
        var _this = this;
        var that = this;
        //解绑事件
        $('div[containerxy]', '#' + that.scopeID).find('.indicatorBox').off('click');
        $('div[containerxy]', '#' + that.scopeID).find('.indicatorItems').off('click');
        $('.contentBox', '#' + that.scopeID).find('table').off('mouseenter');
        $('.contentBox', '#' + that.scopeID).find('.tableBox').off('mouseleave');
        $('.contentBox', '#' + that.scopeID).find('.toggleOpen').off('click');
        $('.contentBox', '#' + that.scopeID).find('.sortable').off('click');
        //绑定事件     
        //1.显示隐藏指标面板
        $('div[containerxy]', '#' + that.scopeID).find('.indicatorBox').on('click', function (e) {
            $('.indicatorItems').hide();
            $(this).siblings('.indicatorItems').show();
            e.stopPropagation();
        });
        $(document).click(function (e) {
            $('.indicatorItems').hide();
        });
        //2.选中某个指标
        $('div[containerxy]', '#' + that.scopeID).find('.indicatorItems').click(function (e) {
            var $target = $(e.target);
            if (e.target.nodeName == 'INPUT') {
                var indicator = $target.parents('.indicatorItems').attr('name');
                that.scatterData[indicator] = $target.val();
                that.scatterData[indicator + 'Name'] = $target.siblings('label').text();
                $target.parents('.indicator').find('.indicatorBox > span').html(that.scatterData[indicator + 'Name']);
                $('.indicatorItems').hide();
                //请求数据，重新渲染
                var codeArr = [{}];
                var key = indicator == 'indicatorX' ? 0 : 1;
                codeArr[0][_this.settingObjCode[key]] = _this.scatterData[indicator];
                var sendObj = Object.assign(_super.prototype.transformInput.call(_this, that.settingObjCode[0].split('_')[0], codeArr), _super.prototype.transformInput.call(_this, 'oldValue', [that.oldValue[indicator]]));
                _super.prototype.onChange.call(_this, that, sendObj);
                that.oldValue[indicator] = that.scatterData[indicator];
            }
            e.stopPropagation();
        });
        //3.鼠标进入表格；
        $('.contentBox', '#' + that.scopeID).find('table').on('mouseenter', function (e) {
            $('.operator').hide();
            $(this).siblings('.operator').show();
        });
        //4.鼠标离开
        $('.contentBox', '#' + that.scopeID).find('.tableBox').on('mouseleave', function (e) {
            $(this).find('.operator').hide();
        });
        //5.table展开、收起切换
        $('.contentBox', '#' + that.scopeID).find('.toggleOpen').on('click', function (e) {
            var index = 0;
            var tableData = null;
            if ($(this).hasClass('open')) {
                $('.tableBox', '#' + that.scopeID).find('.toggleOpen').removeClass('close');
                $('.tableBox', '#' + that.scopeID).hide();
                $(this).parents('.tableBox').show();
                $(this).removeClass('open').addClass('close');
                //重新渲染当前表格全部数据
                index = Number($(this).parents('.tableBox').find('table').attr('index'));
                tableData = that.tableData[index].data;
            }
            else {
                $(this).removeClass('close').addClass('open');
                $('.tableBox', '#' + that.scopeID).show();
                //重新渲染当前表格默认部分数据
                index = Number($(this).parents('.tableBox').find('table').attr('index'));
                tableData = that.tableData[index].data.slice(0, 5);
            }
            that.renderTbody(tableData, $(this).parents('.tableBox').find('table'));
            // e.stopPropagation();    
        });
        //6.点击数据排序
        $('.contentBox', '#' + that.scopeID).find('.sortable').on('click', function (e) {
            var $table = $(this).parents('table');
            var index = 0;
            var tableData = null;
            var $this = $(this);
            if ($table.siblings('.operator').find('.toggleOpen').hasClass('open')) {
                index = Number($table.attr('index'));
                tableData = that.tableData[index].data.slice(0, 5);
            }
            else {
                index = Number($table.attr('index'));
                tableData = that.tableData[index].data.slice(0);
            }
            //排序
            if ($(this).hasClass('sorted')) {
                //降序
                tableData.sort(function (a, b) {
                    return b[that.scatterData[$this.attr('colName')]] - a[that.scatterData[$this.attr('colName')]];
                });
                $(this).removeClass('sorted');
            }
            else {
                //升序
                tableData.sort(function (a, b) {
                    return a[that.scatterData[$this.attr('colName')]] - b[that.scatterData[$this.attr('colName')]];
                });
                $(this).addClass('sorted');
            }
            that.renderTbody(tableData, $table);
        });
    };
    return ScatterComponent;
}(base_component_1.BaseComponent));
exports.ScatterComponent = ScatterComponent;
//# sourceMappingURL=scatter.component.js.map