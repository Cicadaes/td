import {Directive, ElementRef, Input, Renderer} from '@angular/core';
@Directive({selector: '[myAttr]'})
export class AttrDirective {
    constructor(el: ElementRef, renderer: Renderer) {
        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'yellow');
    }
}