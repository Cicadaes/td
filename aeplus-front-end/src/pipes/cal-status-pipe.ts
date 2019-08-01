import {Component, NgModule} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'calStatusPipe'})
export class CalStatusPipe implements PipeTransform {
    transform(value: any): string {
        if (value == '1') {
            return '未开始';
        } else if (value == '2') {
            return '计算中';
        } else if (value == '3') {
            return '计算完成';
        } else if (value == '-1') {
            return '计算失败';
        }
    }
}

@NgModule({
    imports: [],
    exports: [CalStatusPipe],
    declarations: [CalStatusPipe]
})
export class CalStatusPipeModule {
}
