import { Stage } from "./core/views/stage";
import { Component } from "./core/views/component";
import { List } from './core/views/list';
import { DataStore } from './core/stores/data.store';
import { ContainerComponent } from "./core/components/container.component";
import { ComponentContainer } from "./core/views/component.container";
import { PreviewMode } from "./core/views/preview.mode";
import { Trash } from "./core/views/trash";
import { Timer } from "./core/utils/timer";
export class CosmosSDK {

    private _stage: Stage = null;
    private _list: List = null;
    private _trash: Trash = null;
    private _page: number = 1;

    constructor(stage: any, list?: any, trash?: any) {
        this._stage = new Stage(stage);
        if (list) {
            this._list = new List(list);
        }
        if (trash) {
            this._trash = new Trash(trash);
        }
    }

    /**
     * 获取舞台上所有数据
     */
    public get data(): any {
        //更新当前页数据
        return this._stage.data;
    }

    /**
    * 设置数据进行渲染舞台
    */
    public set data(data: any) {
        this._stage.data = data;
    }

    /**
     * 注册外部组件 
     * @param components 组件列表
     */
    public registerComponents(components: any): void {
        DataStore.saveRegisterComponents(components);
    }

    /**
     * 设置舞台预览和编辑模式
     */
    public set previewMode(isPre: boolean) {
        PreviewMode.savePreviewMode(isPre);
        this._stage.previewMode();
    }

    /**
    * 刷新舞台
    */
    public refreshStage() {
        this._stage.refreshStage();
    }

    /**
     * 获取舞台预览和编辑模式
     */
    public get previewMode(): boolean {
        return PreviewMode.getPreviewMode();
    }

    private timer:any = null;
    private curPage:any = null;
    /**
     * 改变页
     * @param page 
     */
    public changePage(page: number) {
        this.curPage = page;
        if (!this.timer) {
            this.timer = new Timer();
        }
        this.timer.startTimeOut(0.3,  this.stageChangePage, this);
        
    }

    stageChangePage(){
        this._stage.changePage(this.curPage);
    }

    /**
     * 删除页
     */
    public removePage(removePage: number, changePage?: number) {
        this._stage.removePage(removePage, changePage);
    }

    /**
    * 更改页码名称
    */
    public changePageName(page: any) {
        this._stage.changePageName(page);
    }

    /**
     * 销毁舞台上所有数据
     */
    public destroy(): void {
        this._stage.onDestroy();
        this._list &&this._list.onDestroy();
        this._trash && this._trash.onDestroy();
    }

}



