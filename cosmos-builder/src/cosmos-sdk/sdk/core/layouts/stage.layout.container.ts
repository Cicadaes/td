import { VerticalLayoutContainer } from "./vertical.layout.container";
import { EventEmitter } from "./../events/emitter.event";
import { DataStore } from '../stores/data.store';
import { ComponentEvent, EventType } from "../communication/communication.type";
import { ContainerComponent } from '../components/container.component';

export class StageLayoutContainer extends VerticalLayoutContainer {
    constructor(query: any) {
        super(query);

    }

    /**
    * 获取舞台上所有数据
    */
    public get data(): any {
        //更新当前页数据
        this.updatePagesData(this.page);
        return DataStore.getPagesData();
    }

    /**
    * 设置数据进行渲染舞台
    */
    public set data(data: any) {
        DataStore.getInstance().configData = {};
        DataStore.savePagesData(data);
        if (data && data.length > 0) {
            this.page = data[0]['pageNum'];
            this.renderData(data);
        } else {
            this.removeAllChild();
            // EventEmitter.trigger(ComponentEvent.STAGECLICK);
        }
    }

    /**
     * 渲染舞台
     */
    public renderData(data: any) {
        this.removeAllChild();

        let index = this.checkPagesData(this.page);
        if (index < 0) {
            data.push({
                "name": "",
                "pageNum": this.page,
                "charts": [],
                "styleConfig": {},
                "groupManager": {}
            });
            EventEmitter.trigger(ComponentEvent.STAGECLICK);
        } else if (index >= 0 && data[index]['charts'].length > 0) {
            // 添加组件后设置背景及刷新舞台
            this.appendComponents(data[index]).then(() => {
                //依次添加到舞台
                let components = data[index]['charts'][0]['childrens'];
                this.addChildToContainer(components, this);
                EventEmitter.trigger(ComponentEvent.STAGECLICK);
                EventEmitter.trigger(EventType.REFRESHSTAGE);
            });
        }
    }

    /**
     * 添加组件到容器
     * @param components 
     * @param parent 
     */
    public addChildToContainer(components:any, parent:any){
        for(let child of components){
            let instance = DataStore.getComponentInstance(child.cuuid);
            instance && parent.addChild(instance);
            if(child.childrens.length > 0 && instance){
                this.addChildToContainer(child.childrens, instance.container);
            }
        }
    }

    /**
     * 添加组件
     * @param components 组件列表
     */
    public appendComponents(data: any): Promise<any> {
        let promises:any = [];
        let components = data.charts[0]['childrens'];
        this.appendChild(data.charts[0], promises);
        return Promise.all(promises);
    }

    public appendChild(component:any, promises:any){
        let childrens = component['childrens'];
        if(childrens.length > 0){
            for (let component of childrens) {
                if (component) {
                    promises.push(this.appendComponent(component));
                    this.appendChild(component, promises);
                }
            }
        }
    }

    public appendComponent(component: any): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let styleConfig: any = component.styleConfig ? component.styleConfig : {};
                let dataConfig: any = component.dataConfig;

                let chartComponent = this.getComponentClass(component.name);
                
                let stageWidth = this.width;
                let componentContainer;
                if(component.type == 'layout'){
                    componentContainer = new chartComponent(component.cuuid);
                }else{
                    componentContainer  = new ContainerComponent(chartComponent, component.cuuid);
                    componentContainer.pattern = chartComponent['pattern'];
                    componentContainer.enableEdit = chartComponent['isEdit'];
                    componentContainer.isDrag = false;
                }
                
                //保存组件实例
                DataStore.saveComponentInstance(componentContainer);
                componentContainer.onStyleChange(componentContainer.scope, styleConfig)

                //保存配置面板数据
                DataStore.saveConfigData(componentContainer.scope, 'styleConfig', styleConfig);
                DataStore.saveConfigData(componentContainer.scope, 'dataConfig', dataConfig);

