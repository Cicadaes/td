const Sortable = require("sortablejs");

export const DragDropOption = {
    groupName: 'cm-group',
    handle: '.cm-dragdrop-handle',
    draggable: '.cm-dragdrop',
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    dataTransfer: 'view-id',
    animation: 150
};

export class DragDrop {

    public static dragDrop(query: any, options: any): any {
        let el = null;
        // 设置 el
        if (typeof query === 'string') {
            el = document.querySelector(query) as HTMLElement;
        } else {
            el = query;
        }
        return Sortable.create(el, options);
    }

    public static get utils(): any {
        return Sortable.utils;
    }

}