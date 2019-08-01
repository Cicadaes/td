/**
 * Created by meng on 2017/3/6.
 */
import { Component, Input, Output, EventEmitter, OnInit  } from '@angular/core';
import { StageResourceService } from './../../../../services/stage-service/stage.resource.service';
import { StageService } from './../../../../services/stage.service';
import {DatasourceBaseService} from "./../../../../services/config-service/datasource.base.service";


@Component({
    selector: 'tconfig-autocomplete-list',
    templateUrl: 'tconfig-autocomplete-list.component.html'
})
export class TconfigAutoCompleteListComponent implements OnInit {
    @Input() tconfig: any;
    @Output() onRender = new EventEmitter<any>()
    private results:Array<any> = [];
    private delResults:Array<any> = [];
    private options: Array<any> = [];
    private metricValue:Array<any> = [];
    private callBackInfo: any;
    private datasourceViewData:Array<any> = [];
    private dataType:string = "";

    constructor(private stageService: StageService,
                private stageResourceService: StageResourceService,
                private datasourceService: DatasourceBaseService) {
        this.stageService.PostDataSource$.subscribe((data:any)=>{
            let options;
            let option = this.tconfig.optionValues;
            options = option.split(',');
            this.delResults = [];
            this.metricValue = [];
            this.results = [];
            options.forEach((item: any, index: number) => {

                if(this.tconfig.value !== item){
                    this.delResults.push(item)
                }
            })
            if(this.tconfig.requried !== 1){
                this.metricValue = this.tconfig.value.split(',');
            }else{
                this.metricValue = []
            }

        })
    }

    ngOnInit() {
        if (this.tconfig.code != 'dataSource') {
            if(this.tconfig.value){
                this.metricValue = this.tconfig.value.split(',');
            }else{
                this.metricValue = []
            }
        }else{
            this.metricValue.push(this.tconfig.value.name);
        }
        this.addDataType(this.tconfig.code)

        this.handlerOptions(null, () => {
            this.getCallbackInfo()
        });

    }

    addDataType(type:string){
        if(type == "dimension_0"){
            this.dataType = "+ 添加维度"
        }
        if(type == "dimension_1"){
            this.dataType = "+ 添加细分维度"
        }
        if(type == "dataSource"){
            this.dataType = "选择数据源"
        }
        if(type == "metric"){
            this.dataType = "+ 添加指标"
        }
    }

    getCallbackInfo() {
        let vd = this.tconfig.viewMetaData;
        if (vd) {
            try {
                this.callBackInfo = JSON.parse(vd)
            } catch (e) {
                console.warn(e)
            }
        }
    }


    handlerOptions(opt?: any, cb?: any){
        let options;
        let option = this.tconfig.optionValues;
        if (this.tconfig.code != 'dataSource') {
            options = option.split(',');
            options.forEach((item: any, index: number) => {
                this.results.push(item)
            });
        }else{
            option.forEach((item: any, index: number) => {
                this.results.push(item.name)
            });
        }

        let temp = []; //临时数组1
        let temparray = [];//临时数组2
        for(let i=0;i<this.metricValue.length;i++){
            temp[this.metricValue[i]] = true;
        }
        for (var i = 0; i < this.results.length; i++) {
            if (!temp[this.results[i]]) {
                temparray.push(this.results[i]);
            }
        }

        this.delResults = temparray;

        cb && cb();
    }
   

    search(event: any) {
        //event.query = current value in input field

    }

    unselect(event: any) {
        console.log(this.delResults);
        this.delResults.push(event);
        this.handlerData();
    }

    select(event: any) {
        for (var i = 0; i < this.delResults.length; i++) {
            if (this.delResults[i] == event) {
                this.delResults.splice(i, 1);
            }
        }
        console.log(this.delResults);
        this.handlerData();
    }



    click(event: any) {
        console.log(this.delResults)

        this.results = [];
        setTimeout(() => {
            this.results = this.delResults;
        }, 100)

    }

    handlerData() {
        let tconfigValue = this.metricValue,
            tconfigResult,
            e;

        tconfigResult = tconfigValue.join(",");
        this.tconfig.value = this.tconfig.defaultValue = tconfigResult;
        e = {
            tconfig : this.tconfig,
            value: {
                name: this.metricValue
            }
        };

        this.datasourceViewData = this.stageService.DataSourceViewCurrent[1].fields;
        this.datasourceService.todoMultipleMaxNumber(e.tconfig.verifyRule,this.datasourceViewData)

        this.onRender.emit(e)
    }

    handleDropdownClick() {

    }

    // load options
    onFocus(e: any) {
        if (this.callBackInfo) {
            if (this.callBackInfo.action === 'callBack') {
                this.stageService.todoCallback(this.callBackInfo, (parameters: any, api: string) => {
                    this.options = [];
                    this.stageResourceService.datacb(parameters, api, false).then((d: any) => {
                        this.handlerOptions(d)
                    })
                })
            }
        }

    }
}