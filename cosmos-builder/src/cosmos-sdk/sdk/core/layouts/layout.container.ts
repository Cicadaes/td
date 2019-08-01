import { Container } from "../views/container";
import { DataStore } from '../stores/data.store';
import { ContainerComponent } from "../components/container.component";
import { Component } from "../views/component";
import { bg } from '../components/stage.bg';
import { PreviewMode } from '../views/preview.mode';
import { DragDrop, DragDropOption } from "../utils/dragdrop";
import { ViewType } from "../base/base.view";
import { EventEmitter } from "../events/emitter.event";
import { EventType } from "../communication/communication.type";
import { ComponentEvent } from "../../../index";

export class LayoutContainer extends Container {

    protected dragDrop: any = null;

    protected page: any;

    constructor(query: any) {
        super(query);
        this.enableDragDrop = true;
    }

    /**
    * 设置预览和编辑模式
    */
    public previewMode() {
        this.enableDragDrop = !PreviewMode.getPreviewMode();
    }

    // 是否可以拽入组件
    public set enableDragDrop(dragdrop: boolean) {
        if (dragdrop) {
            this.dragDrop = this.createDragDrop();
        } else if (this.dragDrop && this.dragDrop.el) {
            this.dragDrop.destroy();
        }
    }

    // 创建拖拽容器
    protected createDragDrop(): DragDrop {
        let d = DragDrop.dragDrop(this.el, {
            group: {
                name: DragDropOption.groupName,
                pull: true,
                put: true
            },
            handle: DragDropOption.handle,
            draggable: DragDropOption.draggable,
            ghostClass: DragDropOption.ghostClass,
            chosenClass: DragDropOption.chosenClass,
            dragClass: DragDropOption.dragClass,
            dataTransfer: DragDropOption.dataTransfer,
            animation: DragDropOption.animation,
            onAdd: (evt: any) => {
                this.dragDropOnAdd(evt);
            }
        });
        return d;
    }

    // 将拖拽的组件放入容器中
    protected dragDropOnAdd(evt: any): void {
        let oldNode: HTMLElement = evt.item;
        if (!oldNode.getAttribute('cm-scope')) {
            let nodeType: string = oldNode.getAttribute("cm-data");
            let ComponentClass = this.getComponentClass(nodeType);
            if (ComponentClass) {
                if (ComponentClass.type === ViewType.layout) {
                    let newNode = new ComponentClass();
                    this.replaceChild(newNode, oldNode);
                    //保存组件实例
                    DataStore.saveComponentInstance(newNode);
                    newNode['selectStatus'] = true;
                    EventEmitter.trigger(ComponentEvent.COMSELECT, {
                        type: newNode.name, scope: newNode.scope
                    });
                } else {
                    let newNode: ContainerComponent = new ContainerComponent(ComponentClass, null, true);
                    newNode.pattern = ComponentClass['pattern'];
                    newNode.enableEdit = ComponentClass['isEdit'];
                    this.replaceChild(newNode, oldNode);
                    //保存组件实例
                    DataStore.saveComponentInstance(newNode);
                    newNode['selectStatus'] = true;
                    EventEmitter.trigger(ComponentEvent.COMSELECT, {
                        type: newNode.name, scope: newNode.scope
                    });
                }
                EventEmitter.trigger(ComponentEvent.COMRESIZE);
            }
        }
    }

    //获取组件类
    protected getComponentClass(type: string): typeof Component {
        let componentList = DataStore.getRegisterComponents();
        for (let i = 0; i < componentList.length; i++) {
            if (componentList[i]['type'] == type) {
                return componentList[i]['component'];
            }
        }
        return null;
    }

    onDestroy() {
        this.enableDragDrop = false;
    }

}