import { DataStore } from "cosmos-td-sdk";

export class GridGraph {
    style = {
        gridName: {
            color: "#515A6E",
            fontFamily: "Microsoft YaHei",
            fontSize: 12,
            name: ''
        },
        gridColor: {
            bg:"#515A6E",
            even:"#515A6E",
            odd:"#515A6E",
            style:"#515A6E"
        },
        gridValue: {
            color:"#515A6E",
            decimals:2,
            fontFamily:"Microsoft YaHei",
            fontSize:12
        },
        gridDownload: {
            show: false
        },
        gridHelp: {
            show: false
        },
        bgAndBorder: {
            backgroundColor:"rgba(0,0,0,0)",
            borderColor:"rgba(0,0,0,0)",
            borderRadius:"0px",
            borderStyle:"solid",
            borderWidth:"0",
            boxShadow:"none"
        }
    }
    data:any = [];
    private dimensions:any = [];
    private metrics:any = [];
    constructor(data: any = {},scope:string) {
        if(scope && scope.length > 0){
            let dataConfig = DataStore.getConfigData(scope)['dataConfig'];
            console.log(dataConfig)
            this.dimensions = dataConfig.dimensions && JSON.parse(JSON.stringify(dataConfig.dimensions));
            this.metrics = dataConfig.metrics && JSON.parse(JSON.stringify(dataConfig.metrics));
        }
        

        data && data.data && data.data.length && this.setGridData(data.data);
        data && data.style && this.setGridStyle(data.style)
    }

    /**
     * 解析数据成业务表格格式
     * @param  {any}       gpdata [description]
     */
    setGridData(gpdata: any[] = []) {
       console.log(gpdata);
       let data = this.handleData(gpdata);
       this.data = [];
        for(let key in data){
            this.data.push(data[key])
        }
        console.log(this.data)
    }

    /**
     * 处理数据
     * @param gpdata 
     */
    handleData(gpdata: any[] = []){
        let data = {};
        for(let obj of gpdata){
            if(!data[obj.X]){
                data[obj.X] = {};
                data[obj.X][this.dimensions[0]['value']] = obj.X;
            }

            if(this.metrics.length == 1){
                data[obj.X][this.metrics[0]['value']] = obj.Y;
            }else{
                data[obj.X][obj.Legend] = obj.Y
            }
                
        }
        console.log(data)
        return data;
    }



    /**
     * 设置数据类型
     * @param  {any}       dataitem [description]
     * @param  {string =        'bar'}       gptype [description]
     * @return {[type]}             [description]
     */
    setDataType(DATA_TYPE: number = 0, gptype: string = 'grid') {

    }


    /**
     * 图表样式数据转换
     * @param  {any}    gpstyle [description]
     * @return {[type]}         [description]
     */
    setGridStyle(data: any) {

        data && this.setgridItemStyle(data);
    }

    /**
     * 遍历网格的series，设置线图的itemstyle
     * @param  {any}    data [description]
     * @return {[type]}      [description]
     */
    private setgridItemStyle(data: any = {}) {
        data.gridName;
        data.gridColor;
        data.gridValue;
        data.gridDownload;
        data.gridHelp;
        data.bgAndBorder;
    }
}
