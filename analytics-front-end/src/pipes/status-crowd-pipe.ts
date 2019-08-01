import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusCrowdPipe' })
export class StatusCrowdPipe implements PipeTransform {
  transform(value: any): string {
    if (value === 1) {
      return '未生效';
    } else if (value === 2) {
      return '已生效';
    } else if (value === -1) {
      return '已删除';
    } else if (value === 3) {
      return '已过期';
    }
  }
}

@NgModule({
  imports: [],
  exports: [StatusCrowdPipe],
  declarations: [StatusCrowdPipe]
})
export class StatusCrowdPipeModule {}
