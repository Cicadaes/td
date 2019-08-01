import { DataStore } from "cosmos-td-sdk";

export class TableGraph {
    style = {
       
    }
    data:any = [];
    public dimensions:any = [];
    public metrics:any = [];
    public sort:any;
    constructor(data: any = {},scope:string) {
        if(scope && scope.length > 0){
            let dataConfig = DataStore.getConfigData(scope)['dataConfig'];
            this.dimensions = dataConfig.dimensions && JSON.parse(JSON.stringify(dataConfig.dimensions));
            this.metrics = dataConfig.metrics && JSON.parse(JSON.stringify(dataConfig.metrics));
            this.sort = dataConfig.orderBy && JSON.parse(JSON.stringify(dataConfig.orderBy));
        }
        

        data && data.data && data.data.length && this.setTableData(data.data);
    }

    /**
     * 解析数据成业务表格格式
     * @param  {any}       gpdata [description]
     */
    setTableData(gpdata: any[] = []) {
        this.data = gpdata
    }


    /**
     * 设置数据类型
     * @param  {any}       dataitem [description]
     * @param  {string =        'bar'}       gptype [description]
     * @return {[type]}             [description]
     */
    setDataType(DATA_TYPE: number = 0, gptype: string = 'table') {

    }



}
