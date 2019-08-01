import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relationPipe' })
export class RelationPipe implements PipeTransform {
  transform(value: any): string {
    if (value && value === 'or') {
      return '或者';
    } else if (value && value === 'and') {
      return '并且';
    }
  }
}

@NgModule({
  imports: [],
  exports: [RelationPipe],
  declarations: [RelationPipe]
})
export class RelationPipeModule {}
