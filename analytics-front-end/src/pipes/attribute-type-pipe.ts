import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'attributeTypePipe' })
export class AttributeTypePipe implements PipeTransform {
  transform(value: any): string {
    if (value && value === 'Tag') {
      return '字典项';
    } else if (value && value === 'String') {
      return '字符串';
    } else if (value && value === 'Integer') {
      return '数字';
    } else if (value && value === 'Double') {
      return '数值';
    } else if (value && value === 'Date') {
      return '日期类型';
    } else if (value && value === 'Timestamp') {
      return '时间类型';
    } else {
      return value;
    }
  }
}

@NgModule({
  imports: [],
  exports: [AttributeTypePipe],
  declarations: [AttributeTypePipe]
})
export class AttributeTypePipeModule {}
