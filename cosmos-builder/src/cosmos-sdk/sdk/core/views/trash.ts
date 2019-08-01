import { DragDrop, DragDropOption } from '../utils/dragdrop';
import { Component } from './component';
import { DataStore } from '../stores/data.store';
import { EventEmitter } from '../events/emitter.event';
import { ComponentEvent } from "../communication/communication.type";

export class Trash {

    private sortable: any = null;

    constructor(trash: any) {
        let trashElement: HTMLElement = null;
        if (typeof trash === 'string') {
            trashElement = document.querySelector(trash) as HTMLElement;
        } else {
            trashElement = trash;
        }
        this.sortable = DragDrop.dragDrop(trash, {
            group: {
                name: DragDropOption.groupName,
                pull: false,
                put: true
            },
            sort: false,
            handle: DragDropOption.handle,
            draggable: DragDropOption.draggable,
            ghostClass: DragDropOption.ghostClass,
            chosenClass: DragDropOption.chosenClass,
            dragClass: DragDropOption.dragClass,
            dataTransfer: DragDropOption.dataTransfer,
            animation: DragDropOption.animation,
            onAdd: function (evt: any) {
                let itemEl: HTMLElement = evt.item as HTMLElement;
                let scope = itemEl.getAttribute('cm-scope');
                let component: Component = DataStore.getComponentInstance(scope);
                if(component){
                    component.onDestroy();
                    EventEmitter.trigger(ComponentEvent.STAGECLICK);
                    EventEmitter.trigger(ComponentEvent.COMRESIZE);
                }
                trashElement.removeChild(itemEl);
                
            }
        });
    }

    public onDestroy() {
        this.sortable.destroy();
    }

}