import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusPipe' })
export class StatusPipe implements PipeTransform {
  transform(value: any): string {
    if (value === '0') {
      return '未生效';
    } else if (value === '1') {
      return '已生效';
    }
  }
}

@NgModule({
  imports: [],
  exports: [StatusPipe],
  declarations: [StatusPipe]
})
export class StatusPipeModule {}
