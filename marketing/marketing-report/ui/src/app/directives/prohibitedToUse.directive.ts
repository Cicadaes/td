import { Directive, HostListener, Input, Renderer, ViewChild, ElementRef, SimpleChanges } from '@angular/core';

/**
 * 根据参数禁止组件内所有的事件和输入框全部disabled
 * @export
 * @class ProhibitedToUseDirective
 */
@Directive({
    selector: '[tdProhibitedToUse]'
})
export class ProhibitedToUseDirective {
    private height: string = '0px';
    private div: any;
    private content: any;
    @Input() usable: boolean = false;

    constructor(
        private render: Renderer,
        private el: ElementRef
    ) { }

    ngOnInit() {
        let that = this;
        if(that.usable === false) {
            return;
        }
        that.div = that.render.createElement(that.el.nativeElement, 'div');
        that.render.setElementStyle(that.div, 'width', '100%');
        that.render.setElementStyle(that.div, 'height', '100%');
        that.render.setElementStyle(that.div, 'position', 'absolute');
        that.render.setElementStyle(that.div, 'top', '0');
        that.render.setElementStyle(that.div, 'left', '0');
    }
}