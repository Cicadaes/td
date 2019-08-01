import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'toBrPipe' })
export class ToBrPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any) {
    const reg = new RegExp(/\r\n/, 'gi');
    if (!value) {
      return this.sanitizer.bypassSecurityTrustHtml(value);
    } else {
      value = value.replace(reg, `<br/>`);
      return this.sanitizer.bypassSecurityTrustHtml(value);
    }
  }
}

@NgModule({
  imports: [],
  exports: [ToBrPipe],
  declarations: [ToBrPipe]
})
export class ToBrPipeModule {}
