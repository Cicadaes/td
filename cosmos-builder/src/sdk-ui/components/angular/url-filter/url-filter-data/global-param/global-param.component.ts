import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalParamService } from './global-param.service';
import { DataStore } from 'cosmos-td-sdk';
import { Subscription } from 'rxjs';
import { ReportConfigService } from '../../../../../service/report-config.service';
@Component({
	selector: 'app-global-param',
	templateUrl: './global-param.component.html',
	styleUrls: ['./global-param.component.less']
})
export class GlobalParamComponent implements OnInit {

	isVisibleMiddle: boolean = false;

	selectedParamInfo: any = [];//参数配置列表
	paramList: any = []; //参数列表
	operatorList: any = [];//运算符列表

	showError: boolean = false;//展示错误信息
	errorMsg: string = "配置不完整";//错误提示信息

    private subscription: Subscription;
    
    @ViewChild('scroll') scroll: any;

    constructor(
        private globalParamService: GlobalParamService,
        private reportConfigService: ReportConfigService,
	) {
		reportConfigService.queryGlobalParamList().then(data=> {
            this.paramList = data;
        });
		this.operatorList = [{
            label: "=",
            value: "="
		}]
		
        this.subscription = this.globalParamService.missionShowModal$.subscribe(data => {
			if(data){
				this.isVisibleMiddle = true;
				this.initGlobalParam();
			}
		});
	}

	ngOnInit() {

	}
	
	initGlobalParam() {
        let globalData = DataStore.getGlobalData();
        if (globalData && globalData["filter"] && globalData['filter'].length > 0) {
            this.selectedParamInfo = JSON.parse(JSON.stringify(globalData['filter']));
        } 
    }
    /**
     * 取消
     */
    handleCancelMiddle(e: any) {
        this.selectedParamInfo = [];
        this.isVisibleMiddle = false;
        this.showError = false;
	};
	
	/**
     * 添加参数信息
     */
    addParamInfo() {
        this.selectedParamInfo.push({
            "field": "",
            "operator": "=",
            "value": ""
        });
        setTimeout(() => {
            // 滚动条
            if (this.scroll && this.scroll.nativeElement.offsetHeight && this.scroll.nativeElement.offsetHeight == 190) {
                this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight - this.scroll.nativeElement.offsetHeight
            }
        }, 0);
    }

    /**
     * 删除参数
     * @param data 
     * @param index 
     */
    removeParam(data: any, index: number) {
		this.showError = false;
        data.splice(index, 1);
    }

    /**
     * 改变参数
     * @param value 
     */
    changeParam(value: any, index: number) {
		this.showError = false;
        this.selectedParamInfo[index]["value"] = "";
	}
	
	/**
     * 改变参数值
     * @param value 
     */
    changeValue(value: any) {
        this.showError = false;
    }

    /**
     * 构建参数条件，并保存
     */
    buildParamInfo() {
        let data: any[] = [];
        let fields: any[] = [],repeat = false;
        if (this.selectedParamInfo && this.selectedParamInfo.length > 0) {
            this.selectedParamInfo.forEach((element: any) => {
                if (element["field"] && element["value"]) {
                    data.push(element);
                    if(fields.indexOf(element["field"]) > -1) {
                        repeat = true;
                    }
                    fields.push(element["field"]);
                } else {
					this.showError = true;
                }
            });
		}
        if(this.showError){
            this.errorMsg = "配置不完整";
            return ;
        }

        if(repeat){
            this.showError = true;
            this.errorMsg = "参数重复";
            return ;
        }

        let obj = {
            filter: data
		}
		let globalData = DataStore.getGlobalData();
		globalData? Object.assign(globalData, obj): globalData = obj;
		DataStore.saveGlobalData(globalData);
		this.isVisibleMiddle = false;
		this.globalParamService.showModal(false);
    }
	
	/**
	 * 保存参数
	 * @param data
	 */
	saveParam(data: any){
		this.buildParamInfo();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
