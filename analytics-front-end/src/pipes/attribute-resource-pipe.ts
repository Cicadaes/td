import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'attributeResourcePipe' })
export class AttributeResourcePipe implements PipeTransform {
  transform(value: any): string {
    if (value === 0) {
      return '系统属性';
    } else if (value && value === 1) {
      return '自定义属性';
    }
  }
}

@NgModule({
  imports: [],
  exports: [AttributeResourcePipe],
  declarations: [AttributeResourcePipe]
})
export class AttributeResourcePipeModule {}
