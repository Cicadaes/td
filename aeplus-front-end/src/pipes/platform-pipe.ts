import {Component, NgModule} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'platformPipe'})
export class PlatformPipe implements PipeTransform {
    transform(value: any): string {
        if (value && value === 'App') {
            return 'App';
        } else if (value && (value === 'Web' || value == '1')) {
            return 'Web';
        } else if (value && (value === 'H5' || value == '2')) {
            return 'H5';
        } else if (value && value === 'miniprogram') {
            return '小程序';
        }
    }
}

@NgModule({
    imports: [],
    exports: [PlatformPipe],
    declarations: [PlatformPipe]
})
export class PlatformPipeModule {
}
