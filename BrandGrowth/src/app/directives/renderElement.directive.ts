import { Directive, Input, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[td-render]'
})
export class RenderElementDirective {
  @Input()
  html: boolean = false;

  @Input()
  renderElement: any = null;

  constructor(
    private renderer: Renderer2,
    private _el: ElementRef
  ) { }

  ngOnInit() {
    if(this.html && this.renderElement) {
      this.renderer.appendChild(this._el.nativeElement, this.renderElement);
    }
  }

}