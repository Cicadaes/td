import { TdBaseGraph } from '../common/td-base.graph';

export class FunnelGraph extends TdBaseGraph {
    abscissa: boolean;//日期字段
    constructor(data: any = {}) {
        super("funnel");
        if (data && data["data"] && data["data"][0] && data["data"][0].length > 0) {
            data = {
                data: data["data"][1],
                style: data['style']
            };
            if (data && data.data && data.data[0] && data.data[0]["data"] && data.data[0]["data"].length && data.data[0]["interval"]) {
                if (data.data[0]["interval"]['field'] == data.data[0]["dimensions"][0]) {
                    this.abscissa = true;
                } else {
                    this.abscissa = false;
                }
            } else {
                this.abscissa = false;
            }
            data && data.data && data.data.length && this.setFunnelData(data.data[0]["data"]);
            data && data.style && this.setFunnelStyle(data.style);
        } else {
            data && data.data && data.data.length && this.setFunnelData(data.data);
            data && data.style && this.setFunnelStyle(data.style);
        }

    }

    /**
     * 设置funnnel图的数据
     * @param  {Array<any> = []}          gpdata [description]
     * @return {[type]}          [description]
     */
    private setFunnelData(gpdata: any[] = []) {
        this.legend.data = [];
        this.series = [];
        this.removeCategory();

        Object.assign(this.series, [
            {
                left: '20%',
                right: '20%',
                type: 'funnel',
                sort: 'none',
                label: {
                    show: false
                },
                data: []
            },
            {
                type: 'funnel',
                left: '20%',
                right: '20%',
                sort: 'none',
                label: {
                    show: false
                },
                data: []
            },
            {
                type: 'funnel',
                left: '20%',
                right: '20%',
                sort: 'none',
                label: {
                    show: false
                },
                data: []
            },
            {
                type: 'funnel',
                left: '20%',
                right: '20%',
                sort: 'none',
                label: {
                    show: false
                },
                data: []
            }
        ]);

        if (!gpdata.length) {
            return;
        }

        gpdata.forEach((item: any) => {
            this.legend.data.push(item[this.DIMENSION_FIRST]);
            this.series && this.series.forEach((node: any) => {
                node.data.push({
                    name: item[this.DIMENSION_FIRST],
                    value: item[this.GRAPH_ITEM_VALUE]
                })
            });
        })
    }

