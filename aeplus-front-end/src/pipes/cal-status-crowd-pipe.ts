import {Component, NgModule} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'calStatusCrowdPipe'})
export class CalStatusCrowdPipe implements PipeTransform {
    transform(value: any): string {
        if (value === 0) {
            return '未计算';
        } else if (value === 1) {
            return '计算中';
        } else if (value === 2) {
            return '计算完成';
        } else if (value === 3) {
            return '终止中';
        } else if (value === 4) {
            return '被终止';
        } else if (value === 6) {
            return '重试中';
        } else if (value === -1) {
            return '计算失败';
        } else if (value === -2) {
            return '超时';
        } else if (value === -4) {
            return '重新计算';
        }
    }
}

@NgModule({
    imports: [],
    exports: [CalStatusCrowdPipe],
    declarations: [CalStatusCrowdPipe]
})
export class CalStatusCrowdPipeModule {
}
