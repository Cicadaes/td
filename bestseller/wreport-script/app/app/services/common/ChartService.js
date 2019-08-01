'use strict';

angular.module('wreport.app').factory('ChartService', function (Restangular) {
    return {

        getColorList: function(color){
            var colorList = [color, '#72cb68',
                '#f7a33d','#e77345',
                '#9280eb','#26bc92',
                '#f0e53d', '#d6aa27',
                '#aa71bf', '#dfa2d8'];
            return colorList;
        },

        prepareChartMultiOption: function (constants, projectNameMap, data, dataType, color) {
            if (data.length == 0) {
                return;
            }

            var legendList = [];
            var seriesList = [];
            var x_name = [];
            var x_name2 = {};


            var valueList = data[0].values;
            for (var k = 0; k < valueList.length; k++) {
                var obj = valueList[k];
                x_name.push(obj.date.substr(5, 5));
                x_name2[k] = obj.date;
            }

            for (var i = 0; i < data.length; i++) {
                var tmpProjectId = data[i].projectId;
                var tmpValueList = data[i].values;

                legendList.push({
                    name: projectNameMap[tmpProjectId],
                    icon: 'roundRect'
                });

                var new1 = [];
                for (var j = 0; j < tmpValueList.length; j++) {
                    var obj2 = tmpValueList[j];
                    new1.push(obj2.value);
                }

                var series_obj = {
                    name: projectNameMap[tmpProjectId],
                    type: 'line',
                    data: new1,
                };

                seriesList.push(series_obj);

            }

            var colorList = this.getColorList(color);

            var colorMap = {};
            for (var l in legendList) {
                colorMap[legendList[l].name] = colorList[l];
            }


            var formatter = function (params) {
                var index = params[0].dataIndex;
                var detail_line = '';
                for (var i = 0; i < params.length; i++) {
                    var obj = params[i];
                    var tmpValue = obj.value;
                    if (dataType == "5") {
                        tmpValue = (obj.value * 100).toFixed(2) + ' %';
                    } else if (dataType == "2" || dataType == "4") {
                        tmpValue = obj.value;
                    }

                    detail_line += '<p><span class="icon_square roomPare" style="background-color:' + colorMap[params[i].seriesName] + '"></span><b class="robe_red">' + tmpValue + '</b><em>' + params[i].seriesName + '</em></p>';
                }

                var res = '<div class="robe_mud_1" >'
                    + '<div class="robe_mud_con">'
                    + '<div class="robe_mud_top"><b>' + x_name2[index] + '</b>' + constants.label_period + '</div>'
                    + '<div class="robe_mud_traffic">'
                    + detail_line
                    + '<ul>'
                    + '<li></li>'
                    + '</ul>'
                    + '</div>'
                    + '</div>'
                    + '<ul>'
                    + '<li></li>'
                    + '</ul>'
                    + '</div>'
                    + '</div>'
                    + '</div>';
                return res;
            };

            var option = chartOptionUtil.getChartMultiOption(x_name, legendList, seriesList, colorList, formatter);
            return option;
        },

        prepareChartStroeSensor: function (constants, x_name, seriesData_1, seriesData_2,effectiveName,totalName,color) {  // 查看店铺探针详情

            var formatter = function (params, ticket, callback) {
                var index = params[0].dataIndex;

                var res = '<div class="robe_mud_1">'
                    + '<div class="robe_mud_con">'
                    + '<div class="robe_mud_top"><b>' + x_name[index] + '</b>' + constants.label_period + '</div>'
                    + '<div class="robe_mud_traffic">'
                    + '<div class="tmp2">'
                    + '<ul>'
                    + '<li><b>' + seriesData_1[index] + '</b><em>' + effectiveName + '</em><span class="icon_square color_rose"></span></li>'
                    + '<li><b>' + seriesData_2[index] + '</b><em>' + totalName + '</em><span class="icon_square color_pink"></span></li>'
                    + '</ul>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>';
                callback(ticket, res);
                return res;

            };

            var option = chartOptionUtil.getChartStroeSensor(x_name, seriesData_1, seriesData_2,effectiveName,totalName, formatter,color);

            return option;
        },

        prepareChartSingleOption: function (constants, legendName, data, dataKeys, color) {
            var x_name = [];
            var legendData = [];

            for (var i = 0; i < data.list.length; i++) {
                var self = data.list[i];
                x_name.push(self.date.substr(5, 5));
                var enterRoom = 0;

                enterRoom = self[dataKeys];
                legendData.push(enterRoom);
            }

            var lrrKeyMap = {};
            var lrrValueMap = {};
            for (var k in data.beforeList) {
                if (!data.beforeList.hasOwnProperty(k)) {
                    continue;
                }
                var obj = data.beforeList[k];
                lrrKeyMap[k] = obj.date;
                lrrValueMap[k] = obj[dataKeys];
            }

            var curKeyMap = {};
            for (var k2 in data.list) {
                if (!data.list.hasOwnProperty(k2)) {
                    continue;
                }
                var obj2 = data.list[k2];
                curKeyMap[k2] = obj2.date;
            }

            var formatter = function (params, ticket, callback) {
                var index = params[0].dataIndex;

                var res = '<div class="robe_mud_1">'
                    + '<div class="robe_mud_con">'
                    + '<div class="robe_mud_top"><b>' + curKeyMap[index] + '</b>' + constants.label_period + '</div>'
                    + '<div class="robe_mud_traffic">'
                    + '<p><b class="robe_red">' + params[0].data + '</b><em>' + params[0].seriesName + '</em></p>'
                    + '<ul>'
                    + '<li></li>'
                    + '</ul>'
                    + '</div>'
                    + '</div>'
                    + '<div class="robe_mud_con">'
                    + '<div class="robe_mud_top"><b>' + lrrKeyMap[index] + '</b><em>' + constants.label_cycle + '</em></div>'
                    + '<div class="robe_mud_traffic">'
                    + '<p><b>' + lrrValueMap[index] + '</b><em>' + constants.label_cycle + constants.label_space + params[0].seriesName + '</em></p>'
                    + '<ul>'
                    + '<li></li>'
                    + '</ul>'
                    + '</div>'
                    + '</div>'
                    + '</div>';
                callback(ticket, res);
                return res;
            };

            var option = chartOptionUtil.getChartSingleOption(legendName, x_name, legendData, color, formatter);

            return option;
        },

        prepareChartDoubleOption: function (constants, _title, data, dataKeys, color) {

            var legendName_1 = constants.label_new_flow;
            var legendName_2 = constants.label_old_flow;

            // 整理数据
            var x_name = [];
            var legendData_1 = [];
            var legendData_2 = [];

            for (var i = 0; i < data.list.length; i++) {
                var self = data.list[i];
                x_name.push(self.date.substr(5, 5));
                legendData_1.push(self[dataKeys.newkey]);
                legendData_2.push(self[dataKeys.oldkey]);
            }

            var lrrKeyMap = {};
            var lrrValueMap = {};
            var lrrValueMapSeries_1 = {};
            var lrrValueMapSeries_2 = {};
            for (var k in data.beforeList) {
                if (!data.beforeList.hasOwnProperty(k)) {
                    continue;
                }
                var obj = data.beforeList[k];
                lrrKeyMap[k] = obj.date;
                lrrValueMapSeries_1[k] = obj[dataKeys.newkey];
                lrrValueMapSeries_2[k] = obj[dataKeys.oldkey];

                lrrValueMap[k] = obj[dataKeys.sumkey];
            }

            var curKeyMap = {};
            var curValueMap = {};
            for (var k2 in data.list) {
                if (!data.list.hasOwnProperty(k2)) {
                    continue;
                }
                var obj2 = data.list[k2];
                curKeyMap[k2] = obj2.date;
                curValueMap[k2] = obj2[dataKeys.sumkey];
            }

            var formatter = function (params, ticket, callback) {
                var index = params[0].dataIndex;

                var res = '<div class="robe_mud_1">'
                    + '<div class="robe_mud_con">'
                    + '<div class="robe_mud_top"><b>' + curKeyMap[index] + '</b>' + constants.label_period + '</div>'
                    + '<div class="robe_mud_traffic">'
                    + '<div class="tmp2">'
                    + '<p><b class="robe_red">' + curValueMap[index] + '</b><em>' + _title + '</em></p>'
                    + '<ul>'
                    + '<li class = "robe_mud_traffic_li" ><b>' + params[0].data + '</b><em>' + params[0].seriesName + '</em><span class="icon_square color_rose"></span></li>';
                if (params.length > 1) {
                    res += '<li class = "robe_mud_traffic_li" ><b>' + params[1].data + '</b><em>' + params[1].seriesName + '</em><span class="icon_square color_pink"></span></li>';
                }
                res += '</ul>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '<div class="robe_mud_con">'
                    + '<div class="robe_mud_top"><b>' + lrrKeyMap[index] + '</b><em>' + constants.label_cycle + '</em></div>'
                    + '<div class="robe_mud_traffic">'
                    + '<div class="tmp2">'
                    + '<p><b>' + lrrValueMap[index] + '</b><em>' + constants.label_cycle + constants.label_space + _title + '</em></p>'
                    + '<ul>'
                    + '<li class = "robe_mud_traffic_li" ><b>' + lrrValueMapSeries_1[index] + '</b><em>' + constants.label_cycle + constants.label_space + params[0].seriesName + '</em><span class="icon_square color_red"></span></li>';
                if (params.length > 1) {
                    res += '<li class = "robe_mud_traffic_li"  ><b>' + lrrValueMapSeries_2[index] + '</b><em>' + constants.label_cycle + constants.label_space + params[1].seriesName + '</em><span class="icon_square color_gray"></span></li>';
                }
                res += '</ul>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>';
                callback(ticket, res);
                return res;
            };

            var option = chartOptionUtil.getChartDoubleOption(legendName_1, legendName_2, x_name, legendData_1, legendData_2, color, formatter);

            return option;
        },

        //新建和查看交叉分析
        prepareMonthSalesOption: function (constants, legendList, seriesList, name_index_map, data_time, x, y, color, titName, max_x, min_x, max_y, min_y,one) {
            //指标对比图表2，月度销售·客流
            var yName = one.yaxis;
            var xName = "";
            (one.xaxis == "stay")?xName = constants.tab_stay_passenger_flow:xName = constants.tab_active_passenger_flow;

            var nameObj = [];
            var newSeriesList = [];
            var nameArr = name_index_map[legendList[0]]
            for (var i = 0; i < nameArr.length; i++) {
                var obj = {};
                obj["icon"] = "roundRect";
                obj["name"] = nameArr[i];
                nameObj.push(obj)
            }
            var seriesListData = seriesList[0].data;
            for (var j = 0; j < seriesListData.length; j++) {
                var obj2 = {};
                var data1 = [];
                data1.push(seriesListData[j])
                obj2["data"] = data1;
                obj2["name"] = nameArr[j];
                obj2["type"] = "scatter";
                newSeriesList.push(obj2)
            }

            var formatter = function (params, a, b, c) {
                var salesAmount = params.value[1];
                var salesAmount1 = salesAmount * 10;
                if (salesAmount1 >= 10000000) {
                    salesAmount1 = (salesAmount1 / 10000000).toFixed(1) + constants.company_million;
                } else {
                    salesAmount1 = (salesAmount1 / 10).toFixed(1);
                }
                var res = '<div class="robe_mud_1 robe_mud_1_">'
                    + '<div class="robe_mud_con">'
                    + '<div class="robe_mud_top"><b> </b>' + params.seriesName + '</div>'
                    + '<div class="robe_mud_traffic">'
                    + '<p><b class="robe_red" style = "margin-right: -1px;">' + data_time[legendList[0]][params.seriesIndex] + '</b><em>' + constants.label_time + '</em></p>'
                    + '<ul>'
                    + '<li><b style="margin-right: 0px;">' + params.value[0] + '</b><em>' + xName + '</em></li>'
                    + '<li><b style="margin-right: 0px;">' + salesAmount1 + '</b><em>' + yName + '</em></li>'
                    + '</ul>'
                    + '</div>'
                    + '</div>'
                    + '</div>';
                return res;
            };


            var option = chartOptionUtil.getMonthSalesOption(legendList, seriesList, name_index_map, data_time, x, y, color, titName, max_x, min_x, max_y, min_y,
                nameObj, newSeriesList, formatter,constants);
            return option;
        },

        //客流趋势右上 客流到访时段
        prepareCustomArriveTimeOption: function (constants, dataLine, new_data, count_all, color) {

            var title = constants.title_active_time_distribution + constants.label_space + constants.label_rate;

            var formatter = function (params, ticket, callback) {

                var value = 0;
                if (count_all > 0) {
                    value = (params[0].data / count_all * 100).toFixed(1);
                }
                var res = '<div class="robe_mud_1">'
                    + '<div class="robe_mud_con">'
                    + '<div class="robe_mud_top"><b>' + params[0].name + '</b>' + constants.label_time + '</div>'
                    + '<div class="robe_mud_traffic">'
                    + '<ul>'
                    + '<li><b>' + value + '%</b><em>' + title + '</em><span class="icon_square customArriveTimeOptionTooltip" ></span></li>'
                    + '</ul>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>';
                callback(ticket, res);
                return res;
            };

            var option = chartOptionUtil.getCustomArriveTimeOption(dataLine, new_data, count_all, color, formatter);
            return option;
        },

        // 到访深度右上图表
        prepareVisitDepthLaterOption: function (constants, dataLine, new_data, title, color) {

            var formatter = function (params, ticket, callback) {
                var res = '<div class="robe_mud_1">'
                    + '<div class="robe_mud_con">'
                    + '<div class="robe_mud_top"><b>' + params[0].name + '</b>' + constants.label_interval + '</div>'
                    + '<div class="robe_mud_traffic">'
                    + '<ul>'
                    + '<li><b>' + params[0].data + '</b><em>' + title + '</em><span class="icon_square lejicishu"></span></li>'
                    + '</ul>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>';
                callback(ticket, res);
                return res;
            };

            var option = chartOptionUtil.getVisitDepthLaterOption(dataLine, new_data, color, formatter);
            return option;
        },

        // 房店指标图表1，Top10房间
        prepareRoomTopFlowOption: function (constants, legendArray, x_name, seriesArray, dateMap, nameMap, width, chartTypeChange, color){


            if (color == undefined) {
                color = "#43A3FB";
            }
            var colorList = this.getColorList(color);
            var colorMap = {};
            for (var l in legendArray) {
                colorMap[legendArray[l]] = colorList[l];
            }
            var formatter = function (params, ticket, callback) {
                var count = 0;
                for (var j = 0; j < params.length; j++) {
                    count = count + parseInt(params[j].value);
                }
                var res = '<div class="robe_mud_1">'
                    + '<div class="robe_mud_con">'
                    + '<div class="robe_mud_top"><b>' + dateMap.get(params[0].name) + '</b>' + constants.label_period + '</div>'
                    + '<div class="robe_mud_traffic">'
                    + '<div class="tmp">'
                    + '<ul>';
                for (var i = 0; i < params.length; i++) {
                    var obj = params[i];

                    var tmpValue = obj.value;
                    if (chartTypeChange == 3 || chartTypeChange == 5) {
                        tmpValue = obj.value + ' %';
                    }
                    res = res
                        + '<li><b>' + tmpValue + '</b><em>' + nameMap[obj.seriesIndex] + '</em><span class="icon_square" style="background-color:' + colorMap[nameMap[obj.seriesIndex]] + '"></span></li>';
                }
                res = res
                    + '</ul>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>';
                callback(ticket, res);
                return res;
            };



            var option = chartOptionUtil.getRoomTopFlowOption(legendArray, x_name, seriesArray, nameMap, width, colorList, formatter);
            return option;
        },

        // 房店指标图表2，坪效指标
        prepareRoomTopEffictOption: function (constants, legendName, x_name, legendData, startDateVal, endDateVal, color) {

            var formatter = function (params, ticket, callback) {
                var obj = params[0];
                var res = '<div class="robe_mud_1">'
                    + '<div class="robe_mud_con">'
                    + '<div class="robe_mud_top"><b style="width: 150px;">' + startDateVal + "~" + endDateVal + '</b>' + constants.label_period + '</div>'
                    + '<div class="robe_mud_traffic">'
                    + '<p><b class="robe_red">' + obj.value + '</b><em>' + legendName + '</em></p>'
                    + '<ul>'
                    + '<li></li>'
                    + '</ul>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>';
                if (params[0].name == '') {
                    res = '';
                }
                callback(ticket, res);
                return res;
            };

            var option = chartOptionUtil.getRoomTopEffictOption(legendName, x_name, legendData, color, formatter);
            return option;
        },
    };
});

