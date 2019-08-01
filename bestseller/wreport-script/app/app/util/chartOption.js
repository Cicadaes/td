var chartOptionUtil = {
    // 客流趋势图表2，圆型饼图
    getOption_1: function (per1, per2, color, series_data_name_1, series_data_name_2) {
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{b}:&nbsp&nbsp&nbsp{d}%",
                backgroundColor: 'rgba(255,255,255,1)',
                borderColor: color,
                borderWidth: '1',
                textStyle: {
                    color: 'black',
                    decoration: 'none'
                }
            },
            grid: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            },
            series: [{
                name: 'series_1',
                type: 'pie',
                data: [{
                    value: per1,
                    name: series_data_name_1
                }, {
                    value: per2,
                    name: series_data_name_2
                }],
                hoverAnimation: false,
                radius: ['85%', '100%'],
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                }
            }],
            color: [color, 'rgba(255,255,255,0)']
        };

        return option;
    },

    getChartSingleOption: function (legendName, x_name, legendData, color, formatter) {
        //客流趋势单维度图表，停留率
        var option = {
            legend: {
                data: [{
                    name: legendName,
                    icon: 'roundRect'
                }],
                align: 'right',
                right: 0
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: "rgba(255,255,255,0)",
                textStyle: {
                    color: '#444',
                    fontSize: 12
                },
                formatter: formatter
            },
            xAxis: {
                type: 'category',
                data: x_name,
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dotted',
                        color: '#dbe1e5'
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true
                }
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dotted',
                        color: '#dbe1e5'
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true
                }
            },
            grid: {
                left: 70,
                right: 30,
                top: 50,
                bottom: 50
            },
            series: [{
                name: legendName,
                type: 'line',
                data: legendData,
                stack: 'group_1',
                areaStyle: {
                    normal: {
                        color: color
                    }
                },
                symbol: 'circle',
                symbolSize: 5,
                showAllSymbol: false,
                itemStyle: {
                    normal: {
                        color: color
                    }
                }
            }]
        };
        return option;
    },

    getChartDoubleOption: function (legendName_1, legendName_2, x_name, legendData_1, legendData_2, color, formatter) {
        //客流趋势，带新老客折线图表

        var color2 = '';
        if (color == "#02aea2") {
            color2 = "#7bd7ce";
        } else if (color == "#43A3FB") {
            color2 = "rgba(124,192,255,1)";
        }
        var option = {
            legend: {
                data: [{
                    name: legendName_1,
                    icon: 'roundRect'
                }, {
                    name: legendName_2,
                    icon: 'roundRect'
                }],
                align: 'right',
                right: 0
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: "rgba(255,255,255,0)",
                textStyle: {
                    color: '#444',
                    fontSize: 12
                },
                formatter: formatter
            },
            xAxis: {
                type: 'category',
                data: x_name,
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dotted',
                        color: '#dbe1e5'
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true
                }
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dotted',
                        color: '#dbe1e5'
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true
                }
            },
            grid: {
                left: 80,
                right: 30,
                top: 50,
                bottom: 50
            },
            series: [{
                name: legendName_1,
                type: 'line',
                data: legendData_1,
                stack: 'group_1',
                areaStyle: {
                    normal: {
                        color: color
                    }
                },
                symbol: 'circle',
                symbolSize: 5,
                showAllSymbol: false,
                itemStyle: {
                    normal: {
                        color: color
                    }
                }
            }, {
                name: legendName_2,
                type: 'line',
                data: legendData_2,
                stack: 'group_1',  // 堆叠图的不堆叠设置
                areaStyle: {
                    normal: {
                        color: color2
                    }
                },
                symbol: 'circle',
                symbolSize: 5,
                showAllSymbol: false,
                itemStyle: {
                    normal: {
                        color: color2
                    }
                }
            }]
        };

        return option;
    },

    getChartMultiOption: function (x_name, legendList, seriesList, colorList, formatter) {
        //指标对比图表1，客流指标
        var option = {
            color: colorList,
            legend: {
                data: legendList,
                align: 'right',
                right: 0,
                width: '100%'
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'auto',
                textStyle: {
                    color: '#444',
                    fontSize: 12
                },
                axisPointer: {
                    type: 'line',
                    lineStyle: {          // 直线指示器样式设置
                        color: '#444'
                    }
                },
                formatter: formatter
            },
            xAxis: {
                type: 'category',
                data: x_name,
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dotted',
                        color: '#dbe1e5'
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true
                }
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dotted',
                        color: '#dbe1e5'
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true
                }
            },
            grid: {
                // left: 0,
                right: 0,
                top: 80
                // bottom: 0
            },
            series: seriesList
        };
        return option;
    },

    getMonthSalesOption: function (legendList, seriesList, name_index_map, data_time, x, y, color, titName, max_x, min_x, max_y, min_y,
                                   nameObj, newSeriesList, formatter,constants) {

        var option = {
            legend: {
                data: newSeriesList,
                right: '3%',
                top: '13%',
                width: '80%'
            },
            title: {
                top: '5%',
                left: '2%',
                text: titName
            },
            grid: {
                left: '8%',
                right: '15%',
                top: '22%',
                bottom: '10%'
                //containLabel: true
            },
            tooltip: {
                backgroundColor: "#FFF",
                formatter: formatter
            },
            xAxis: [
                {
                    type: 'value',
                    scale: true,
                    min: min_x,
                    max: max_x,
                    // minInterval:1,
                    splitNumber: 10,
                    left: '8%',
                    boundaryGap: ['0%', '20%'],
                    axisLabel: {
                        formatter: '{value}' + constants.label_space + constants.company_person,
                        textStyle: {
                            color: function (val) {
                                return '#7f8b9c';
                            }
                        }
                        //margin:20,
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dotted',
                            color: '#7f8b9c'
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    name: x,
                    top: 90,
                    nameTextStyle: {
                        color: "#7f8b9c",
                        fontSize: 15
                    },
                    nameGap: 10
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    min: min_y,
                    max: max_y,
                    //minInterval:1,
                    splitNumber: 9,
                    axisLabel: {
                        formatter: '{value}' + constants.label_space + constants.company_rmb,
                        textStyle: {
                            color: function (val) {
                                return '#7f8b9c';
                            }
                        }
                        //margin:20,

                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dotted',
                            color: '#7f8b9c'//dbe1e5
                        }
                    },
                    name: y,
                    nameTextStyle: {
                        color: "#7f8b9c",
                        fontSize: 15
                    },
                    nameGap: 33
                }
            ],
            series: newSeriesList

        };
        return option;
    },
    //===========================================

    getCustomArriveTimeOption: function (dataLine, new_data, count_all, color, formatter) {
        //客流趋势右上图表，客流到访时段
        var option = {

            tooltip: {
                trigger: 'axis',
                backgroundColor: "rgba(255,255,255,0)",
                textStyle: {
                    color: '#444',
                    fontSize: 12
                },
                formatter: formatter
            },
            xAxis: {
                type: 'category',
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                data: dataLine
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            },
            grid: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            },
            series: [{
                name: 'series_1',
                type: 'line',
                data: new_data,
                symbol: 'circle',
                symbolSize: 8,
                showAllSymbol: true,
                itemStyle: {
                    normal: {
                        //color : '#5F92E1'
                        color: color
                    }
                }
            }]

        };
        return option;
    },
    getVisitDepthLaterOption: function (dataLine, new_data, color, formatter) {
        //到访深度右上图表，项目类型为6,7,8,9
        var option = {

            tooltip: {
                trigger: 'axis',
                backgroundColor: "rgba(255,255,255,0)",
                textStyle: {
                    color: '#444',
                    fontSize: 12
                },
                formatter: formatter
            },
            grid: {
                left: '40',
                right: '40',
                bottom: '20',
                top: '20',
                containLabel: true
            },
            yAxis: {
                type: 'category',
                splitLine: {
                    show: false
                },
                axisLine: {
                    // show : false
                },
                axisTick: {
                    show: false,
                    alignWithLabel: true
                },
                axisLabel: {
                    // show : false
                },
                data: dataLine
            },
            xAxis: {
                type: 'value'
            },
            series: [{
                name: 'series_1',
                type: 'bar',
                barWidth: '20',
                data: new_data,
                // symbol : 'circle',
                // symbolSize : 8,
                // showAllSymbol : true,
                itemStyle: {
                    normal: {
                        color: color
                    }
                }
            }]

        };
        return option;
    },

    //===========================================

    getCustomDistOption: function (yAxis, series_1, series_2, series_3, series_4) {
        //竞品概览图表1，客群辐射分布
        var option = {
            color: ['#89ce25', '#f8d249', '#f9a44a', '#44a4fb'],
            title: {
                //text: title,
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['    <1km', '    1-3km', '    3-5km', '    >5km'],
                top: '30%',
                right: '4%',
                orient: 'vertical',
                itemGap: 30,
                itemWidth: 18,
                itemHeight: 18,
                align: 'left',
                icon: 'stack'

            },
            grid: {
                left: '-3%',
                right: '15%',
                bottom: '3%',
                containLabel: true,
                x: 1

            },
            xAxis: {
                // type: 'value'

                type: 'value',
                max: 100,
                interval: 10,
                min: 0,
                position: 'top',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}%',
                    textStyle: {
                        color: function (val) {
                            return '#83888e';
                        }
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#a7acb2'
                    }
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        width: 2,
                        color: '#e0e1e3'
                    }
                }
            },
            yAxis: {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#e0e1e3',
                        type: 'solid',
                        width: 2
                    }
                },
                nameLocation: 'start',
                axisLabel: {
                    margin: 110,
                    formatter: function (value) {
                        if (!value) {
                            value = '';
                        }
                        if (value.length > 5) {
                            value = value.substring(0, 5) + "...";
                        } else if (value.length == 4) {
                            value = value + "      ";
                        } else if (value.length == 3) {
                            value = value + "         ";
                        } else if (value.length == 2) {
                            value = value + "            ";
                        }

                        return value;
                    },
                    textStyle: {
                        color: function (val) {
                            return '#818189';
                        },
                        fontSize: 13,
                        align: 'left'

                    }
                },
                data: yAxis
            },
            series: [
                {
                    name: '    <1km',
                    type: 'bar',
                    stack: 'group_1',
                    yAxisIndex: 0,
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight',
                            formatter: '{c}%'
                        }
                    },
                    symbol: 'emptyCircle',
                    barWidth: 30,  // 条格的宽度
                    barGap: '30%',
                    data: series_1
                },
                {
                    name: '    1-3km',
                    type: 'bar',
                    stack: 'group_1',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight',
                            formatter: '{c}%'
                        }
                    },
                    barWidth: 30,
                    barGap: '30%',
                    data: series_2
                },
                {
                    name: '    3-5km',
                    type: 'bar',
                    stack: 'group_1',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight',
                            formatter: '{c}%'
                        }
                    },
                    barWidth: 30,
                    barGap: '30%',
                    data: series_3
                },
                {
                    name: '    >5km',
                    type: 'bar',
                    stack: 'group_1',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight',
                            formatter: '{c}%'
                        }
                    },
                    barWidth: 30,
                    barGap: '30%',
                    data: series_4
                }
            ]

        };
        return option;
    },

    getRelativeIndexOption: function (legendName_1, legendName_2, x_name, legendData_1, legendData_2) {
        //竞品概览图表3，关联度指标
        var option = {

            color: ['#f9a44a', '#8ed122'],
            title: {},
            tooltip: {
                trigger: 'axis',
                formatter: '{c}%'
            },
            legend: {
                data: [legendName_1, legendName_2],
                top: '50%',
                right: '2%',
                orient: 'vertical',
                itemGap: 30,
                itemWidth: 18,
                itemHeight: 18,
                align: 'left',
                icon: 'stack'
            },
            grid: {
                left: '-1%',
                right: '15%',
                bottom: '7%',
                containLabel: true
            },
            calculable: true,
            yAxis: {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#e0e1e3',
                        type: 'solid',
                        width: 2
                    }
                },
                nameLocation: 'start',
                axisLabel: {
                    margin: 110,
                    formatter: function (value) {
                        if (!value) {
                            value = '';
                        }
                        if (value.length > 5) {
                            value = value.substring(0, 5) + "...";
                        } else if (value.length == 4) {
                            value = value + "      ";
                        } else if (value.length == 3) {
                            value = value + "         ";
                        } else if (value.length == 2) {
                            value = value + "            ";
                        }

                        return value;
                    },
                    textStyle: {
                        color: function (val) {
                            return '#818189';
                        },
                        fontSize: 13,
                        align: 'left'

                    }
                },
                data: x_name
            },
            xAxis: {
                type: 'value',
                max: 100,
                interval: 10,
                min: 0,
                position: 'top',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}%',
                    textStyle: {
                        color: function (val) {
                            return '#83888e';
                        }
                    }
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#a7acb2'
                    }
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        width: 2,
                        color: '#e0e1e3'
                    }
                }
            },
            series: [
                {
                    name: legendName_1,
                    type: 'bar',
//			            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                    data: legendData_1,
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight',
                            formatter: '{c}%'
                        }
                    },
                    barWidth: 10//柱图宽度
                },
                {
                    name: legendName_2,
                    type: 'bar',
//			            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                    data: legendData_2,
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight',
                            formatter: '{c}%'
                        }
                    },
                    barWidth: 10//柱图宽度
                }
            ]

        };
        return option;
    },
    //=======================================
    getPeoplePropertyOption: function (showval, hideval, color) {
        //客群画像，人口属性饼图
        var option = {
            color: [color, 'rgba(255,255,255,0)'],
            series: [{
                type: 'pie',
                radius: ['75%', '90%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [{
                    value: showval
                }, {
                    value: hideval
                }]
            }]

        };
        return option;
    },
    getPeopleExpenseOption: function (title, rarr, sum, color) {
        if (color == undefined) {
            color = "#43A3FB";
        }
        //客群画像，消费能力饼图
        var option = {

            tooltip: {
                show: true,
                formatter: "{b}:&nbsp&nbsp&nbsp{d}%",
                backgroundColor: 'rgba(255,255,255,1)',
                borderColor: '#43A3FB',
                borderWidth: '1',
                textStyle: {
                    color: 'black',
                    decoration: 'none'
                }
            },
            series: [{
                type: 'pie',
                name: title,
                radius: ['65%', '90%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                label: {
                    normal: {
                        // show: false,
                        // position: 'center',
                        formatter: function (obj) {
                            var label = obj.name + ' ' + '0%';
                            if (sum) {
                                label = obj.name + ' ' + (parseFloat(obj.value) / sum * 100).toFixed(2) + '%';
                            }
                            return label
                        }
                    }
                },
                labelLine: {
                    normal: {
                        // show: false
                    }
                },
                minAngle: 15,
                center: ['50%', '55%'],
                data: rarr
            }],
            color: [color, '#9860df', '#f9a449', '#f8d249', '#96d02e', '#abb5c3']

        };
        return option;
    },
    getPeopleAppOption: function (legendName, x_name, legendData, color) {
        //客群画像，应用偏好提升度，折线图
        if (color == undefined) {
            color = "#43A3FB";
        }
        var option = {

            backgroundColor: null,
            color: [color],
            title: {},
            tooltip: {
                trigger: 'item',
                formatter: "{b}:&nbsp&nbsp&nbsp{c}%",
                backgroundColor: 'rgba(255,255,255,1)',
                borderColor: '#43A3FB',
                borderWidth: '1',
                textStyle: {
                    color: 'black',
                    decoration: 'none'
                }
            },
            legend: {
                data: []
            },
            calculable: true,
            xAxis: [{
                axisLine: {
                    show: true,
                    onZero: true
                },
                axisLabel: {
                    rotate: 60,
                    interval: 0
                    // margin:-marginValue
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                type: 'category',
                boundaryGap: true,
                data: x_name
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {
                    formatter: function (value) {
                        return value + "%";
                    }

                }
            }],
            series: [{
                name: legendName,
                type: 'line',
                data: legendData
            }]

        };
        return option;
    },
    getPeopleRadarOption: function (x_name, legendData, perMap, color) {
        //客群画像，应用偏好覆盖率，雷达图
        if (color == undefined) {
            color = "#43A3FB";
        }
        var option = {

            radar: {
                // shape: 'circle',
                indicator: x_name
            },
            name: {
                formatter: function (a) {
                    return a + ' ' + (perMap[a] * 100).toFixed(2) + '%';
                },
                textStyle: {
                    color: '#333'
                }
            },
            series: [{
                name: 'series_1',
                type: 'radar',
                itemStyle: {
                    normal: {
                        color: color
                    }
                },
                lineStyle: {
                    normal: {
                        color: color
                    }
                },
                areaStyle: {
                    normal: {
                        color: color
                    }
                },
                data: [{
                    value: legendData,
                    name: 'group_1'
                }]
            }]

        };
        return option;
    },

    //====================================

    getRoomTopFlowOption: function (legendArray, x_name, seriesArray, nameMap, width, colorList, formatter) {

        //房店指标图表1，Top10房间
        var option = {
            color: colorList,
            tooltip: {
                trigger: 'axis',
                backgroundColor: "rgba(255,255,255,0)",
                textStyle: {
                    color: '#444',
                    fontSize: 12
                },
                formatter: formatter
            },
            legend: {
                data: legendArray,
                orient: 'vertical',
                // align:'left',
                left: 'left',
                top: 'middle'
            },
            grid: {
                left: width,
                right: '30',
                bottom: '20',
                top: '10',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                splitLine: {
                    show: false
                },
                axisLine: {
                    // show : false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    // show : false
                },
                boundaryGap: false,
                data: x_name
            },
            yAxis: {
                type: 'value'
            },
            series: seriesArray

        };
        return option;
    },
    getRoomTopEffictOption: function (legendName, x_name, legendData, color, formatter) {
        //房店指标图表2，坪效指标
        var option = {

            color: [color],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'line' // 默认为直线，可选为：'line' | 'shadow'
                },
                backgroundColor: "rgba(255,255,255,0)",
                textStyle: {
                    color: '#444',
                    fontSize: 12
                },
                formatter: formatter
            },
            grid: {
                left: '75',
                right: '30',
                bottom: '20',
                top: '10',
                containLabel: true
            },
            yAxis: [{
                type: 'category',
                splitLine: {
                    show: false
                },
                axisLine: {
                    // show : false
                },
                axisTick: {
                    show: false,
                    alignWithLabel: true
                },
                axisLabel: {
                    // show : false
                },
                data: x_name
            }],
            xAxis: [{
                type: 'value'
            }],
            series: [{
                name: legendName,
                type: 'bar',
                barWidth: '20',
                data: legendData,
                itemStyle: {
                    normal: {
                        color: color
                    }
                }
            }]

        };
        return option;
    },
    getChartStroeSensor: function (x_name, seriesData_1, seriesData_2, effectiveName, totalName, formatter, color) {
        var color2 = '';
        if (color == "#02aea2") {
            color2 = "#7bd7ce";
        } else if (color == "#43A3FB") {
            color2 = "rgba(124,192,255,1)";
        }
        var option = {
            legend: {
                data: [{
                    name: effectiveName,
                    icon: 'roundRect'
                }, {
                    name: totalName,
                    icon: 'roundRect'
                }],
                align: 'right',
                right: 0
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255,255,255,0)',
                textStyle: {
                    color: '#444',
                    fontSize: 12
                },
                formatter: formatter
            },
            xAxis: {
                type: 'category',
                data: x_name,
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dotted',
                        color: '#dbe1e5'
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true
                }
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dotted',
                        color: '#dbe1e5'
                    }
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: true
                }
            },
            grid: {
                top: 50,
                left: 60,
                right: 30,
                bottom: 20
            },
            series: [{
                name: effectiveName,
                type: 'line',
                data: seriesData_1,
                stack: 'group_1',
                areaStyle: {
                    normal: {
                        color: 'rgba(255,255,255,0)'
                    }
                },
                symbol: 'circle',
                symbolSize: 5,
                showAllSymbol: false,
                itemStyle: {
                    normal: {
                        color: color
                    }
                }
            }, {
                name: totalName,
                type: 'line',
                data: seriesData_2,
                stack: 'group_2',
                areaStyle: {
                    normal: {
                        color: 'rgba(255,255,255,0)'
                    }
                },
                symbol: 'circle',
                symbolSize: 5,
                showAllSymbol: false,
                itemStyle: {
                    normal: {
                        color: color2
                    }
                }
            }]
        };
        return option;
    }
};

