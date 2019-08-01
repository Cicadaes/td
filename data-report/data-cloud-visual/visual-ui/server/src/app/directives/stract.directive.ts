/**
 * Created by wangshouyun on 2016/12/31.
 */
import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({selector: '[myStract]'})
export class StractDirective {

    constructor(private templateRef: TemplateRef<any>,
                private viewContainer: ViewContainerRef) {
    }

    @Input() set myStract(condition: boolean) {
        if (!condition) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}