    /**
     * 图表样式数据转换
     * @param  {any}    gpstyle [description]
     * @return {[type]}         [description]
     */
    private setFunnelStyle(data: any) {

        data.legend && this.setLegend(data.legend);

        data.bgAndBorder && this.setBackgroundColor(data.bgAndBorder);

        data.color && this.setColor(data.color.colors, data.color.mode);

        data && this.setFunnelItemStyle(data);
        if (data.legend && data.legend["layout"]["type"] !== "flushRight") {
            this.series[0]["left"] = '15%';
            this.series[0]["right"] = '15%';
            if (this.series[1]) {
                this.series[1]["left"] = '15%';
                this.series[1]["right"] = '15%';
            }
            if (this.series[2]) {
                this.series[2]["left"] = '15%';
                this.series[2]["right"] = '15%';
            }
            if (this.series[3]) {
                this.series[3]["left"] = '15%';
                this.series[3]["right"] = '15%';
            }
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

        this.color = data;
    }

    /**
     * 遍历漏斗图的series，设置饼图的label
     * @param  {any}    data [description]
     * @return {[type]}      [description]
     */
    private setFunnelItemStyle(data: any = {}) {
        let _that = this;
        let dataArr = this.series[0] && this.series[0].data || [];

        if (data.procedure && data.procedure.boxShadow) {
            this.series[0] && Object.assign(this.series[0], {
                label: {
                    show: data.procedure.boxShadow,
                    fontSize: data.procedure.fontSize || 12,
                    color: data.procedure.color || '#fff',
                    fontFamily: data.procedure.fontFamily || 'sans-serif'
                },
                labelLine: {
                    lineStyle: {
                        color: data.procedure.color || '#fff'
                    }
                }
            });
            if (this.abscissa) {
                this.series[0] && this.series[0].data.forEach((item: any) => {
                    item && Object.assign(item, {
                        label: {
                            formatter: function (params: any) {
                                return params.name.slice(0, 4) + '-' + params.name.slice(4, 6) + '-' + params.name.slice(6)
                            }
                        },
                    });
                });
            }
        }

        if (data.percent && data.percent.boxShadow) {
            this.series[1] && Object.assign(this.series[1], {
                label: {
                    show: data.percent.boxShadow,
                    position: 'left',
                    fontSize: data.percent.fontSize || 12,
                    color: data.percent.color || '#fff',
                    fontFamily: data.percent.fontFamily || 'sans-serif'
                },
                labelLine: {
                    lineStyle: {
                        color: data.percent.color || '#fff'
                    }
                }
            });

            this.series[1] && this.series[1].data.forEach((item: any) => {
                item && Object.assign(item, {
                    label: {
                        formatter: function (params: any) {
                            return `步骤间的转化率：` + (params.value ? _that.percentchange((params.value / (dataArr[(params.dataIndex - 1) < 0 ? 0 : params.dataIndex - 1].value) * 100).toFixed(2)) : '0') + `%`;
                        }
                    },
                });
            });
        }
        if (data.accumulated && data.accumulated.boxShadow) {
            this.series[3] && Object.assign(this.series[3], {
                label: {
                    show: data.accumulated.boxShadow,
                    position: 'left',
                    fontSize: data.accumulated.fontSize || 12,
                    color: data.accumulated.color || '#fff',
                    fontFamily: data.accumulated.fontFamily || 'sans-serif'
                },
                labelLine: {
                    lineStyle: {
                        color: data.accumulated.color || '#fff'
                    }
                }
            });

            this.series[3] && this.series[3].data.forEach((item: any) => {
                item && Object.assign(item, {
                    label: {
                        formatter: function (params: any) {
                            if (data.percent && data.percent.boxShadow) {
                                return `累计转化率：` + (params.value ? _that.percentchange(((params.value / dataArr[0].value) * 100).toFixed(2)) : '0') + `%` + " " + " " + " " + " " + " " + " " + " " + `\n\n\n`;
                            } else {
                                return `累计转化率：` + (params.value ? _that.percentchange(((params.value / dataArr[0].value) * 100).toFixed(2)) : '0') + `%`;
                            }
                        }
                    },
                });
            });
        }
        if (data.value && data.value.boxShadow) {
            this.series[2] && Object.assign(this.series[2], {
                label: {
                    show: data.value.boxShadow,
                    position: 'inside',
                    fontSize: data.value.fontSize || 12,
                    color: data.value.color || '#fff',
                    fontFamily: data.value.fontFamily || 'sans-serif',
                    verticalAlign: 'top',
                }
            });
            this.series[2] && this.series[2].data.forEach((item: any) => {
                item && Object.assign(item, {
                    label: {
                        formatter: function (params: any) {
                            return _that.setPrecision(params.value)
                        }
                    },
                });
            });
        }

        if (data.total && data.total.boxShadow) {
            let Left: any;
            if (data.legend && data.legend["layout"]["type"] !== "flushRight") {
                Left = 'center';
            } else {
                Left = '43.3%';
            }
            this.title && Object.assign(this.title, {
                text: '总转化率 ' + (dataArr[dataArr.length - 1].value ? _that.percentchange(((dataArr[dataArr.length - 1].value / dataArr[0].value) * 100).toFixed(2)) : 0) + `%`,
                top: '5%',
                left: Left,
                textStyle: {
                    color: data.total.color || '#515a6e',
                    fontSize: data.total.fontSize || 16,
                    fontFamily: data.value.fontFamily || 'sans-serif'
                }
            });
        } else {
            this.title = {};
        }
    }
    /**
     * 百分数显示  100.00/100.10=>100/100.1
     * @param data 
     */
    percentchange(data: any) {
        let date = data.split(".");
        if (date.length > 1) {
            if (date[1] == '00') {
                return date = date[0]
            }
            // else if (date[1][date[1].length - 1] == '0') {
            //     return date = date[0] + "." + date[1][date[1].length - 2]
            // }
            else {
                return date[0] + "." + date[1]
            }
        }
        return data
    }
}
