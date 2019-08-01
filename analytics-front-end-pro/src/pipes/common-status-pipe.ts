import {Component, NgModule} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'commonStatusPipe'})
export class CommonStatusPipe implements PipeTransform {
    transform(value: any): string {
        if (value === 0) {
            return '禁用';
        } else if (value === 1) {
            return '启用';
        }
    }
}

@NgModule({
    imports: [],
    exports: [CommonStatusPipe],
    declarations: [CommonStatusPipe]
})
export class CommonStatusPipeModule {
}
