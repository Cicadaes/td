import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[data-host]',
})
export class DataDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}