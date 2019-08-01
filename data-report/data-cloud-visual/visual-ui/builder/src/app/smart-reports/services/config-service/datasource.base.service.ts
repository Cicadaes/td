import { StyleviewBaseService } from './styleview.base.service';
import any = jasmine.any;

export class DatasourceBaseService extends StyleviewBaseService {
    constructor() {
        super()
    }
    DataSourceMetadata: Array<any>
    DataSourceViewCurrent: Array<any>
    DataSourceIdCurrent:Number;
    DataSourceIdName:string;
    dataParameterView: any;
    dataDateView: any;
    QueryType: Number;
    getDatasourceByName(nameVal: any): any {

        let ft,
            name:string = "";
        if(nameVal.constructor === String){
            name = nameVal;
        }else{
            name = nameVal[0].name
        }
        if (this.DataSourceMetadata.length) {
            ft = this.DataSourceMetadata.filter(item =>
                item.name.toLowerCase() === name.toLowerCase()

            )
            return JSON.parse(JSON.stringify(ft[0]))
        } else {
            return {}
        }
    }

    getDatasourceMetaData(): any {
        return JSON.parse(JSON.stringify(this.DataSourceMetadata[0]))
    }

    filterFieldKey(field: any) {
        let fd = {}, nv
        if (field.viewType === 22 && typeof field.value === 'object' && typeof field.value.start !== 'number') {
            nv = { start: Date.parse(field.value.start), end: Date.parse(field.value.end), status: field.value.status }
        } else if (field.viewType === 22 && typeof field.value === 'string') {
            nv = JSON.parse(field.value)
        }

        for (let ckey in field) {
            switch (ckey) {
                case "code":
                    fd[ckey] = field[ckey];
                    break;
                case "value":
                    fd[ckey] = nv || field[ckey];
                    break;

            }
        }
        return fd
    }

    handlerChildFields(fields: Array<any>, tc: Array<any>) {
        fields.forEach((field: any) => {
            Array.prototype.push.call(tc, this.filterFieldKey(field));
            if (field.viewType === 21 && field.childrenFields.length) {
                this.handlerChildFields(field.childrenFields, tc)
            }
        })
    }

    public getNewParameter(data:any): void {
        this.dataParameterView = data;
    }

    public formatDate(date:any):any {
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y+M+D+h+m+s
    }

    getFieldParameters(keyType: string):any[] {
        let tc: Array<any> = [];
        this.dataParameterView = this.DataSourceViewCurrent[1];
        this.dataDateView =  this.DataSourceViewCurrent[2];
        if (this.DataSourceMetadata || this.dataParameterView) {
            for(let item of this.dataParameterView.fields){
                for(let key in item){
                    if(key == "code" && item[key].search('dimension') !== -1 && keyType == "dimensions"){
                        let dimensionArr :Array<any> = [];
                         if(item.value !== null && item.value.length > 0){
                             dimensionArr = item.value;
                         }else{
                             dimensionArr.push({
                                 name: "",
                                 id: ""
                             })
                         }
                        for(let item of dimensionArr){
                            tc.push(item.name + "");
                        }
                    }

                    if(key == "code" && item[key].search('metric') !== -1 && keyType == "metrics"){
                        let metricArr :Array<any> = [];
                        metricArr = item.value;
                        for(let item of metricArr){
                            tc.push(item.name + "");
                        }
                    }

                    if(key == "code" && item[key].search('metric') !== -1 && keyType == "orderBy"){
                        let metricArr :Array<any> = [];
                        metricArr = item.value;
                        for(let item of metricArr){
                            tc.push(item.name + "");
                        }
                    }
                }


            }
        }
        if (this.DataSourceMetadata || this.dataDateView) {
            let dataDate;
            for(let item of this.dataDateView.fields){
                for(let key in item){
                    if(key == "code" && item[key].search('date') !== -1 && keyType == "filters"){
                        if (item.viewType === 22 && typeof item.value === 'object') {
                            tc = [{
                                field: 'create_dt',
                                operator: '>=',
                                value: item.value.start
                            },{
                                field: 'create_dt',
                                operator: '<=',
                                value: item.value.end
                            }]
                        }
                    }
                }


            }
        }

        return tc
    }

    getParameterValue(key: string): any {
        let val;
        switch (key) {
            case 'datasource_id': val = 0; break;
            case 'dimensions': val = this.getFieldParameters('dimensions'); break;
            case 'metrics': val = this.getFieldParameters('metrics'); break;
            case 'filters': val = this.getFieldParameters('filters'); break;
            case 'limit': val = []; break;
            case 'orderBy': val = this.getFieldParameters('metrics'); break;
            case 'queryType': val = this.QueryType; break;
            default: throw new Error('end data err...');
        }
        return val
    }
    getCallbackParameter(callBackInfo: any): any {
        let actionHash = JSON.parse(JSON.stringify(callBackInfo.actionParams));
        if (!Array.isArray(actionHash)) {
            return console.warn('MENG_OPERA:no operator parameters!')
        }
        // let formData = new FormData();
        let formData = {};
        actionHash.forEach((hitem: any) => {
            // formData.append(hitem, this.getParameterValue(hitem))
            formData[hitem] = this.getParameterValue(hitem)
        })

        return formData
    }
    todoCallback(callBackInfo: any, cb: any) {
        let cbUrl = callBackInfo.actionValue;
        if (cbUrl) {
            if (cbUrl.search('/') == 0) {
                cbUrl = cbUrl.substr(1)
            }
            cb && cb(this.getCallbackParameter(callBackInfo), cbUrl)

        }
    }


    //改变multipleMaxNumber值
    todoMultipleMaxNumber(multipleSize:any,datasourceData:Array<any>){
        for(let item of datasourceData){
            this[item.code] = item;
        }
        eval(multipleSize);
    }

}