import { gradientColor } from './../common/color';

export class RetentionGraph {
    private tbodyOption: any[] = [];
    private retentionStyle: any;
    private dateFormat: string = "日";
    private colorArr: any;//存放颜色
    private dataArr: any[] = [];//存放数据
    public style: any;//字体样式
    private dataConfig: any;//存放数据面板
    private theadOption: any = {
        left: [
            {
                "title": `首次使用${this.dateFormat}`,
            },
            {
                "title": "访客数",
            }
        ],
        right: []
    };
    public Option: any = {
        theadOption: this.theadOption,
        tbodyOption: this.tbodyOption
    }


    constructor(data: any = {}) {
        if (data && data.dataConfig) {
            this.dataConfig = data.dataConfig;
        }
        data && data.data && data.data.length && this.setRetentionData(data.data);
        data && data.style && this.setRetentionStyle(data.style);
    }

    /**
     * 设置留存图的数据
     * @param  data 原始数据
     */
    setRetentionData(data: any) {
        let sortData;
        for (let i = 0; i < data.length; i++) {
            this.tbodyOption.push({});
            let numArr = [];
            sortData = this.objKeySort(data[i]);
            for (var key in sortData) {
                if (this.dataConfig.dateDimension == key) {
                    this.tbodyOption[i].date = sortData[key];
                } else if (!this.dataConfig.dateDimension) {
                    this.tbodyOption[i].date = sortData['date'];
                }
                if (this.dataConfig.metrics && this.dataConfig.metrics[0].value == key) {
                    this.tbodyOption[i].new_user = sortData[key];
                } else if (!this.dataConfig.metrics) {
                    this.tbodyOption[i].new_user = sortData['sum_new_user'];
                }
                let arr = key.split("_");
                let titleStr = arr[arr.length - 1];
                if (titleStr && Number(titleStr)) {
                    numArr.push({ num: sortData[key]});
                }
            }
            this.tbodyOption[i]['numArr'] = numArr;
        }
        let dateArr = [];
        // for (var key in data[0]) {
        for (var key in sortData) {
            let titleStr = key.split("_")[key.split("_").length-1];
            if (titleStr && Number(titleStr)) {
                titleStr = `+${titleStr}${this.dateFormat}`;
                dateArr.push({ title: titleStr })
            }
        }
        this.theadOption['right'] = dateArr;
    }

    /**
     * 根据返回对象的key排序
     * @param a 
     * @param b 
     */
    sortKey(a: string, b: string) {
        let aArr: any = a.split("_");
        let bArr: any = b.split("_");
        if(Number(aArr[aArr.length - 1]) && Number(bArr[bArr.length - 1])){
            return aArr[aArr.length - 1] - bArr[bArr.length - 1];
        }
        return ;
    }

    /**
     * 排序乱序的对象
     * @param arys 
     */
    objKeySort(arys: any) { 
        let newkey = Object.keys(arys).sort(this.sortKey);　　 
        let newObj = {}; //创建一个新的对象，用于存放排好序的键值对
        for(let i = 0; i < newkey.length; i++) {
            //向新创建的对象中按照排好的顺序依次增加键值对
            newObj[newkey[i]] = arys[newkey[i]]; 

        }
        return newObj; //返回排好序的新对象
    }

    //title
    assign(data: any) {
        let dateArr = [];
        for (var key in data[0]) {
            let titleStr: any = key.split("_")[key.split("_").length - 1];
            if (titleStr && Number(titleStr)) {
                titleStr = Number(titleStr)
                dateArr.push(titleStr);
            }
        }
        dateArr = dateArr.sort(this.compare);
        for (let j = 0; j < dateArr.length; j++) {
            dateArr[j] = `+${dateArr[j]}${this.dateFormat}`;
        }
        return dateArr;
    }

    /**
     * 获取当前时间多少天之前的日期（不含今天）
     * @param day
     */
    getBeforeDate(day: number) {
        let nowDate = new Date().getTime();
        let range = 1000 * 60 * 60 * 24 * day;
        let beforeDate = this.formateDate(new Date(nowDate - range));
        return beforeDate;
    }

