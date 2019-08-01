import { BaseGraph } from './base.graph'

export class TdBaseGraph extends BaseGraph {
    constructor(gptype: string = 'line') {
        super(gptype)
    }

    public DIMENSION_FIRST: string = 'X';
    public DIMENSION_SECOND: string = 'Legend';
    public GRAPH_ITEM_VALUE: string = 'Y';

    // public DIMENSION_FIRST: string = 'create_dt'
    // public DIMENSION_SECOND: string = 'name'
    // public GRAPH_ITEM_VALUE: string = 'value3'

    public DEFAULT_VALUE: number = 0;

    public Length: number = 0;
    /**
     * 设置坐标轴的样式配置
     * @param  {any}    data [description]
     * @return {[type]}      [description]
     */
    public setAxis(data: any, abscissa?: boolean) {
        let that = this;
        let xCommonObj = {
            z: 15,
            show: data.showAxis,
            axisTick: {
                show: data["xAxisLine"],
                alignWithLabel: data["xAxisLine"],

            },
            axisLine: {
                show: data.xAxisLine,
                lineStyle: {
                    color: data.axisColor || '#333'
                }
            },
            axisLabel: {
                show: data.xAxisLabel,
                // interval: 0,
                textStyle: {
                    fontSize: 12,
                    color: '#80848F',
                    fontFamily: "HelveticaNeue,Microsoft YaHei,PingFangSC"
                },
                formatter: function (value: any, index: any) {
                    if (abscissa) {
                        if (value.length !== 8) {
                            return value
                        }
                        return value.toString().slice(4, 6) + '/' + value.toString().slice(6)
                    } else {
                        return value
                    }
                }
            }
        };
        this.xAxis && Object.assign(this.xAxis, xCommonObj, {
            name: data.xAxisTitle && data.xAxisName || '',
            nameLocation: "middle",
            nameGap: 25,
        });
        let yCommonObj = {
            show: data.showAxis,
            axisTick: {
                show: data["yAxisLine"],
                alignWithLabel: data["yAxisLine"],
            },
            axisLine: {
                show: data.yAxisLine,
                lineStyle: {
                    color: data.axisColor || '#333'
                }
            },
            axisLabel: {
                show: data.yAxisLabel,
                fontSize: 12,
                color: '#80848F',
                fontFamily: "HelveticaNeue,Microsoft YaHei,PingFangSC",
                formatter: function (value: any, index: any) {
                    if (Number(value)) {
                        let maxNumber = that.toReorder(that.series);
                        if (maxNumber >= 100000) {
                            return that.setPrecision(value);
                        } else {
                            return that.setPrecision(value, true);
                        }
                    } else {
                        return value
                    }
                }
            },
        };
        if (data.yAxisTitle && data.yAxisName) {
            // let cont = data.yAxisName.join("/")
            this.Length = this.length(data.yAxisName)
        } else {
            this.Length = 0
        }
        this.yAxis && Object.assign(this.yAxis, yCommonObj, {
            name: data.yAxisTitle && data.yAxisName || '',
            min: data.yAxisMin || null,
            max: data.yAxisMax || null,
            interval: Number(data.yAxisInterval) || undefined,
            nameTextStyle: {
                padding: [0, 0, 10, (12 * (this.Length + 2))],
            }
        });
    }

    /**
     * 设置网格属性
     * @param  {any}    data [description]
     * @return {[type]}      [description]
     */
    public setGrid(data: any = {}) {
        this.xAxis && Object.assign(this.xAxis, {
            splitLine: {
                show: data.verticalGrid || false,
                lineStyle: {
                    color: [data.color] || ['#ccc']
                }
            }
        });
        this.yAxis && Object.assign(this.yAxis, {
            splitLine: {
                show: data.horizontalGrid || false,
                lineStyle: {
                    color: [data.color] || ['#ccc']
                }
            }
        });
        this.grid && Object.assign(this.grid, {
            show: true,
            backgroundColor: data.background || 'transparent'
        })
    }

