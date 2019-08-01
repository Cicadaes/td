/**
 * Created by wangshouyun on 2017/3/9.
 */
"use strict";
var Utils = (function () {
    function Utils() {
    }
    Utils.changeData = function (sourceData, styleObj) {
        var newData = {};
        this.datasourceData = sourceData;
        for (var key in sourceData) {
            switch (key) {
                case 'pietype':
                    newData["series_0_data"] = sourceData;
                    newData["series_0_type"] = 'pie';
                    newData["legend_data"] = [];
                    var resData = [];
                    for (var i in sourceData) {
                        resData.push(sourceData[i].name);
                    }
                    newData["legend_data"] = resData;
                    newData["series_0_radius"] = styleObj['series_0_radius'];
                    newData["series_0_radius"] = styleObj['series_0_radius'];
                    newData["series_0_label_normal_formatter"] = styleObj['series_0_label_normal_formatter'];
                    newData["series_0_label_normal_textStyle_fontFamily"] = styleObj["series_0_label_normal_textStyle_fontFamily"];
                    break;
                case 'maptype':
                    newData["series_0_data"] = sourceData;
                    newData["series_0_type"] = 'map';
                    newData["series_0_mapType"] = 'china';
                    newData["legend_data"] = [];
                    var mapData = [];
                    for (var i in sourceData) {
                        mapData.push(sourceData[i].name);
                    }
                    newData["legend_data"] = mapData;
                    break;
                case 'linetype':
                    var res = [], resDate = [];
                    Utils.setArrData(Utils.changeArrData(sourceData), resDate, res);
                    newData["legend_data"] = [];
                    newData["xAxis_data"] = resDate;
                    newData["xAxis_axisLine_lineStyle_width"] = newData["yAxis_axisLine_lineStyle_width"] = 1;
                    for (var index in res) {
                        newData["legend_data_" + index + "_name"] = newData["series_" + index + "_name"] = res[index];
                        newData["legend_data_" + index + "_icon"] = "roundRect";
                        if (resDate.length == 1 || res.length == 1) {
                            newData["series_" + index + "_type"] = 'bar';
                        }
                        else {
                            newData["series_" + index + "_type"] = 'line';
                            newData["series_" + index + "_showSymbol"] = false;
                        }
                        var valArr = [];
                        for (var _i = 0, _a = Utils.changeArrData(sourceData); _i < _a.length; _i++) {
                            var item = _a[_i];
                            if (item.name == res[index]) {
                                valArr.push(item.value);
                            }
                        }
                        newData["series_" + index + "_data"] = valArr;
                    }
                    break;
                case 'lineBartype':
                    var resBar = [], resBarDate = [];
                    Utils.setArrData(Utils.changeArrData(sourceData.data), resBarDate, resBar);
                    newData["legend_data"] = [];
                    newData["xAxis_data"] = resBarDate;
                    newData["xAxis_axisLine_lineStyle_width"] = newData["yAxis_axisLine_lineStyle_width"] = 1;
                    for (var index in resBar) {
                        newData["legend_data_" + index + "_name"] = newData["series_" + index + "_name"] = resBar[index];
                        newData["legend_data_0_icon"] = "roundRect";
                        // newData[`legend_data_${index}_icon`]="rect"
                        newData["series_0_type"] = 'bar';
                        newData["series_0_name"] = 'percent';
                        newData["series_1_name"] = 'average_R';
                        newData["series_2_name"] = 'average_F';
                        newData["series_3_name"] = 'average_M';
                        newData["series_0_yAxisIndex"] = 1;
                        newData["series_" + index + "_type"] = 'line';
                        newData["series_" + index + "_showSymbol"] = false;
                        var valArr = [];
                        for (var _b = 0, _c = Utils.changeArrData(sourceData.data); _b < _c.length; _b++) {
                            var item = _c[_b];
                            if (item.name == resBar[index]) {
                                valArr.push(item.value);
                            }
                        }
                        newData["series_" + index + "_data"] = valArr;
                    }
                    break;
                case 'areatype':
                    var areares = [], arearesDate = [];
                    Utils.setArrData(Utils.changeArrData(sourceData), arearesDate, areares);
                    newData["legend_data"] = [];
                    newData["xAxis_data"] = arearesDate;
                    newData["xAxis_axisLine_lineStyle_width"] = newData["yAxis_axisLine_lineStyle_width"] = 1;
                    for (var index in areares) {
                        newData["legend_data_" + index + "_name"] = newData["series_" + index + "_name"] = areares[index];
                        newData["series_" + index + "_type"] = 'line';
                        newData["series_" + index + "_stack"] = '总量';
                        newData["series_" + index + "_areaStyle"] = {
                            normal: {
                                color: {
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                            offset: 0,
                                            color: 'rgba(45,140,240,0.60)'
                                        }, {
                                            offset: 1,
                                            color: 'rgba(45,140,240,0.05)'
                                        }],
                                }
                            }
                        };
                        newData["series_" + index + "_showSymbol"] = false;
                        var valArr = [];
                        for (var _d = 0, _e = Utils.changeArrData(sourceData); _d < _e.length; _d++) {
                            var item = _e[_d];
                            if (item.name == areares[index]) {
                                valArr.push(item.value);
                            }
                        }
                        newData["series_" + index + "_data"] = valArr;
                    }
                    break;
                case 'barype':
                    var barres = [], barresDate = [];
                    Utils.setArrData(Utils.changeArrData(sourceData), barresDate, barres);
                    newData["legend_data"] = [];
                    newData["xAxis_data"] = barresDate;
                    newData['xAxis_axisTick_alignWithLabel'] = true;
                    newData['xAxis_boundaryGap'] = true;
                    newData["xAxis_axisLine_lineStyle_width"] = newData["yAxis_axisLine_lineStyle_width"] = 1;
                    for (var index in barres) {
                        newData["legend_data_" + index + "_name"] = newData["series_" + index + "_name"] = barres[index];
                        newData["legend_data_" + index + "_icon"] = "roundRect";
                        newData["series_" + index + "_type"] = 'bar';
                        newData["series_" + (barres.length - 1) + "_barGap"] = "5%";
                        var valArr = [];
                        for (var _f = 0, _g = Utils.changeArrData(sourceData); _f < _g.length; _f++) {
                            var item = _g[_f];
                            if (item.name == barres[index]) {
                                valArr.push(item.value);
                            }
                        }
                        newData["series_" + index + "_data"] = valArr;
                    }
                    break;
                case 'striptype':
                    var stripres = [], stripresDate = [];
                    Utils.setArrData(Utils.changeArrData(sourceData), stripresDate, stripres);
                    newData["legend_data"] = [];
                    newData["yAxis_data"] = stripresDate;
                    newData['yAxis_boundaryGap'] = true;
                    newData["yAxis_axisTick_alignWithLabel"] = true;
                    newData["xAxis_axisLine_lineStyle_width"] = newData["yAxis_axisLine_lineStyle_width"] = 1;
                    for (var index in stripres) {
                        newData["legend_data_" + index + "_name"] = newData["series_" + index + "_name"] = stripres[index];
                        newData["series_" + index + "_type"] = 'bar';
                        newData["series_" + index + "_barGap"] = '5%';
                        var valArr = [];
                        for (var _h = 0, _j = Utils.changeArrData(sourceData); _h < _j.length; _h++) {
                            var item = _j[_h];
                            if (item.name == stripres[index]) {
                                valArr.push(item.value);
                            }
                        }
                        newData["series_" + index + "_data"] = valArr;
                    }
                    break;
            }
        }
        return newData;
    };
    Utils.isRepeat = function (sourceArr, value) {
        for (var _i = 0, sourceArr_1 = sourceArr; _i < sourceArr_1.length; _i++) {
            var item = sourceArr_1[_i];
            if (item == value) {
                return true;
            }
        }
        return false;
    };
    Utils.changeArrData = function (sourceData) {
        var _itemArray = [];
        for (var _i = 0, sourceData_1 = sourceData; _i < sourceData_1.length; _i++) {
            var item = sourceData_1[_i];
            for (var key in item) {
                if (key.indexOf('name') >= 0) {
                    _itemArray = sourceData;
                    break;
                }
                else {
                    if (key !== "date") {
                        _itemArray.push({
                            name: key,
                            value: item[key],
                            date: item.date
                        });
                    }
                }
            }
        }
        return _itemArray;
    };
    Utils.setArrData = function (_itemArray, resDateArr, resArr) {
        for (var i = 0, j = _itemArray.length; i < j; i++) {
            if (!Utils.isRepeat(resDateArr, _itemArray[i].date)) {
                resDateArr.push(_itemArray[i].date);
            }
            if (!Utils.isRepeat(resArr, _itemArray[i].name)) {
                resArr.push(_itemArray[i].name);
            }
        }
    };
    // y轴最大值
    Utils.MaxData = function (sourceD) {
        var arrDa = [];
        var max = 0;
        for (var key in sourceD) {
            arrDa.push(sourceD[key].value);
        }
        for (var i = 0; i < arrDa.length; i++) {
            if (arrDa[i] > arrDa[max])
                max = i;
        }
        return arrDa[max];
    };
    Utils.DightNumber = function (data) {
        if (data != undefined) {
            var dightLength = JSON.stringify(data).split('');
            data = Math.ceil(data / Math.pow(10, (dightLength.length - 1))) * Math.pow(10, (dightLength.length - 1));
        }
        return data;
    };
    Utils.dataSorceStyle = function (sourceStyle, sourceData) {
        var newStyle = {};
        for (var key in sourceStyle) {
            switch (key) {
                case 'series_0_showSymbol':
                    var res = [];
                    for (var i = 0, j = sourceData.length; i < j; i++) {
                        if (!Utils.isRepeat(res, sourceData[i].name)) {
                            res.push(sourceData[i].name);
                        }
                    }
                    for (var index in res) {
                        newStyle["series_" + index + "_showSymbol"] = sourceStyle["series_0_showSymbol"];
                    }
                    break;
                case 'series_0_label_normal_show':
                    var resshow = [];
                    for (var i = 0, j = sourceData.length; i < j; i++) {
                        if (!Utils.isRepeat(resshow, sourceData[i].name)) {
                            resshow.push(sourceData[i].name);
                        }
                    }
                    for (var index in resshow) {
                        newStyle["series_" + index + "_label_normal_show"] = sourceStyle["series_0_label_normal_show"];
                    }
                    break;
                case 'series_0_lineStyle_normal_width':
                    var reswidth = [];
                    for (var i = 0, j = sourceData.length; i < j; i++) {
                        if (!Utils.isRepeat(reswidth, sourceData[i].name)) {
                            reswidth.push(sourceData[i].name);
                        }
                    }
                    for (var index in reswidth) {
                        newStyle["series_" + index + "_lineStyle_normal_width"] = sourceStyle["series_0_lineStyle_normal_width"];
                    }
                    break;
            }
        }
        return newStyle;
    };
    Utils.changeTitleSite = function (style, container) {
        for (var key in style) {
            switch (key) {
                case 'title_left':
                    if (style.title_left == "left") {
                        container.textAlign = "left";
                    }
                    break;
                case 'title_right':
                    if (style.title_right == "right") {
                        container.textAlign = "right";
                    }
                    break;
                case 'title_center':
                    if (style.title_center == "center") {
                        container.textAlign = "center";
                    }
                    break;
            }
        }
    };
    Utils.changeValueSite = function (style, container) {
        for (var key in style) {
            switch (key) {
                case 'value_left':
                    if (style.value_left == "left") {
                        container.textAlign = "left";
                    }
                    break;
                case 'value_right':
                    if (style.value_right == "right") {
                        container.textAlign = "right";
                    }
                    break;
                case 'value_center':
                    if (style.value_center == "center") {
                        container.textAlign = "center";
                    }
                    break;
            }
        }
    };
    Utils.addStyle = function (sourceStyle) {
        for (var key in sourceStyle) {
            switch (key) {
                case 'legend_left':
                    sourceStyle['legend_show'] = true;
                    sourceStyle['legend_top'] = "center";
                    sourceStyle['legend_left'] = "right";
                    sourceStyle['legend_orient'] = "vertical";
                    break;
                case 'legend_top':
                    sourceStyle['legend_show'] = true;
                    sourceStyle['legend_top'] = "top";
                    sourceStyle['legend_left'] = "center";
                    sourceStyle['legend_orient'] = "horizontal";
                    break;
                case 'legend_bottom':
                    sourceStyle['legend_show'] = true;
                    sourceStyle['legend_top'] = "bottom";
                    sourceStyle['legend_left'] = "center";
                    sourceStyle['legend_orient'] = "horizontal";
                    break;
                case 'series_0_radius':
                    sourceStyle['series_0_radius'] = [sourceStyle[key] + '%', '75%'];
                    break;
                case 'xAxis_splitLine_lineStyle_color':
                    sourceStyle['yAxis_splitLine_lineStyle_color'] = sourceStyle['xAxis_splitLine_lineStyle_color'];
                    break;
                case 'xAxis_axisLine_lineStyle_color':
                    sourceStyle['yAxis_axisLine_lineStyle_color'] = sourceStyle['xAxis_axisLine_lineStyle_color'];
                    break;
                case 'series_0_showSymbol':
                    var showSymbolStyle = this.dataSorceStyle(sourceStyle, this.datasourceData);
                    for (var key_1 in showSymbolStyle) {
                        if (key_1.indexOf('showSymbol') !== -1) {
                            sourceStyle[key_1] = sourceStyle['series_0_showSymbol'];
                        }
                    }
                    break;
                case 'series_0_label_normal_show':
                    var lineStyleStyle = this.dataSorceStyle(sourceStyle, this.datasourceData);
                    for (var key_2 in lineStyleStyle) {
                        if (key_2.indexOf('label_normal_show') !== -1) {
                            sourceStyle[key_2] = sourceStyle['series_0_label_normal_show'];
                        }
                    }
                    break;
                case 'series_0_lineStyle_normal_width':
                    var lineStyleWidth = this.dataSorceStyle(sourceStyle, this.datasourceData);
                    for (var key_3 in lineStyleWidth) {
                        if (key_3.indexOf('lineStyle_normal_width') !== -1) {
                            sourceStyle[key_3] = sourceStyle['series_0_lineStyle_normal_width'];
                        }
                    }
                    break;
                case 'series_0_label_normal_formatter':
                    if (sourceStyle['series_0_label_normal_formatter'].constructor == Object) {
                        sourceStyle['series_0_label_normal_formatter'] = sourceStyle['series_0_label_normal_formatter'].value;
                    }
                    break;
            }
        }
        return sourceStyle;
    };
    Utils.mergeSourceData = function (sourceData, targetData) {
        var sourceIndexArr = [], sourceKye, targetObj = targetData.series[0];
        this.getSeries(sourceData, sourceKye, sourceIndexArr);
        for (var _i = 0, _a = this.unique(sourceIndexArr); _i < _a.length; _i++) {
            var j = _a[_i];
            for (var t = 0; t < targetData.series.length; t++) {
                if (targetData.series[j] == undefined) {
                    targetData.series[j] = {};
                    targetData.series[j]['type'] = targetObj.type;
                }
            }
        }
    };
    Utils.unique = function (arr) {
        var result = [];
        for (var i = 0; i < arr.length; i++) {
            if (result.indexOf(arr[i]) == -1) {
                result.push(arr[i]);
            }
        }
        return result;
    };
    Utils.getSeries = function (arr, sourceKey, sourceIndexArr) {
        for (var key in arr) {
            if (key.indexOf('series') === 0) {
                sourceKey = key.split("_");
                sourceIndexArr.push(Number(sourceKey[1]));
            }
        }
    };
    Utils.clearSeariesData = function (sourceData, echartSeriesData) {
        var sourceIndexArr = [], sourceKye, targetObj = echartSeriesData[0];
        for (var j = echartSeriesData.length - 1; j >= 0; j--) {
            if (echartSeriesData[j] == undefined) {
                echartSeriesData[j] = {};
            }
            echartSeriesData[j]['type'] = targetObj.type;
            if (sourceData["series_" + j + "_name"] !== echartSeriesData[j].name) {
                echartSeriesData.splice(j, 1);
            }
        }
    };
    Utils.compareObj = function (sourceData, targetData) {
        var parseKeyString = function (key) {
            var keyArray = key.toString().split("_");
            var keyString = "";
            for (var _i = 0, keyArray_1 = keyArray; _i < keyArray_1.length; _i++) {
                var item = keyArray_1[_i];
                keyString += "['" + item + "']";
            }
            return keyString;
        };
        var parseKeyArray = function (key) {
            var keyArray = key.toString().split("_");
            var arr = [];
            for (var i = 0; i < keyArray.length; i++) {
                if (arr.length == 0) {
                    arr.push("['" + keyArray[i] + "']");
                }
                else {
                    arr.push(arr[i - 1] + "['" + keyArray[i] + "']");
                }
            }
            return arr;
        };
        var setEmptyByKeyArr = function (keyArray, data) {
            for (var index = 0; index < keyArray.length; index++) {
                var key = keyArray[index];
                var result = Function('data', "return " + "data" + key)(data);
                if (result == null) {
                    var reg = /(\[\'[0-9]+\'\])/;
                    if (index < keyArray.length - 1) {
                        var match = keyArray[index + 1].match(reg);
                        if (match && match[0].length + match.index == match.input.length) {
                            Function('data', 'value', "data" + key + "=" + "value")(data, []);
                        }
                        else {
                            Function('data', 'value', "data" + key + "=" + "value")(data, {});
                        }
                    }
                }
            }
        };
        var setDataByKey = function (key, value, data) {
            Function('data', 'value', "data" + key + "=" + "value")(data, value);
        };
        for (var key in sourceData) {
            //set empty vaule
            var keyArray = parseKeyArray(key);
            setEmptyByKeyArr(keyArray, targetData);
            //set data value
            var keyString = parseKeyString(key);
            setDataByKey(keyString, sourceData[key], targetData);
        }
        return targetData;
    };
    Utils.offsetPosition = function (el) {
        var _x = 0, _y = 0;
        while (el && !isNaN(el['offsetLeft']) && !isNaN(el['offsetTop'])) {
            _x += el['offsetLeft'] - el.scrollLeft;
            _y += el['offsetTop'] - el.scrollTop;
            el = el['offsetParent'];
        }
        return { top: _y, left: _x };
    };
    Utils.changeNumber = function (value) {
        var texts = '';
        var new_num = value;
        var istype = '';
        if (value > 9999) {
            if (value < 1e8) {
                new_num = (new_num / 1e4).toFixed(2).toString();
                istype = '万';
            }
            else if (value >= 1e8) {
                new_num = (new_num / 1e8).toFixed(2).toString();
                istype = '亿';
            }
        }
        texts = new_num + istype;
        return texts;
    };
    Utils.handleLifeCycleMap = function (data, type) {
        for (var key in Utils.lifeCycleMap) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var item = data_1[_i];
                if (Utils.lifeCycleMap[key] == item[type]) {
                    item[type] = key;
                }
            }
        }
        return data;
    };
    //数字加逗号
    Utils.parseFormatNum = function (number, n) {
        if (n != 0) {
            n = (n > 0 && n <= 20) ? n : 2;
        }
        number = parseFloat((number + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var sub_val = number.split(".")[0].split("").reverse();
        var sub_xs = number.split(".")[1];
        var show_html = "";
        for (var i = 0; i < sub_val.length; i++) {
            show_html += sub_val[i] + ((i + 1) % 3 == 0 && (i + 1) != sub_val.length ? "," : "");
        }
        if (n == 0) {
            return show_html.split("").reverse().join("");
        }
        else {
            return show_html.split("").reverse().join("") + "." + sub_xs;
        }
    };
    //转化时间
    Utils.changeDate = function (date, str, k) {
        var newDate = date.split(str).join(k);
        return newDate;
    };
    return Utils;
}());
Utils.datasourceData = [];
Utils.lifeCycleMap = {
    "注册期": "1",
    "新客户期": "2",
    "成长期": "3",
    "稳定期": "4",
    "休眠期": "5",
    "流失期": "6",
    "召回期": "7",
};
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map