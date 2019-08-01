/**
 * Created by wangshouyun on 2017/3/9.
 */

export class Utils {

    public static datasourceData: any = [];

    public static changeData(sourceData: any, styleObj: any): any {
        let newData = {}
        this.datasourceData = sourceData;
        for (let key in sourceData) {
            switch (key) {
                case 'pietype' :
                    newData[`series_0_data`] = sourceData;
                    newData[`series_0_type`] = 'pie';
                    newData[`legend_data`] = [];
                    let resData: any = []
                    for (let i in sourceData) {
                        resData.push(sourceData[i].name);
                    }
                    newData[`legend_data`] = resData;
                    newData[`series_0_radius`] = styleObj['series_0_radius']
                    newData[`series_0_radius`] = styleObj['series_0_radius']
                    newData[`series_0_label_normal_formatter`] = styleObj['series_0_label_normal_formatter']
                    newData[`series_0_label_normal_textStyle_fontFamily`] = styleObj[`series_0_label_normal_textStyle_fontFamily`];
                    break;
                case 'maptype' :
                    newData[`series_0_data`] = sourceData;
                    newData[`series_0_type`] = 'map';
                    newData[`series_0_mapType`] = 'china';
                    newData[`legend_data`] = [];
                    let mapData: any = [];
                    for (let i in sourceData) {
                        mapData.push(sourceData[i].name);
                    }
                    newData[`legend_data`] = mapData;
                    break;
                case 'linetype' : //折线图   
                    let res: any = [],
                        resDate: any = [];

                    Utils.setArrData(Utils.changeArrData(sourceData), resDate, res);

                    newData[`legend_data`] = [];
                    newData[`xAxis_data`] = resDate;
                    newData[`xAxis_axisLine_lineStyle_width`] = newData[`yAxis_axisLine_lineStyle_width`] = 1

                    for (let index in res) {
                        newData[`legend_data_${index}_name`] = newData[`series_${index}_name`] = res[index];
                        newData[`legend_data_${index}_icon`] = "roundRect";
                        if (resDate.length == 1 || res.length == 1) {
                            newData[`series_${index}_type`] = 'bar';
                        } else {
                            newData[`series_${index}_type`] = 'line';
                            newData[`series_${index}_showSymbol`] = false;
                        }
                        let valArr: any = [];
                        for (let item of Utils.changeArrData(sourceData)) {
                            if (item.name == res[index]) {
                                valArr.push(item.value);
                            }
                        }
                        newData[`series_${index}_data`] = valArr;
                    }
                    break;
                case 'lineBartype' ://柱状折线图
                    let resBar: any = [],
                        resBarDate: any = [];

                    Utils.setArrData(Utils.changeArrData(sourceData.data), resBarDate, resBar);

                    newData[`legend_data`] = [];
                    newData[`xAxis_data`] = resBarDate;
                    newData[`xAxis_axisLine_lineStyle_width`] = newData[`yAxis_axisLine_lineStyle_width`] = 1
                    for (let index in resBar) {
                        newData[`legend_data_${index}_name`] = newData[`series_${index}_name`] = resBar[index];
                        newData[`legend_data_0_icon`] = "roundRect"
                        // newData[`legend_data_${index}_icon`]="rect"
                        newData[`series_0_type`] = 'bar';
                        newData[`series_0_name`] = 'percent';
                        newData[`series_1_name`] = 'average_R';
                        newData[`series_2_name`] = 'average_F';
                        newData[`series_3_name`] = 'average_M';
                        newData[`series_0_yAxisIndex`] = 1;
                        newData[`series_${index}_type`] = 'line';
                        newData[`series_${index}_showSymbol`] = false;

                        let valArr: any = [];
                        for (let item of Utils.changeArrData(sourceData.data)) {
                            if (item.name == resBar[index]) {
                                valArr.push(item.value);
                            }
                        }
                        newData[`series_${index}_data`] = valArr;
                    }
                    break;
                case 'areatype' ://面积图
                    let areares: any = [],
                        arearesDate: any = [];

                    Utils.setArrData(Utils.changeArrData(sourceData), arearesDate, areares);

                    newData[`legend_data`] = [];
                    newData[`xAxis_data`] = arearesDate;
                    newData[`xAxis_axisLine_lineStyle_width`] = newData[`yAxis_axisLine_lineStyle_width`] = 1;

                    for (let index in areares) {
                        newData[`legend_data_${index}_name`] = newData[`series_${index}_name`] = areares[index];
                        newData[`series_${index}_type`] = 'line';
                        newData[`series_${index}_stack`] = '总量';
                        newData[`series_${index}_areaStyle`] = {
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
                        newData[`series_${index}_showSymbol`] = false;
                        let valArr: any = [];
                        for (let item of Utils.changeArrData(sourceData)) {
                            if (item.name == areares[index]) {
                                valArr.push(item.value);
                            }
                        }
                        newData[`series_${index}_data`] = valArr;
                    }
                    break;
                case 'barype' : //柱图

                    let barres: any = [],
                        barresDate: any = [];

                    Utils.setArrData(Utils.changeArrData(sourceData), barresDate, barres);

                    newData[`legend_data`] = [];
                    newData[`xAxis_data`] = barresDate;
                    newData['xAxis_axisTick_alignWithLabel'] = true;
                    newData['xAxis_boundaryGap'] = true;
                    newData[`xAxis_axisLine_lineStyle_width`] = newData[`yAxis_axisLine_lineStyle_width`] = 1;

                    for (let index in barres) {
                        newData[`legend_data_${index}_name`] = newData[`series_${index}_name`] = barres[index];
                        newData[`legend_data_${index}_icon`] = "roundRect";
                        newData[`series_${index}_type`] = 'bar';
                        newData[`series_${barres.length - 1}_barGap`] = "5%";

                        let valArr: any = [];
                        for (let item of Utils.changeArrData(sourceData)) {
                            if (item.name == barres[index]) {
                                valArr.push(item.value);
                            }
                        }
                        newData[`series_${index}_data`] = valArr;
                    }
                    break;
                case 'striptype' : //条形图
                    let stripres: any = [],
                        stripresDate: any = [];

                    Utils.setArrData(Utils.changeArrData(sourceData), stripresDate, stripres);

                    newData[`legend_data`] = [];
                    newData[`yAxis_data`] = stripresDate;
                    newData['yAxis_boundaryGap'] = true;
                    newData[`yAxis_axisTick_alignWithLabel`] = true;
                    newData[`xAxis_axisLine_lineStyle_width`] = newData[`yAxis_axisLine_lineStyle_width`] = 1
                    for (let index in stripres) {
                        newData[`legend_data_${index}_name`] = newData[`series_${index}_name`] = stripres[index];
                        newData[`series_${index}_type`] = 'bar';
                        newData[`series_${index}_barGap`] = '5%'
                        let valArr: any = [];
                        for (let item of Utils.changeArrData(sourceData)) {
                            if (item.name == stripres[index]) {
                                valArr.push(item.value);
                            }
                        }
                        newData[`series_${index}_data`] = valArr;
                    }
                    break;
            }
        }

        return newData;

    }

    public static isRepeat(sourceArr: any[], value: string): Boolean {
        for (let item of sourceArr) {
            if (item == value) {
                return true;
            }
        }
        return false;
    }

    public static changeArrData(sourceData: Array<any>) {
        let _itemArray: Array<any> = [];

        for (let item of sourceData) {
            for (let key in item) {
                if (key.indexOf('name') >= 0) {
                    _itemArray = sourceData;
                    break;
                } else {
                    if (key !== "date") {
                        _itemArray.push({
                            name: key,
                            value: item[key],
                            date: item.date
                        })
                    }
                }
            }

        }

        return _itemArray;
    }

    public static setArrData(_itemArray: Array<any>, resDateArr: Array<any>, resArr: Array<any>) {
        for (let i = 0, j = _itemArray.length; i < j; i++) {
            if (!Utils.isRepeat(resDateArr, _itemArray[i].date)) {
                resDateArr.push(_itemArray[i].date);
            }
            if (!Utils.isRepeat(resArr, _itemArray[i].name)) {
                resArr.push(_itemArray[i].name);
            }
        }
    }

    // y轴最大值
    public static MaxData(sourceD: any) {
        let arrDa: any = [];
        let max = 0;
        for (let key in sourceD) {
            arrDa.push(sourceD[key].value)
        }
        for (let i = 0; i < arrDa.length; i++) {
            if (arrDa[i] > arrDa[max])
                max = i;
        }
        return arrDa[max];
    }

    public static DightNumber(data: any) {
        if (data != undefined) {
            let dightLength = JSON.stringify(data).split('');
            data = Math.ceil(data / Math.pow(10, (dightLength.length - 1))) * Math.pow(10, (dightLength.length - 1));
        }
        return data;
    }

    public static dataSorceStyle(sourceStyle: any, sourceData: any): any {

        let newStyle = {};

        for (let key in sourceStyle) {
            switch (key) {
                case 'series_0_showSymbol' :
                    let res: any = [];
                    for (let i = 0, j = sourceData.length; i < j; i++) {
                        if (!Utils.isRepeat(res, sourceData[i].name)) {
                            res.push(sourceData[i].name);
                        }
                    }
                    for (let index in res) {
                        newStyle[`series_${index}_showSymbol`] = sourceStyle[`series_0_showSymbol`];
                    }
                    break;
                case 'series_0_label_normal_show' :
                    let resshow: any = [];
                    for (let i = 0, j = sourceData.length; i < j; i++) {
                        if (!Utils.isRepeat(resshow, sourceData[i].name)) {
                            resshow.push(sourceData[i].name);
                        }
                    }
                    for (let index in resshow) {
                        newStyle[`series_${index}_label_normal_show`] = sourceStyle[`series_0_label_normal_show`];
                    }
                    break;
                case 'series_0_lineStyle_normal_width' :
                    let reswidth: any = [];
                    for (let i = 0, j = sourceData.length; i < j; i++) {
                        if (!Utils.isRepeat(reswidth, sourceData[i].name)) {
                            reswidth.push(sourceData[i].name);
                        }
                    }
                    for (let index in reswidth) {
                        newStyle[`series_${index}_lineStyle_normal_width`] = sourceStyle[`series_0_lineStyle_normal_width`];
                    }
                    break;

            }
        }

        return newStyle;
    }

    public static changeTitleSite(style: any, container: any): any {

        for (let key in style) {
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
    }

    public static changeValueSite(style: any, container: any): any {

        for (let key in style) {
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
    }

    public static addStyle(sourceStyle: any): any {
        for (let key in sourceStyle) {
            switch (key) {
                case 'legend_left' :
                    sourceStyle['legend_show'] = true;
                    sourceStyle['legend_top'] = "center";
                    sourceStyle['legend_left'] = "right";
                    sourceStyle['legend_orient'] = "vertical";
                    break;
                case 'legend_top' :
                    sourceStyle['legend_show'] = true;
                    sourceStyle['legend_top'] = "top";
                    sourceStyle['legend_left'] = "center";
                    sourceStyle['legend_orient'] = "horizontal";
                    break;
                case 'legend_bottom' :
                    sourceStyle['legend_show'] = true;
                    sourceStyle['legend_top'] = "bottom";
                    sourceStyle['legend_left'] = "center";
                    sourceStyle['legend_orient'] = "horizontal";
                    break;
                case 'series_0_radius' :
                    sourceStyle['series_0_radius'] = [sourceStyle[key] + '%', '75%'];
                    break;
                case 'xAxis_splitLine_lineStyle_color' :
                    sourceStyle['yAxis_splitLine_lineStyle_color'] = sourceStyle['xAxis_splitLine_lineStyle_color'];
                    break;
                case 'xAxis_axisLine_lineStyle_color' :
                    sourceStyle['yAxis_axisLine_lineStyle_color'] = sourceStyle['xAxis_axisLine_lineStyle_color'];
                    break;
                case 'series_0_showSymbol' :
                    let showSymbolStyle = this.dataSorceStyle(sourceStyle, this.datasourceData);
                    for (let key in showSymbolStyle) {
                        if (key.indexOf('showSymbol') !== -1) {
                            sourceStyle[key] = sourceStyle['series_0_showSymbol']
                        }
                    }
                    break;
                case 'series_0_label_normal_show':
                    let lineStyleStyle = this.dataSorceStyle(sourceStyle, this.datasourceData);
                    for (let key in lineStyleStyle) {
                        if (key.indexOf('label_normal_show') !== -1) {
                            sourceStyle[key] = sourceStyle['series_0_label_normal_show']
                        }
                    }
                    break;
                case 'series_0_lineStyle_normal_width':
                    let lineStyleWidth = this.dataSorceStyle(sourceStyle, this.datasourceData);
                    for (let key in lineStyleWidth) {
                        if (key.indexOf('lineStyle_normal_width') !== -1) {
                            sourceStyle[key] = sourceStyle['series_0_lineStyle_normal_width']
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
    }

    public static mergeSourceData(sourceData: any, targetData: any): any {
        let sourceIndexArr: Array<any> = [],
            sourceKye: any,
            targetObj: any = targetData.series[0];
        this.getSeries(sourceData, sourceKye, sourceIndexArr)
        for (let j of this.unique(sourceIndexArr)) {
            for (let t = 0; t < targetData.series.length; t++) {
                if (targetData.series[j] == undefined) {
                    targetData.series[j] = {};
                    targetData.series[j]['type'] = targetObj.type
                }
            }
        }
    }

    public static unique(arr: Array<any>): any {
        var result: Array<any> = [];
        for (var i = 0; i < arr.length; i++) {
            if (result.indexOf(arr[i]) == -1) {
                result.push(arr[i])
            }
        }
        return result;
    }

    public static getSeries(arr: Array<any>, sourceKey: any, sourceIndexArr: any): any {
        for (let key in arr) {
            if (key.indexOf('series') === 0) {
                sourceKey = key.split("_");
                sourceIndexArr.push(Number(sourceKey[1]))
            }
        }
    }

    public static clearSeariesData(sourceData: any, echartSeriesData: any): any {
        let sourceIndexArr: Array<any> = [],
            sourceKye: any,
            targetObj: any = echartSeriesData[0];

        for (let j = echartSeriesData.length - 1; j >= 0; j--) {
            if (echartSeriesData[j] == undefined) {
                echartSeriesData[j] = {};
            }
            echartSeriesData[j]['type'] = targetObj.type;
            if (sourceData[`series_${j}_name`] !== echartSeriesData[j].name) {
                echartSeriesData.splice(j, 1)
            }
        }
    }

    public static compareObj(sourceData: any, targetData: any): any {
        let parseKeyString = (key: any): any => {
            let keyArray = key.toString().split("_");
            let keyString = "";
            for (let item of keyArray) {
                keyString += "['" + item + "']";
            }
            return keyString;
        };

        let parseKeyArray = (key: any): any => {
            let keyArray = key.toString().split("_");
            let arr: any = [];
            for (let i = 0; i < keyArray.length; i++) {
                if (arr.length == 0) {
                    arr.push("['" + keyArray[i] + "']");
                } else {
                    arr.push(arr[i - 1] + "['" + keyArray[i] + "']");
                }
            }
            return arr;
        };

        let setEmptyByKeyArr = (keyArray: any[], data: any) => {
            for (var index = 0; index < keyArray.length; index++) {
                let key = keyArray[index];
                let result = Function('data', "return " + "data" + key)(data);
                if (result == null) {
                    let reg = /(\[\'[0-9]+\'\])/;
                    if (index < keyArray.length - 1) {
                        let match = keyArray[index + 1].match(reg);
                        if (match && match[0].length + match.index == match.input.length) {
                            Function('data', 'value', "data" + key + "=" + "value")(data, []);
                        }
                        else {
                            Function('data', 'value', "data" + key + "=" + "value")(data, {});
                        }
                    }
                }
            }
        }

        let setDataByKey = (key: string, value: any, data: any): any => {
            Function('data', 'value', "data" + key + "=" + "value")(data, value);
        };

        for (let key in sourceData) {
            //set empty vaule
            let keyArray: any = parseKeyArray(key);
            setEmptyByKeyArr(keyArray, targetData);

            //set data value
            let keyString: any = parseKeyString(key);
            setDataByKey(keyString, sourceData[key], targetData);
        }

        return targetData;
    }

    public static offsetPosition(el: Element): any {
        var _x = 0, _y = 0;
        while (el && !isNaN(el['offsetLeft']) && !isNaN(el['offsetTop'])) {
            _x += el['offsetLeft'] - el.scrollLeft;
            _y += el['offsetTop'] - el.scrollTop;
            el = el['offsetParent'];
        }
        return {top: _y, left: _x};
    }

    public static changeNumber(value: any) {
        var texts = '';
        var new_num = value;
        var istype = '';
        if (value > 9999) {
            if (value < 1e8) {
                new_num = (new_num / 1e4).toFixed(2).toString();
                istype = '万';
            } else if (value >= 1e8) {
                new_num = (new_num / 1e8).toFixed(2).toString();
                istype = '亿'
            }
        }
        texts = new_num + istype;
        return texts;
    }

    public static lifeCycleMap = {
        "注册期": "1",
        "新客户期": "2",
        "成长期": "3",
        "稳定期": "4",
        "休眠期": "5",
        "流失期": "6",
        "召回期": "7",

        "注册浅度访客": "11",
        "注册深度访客": "12",
        "休眠浅度访客": "51",
        "休眠深度访客": "52",
    }

    public static handleLifeCycleMap(data: any, type: any) {
        for (let key in Utils.lifeCycleMap) {
            for (let item of data) {
                if (Utils.lifeCycleMap[key] == item[type]) {
                    item[type] = key;
                }
            }
        }
        return data;
    }

    //数字加逗号
    public static parseFormatNum(number: any, n: any) {
        if (n != 0) {
            n = (n > 0 && n <= 20) ? n : 2;
        }
        number = parseFloat((number + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var sub_val = number.split(".")[0].split("").reverse();
        var sub_xs = number.split(".")[1];

        var show_html = "";
        for (let i = 0; i < sub_val.length; i++) {
            show_html += sub_val[i] + ((i + 1) % 3 == 0 && (i + 1) != sub_val.length ? "," : "");
        }

        if (n == 0) {
            return show_html.split("").reverse().join("");
        } else {
            return show_html.split("").reverse().join("") + "." + sub_xs;
        }

    }

    //转化时间
    public static changeDate(date: any, str: any, k: any) {
        let newDate = date.split(str).join(k)
        return newDate;
    }

}