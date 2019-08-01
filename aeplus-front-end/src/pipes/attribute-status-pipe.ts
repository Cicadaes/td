import {Component, NgModule} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'attributeStatusPipe'})
export class AttributeStatusPipe implements PipeTransform {
    transform(value: any): string {
        if (value === 0) {
            return '启用';
        } else if (value === 1) {
            return '禁用';
        }
    }
}

@NgModule({
    imports: [],
    exports: [AttributeStatusPipe],
    declarations: [AttributeStatusPipe]
})
export class AttributeStatusPipeModule {
}
