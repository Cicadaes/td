import { Component, OnInit, OnDestroy, Input, ElementRef, Output, EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { funnelProcedureService } from './funnel-procedure.service';
import { Subscription } from 'rxjs/Subscription';
import { DataStore } from 'cosmos-td-sdk';
import { ConfigApi } from '../../../../../api/config-api';
import { ReportConfigService } from '../../../../../../sdk-ui/service/report-config.service';



@Component({
    selector: 'funnel-procedure',
    templateUrl: './funnel-procedure.component.html',
    styleUrls: ['./funnel-procedure.component.less'],
    providers: [FormBuilder]
})
export class FunnelProcedureComponent implements OnInit {

    add: boolean = true;         //添加显示?
    private funnels: any;
    private _cubeId: number;
    private subscription: Subscription;
    private filter: any;
    private DaTa: any;
    private Value: any;
    isVisibleMiddle: boolean = false;
    isConfirmLoading: boolean = false;
    //默认数组
    stepArray: Array<any> = [];
    private database: Array<any> = []; //中间数
    databases: any = [];
    //提示开关
    decide: boolean = false;
    //提示信息
    promptMessage: any;
    gists: Array<any> = [];
    names: Array<any> = [];
    resultarr: boolean = false;//开关1事件
    latttarr: boolean = false;//开关2事件命名

    //下拉框
    dimensionList: Array<any> = [];
    @ViewChild('scroll') scroll: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private _notification: CmNotificationService,
        private store: Store<{ formValidator: any }>,
        private funnelProcedureService: funnelProcedureService,
        private reportConfigService: ReportConfigService,
        public configApi: ConfigApi,
        public ElementRef: ElementRef,
    ) {
        this.subscription = this.funnelProcedureService.missionshowSource$.subscribe((data: any) => {
            this.showModalMiddle()
            if (data) {
                let table = this.deepCopy(data);
                this.stepArray = [];
                for (let i = 0; i < table.length; i++) {
                    if (table[i].gist !== "") {
                        this.stepArray.push(table[i])
                    }
                }
            } else {
                this.addField(undefined)
            }
            if (this.stepArray.length < 7) {
                this.add = true;
            } else {
                this.add = false;
            }
        });

        /**
         * 下拉框
         */
        this.subscription = this.funnelProcedureService.missionupdateFunnel$.subscribe((data: any) => {
            //全局过滤器处理
            let globalData = DataStore.getGlobalData() && DataStore.getGlobalData()["filter"];
            // let globalData = DataStore.getGlobalData();
            let content: any, conditions: any = [];

            if (globalData && globalData.length) {
                globalData.forEach((item: any) => {
                    let field: any;
                    field = this.getParamByName(item["field"])
                    if (field) {
                        conditions.push({ "field": item["field"], "operator": item["operator"], "value": field })
                    } else {
                        conditions.push({ "field": item["field"], "operator": item["operator"], "value": item["value"] })
                    }
                })

                // content = [{ "type": "and", "condition": [{ "field": globalData[0]["field"], "operator": globalData[0]["operator"], "value": globalData[0]["value"] }] }];
                content = [{ "type": "and", "condition": conditions }];

            } else {
                content = [];
            }
            this.reportConfigService.queryChartData([{ "cubeId": data.cube, "dimensions": [{ "field": data.query }], "groupBy": [{ "field": data.query }], "dictionary": true, "filters": content, "limit": { "page": 1, "pageSize": 100 } }]).then(data => {
                this.dimensionList = [];
                if (data && data["_body"]) {
                    data = JSON.parse(data["_body"]);
                    this.Value = data["data"][0]["data"]
                    for (let i = 0; i < this.Value.length; i++) {
                        //for (var key in this.Value[i]) {
                        // this.dimensionList.push(this.Value[i][key])
                        //}
                        this.dimensionList.push({ "label": this.Value[i]["dicItemValue"], "id": this.Value[i]["id"] })
                    }
                }
            }).catch(err => { });
        });
    }
    showModalMiddle() {             //显示
        this.isVisibleMiddle = true;
    };
    /**
     *  确定
     * @param val
     */
    saveTheDataSource(val: any) {
        let table = this.deepCopy(val);
        if (table[0].gist == "") {
            this.decide = true;
            this.promptMessage = "至少选择一个事件";
        } else {
            this.databases = [];
            this.gists = [];
            this.names = [];
            for (let i = 0; i < table.length; i++) {
                if (table[i].gist !== "") {
                    this.databases.push(table[i]);
                    this.gists.push(table[i].gist);
                    this.names.push(table[i].name);
                }
            }
            keys: for (let l = 0; l < this.gists.length; l++) {
                for (let k = l + 1; k < this.gists.length; k++) {
                    if (this.gists[l] == this.gists[k]) {
                        this.resultarr = true;
                        break keys;
                    } else {
                        this.resultarr = false;
                    }
                }
            }
            if (this.resultarr) {
                this.decide = true;
                return this.promptMessage = "事件不能被重复选择";
            }
            if (!this.resultarr) {
                this.funnelProcedureService.SAVE(this.databases)
                this.decide = false;
                this.isVisibleMiddle = false;
            }
        }
    }
    /**
     * 取消
     */
    handleCancelMiddle(e: any) {
        this.isVisibleMiddle = false;
        this.decide = false;
        this.resultarr = false;
        this.latttarr = false;
    };
    /**
     * 添加
     * @param e 
     */
    addField(e?: MouseEvent) {

        if (this.stepArray.length < 7) {
            this.add = true;
        } else {
            this.add = false;
        }
        if (e == undefined) {
            this.stepArray = [
                {
                    gist: '',
                    name: '',
                    id: ''
                },
            ]
        } else {
            this.stepArray.push(
                {
                    gist: '',
                    name: '',
                    id: ''
                },
            )
        }
        setTimeout(() => {
            // 滚动条
            if (this.scroll && this.scroll.nativeElement.offsetHeight && this.scroll.nativeElement.offsetHeight == 190) {
                this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight - this.scroll.nativeElement.offsetHeight
            }
        }, 0);

    }
    /**
     * 删除
     */
    removeFunnel(i: any) {
        this.resultarr = false;
        if (this.stepArray.length < 9) {
            this.add = true;
        } else {
            this.add = false;
        }
        if (this.stepArray.length > 1) {
            const index = this.stepArray.indexOf(i);
            this.stepArray.splice(index, 1);
        }
    }
    ngOnInit() {
    }
    funnelChanges(data: any, type: any, number: any) {
        for (let i = 0; i < this.dimensionList.length; i++) {
            if (data["id"] == this.dimensionList[i]["id"]) {
                data["gist"] = this.dimensionList[i]["label"];
            }
        }
    }
    // 深拷贝
    private deepCopy(data: any): any {
        let json = JSON.stringify(data);
        return JSON.parse(json);
    }
    /**
    * 获取URL
    * @param name 
    */
    getParamByName(name: string) {
        var search = document.location.href;
        var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
        var matcher = pattern.exec(search);
        var items = null;
        if (null != matcher) {
            try {
                items = decodeURIComponent(decodeURIComponent(matcher[1]));
            } catch (e) {
                try {
                    items = decodeURIComponent(matcher[1]);
                } catch (e) {
                    items = matcher[1];
                }
            }
        }
        return items;
    };
}