                // type
                componentContainer['type'] = component.type;
                // 添加进舞台
                // parent.addChild(componentContainer);
                resolve();
            }, 300);
        });

    }

    /**
     * 查找页码对应的索引，没有则返回-1
     * @param page 
     */
    public checkPagesData(page: any) {
        let index: number = -1;
        let data = DataStore.getPagesData();
        for (let i = 0; i < data.length; i++) {
            if (data[i]['pageNum'] == page) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
    * 改变页码
    * @param page 
    */
    public changePage(page: any) {
        //更新当前页的数据
        this.updatePagesData(this.page);
        //翻页
        this.page = page;
        // 切换数据
        this.renderData(DataStore.getPagesData());
    }

    public removePage(removePage: any, changePage?: any) {
        let data = DataStore.getPagesData();
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item['pageNum'] == removePage) {
                DataStore.getPagesData().splice(i, 1);
                break;
            }
        }
        if (changePage) {
            this.changePage(changePage);
        }
    }

    public changePageName(page: any) {
        let data = DataStore.getPagesData();
        for (let item of data) {
            if (item['pageNum'] == page['pageNum']) {
                item['name'] = page['name'];
                break;
            }
        }
    }

    /**
     * 更新当前页的数据
     * @param page 
     */
    public updatePagesData(page?: any) {
        let reportData: any = [
            {
                name: 'stageContainer',
                childrens: [],
                cuuid: this.scope,
                type: this.type,
                dataConfig: {},
                styleConfig: {}
            }
        ];

        this.getChildrensTree(this, reportData[0]['childrens']);
        console.log(reportData);

        page = page ? page : this.page;
        //更新当前页数据
        let index = this.checkPagesData(page);
        if (index >= 0) {
            DataStore.getPagesData()[index]['charts'] = reportData;
        }
    }

    /**
     * 获取组件树
     * @param instance 组件实例
     * @param childrens 子组件
     */
    public getChildrensTree(instance:any, childrens:any[] = []) {
        let chartList = instance.children;
        if (chartList.length > 0) {
            for (let chart of chartList) {
                let chartData = {
                    cuuid: chart.scope,
                    type: chart.type,
                    name: chart.name,
                };
                let styleConfig = DataStore.getConfigData(chart.scope) ? (DataStore.getConfigData(chart.scope)['styleConfig'] ? DataStore.getConfigData(chart.scope)['styleConfig'] : {}) : {};
                let dataConfig = DataStore.getConfigData(chart.scope) ? (DataStore.getConfigData(chart.scope)['dataConfig'] ? DataStore.getConfigData(chart.scope)['dataConfig'] : {}) : {};
    
                chartData['styleConfig'] = styleConfig;
                chartData['dataConfig'] = dataConfig;
                chartData['childrens'] = [];
                chartData['metaObjectId'] = dataConfig && dataConfig.cube;
                let currentCom = DataStore.getComponentInstance(chart.scope);
                if(currentCom)this.getChildrensTree(currentCom.container, chartData['childrens']);

                childrens.push(chartData);
            }
        }else{
            childrens = [];
        }
    }

    /**
     * 获取当前父容器
     * @param scope 
     */
    public getTargetContainer(scope: any) {
        let component = DataStore.getComponentInstance(scope);
        if(component){
            let parentLayout = component.container.getParent(component.el);

            while(parentLayout &&!(parentLayout.container instanceof StageLayoutContainer) && !this.checkHasChart(parentLayout.container)){
                parentLayout = parentLayout.container.getParent(parentLayout.el);
            }
            return parentLayout;
        }
        
    }

    /**
     * 获取当前容器的顶级过滤器数据
     * @param container 容器/组件
     */
    public getTopFilterData(container?:any) {
        let topGroups:any = [];
        
        if(container){
            topGroups = container.children || [];
        }else{
            this.getChildrensTree(this, topGroups);
        }

        let filterData: any[] = [];
        for (let child of topGroups) {
            let component = (child.cuuid && DataStore.getComponentInstance(child.cuuid)) || child;
            if (component && component.pattern == 'filter') {
                if (component.tempData) {
                    filterData.push(component.tempData);
                }
            }else{
                if(!this.checkHasChart(component.container)){
                    let allchildren = component.container.allChildren;
                    if(allchildren && allchildren.length > 0){
                        for(let i = 0; i < allchildren.length; i++){
                            if(allchildren[i].pattern == 'filter'){
                                if (allchildren[i].tempData) {
                                    filterData.push(allchildren[i].tempData);
                                }
                            }
                        }
                    }
                    
                }
            }
        }
        return filterData;
    }

    /**
     * 检查组件内是否有图表
     * @param component 组件
     */
    checkHasChart(contianer:any){
        let hasChart:boolean = false;
        if(contianer && contianer.allChildren){
            let allchildren = contianer.allChildren;
            for(let i = 0; i < allchildren.length; i++){
                if(allchildren[i].pattern == 'chart'){
                    hasChart = true;
                    break;
                }
            }
        }
        return hasChart;
    }

    public getGroupManagerByPage() {
        let tree: any = [];
        this.getChildrensTree(this, tree);
        return tree;
    }

}