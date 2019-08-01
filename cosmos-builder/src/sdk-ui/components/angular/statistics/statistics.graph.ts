import { TdBaseGraph } from '../common/td-base.graph'

export class StatisticsGraph extends TdBaseGraph {

    constructor(data: any = {}) {
        super();
        data && data.data && data.data.length && this.setLineData(data.data);
        data && data.style && this.setLineStyle(data.style)
    }

    /**
     * 解析数据成ECharts格式
     * @param  {any}       gpdata [description]
     * @param  {string =      'bar'}       gptype [description]
     * @return {[type]}           [description]
     */
    setLineData(gpdata: any[] = []) {
        this.addCategory();

        if (!gpdata.length) {
            return;
        }
        // 确定数据类型
        // 1 ===》 两维度一指标
        // 0 ===》 一维度一指标
        if (typeof gpdata[0] == 'object') {
            this.series = [];
            this.legend.data = [];
            const DATA_TYPE: number = gpdata[0].hasOwnProperty(this.DIMENSION_SECOND) ? 1 : 0;
            this.setDataType(DATA_TYPE, this.gpType);
            // 暂存第二维度
            let dimension_second_arr: any = [];
            gpdata.forEach((item: any) => {
                // 添加第一维度
                if (!this.xAxis.data.includes(item[this.DIMENSION_FIRST])) {
                    this.xAxis.data.push(item[this.DIMENSION_FIRST])
                }
                if (DATA_TYPE) {
                    // 添加series（第二维度）
                    if (!dimension_second_arr.includes(item[this.DIMENSION_SECOND])) {
                        this.legend.data.push(item[this.DIMENSION_SECOND]);
                        dimension_second_arr.push(item[this.DIMENSION_SECOND]);
                        this.series.push({
                            name: item[this.DIMENSION_SECOND],
                            type: this.gpType,
                            data: [item[this.GRAPH_ITEM_VALUE]]
                        })
                    } else {
                        this.series[dimension_second_arr.indexOf(item[this.DIMENSION_SECOND])].data.push(item[this.GRAPH_ITEM_VALUE])
                    }
                } else {
                    this.series[0].data.push(item[this.GRAPH_ITEM_VALUE])
                }
            })
        } else {
            console.log('数据格式错误');
            console.log(gpdata)
        }
    }

    /**
     * 设置数据类型
     * @param  {any}       dataitem [description]
     * @param  {string =        'bar'}       gptype [description]
     * @return {[type]}             [description]
     */
    setDataType(DATA_TYPE: number = 0, gptype: string = 'bar') {
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
    setLineStyle(data: any) {

        this.setToolTip();
        data.legend && this.setLegend(data.legend);
        data.axis && this.setAxis(data.axis);
        data.grid && this.setGrid(data.grid);
        data.bgAndBorder && this.setBackgroundColor(data.bgAndBorder);

        data.line && this.setLineItemStyle(data.line, data.missingData);
    }

    /**
     * 遍历线图的series，设置线图的itemstyle
     * @param  {any}    data [description]
     * @return {[type]}      [description]
     */
    private setLineItemStyle(data: any = {}, missingData: string = "breakValue") {

        this.series && this.series.forEach((item: any) => {
            item && Object.assign(item, {
                symbolSize: data.displayPoint ? 4 : 0,
                label: {
                    show: data.dataLabel
                },
                lineStyle: {
                    width: data.borderWidth >= 0 ? data.borderWidth : 2
                },
                connectNulls: missingData == "insertionValue" ? true : false
            })
        });

        if (missingData == "zeroValue") {
            let len = this.xAxis && this.xAxis.data && this.xAxis.data.length || 0;
            this.series && this.series.forEach((item: any) => {
                if (!item.data) {
                    item.data = [];
                }
                let curLen = item.data.length;
                for (let i = curLen; i < len; i++) {
                    item.data.push(0);
                }
            });
        }
    }

}
