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
var base_chart_1 = require("../../base/base.chart");
var $ = require("jquery");
var dataSourceConfig_1 = require("../../../dataSourceConfig");
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
        _this.body = null;
        _this.projectName = '项目';
        _this.datasourceId = null;
        var template = new scatter_template_1.ScatterTemplate(_this.scopeID);
        //获得模板渲染后的节点
        _this.element = _this.render(template);
        _this.scatterData = new scatter_model_1.ScatterModel();
        // this.handleData(this.scatterData);
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
                min: _this.scatterData.xAxis_min,
                max: _this.scatterData.xAxis_max,
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
                min: _this.scatterData.yAxis_min,
                max: _this.scatterData.yAxis_max,
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
                    data: [],
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
                    data: [],
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
                    data: [],
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
                    data: [],
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
        this.init();
    };
    ScatterComponent.prototype.beforeDestory = function () {
    };
    ScatterComponent.prototype.afterDestory = function () {
    };
    // public settingChange(event:any,target:any): void{
    //拿到配置的指标重新渲染
    // this.renderContainerXY(target.settingObj.result,target.settingObj.code);
    // this.saveSettingObjCode(target.settingObj.code);
    // this.setDefaltIndicators();
    //绑定事件
    // this.eventBindHtml();
    // }
    //保存code
    // public saveSettingObjCode(code:any){       
    //     this.settingObjCode[code.charAt(code.length -1) -1] = code;
    // }
    ScatterComponent.prototype.getconfiginformation = function (event, changeObj) {
        if (!this.isEmptyObject(changeObj)) {
            //设置默认指标
            if (changeObj.result.nameType) {
                this.projectName = changeObj.result.nameType;
            }
            this.setDefaltIndicators(changeObj);
        }
        else {
            return;
        }
    };
    //buildBody
    ScatterComponent.prototype.buildbody = function (result) {
        this.body = dataSourceConfig_1.DataSourceConfig.getConfigByKey(result.dscKey);
        this.datasourceId = this.body.datasource_id;
        this.body["charUUID"] = this.scopeID;
        this.body["requestTitle"] = "scatter";
        return this.body;
    };
    ScatterComponent.prototype.getProjectName = function (filterArr) {
        for (var j = 0; j < filterArr.length; j++) {
            var filter = filterArr[j];
            if (filter['field'] == 'projectType') {
                return this.scatterData.projectInfo[filter['value']];
            }
        }
    };
    ScatterComponent.prototype.resize = function () {
        if (this.myChart)
            this.myChart.resize();
    };
    ScatterComponent.prototype.dataChange = function (data) {
        if (data && data.length > 0) {
            this.chartData = data;
            // var myChartData = this.myChart.getOption();       
            this.scatterData.data = data;
            $('div[containerScatter]', '#' + this.scopeID).show();
            $('div[containerNodata]', '#' + this.scopeID).hide();
            $(".quadrantRegion", '#' + this.scopeID).show();
            //处理data
            this.handleData(this.scatterData);
            this.scatterData.legend_data = this.echartData.legend.data = this.seriesName;
            var indicatorXName_1 = this.scatterData.indicatorXName;
            var indicatorYName_1 = this.scatterData.indicatorYName;
            var projectName_1 = this.projectName;
            this.echartData['tooltip']['formatter'] = function (obj) {
                var value = obj.value;
                var xValue = (value[0] + '').replace(/(\d{1,2})(?=(\d{3})+$)/g, '$1,');
                var yValue = (value[1] + '').replace(/(\d{1,2})(?=(\d{3})+$)/g, '$1,');
                return '品牌：' + obj.seriesName + '<br>' +
                    projectName_1 + '：' + value[2] + '<br>' +
                    indicatorXName_1 + '：' + xValue + '<br>' +
                    '排名：' + value[3] + '<br>' +
                    indicatorYName_1 + '：' + yValue + '<br>' +
                    '排名：' + value[4];
            };
            //重置图表配置的series
            var obj = {};
            $.extend(true, obj, this.echartData.series[0]);
            this.echartData.series = [];
            for (var i = 0; i < this.seriesData.length; i++) {
                this.echartData.series[i] = {};
                $.extend(true, this.echartData.series[i], obj);
                this.echartData.series[i].name = this.seriesName[i];
                this.echartData.series[i].data = this.seriesData[i];
                this.echartData.series[i]['itemStyle'].normal['color'] = this.scatterData.echart_color[i];
                this.echartData.series[i]['itemStyle'].normal['borderColor'] = this.scatterData.echart_color[i];
                this.echartData.series[i]['markLine']['data'][0].yAxis = this.averageY;
                this.echartData.series[i]['markLine']['data'][1].xAxis = this.averageX;
            }
            this.myChart = base_chart_1.BaseCharts.echarts.init(this.element.querySelector("div[containerScatter]"));
            // 清除图标缓存
            this.myChart.clear();
            //重新渲染象限图
            this.myChart.setOption(this.echartData);
            //重新渲染表格      
            this.renderTables(this.tableData, 5);
        }
        else {
            $(".quadrantRegion", '#' + this.scopeID).hide();
            $('div[containerScatter]', '#' + this.scopeID).hide();
            $('div[containerNodata]', '#' + this.scopeID).show();
            $('div[containerRight]', '#' + this.scopeID).empty();
        }
        //绑定事件
        this.eventBindHtml();
    };
    ScatterComponent.prototype.filterChange = function (event, data) {
        var dataNew = JSON.parse(JSON.stringify(data));
        if (!dataNew.datasource_id) {
            dataNew.datasource_id = this.datasourceId;
        }
        var tmpName = null;
        if (dataNew.filter && dataNew.filter.length > 0)
            tmpName = this.getProjectName(dataNew.filter);
        if (tmpName) {
            this.projectName = tmpName;
        }
        this.body = dataSourceConfig_1.DataSourceConfig.mergeBodyByFilter(this.body, dataNew);
        this.postChange(this.body);
    };
    ScatterComponent.prototype.postChange = function (postQuery) {
        var sendObj = Object.assign(_super.prototype.transformInput.call(this, 'scopeID', this.scopeID), _super.prototype.transformInput.call(this, 'result', postQuery));
        _super.prototype.onChange.call(this, this, sendObj);
    };
    ScatterComponent.prototype.styleChange = function (style) {
        // let changeStyle = Utils.addStyle(style);
        // Utils.mergeSourceData(changeStyle,this.echartData);
        // let newStyle = Utils.compareObj(changeStyle,this.echartData);
        // this.myChart.setOption(newStyle,true);
    };
    ScatterComponent.prototype.loadData = function () {
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
        //获取几个数列
        this.getSeriesInfo(this.scatterData);
        //数据分区
        this.tableData = this.assortDataToQuadrant(json);
        //数据排名
        this.rankData(json, this.tableData);
        //数据默认降序排列
        this.tableData.forEach(function (obj, index) {
            if (obj.data) {
                obj.data.sort(function (a, b) {
                    return b[json.indicatorX] - a[json.indicatorX];
                });
            }
        });
        //数据分类
        this.seriesData = this.makeDataToSeries(json, this.tableData);
    };
    //数据排名
    ScatterComponent.prototype.rankData = function (json, tableData) {
        if (tableData) {
            //X轴降序排名
            tableData.forEach(function (obj, index) {
                if (obj.data) {
                    obj.data.sort(function (a, b) {
                        return b[json.indicatorX] - a[json.indicatorX];
                    });
                }
            });
            tableData.forEach(function (obj, index) {
                if (obj.data) {
                    var rankX = 1;
                    for (var i = 0; i < obj.data.length; i++) {
                        if (i > 0 && obj.data[i][json.indicatorX] != obj.data[i - 1][json.indicatorX]) {
                            rankX = i + 1;
                        }
                        obj.data[i]['rankX'] = rankX;
                    }
                }
            });
            //Y轴降序排名
            tableData.forEach(function (obj, index) {
                if (obj.data) {
                    obj.data.sort(function (a, b) {
                        return b[json.indicatorY] - a[json.indicatorY];
                    });
                }
            });
            tableData.forEach(function (obj, index) {
                var rankY = 1;
                for (var j = 0; j < obj.data.length; j++) {
                    if (j > 0 && obj.data[j][json.indicatorY] != obj.data[j - 1][json.indicatorY]) {
                        rankY = j + 1;
                    }
                    obj.data[j]['rankY'] = rankY;
                }
            });
        }
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
            else if (obj[json.indicatorX] < that.averageX && obj[json.indicatorY] >= that.averageY) {
                //B区
                arr[1].data.push(obj);
            }
            else if (obj[json.indicatorX] <= that.averageX && obj[json.indicatorY] < that.averageY) {
                //C区
                arr[2].data.push(obj);
            }
            else if (obj[json.indicatorX] > that.averageX && obj[json.indicatorY] < that.averageY) {
                //D区
                arr[3].data.push(obj);
            }
        });
        return arr;
    };
    //数据分类
    ScatterComponent.prototype.makeDataToSeries = function (json, tableData) {
        var arr = [], seriesName = this.seriesName;
        for (var i = 0; i < seriesName.length; i++) {
            arr.push([]);
        }
        if (tableData) {
            tableData.forEach(function (obj) {
                if (obj.data) {
                    for (var j = 0; j < obj.data.length; j++) {
                        for (var i = 0; i < seriesName.length; i++) {
                            if (obj.data[j].brand == seriesName[i]) {
                                var infoArr = [];
                                infoArr[0] = obj.data[j][json.indicatorX];
                                infoArr[1] = obj.data[j][json.indicatorY];
                                infoArr[2] = obj.data[j]['project_name'];
                                infoArr[3] = obj.data[j]['rankX'];
                                infoArr[4] = obj.data[j]['rankY'];
                                arr[i].push(infoArr);
                            }
                        }
                    }
                }
            });
        }
        return arr;
    };
    ScatterComponent.prototype.init = function () {
        //渲染xy轴指标数据源
        this.renderContainerXY(this.scatterData.indicators, 'X');
        this.renderContainerXY(this.scatterData.indicators, 'Y');
        // 基于准备好的dom，初始化echarts实例
        // this.myChart = BaseCharts.echarts.init(this.element.querySelector("div[containerScatter]") as HTMLDivElement);
    };
    //渲染xy轴指标数据源
    ScatterComponent.prototype.renderContainerXY = function (data, code) {
        if (code == 'X') {
            var $container = $(this.element).find('div[name="indicatorX"]');
            $container.empty();
            this.renderListByArr($container, data, 'X');
        }
        else if (code == 'Y') {
            var $container = $(this.element).find('div[name="indicatorY"]');
            $container.empty();
            this.renderListByArr($container, data, 'Y');
        }
    };
    //根据给的数组及code渲染下拉列表面板
    ScatterComponent.prototype.renderListByArr = function (container, arr, str) {
        var html = '';
        for (var i = 0; i < arr.length; i++) {
            html += "<div class='itemBox'><span style='display:block'>" + arr[i].name + "</span><ul class='clrfix'>";
            for (var j = 0; j < arr[i].list.length; j++) {
                html += "<li class='fl'><input type='radio' id='" + arr[i].list[j].id + str + "' name='" + str + "' value='" + arr[i].list[j].id + "' /><label for='" + arr[i].list[j].id + str + "'>" + arr[i].list[j].name + "</label></li>";
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
                    if (indicator == 'indicatorX') {
                        sortable = '<span class="sortable sort_down" colName=' + indicator + '><i class="triangleUp"></i><i class="triangleDown"></i></span>';
                    }
                    else {
                        sortable = '<span class="sortable" colName=' + indicator + '><i class="triangleUp"></i><i class="triangleDown"></i></span>';
                    }
                }
                containerBox += '<th><div>' + data[i].head[j] + sortable + '</div></th>';
            }
            //生成tbody
            containerBox += '</tr></thead><tbody>';
            var index = 1;
            var rowCount = data[i].data.length > 5 ? defaulsCount : data[i].data.length;
            for (var k = 0; k < rowCount; k++) {
                //生成tr         
                containerBox += '<tr><td title="' + data[i].data[k]['project_name'] + '"><span>' + index + ' </span>' + data[i].data[k]['project_name'] + '</td><td>' + (data[i].data[k][this.scatterData.indicatorX]).toLocaleString() + '</td>' + '<td>' + (data[i].data[k][this.scatterData.indicatorY]).toLocaleString() + '</td></tr>';
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
            //生成tr和td
            tbody += '<tr><td title="' + data[k]['project_name'] + '"><span>' + index + ' </span>' + data[k]['project_name'] + '</td><td>' + (data[k][this.scatterData.indicatorX]).toLocaleString() + '</td><td>' + (data[k][this.scatterData.indicatorY]).toLocaleString() + '</td></tr>';
            index++;
        }
        $(table).find('tbody').eq(0).append(tbody);
    };
    //初始化XY轴指标
    ScatterComponent.prototype.setDefaltIndicators = function (changeObj) {
        var $inputX = $(this.element).find('div[name="indicatorX"]').find('#active_usersX');
        var $inputY = $(this.element).find('div[name="indicatorY"]').find('#sales_amountY');
        $inputX.prop('checked', true);
        $inputY.prop('checked', true);
        this.scatterData['indicatorXName'] = $inputX.siblings('label').text();
        this.settingObjCode[0] = this.scatterData['indicatorX'] = $inputX.val();
        $inputX.parents('.indicator').find('.indicatorBox > span').html(this.scatterData['indicatorXName']);
        this.scatterData['indicatorYName'] = $inputY.siblings('label').text();
        this.settingObjCode[1] = this.scatterData['indicatorY'] = $inputY.val();
        $inputY.parents('.indicator').find('.indicatorBox > span').html(this.scatterData['indicatorYName']);
        //当X、Y轴坐标都返回后触发onChange
        if (this.settingObjCode[0] && this.settingObjCode[1]) {
            // let codeArr = [{},{}];
            // codeArr[0][this.settingObjCode[0]] = this.scatterData['indicatorX'] + '[' +  this.scatterData['indicatorXName'] + ']';
            // codeArr[1][this.settingObjCode[1]] = this.scatterData['indicatorY'] + '[' +  this.scatterData['indicatorYName'] + ']';
            this.body = this.buildbody(changeObj.result);
            this.body['metrics'] = [
                { 'field': $inputX.val() },
                { 'field': $inputY.val() }
            ];
            if (changeObj.result && changeObj.result.readyBuildQuery) {
                this.postChange(this.body);
            }
        }
        // this.oldValue['indicatorX'] = $inputX.val();
        // this.oldValue['indicatorY'] = $inputY.val();
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
        $('div[containerxy] ', '#' + that.scopeID).find('.indicatorItems').click(function (e) {
            var $input = $(e.target).siblings('input');
            var indicator = $input.parents('.indicatorItems').attr('name');
            if (e.target.nodeName == 'LABEL' && that.scatterData[indicator] != $input.val()) {
                that.scatterData[indicator] = $input.val();
                that.scatterData[indicator + 'Name'] = $(e.target).text();
                $input.parents('.indicator').find('.indicatorBox > span').html(that.scatterData[indicator + 'Name']);
                $('.indicatorItems').hide();
                //请求数据，重新渲染
                //  let codeArr = [{}];
                var key = indicator == 'indicatorX' ? 0 : 1;
                //  codeArr[0][this.settingObjCode[key]] = this.scatterData[indicator] +'[' + that.scatterData[indicator+'Name'] + ']';               
                //  let sendObj:Object = Object.assign(
                //     super.transformInput(that.settingObjCode[0].split('_')[0],codeArr),
                //     super.transformInput('oldValue',[that.oldValue[indicator]])
                //  );
                that.body['metrics'][key]['field'] = $input.val();
                var sendObj = Object.assign(_super.prototype.transformInput.call(_this, 'scopeID', that.scopeID), _super.prototype.transformInput.call(_this, 'result', that.body));
                _super.prototype.onChange.call(_this, that, sendObj);
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
            if ($(this).hasClass('sort_down')) {
                //升序
                tableData.sort(function (a, b) {
                    return a[that.scatterData[$this.attr('colName')]] - b[that.scatterData[$this.attr('colName')]];
                });
                $table.find('.sortable').removeClass('sort_up').removeClass('sort_down');
                $(this).addClass('sort_up');
            }
            else {
                //降序
                tableData.sort(function (a, b) {
                    return b[that.scatterData[$this.attr('colName')]] - a[that.scatterData[$this.attr('colName')]];
                });
                $table.find('.sortable').removeClass('sort_up').removeClass('sort_down');
                $(this).addClass('sort_down');
            }
            that.renderTbody(tableData, $table);
        });
    };
    return ScatterComponent;
}(base_component_1.BaseComponent));
exports.ScatterComponent = ScatterComponent;
//# sourceMappingURL=scatter.component.js.map