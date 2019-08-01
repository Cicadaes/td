/**
 * Created by meng on 2017/3/6.
 */
import { Component, Input, Output, EventEmitter, OnInit  } from '@angular/core';
import { StageResourceService } from './../../../../services/stage-service/stage.resource.service';
import { StageService } from './../../../../services/stage.service';
import {DatasourceBaseService} from "./../../../../services/config-service/datasource.base.service";


@Component({
    selector: 'tconfig-datalist-select',
    templateUrl: 'tconfig-datalist-select.component.html'
})
export class TconfigDataListSelectComponent implements OnInit {
    @Input() tconfig: any;
    @Output() onRender = new EventEmitter<any>()
    private results:Array<any> = [];
    private delResults:Array<any> = [];
    private options: Array<any> = [];
    private chooseArr:Array<any> = [];
    private callBackInfo: any;
    private datasourceViewData:Array<any> = [];
    private dataType:string = "";
    private getResultBool:boolean = false;
    private changeDataBool:boolean = false;


    constructor(private stageService: StageService,
                private stageResourceService: StageResourceService,
                private datasourceService: DatasourceBaseService) {
        this.stageService.PostDataSource$.subscribe((data:any)=>{
            // console.log(this.tconfig)
            this.chooseArr = [];
            this.results = [];
            if(this.tconfig.optionValues !==null){
                this.setOption(this.tconfig.optionValues);
            }
            if(this.tconfig.requried !== 1){
                this.setChooseArr()
            }else{
                this.chooseArr = []
            }

        })
    }


    setChooseArr(){
        if(this.tconfig.value.length>0){
            this.chooseArr = [];
            for(let i of this.tconfig.value){
                this.chooseArr.push({
                    id: i.id,
                    name: i.name,
                    selected: true
                });
            }
        }else{
            this.tconfig.value = null;
        }
    }

    ngOnInit() {

        if(this.tconfig.value !== null){
            this.setChooseArr()
        }else{
            this.chooseArr = []
        }

        this.addDataType(this.tconfig.code)

        this.handlerOptions(null, () => {
            // this.getCallbackInfo()
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


    setOption(optionArr:Array<any>){
        optionArr.forEach((item: any, index: number) => {
            this.results.push({
                selected: false,
                name: item.name,
                id: item.id
            })
        });
    }


    handlerOptions(opt?: any, cb?: any){
        this.setOption(this.tconfig.optionValues);
        cb && cb();
    }
   

    search(event: any) {
        //event.query = current value in input field

    }


    deleteValue(valueArr:Array<any>,event:any){
        for (var i = 0; i < valueArr.length; i++) {
            if (valueArr[i].name == event.name) {
                valueArr.splice(i, 1);
            }
        }
    }

    changeValue(valueArr:Array<any>){
        for (var i = 0; i < valueArr.length; i++) {
            if (valueArr[i].selected) {
                valueArr.splice(i, 1);
            }
        }
    }

    unselect(event: any) {
        this.deleteValue(this.chooseArr,event);
        this.handlerData(event);
        this.hiddenResult();
    }

    hiddenResult(){
        this.getResultBool = false;
        let smartRight = document.querySelector(".smart-right");
        smartRight.className = "smart-right";
    }

    showResult(){
        this.getResultBool = true;
        let smartRight = document.querySelector(".smart-right");
        smartRight.className = "smart-right smart-overflow";
    }


    chooseData(event: any) {
        if(this.changeDataBool){
            this.changeValue(this.chooseArr);
        }
        this.chooseArr.push(event)
        this.handlerData(event);
        this.hiddenResult();

    }

    getResultData(e:any) {
        if(e !== ""){
            this.changeDataBool = true;
        }else{
            this.changeDataBool = false;
        };
        this.showResult();
        this.resultsSeleted(this.results);
        this.judgeExist(this.chooseArr,this.results);
    }

    resultsSeleted(resultArr:Array<any>){
        for(let item of resultArr){
            item.selected = false;
        }
    }

    judgeExist(chooseArr:Array<any>,resultArr:Array<any>){
        if(chooseArr.length > 0){
            for(let j of chooseArr){
                for(let item of resultArr){
                    if(item.name == j.name){
                        item.selected = true;
                    }
                }
            }
        }

    }

    handlerData(event:any) {

        let e;
        if(this.chooseArr.length > 0){
            this.tconfig.value = this.chooseArr;
            e = {
                tconfig : this.tconfig,
                value: {
                    name: event.name
                }
            };
        }else{
            this.tconfig.value = null;
            e = {
                tconfig : this.tconfig,
                value: {
                    name: null
                }
            };
        }

        this.onRender.emit(e);

    }

    datasourceBack(){
        this.getResultBool = false;
    }

    handleDropdownClick() {

    }


    getCallbackInfo() {
        let vd = this.tconfig.viewMetaData;
        if (vd) {
            try {
                this.callBackInfo = JSON.parse(vd);
            } catch (e) {
                console.warn(e)
            }
        }
    }
}