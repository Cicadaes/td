import { TdBaseGraph } from '../common/td-base.graph'

export class MapGraph extends TdBaseGraph {
    minInNumbers: any;
    maxInNumbers: any;
    cont: any = [];
    conts: Number = 0;
    constructor(data: any = {}) {
        super('map');
        data && data.data && data.data.length && this.setMapData(data.data);
        data && data.style && this.setMapStyle(data.style);

    }

    /**
     * 解析数据成ECharts格式
     * @param  {any}       gpdata [description]
     * @param  {string =      'bar'}       gptype [description]
     * @return {[type]}           [description]
     */
    setMapData(gpdata: any[] = []) {
        let that = this;
        if (!gpdata.length) {
            return;
        }
        if (typeof gpdata[0] == 'object') {
            this.data = gpdata;
            this.Value(this.data)
            this.series[0].data = gpdata;
            this.tooltip = {
                confine: true,
                show: true,
                formatter: function (params: any) {
                    if (params.value) {
                        var relVal = "<div style='display:block;font-size:12px;height:12px'><div style='float:left'><span style='line-height:10px;display: inline-block;height:6px;width:6px;border-radius:50%;margin-right:8px;margin-bottom:1px;background:" + params.color + "'></span>" + params.name + " <span style='margin:0 8px;display:inline-block'></span> " + "</div><div style='float:right'>" + that.setPrecision(params.value) + "</div></div><div style='clear:both'></div>";
                        return relVal;
                    }
                    return;
                },
            }
        } else {
        }
    }
    /**
     * 设置数据类型
     * @param  {any}       dataitem [description]
     * @param  {string =        'bar'}       gptype [description]
     * @return {[type]}             [description]
     */
    setDataType(DATA_TYPE: number = 0, gptype: string = "map") {
        if (!DATA_TYPE) {
            this.series.push({
                data: [],
                type: gptype
            })
        }
    }
    /**
     * 图表样式数据转换
     * @param  {any}    gpstyle [description]
     * @return {[type]}         [description]
     */
    setMapStyle(data: any) {
        data.bgAndBorder && this.setBackgroundColor(data.bgAndBorder);
        data.mapStyle && this.mapStyle(data.mapStyle)
    }
    /**
     * 求和,新组合,最大最小
     * @param data 
     */
    Value(data: any) {
        this.cont = [];
        this.conts = 0;
        this.maxInNumbers = 0;
        this.minInNumbers = 0;
        for (let j = 0; j < data.length; j++) {
            this.cont.push(data[j].value);
        }
        for (let k = 0; k < this.cont.length; k++) {
            this.maxInNumbers = Math.max.apply(Math, this.cont);
            this.minInNumbers = Math.min.apply(Math, this.cont);
            // let datatamax = this.formatNum(this.maxInNumbers);
            // let datatamin = this.formatNum(this.minInNumbers);
        }
    }
    /**
     * 遍历map的series，设置线图的itemstyle
     * @param  {any}    data [description]
     * @return {[type]}      [description]
     */
    private mapStyle(data: any = {}) {
        this.Value(this.data)
        this.visualMap = {
            hoverLink: false,
            realtime: true,
            type: 'continuous',
            show: data.dataLabel,
            inRange: {
                color: ['#ffffff', data.labelColor]
            },
            showLabel: true,
            calculable: true,
            text: ['高', '低'],
            itemWidth: 11,
            itemHeight: 72,
            min: this.minInNumbers,
            max: this.maxInNumbers,
            textStyle: {
                fontFamily: data.fontFamily,
                color: data.textColor,
                fontSize: data.fontSize,
            },
        }
        this.geo = {
            roam: true,
            map: 'china',
            label: {
                emphasis: {
                    show: true
                }
            },
            regions: [{
                name: '南海诸岛',
                value: 0,
                itemStyle: {
                    normal: {
                        opacity: 0,
                        label: {
                            show: false
                        }
                    }
                }
            }],
        }
    }
    /**
     * 转百分数
     * @param point 
     */
    toPercent(point: any) {
        var str = Number(point * 100).toFixed(2);
        str += "%";
        return str;
    }
}