    /**
     * 图例格式数据转换
     * @param  {any}    data [description]
     * @return {[type]}      [description]
     */
    public setLegend(data: any) {
        let obj: any = {};
        switch (data.layout.type) {
            case 'none':
                obj.show = false;
                break;

            case 'flushRight':
                obj.show = true;
                obj.orient = 'vertical';
                obj.left = 'right';
                obj.align = 'left';
                obj.top = data.layout.orientation;
                obj.formatter = function (name: any) {
                    if (data.character != null) {
                        if (name.length > data.character) {
                            return name.substring(0, data.character) + '...';
                        } else {
                            return name
                        }
                    } else {
                        if (name.length > 10) {
                            return name.substring(0, 10) + '...';
                        } else {
                            return name
                        }
                    }

                };
                break;

            case 'flushBottom':
                obj.show = true;
                obj.orient = 'horizontal';
                obj.top = 'bottom';
                obj.align = 'left';
                obj.left = data.layout.orientation;
                obj.formatter = function (name: any) {
                    if (data.character != null) {
                        if (name.length > data.character) {
                            return name.substring(0, data.character) + '...';
                        } else {
                            return name
                        }
                    } else {
                        if (name.length > 10) {
                            return name.substring(0, 10) + '...';
                        } else {
                            return name
                        }
                    }
                };
                break;

            case 'flushTop':
                obj.show = true;
                obj.orient = 'horizontal';
                obj.top = 'top';
                obj.align = 'left';
                obj.left = data.layout.orientation;
                obj.formatter = function (name: any) {
                    if (data.character != null) {
                        if (name.length > data.character) {
                            return name.substring(0, data.character) + '...';
                        } else {
                            return name
                        }
                    } else {
                        if (name.length > 10) {
                            return name.substring(0, 10) + '...';
                        } else {
                            return name
                        }
                    }
                };
                break;
        }

        this.legend && Object.assign(this.legend, {
            type: 'scroll',
            textStyle: {
                color: data.color || '#495060',
                fontSize: data.fontSize || 12,
                fontFamily: data.fontFamily || 'HelveticaNeue,Microsoft YaHei,PingFangSC',
            },
        }, obj)
    }

    /**
     * 设置tooltip鼠标移入显示框加文字
     * @param  {any}    data [description]
     * @return {[type]}      [description]
     */
    public setToolTip(data?: any) {
        this.tooltip && Object.assign(this.tooltip, {
            backgroundColor: 'rgba(23,35,61,0.85)',
            confine: true,
            axisPointer: { type: 'line' },
            trigger: (this.gpType == 'bar' || this.gpType == 'line') ? 'axis' : 'item',
            textStyle: {
                color: data && data.color || '#fff',
                fontFamily: data && data.fontFamily || 'sans-serif'
            }

        })
    }
    /**
 * 设置label饼图特有(可新增)
 * @param  {any}    data [description]
 * @return {[type]}      [description]
 */
    public setLabel(data: any) {

    }

