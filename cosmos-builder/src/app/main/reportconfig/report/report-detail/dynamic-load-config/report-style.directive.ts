import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[style-host]',
})
export class StyleDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}