import {Component, NgModule} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'commonIsnotPipe'})
export class CommonIsnotPipe implements PipeTransform {
    transform(value: any): string {
        if (value === 0) {
            return '否';
        } else if (value === 1) {
            return '是';
        }
    }
}

@NgModule({
    imports: [],
    exports: [CommonIsnotPipe],
    declarations: [CommonIsnotPipe]
})
export class CommonIsnotPipeModule {
}