    /**
     * 设置backgroundColor
     * @param  {any}    data [description]
     * @return {[type]}      [description]
     */
    public setBackgroundColor(data: any) {
        if (data && data.backgroundColor) {
            this.backgroundColor = data.backgroundColor;
        }
    }
    /**
     * 长度
     */
    length(data: any) {
        let character = 0;
        let rests = 0;
        let len;
        for (let j = 0; j < data.length; j++) {
            if (/[\u4E00-\u9FA5]/.test(data[j])) {
                character = character + 1;
            } else {
                rests = rests + 1;
            }
        };
        len = Number(character) + Number(rests / 2);
        return len;

    }
    /**
     *边距
     */
    adaption(data: any) {
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushRight") {
            let character: any;
            if (data["legend"]["character"] == null) {
                this.grid['right'] = (7 * 10) + 50;
            } else if (data["legend"]["character"] == 0) {
                this.grid['right'] = (7 * 5) + 50;
            } else {
                this.grid['right'] = (7 * data["legend"]["character"]) + 50;
            }
            if (data.line && data.line['scaling']) {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.grid['bottom'] = 45;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 5;

            }
            this.grid['top'] = 20;
        }
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushTop") {
            this.grid['right'] = '1.5%';
            this.grid['top'] = 43;
            if (data.line && data.line['scaling']) {
                this.grid['bottom'] = 45;
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 5;
            }
        }
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushBottom") {
            this.grid['right'] = '1.5%';
            this.grid['top'] = 20;
            if (data.line && data.line['scaling']) {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.dataZoom[0]["bottom"] = 30;
                this.grid['bottom'] = 75;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.dataZoom[0]["bottom"] = 0;
                this.grid['bottom'] = 30;
            }
        }
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "none") {
            this.grid['right'] = '1.5%';
            this.grid['top'] = 20;
            if (data.line && data.line['scaling']) {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.grid['bottom'] = 45;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 5;
            }
        }
        if (data.axis && data.axis['yAxisTitle']) {
            this.grid['top'] = 40;
        }
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushTop" && data.axis && data.axis['yAxisTitle']) {
            this.grid['top'] = 65;
        }
        if (data.axis && data.axis['xAxisTitle']) {
            if (data.line && data.line['scaling']) {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.grid['bottom'] = 65;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 20;
            }
        }
        if (data.axis && data.axis['xAxisTitle'] && !data.axis['xAxisLabel']) {
            if (data.line && data.line['scaling']) {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.grid['bottom'] = 80;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 40;
            }
        }
        if (data.legend && data.legend["layout"] && data.legend["layout"]["type"] == "flushBottom" && data.axis && data.axis['xAxisTitle']) {
            if (data.line && data.line['scaling']) {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.grid['bottom'] = 85;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 45;
            }
        }
        if (data.axis && data.axis['xAxisTitle'] && !data.axis['xAxisLabel'] && data.legend["layout"]["type"] == "flushBottom") {
            if (data.line && data.line['scaling']) {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 10;
                this.grid['bottom'] = 105;
            } else {
                this.dataZoom[0]["show"] = data.line['scaling'];
                this.dataZoom[0]["end"] = 100;
                this.grid['bottom'] = 65;
            }
        }
    }

    /**
     * 数组去重加排序
     */
    toReorder(date: any) {
        let arr: any = [];
        for (let j = 0; j < date.length; j++) {
            arr = arr.concat(date[j].data)
        }
        let res = [];
        for (var i = 0; i < arr.length; i++) {
            if (res.indexOf(arr[i]) == -1) {
                res.push(arr[i]);
            }
        }
        res.sort(function (m: any, n: any) {  //m < n 返回-1是从小到大排序，返回1是从大到小排序
            if (m < n) return -1
            else if (m > n) return 1
            else return 0
        });
        res = res[res.length - 1]
        return res
    }
    /**
     * 显示数据调整
     * @param strNum 
     */
    formatNum(strNum: any) {
        strNum = Number(strNum)

        if (strNum) {
            if (strNum >= 100000) {
                strNum = strNum / 10000
                strNum = strNum.toFixed(2);
                var m = strNum.split(".");
                if (m.length != 1) {
                    if (m[1] == "00") {
                        strNum = m[0];
                    }
                }
                if (strNum.length <= 3) {
                    return strNum + "万";
                }
                if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
                    return strNum;
                }
                var a = RegExp.$1, b = RegExp.$2, c = RegExp.$3;
                var re = new RegExp("(\\d)(\\d{3})(,|$)");
                // re.compile("(\\d)(\\d{3})(,|$)");
                while (re.test(b)) {
                    b = b.replace(re, "$1,$2$3");
                }
                return a + "" + b + "" + c + "万";
            } else {
                strNum = strNum.toFixed(2);
                var m = strNum.split(".");
                if (strNum == 100000.00) {
                    return "10万";
                }
                if (m.length != 1) {
                    if (m[1] == "00") {
                        strNum = m[0];
                    }
                }
                if (strNum.length <= 3) {
                    return strNum;
                }
                if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
                    return strNum;
                }
                var a = RegExp.$1, b = RegExp.$2, c = RegExp.$3;
                var re = new RegExp("(\\d)(\\d{3})(,|$)");
                // re.compile("(\\d)(\\d{3})(,|$)");
                while (re.test(b)) {
                    b = b.replace(re, "$1,$2$3");
                }
                return a + "" + b + "" + c;
            }

        } else {
            return strNum;
        }
    }

}
