import {Component, NgModule} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'calStatusPathPipe'})
export class CalStatusPathPipe implements PipeTransform {
    transform(value: any): string {
        if (value == '0') {
            return '未开始';
        } else if (value == '2') {
            return '计算中';
        } else if (value == '1') {
            return '计算完成';
        } else if (value == '-1') {
            return '计算失败';
        }
    }
}

@NgModule({
    imports: [],
    exports: [CalStatusPathPipe],
    declarations: [CalStatusPathPipe]
})
export class CalStatusPathPipeModule {
}
