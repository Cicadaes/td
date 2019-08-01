import { Container } from './container';
import { StageComponent } from '../components/stage.component';
import { View } from './view';
import { PreviewMode } from './preview.mode';
import { StageLayoutContainer } from '../layouts/stage.layout.container';
import { DataStore } from '../stores/data.store';
export class Stage extends Container {

    public stageComponent: StageComponent;

    constructor(query: any) {
        super(query);
        // 将舞台组件添加进舞台中
        this.stageComponent = new StageComponent();

        DataStore.saveComponentInstance(this.stageComponent);
        this.addChild(this.stageComponent);
    }

    onCreate() {
        this.previewMode();
    }

    public get data() {
        return (this.stageComponent.container as StageLayoutContainer).data;
    }

    public set data(data:any){
        (this.stageComponent.container as StageLayoutContainer).data = data;
    }

    /**
     * 设置舞台预览和编辑模式
     */
    public previewMode() {
        (this.stageComponent as StageComponent).previewMode();
    }

    /**
     * 刷新舞台
     */
    public refreshStage(){
        (this.stageComponent as StageComponent).refreshStage();
    }

    public changePage(page: number) {
        (this.stageComponent as StageComponent).changePage(page);
    }

    public removePage(removePage: number, changePage?: number) {
        (this.stageComponent as StageComponent).removePage(removePage,changePage);
    }

    public changePageName(page:any){
        (this.stageComponent as StageComponent).changePageName(page);
    }

    onDestroy() {
        this.stageComponent.onDestroy();
    }

}