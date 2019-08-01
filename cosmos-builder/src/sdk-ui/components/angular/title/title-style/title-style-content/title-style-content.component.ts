import { Component, OnInit, OnDestroy, Input, ElementRef, Output, EventEmitter, ViewContainerRef,ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { TitleProcedureService } from './title-style-content.service';
import { Subscription } from 'rxjs/Subscription';
import { DataStore } from 'cosmos-td-sdk';
import { ConfigApi } from '../../../../../api/config-api';
import { ReportConfigService } from '../../../../../../sdk-ui/service/report-config.service';



@Component({
    selector: 'title-content',
    templateUrl: './title-style-content.component.html',
    styleUrls: ['./title-style-content.component.less'],
    providers: [FormBuilder]
})
export class TitleContentComponent implements OnInit {

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
    describes: Array<any> = [];
    names: Array<any> = [];
    resultarr: boolean = false;//开关1事件

    disiable:boolean = true;

    //下拉框
    dimensionList: Array<any> = [];
    @ViewChild('scroll') scroll: any;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private _notification: CmNotificationService,
        private store: Store<{ formValidator: any }>,
        private TitleProcedureService: TitleProcedureService,
        private reportConfigService: ReportConfigService,
        public configApi: ConfigApi,
    ) {
        this.subscription = this.TitleProcedureService.missionshowSource$.subscribe((data: any) => {
            this.showModalMiddle()
            let config = DataStore.getConfigData(this.configApi.scope);
            let styleConfig = config && config["styleConfig"];
            if (styleConfig && styleConfig.gridHelp.content) {
                let table = this.deepCopy(styleConfig.gridHelp.content);
                this.stepArray = [];
                for (let i = 0; i < table.length; i++) {
                    if (table[i].name !== "") {
                        this.stepArray.push(table[i])
                    }
                }
            } else {
                this.addField(undefined)
            }
            /**
             * 长度
             */
            if (this.stepArray.length < 7) {
                this.add = true;
            } else {
                this.add = false;
            }
        });
    }
    showModalMiddle() {             //显示
        this.isVisibleMiddle = true;
        this.disiable = false;
    };
    /**
     *  确定
     * @param val
     */
    saveTheDataSource(val: any) {
        let table = this.deepCopy(val);
        if (table[0].name == "") {
            this.decide = true;
            this.promptMessage = "至少填写一个名称";
        } else {
            this.databases = [];
            this.names = [];
            this.describes = [];
            for (let i = 0; i < table.length; i++) {
                if (table[i].name !== "") {
                    this.databases.push(table[i]);
                    this.names.push(table[i].name);
                    this.describes.push(table[i].describe);
                }
            }
            keys: for (let l = 0; l < this.names.length; l++) {
                for (let k = l + 1; k < this.names.length; k++) {
                    if (this.names[l] == this.names[k]) {
                        this.resultarr = false;
                        break keys;
                    } else {
                        this.resultarr = false;
                    }
                }
            }
            if (this.resultarr) {
                this.decide = true;
                return this.promptMessage = "名称不能为一致!!";
            }
            if (!this.resultarr) {
                this.TitleProcedureService.SAVE(this.databases)
                this.decide = false;
                this.isVisibleMiddle = false;
            }
        }
    }

    setDisiable(val:any){
        for(let i=0;i<val.length;i++){
            if(val[i].nameRequire || val[i].descRequire){
                this.disiable = true;
                return;
            }else if(!val[i].nameRequire && !val[i].descRequire){
                this.disiable = false;             
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
    };

    @ViewChild('titleModal') titleModal: any;
    /**
     * 添加
     * @param e 
     */
    addField(e?: MouseEvent) {
        
        // if (this.stepArray.length < 7) {
        //     this.add = true;
        // } else {
        //     this.add = false;
        // }
        if (e == undefined) {
            this.stepArray = [
                {
                    describe: '',
                    name: '',
                    id: 0,
                },
            ]
        } else {
            const id = (this.stepArray.length > 0) ? this.stepArray[this.stepArray.length - 1].id + 1 : 0;
            this.stepArray.push({
                describe: '',
                name: '',
                id: id,
            },
            )
        }
        setTimeout(() => {
            // 滚动条
            if (this.scroll && this.scroll.nativeElement.offsetHeight && this.scroll.nativeElement.offsetHeight == 190) {
                this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight - this.scroll.nativeElement.offsetHeight
            }
        }, 0);
        this.setDisiable(this.stepArray);
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
        this.setDisiable(this.stepArray);
    }
    ngOnInit() {
    }
    funnelChanges() {
    }
    nameChange(step:any){
        step.name = step.name.replace(/\s/g,"");
        if(step.name.length == 0 ){
            step['nameRequire'] = true;
        }else{
            step['nameRequire'] = false;           
        }
        step.describe = step.describe.replace(/\s/g,"");
        if(step.describe.length == 0 ){
            step['descRequire'] = true;
        }else{
            step['descRequire'] = false;
        }
         this.setDisiable(this.stepArray);
    }
    // 深拷贝
    private deepCopy(data: any): any {
        let json = JSON.stringify(data);
        return JSON.parse(json);
    }
}





