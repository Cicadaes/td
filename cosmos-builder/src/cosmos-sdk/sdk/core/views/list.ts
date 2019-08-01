import { DragDrop, DragDropOption } from '../utils/dragdrop';

export class List {

    private sortable: any = null;

    constructor(list: any) {
        this.sortable = DragDrop.dragDrop(list, {
            group: {
                name: DragDropOption.groupName,
                pull: "clone",
                put: false
            },
            sort: false,
            handle: DragDropOption.handle,
            draggable: DragDropOption.draggable,
            ghostClass: DragDropOption.ghostClass,
            chosenClass: DragDropOption.chosenClass,
            dragClass: DragDropOption.dragClass,
            dataTransfer: DragDropOption.dataTransfer,
            animation: DragDropOption.animation,
            onChoose: function (evt: any) {
                evt.oldIndex;
            },
            onStart: function (evt: any) {
                evt.oldIndex;
            },
            onEnd: function (evt: any) {
                var itemEl = evt.item;
                evt.to;
                evt.from;
                evt.oldIndex;
                evt.newIndex;
            },
            onAdd: function (evt: any) {

            },
            onUpdate: function (evt: any) {

            },
            onSort: function (evt: any) {

            },
            onRemove: function (evt: any) {

            },
            onFilter: function (evt: any) {
                var itemEl = evt.item;
            },
            onMove: function (evt: any, originalEvent: any) {
                evt.dragged;
                evt.draggedRect;
                evt.related;
                evt.relatedRect;
                originalEvent.clientY;
            },
            onClone: function (evt: any) {
                var origEl = evt.item;
                var cloneEl = evt.clone;
            }
        });
    }

    public onDestroy() {
        this.sortable.destroy();
    }

}