    /**
     * 格式化Date 为 “YYYY-MM-DD”
     * @param date 
     */
    formateDate(date: Date) {
        if ("string" == typeof (date)) {
            date = new Date(date);
        }
        let seperator1 = "-";
        let year = date.getFullYear();
        let month: any = date.getMonth() + 1;
        let strDate: any = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

    /**
    * 设置留存图的样式
    * @param  style 配置样式
    */
    setRetentionStyle(style: any) {
        for (let i = 0; i < this.tbodyOption.length; i++) {
            if (this.tbodyOption[i].numArr && this.tbodyOption[i].numArr.length > 0) {
                for (let j = 0; j < this.tbodyOption[i].numArr.length; j++) {
                    this.dataArr.push(this.tbodyOption[i].numArr[j].num);
                }
            }
        }
        this.dataArr = this.sortArr(this.dataArr);
        if (style.heatmap.show) {
            let gradient = gradientColor('#ffffff', style.heatmap.color, this.dataArr.length);
            this.colorArr = gradient;
            for (let i = 0; i < this.tbodyOption.length; i++) {
                if (this.tbodyOption[i].numArr && this.tbodyOption[i].numArr.length > 0) {
                    for (let j = 0; j < this.tbodyOption[i].numArr.length; j++) {
                        this.tbodyOption[i].numArr[j]['BgColor'] = this.getBgColor(this.tbodyOption[i].numArr[j].num);
                        this.tbodyOption[i].numArr[j]['FontColor'] = this.getFontColor(this.tbodyOption[i].numArr[j].num);
                        this.tbodyOption[i].numArr[j]['FontSize'] = `${style.content.fontSize}px`;
                        this.tbodyOption[i].numArr[j]['FontFamily'] = style.content.fontFamily;
                    }
                }
            }
        } else {
            for (let i = 0; i < this.tbodyOption.length; i++) {
                if (this.tbodyOption[i].numArr && this.tbodyOption[i].numArr.length > 0) {
                    for (let j = 0; j < this.tbodyOption[i].numArr.length; j++) {
                        this.tbodyOption[i].numArr[j]['BgColor'] = "";
                        this.tbodyOption[i].numArr[j]['FontColor'] = "";
                    }
                }
            }
        }
        this.style = {
            "font-size": `${style.content.fontSize}px`,
            "font-family": `${style.content.fontFamily}`
        }
    }

    /**
   * 数组排序去重
   * @param array 存储数据的数组
   */
    private sortArr(array: any) {
        var i = 0, len = array.length, j, d; for (; i < len; i++) {
            for (j = 0; j < len; j++) {
                if (array[i] < array[j]) {
                    d = array[j]; array[j] = array[i]; array[i] = d;
                }
            }
        }
        let len1 = array.length;
        for (let i = 0; i < len1; i++) {
            for (let j = i + 1; j < len1; j++) {
                if (array[i] == array[j]) {
                    array.splice(j, 1);
                    len1--;
                    j--;
                }
            }
        }
        return array
    }

    /**
    * 获取背景
    * @param value 每格的值
    */
    private getBgColor(value: any) {
        for (let i = 0; i < this.dataArr.length; i++) {
            if (this.dataArr[i] == value) {
                return this.colorArr[i];
            }
        }
    }

    /**
    * 获取字体颜色
    * @param  value 每格的值
    */
    private getFontColor(value: any) {
        let arr = [];
        for (let i = 0; i < this.dataArr.length; i++) {
            arr.push(Number(this.dataArr[i]));

        }
        for (let i = 0; i < arr.length; i++) {
            if (value >= arr[arr.length / 2]) {
                return "#ffffff"
            } else {
                return "#333333"
            }
        }
    }

    compare = function (x: any, y: any) {//比较函数
        if (x < y) {
            return -1;
        } else if (x > y) {
            return 1;
        } else {
            return 0;
        }
    }


}
