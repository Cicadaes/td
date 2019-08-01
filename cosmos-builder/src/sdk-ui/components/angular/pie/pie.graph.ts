import { TdBaseGraph } from '../common/td-base.graph';
import { NumberSymbol } from '@angular/common';

export class PieGraph extends TdBaseGraph {
    nums: any;//总和
    constructor(data: any = {}) {
        super("pie");
        if (data && data["data"] && data["data"][0] && data["data"][0].length > 0) {
            data = {
                data: data["data"][1],
                style: data['style']
            };
            if (data && data.data && data.data[0] && data.data[0]["data"] && data.data[0]["data"].length && data.data[0]["sumMetric"]) {
                this.nums = data.data[0]["sumMetric"];
            } else {
                this.nums = false;
            }
            data && data.data && data.data.length && this.setPieData(data.data[0]["data"]);
            data && data.style && this.setPieStyle(data.style);
        } else {
            data && data.data && data.data.length && this.setPieData(data.data);
            data && data.style && this.setPieStyle(data.style);
        }
    }

    /**
     * 设置Pie图的数据
     * @param  {Array<any> = []}          gpdata [description]
     * @return {[type]}          [description]
     */
    private setPieData(gpdata: any[] = []) {
        this.legend.data = [];
        this.series[0].data = [];
        this.removeCategory();

        Object.assign(this.series, [{
            type: 'pie',
            center: ['38%', '50%'],
            data: []
        }]);

        if (!gpdata.length) {
            return;
        }

        gpdata.forEach((item: any) => {
            this.legend.data.push(item[this.DIMENSION_FIRST]);
            this.series[0].data.push({
                name: item[this.DIMENSION_FIRST],
                value: item[this.GRAPH_ITEM_VALUE]
            })
        })
        this.series[0].data.sort(function (a: any, b: any) {
            return b.value - a.value;
        })
    }
    /**
     * 图表样式数据转换
     * @param  {any}    gpstyle [description]
     * @return {[type]}         [description]
     */
    private setPieStyle(data: any) {
        if (!data) {
            return;
        }
        data.legend && this.setLegend(data.legend);
        data.label && this.setLabel(data.label);
        data.bgAndBorder && this.setBackgroundColor(data.bgAndBorder);

        data.pie && this.setColor(data.pie.colors, data.pie.mode);
        data.pie && this.setPieItemStyle(data.pie);
        if (data.legend && data.legend["layout"]["type"] !== "flushRight") {
            this.series[0]['center'] = ['50%', '50%'];
            this.series[1]['center'] = ['50%', '50%']
        }
    }
    /**
     * 设置调色盘颜色列表
     * @param  {Array<string>} data [description]
     * @param  {number     =    1}           num [description]
     * @return {[type]}             [description]
     */
    private setColor(data: Array<string> = [], mode: string = 'queue') {
        if (!data || !data.length) {
            return;
        }
        if (mode == 'single') {
            data = data.slice(0, 1);
        }

        for (let i = 0; i < this.color.length; i++) {
            this.color[i] = data[i % data.length]
        }

        this.color = data;
    }

    /**
     * 遍历饼图的series，设置饼图的itemstyle
     * @param  {any}    data [description]
     * @return {[type]}      [description]
     */
    private setPieItemStyle(data: any = {}) {
        let total = 0;
        let that = this;
        this.series[0].data.forEach((item: any) => {
            total += item.value;
        });

        this.series && this.series.forEach((item: any) => {
            item && Object.assign(item, {
                radius: [(1 - Number(data.fill) * 0.05) * 0.75 * 100 + '%', '75%']
            })
        });

        this.series.push(this.deepCopy(this.series[0]));
        this.series[1] && Object.assign(this.series[1], {
            avoidLabelOverlap: false,
            label: {
                show: data.total,
                position: 'center',
                fontSize: 14,
                fontFamily: 'sans-serif',
                color: '#515a6e',
                emphasis: {
                    show: data.total,
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 500
                    }
                },
                formatter: function (params: any) {
                    let label = '';
                    if (0 == params.dataIndex) {
                        if (data.total && data.totalAttr) {
                            label = data.totalAttr + `总计\n\n` + that.formatNum(total);
                        } else {
                            label = `总计\n\n` + that.formatNum(total);
                        }
                    }
                    return label;
                }
            }
        })
    }

    /**
     * 设置饼图的tooltip
     * @param  {any}    data [description]
     * @return {[type]}      [description]
     */
    public setToolTip(data: any) {
        super.setToolTip(data);

        let type = '';
        switch (data.type) {
            case 'none':
                type = '';
                break;

            case 'percent':
                type = '{d}%';
                break;

            case 'label':
                type = '{b}';
                break;

            case 'value':
                type = '{c}';
                break;

            default:
                type = '';
                break;
        }
        this.tooltip && Object.assign(this.tooltip, {
            confine: true,
            background: 'rgba(23,35,61,0.85)',
            formatter: type
        })
    }

    /**
    * 设置饼图的标签
    * @param  {any}    data [description]
    * @return {[type]}      [description]
    */
    public setLabel(data: any) {
        let _that = this;
        let format = "";
        if (data.type == "none") {
            format = ""
        }
        if (data.type == "percent") {
            format = "{d}%"
        }
        if (data.type == "label") {
            format = "{b}"
        }
        if (data.type == "value") {
            format = '{c}'
        }
        if (format == '{c}') {
            this.series && this.series.forEach((item: any) => {
                item && Object.assign(item, {
                    label: {
                        position: 'inside',
                        formatter: function (params: any) {
                            return _that.setPrecision(params.value)
                        },
                        color: data.color,
                        fontFamily: data.fontFamily
                    },
                });
            });
        } else {
            this.series && this.series.forEach((item: any) => {
                item && Object.assign(item, {
                    label: {
                        position: 'inside',
                        formatter: format,
                        color: data.color,
                        fontFamily: data.fontFamily
                    },
                });
            });
        }

    }

    //深拷贝
    private deepCopy(data: any): any {
        let json = JSON.stringify(data);
        return JSON.parse(json);
    }
}
