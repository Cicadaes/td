import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { DataDirective } from './report-data.directive';
import { StyleDirective } from './report-style.directive';
import { ConfigApi } from '../../../../../../sdk-ui/api/config-api';
import { ComponentEvent, EventEmitter, DataStore } from 'cosmos-td-sdk';

@Component({
    selector: 'dynamic-load',
    templateUrl: './dynamic-load.component.html',
    styleUrls: ['./dynamic-load.component.less']
})
export class DynamicLoadComponent implements OnInit {

    isNoLoad: boolean = true; //配置面板没有加载图表组建
    showType: string = "data";//配置面板显示  data:数据配置面板；style:样式配置面板

    pannelType: string = "data";

    disableDataConfig: boolean = false;//禁用数据配置
    disableStyleConfig: boolean = false;//禁用样式配置

    @ViewChild(StyleDirective) styleHost: StyleDirective;
    @ViewChild(DataDirective) dataHost: DataDirective;

    constructor(
        private configApi: ConfigApi,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private cdref: ChangeDetectorRef, 
    ) {

    }

    ngOnInit() {
        //拖拽图表时触发；
        EventEmitter.register(ComponentEvent.COMSELECT, this.loadComponent, this);

        EventEmitter.register(ComponentEvent.STAGECLICK, this.switchStage, this);
    }

    ngOnDestroy() {
        EventEmitter.unRegister(ComponentEvent.COMSELECT, this.loadComponent, this);

        EventEmitter.unRegister(ComponentEvent.STAGECLICK, this.switchStage, this);
    }

    /**
     * 按需加载组件
     */
    loadComponent(e: any, data: any) {
        this.configApi.scope = data["scope"];//保存当前的scopeId
        this.configApi.type = data["type"];//保存当前的图表类型
        this.configApi.linkageData = null;

        this.initComponent();
        //拖拽图表时触发；
        if(data.scope){
            this.isNoLoad = false;
            //根据选中的图表类型，加载组件
            let typeComponent = this.getComponentByType(data["type"]);
            //样式面板加载
            if(!typeComponent["styleConfig"]){
                this.disableStyleConfig = true;
                this.showType = "data";
            }else{
                let styleComponentFactory = this._componentFactoryResolver.resolveComponentFactory(typeComponent["styleConfig"]);
                let styleViewContainerRef = this.styleHost.viewContainerRef;
                styleViewContainerRef.clear();
                styleViewContainerRef.createComponent(styleComponentFactory);
            }
            
            //数据面板加载
            if(!typeComponent["dataConfig"]){
                this.disableDataConfig = true;
                this.showType = "style";
            }else{
                let dataComponentFactory = this._componentFactoryResolver.resolveComponentFactory(typeComponent["dataConfig"]);
                let dataViewContainerRef = this.dataHost.viewContainerRef;
                dataViewContainerRef.clear();
                dataViewContainerRef.createComponent(dataComponentFactory);
            }
            // this.cdref.detectChanges();
        }
        
    }

    /**
     * 根据图表类型，返回dataStore中存储的组件信息
     * @param type
     */
    getComponentByType(type: string): typeof Component {
        let dataStore = DataStore.getInstance().registerComponents;
        for (let i = 0; i < dataStore.length; i++) {
            if (type == dataStore[i]["type"]) {
                return dataStore[i];
            }
        }
        return null;
    }

    /**
     * 未点击组件时触发
     */
    switchStage() {
        this.isNoLoad = true;
    }

    initComponent(){
        this.disableDataConfig = false;
        this.disableStyleConfig = false;
        this.showType = "data";
    }

}
