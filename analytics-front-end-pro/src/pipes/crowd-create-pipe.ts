import {Component, NgModule} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'crowdCreatePipe'})
export class CrowdCreatePipe implements PipeTransform {
    mustMap: any = {
        'false': '发生行为',
        'true': '未发生行为',
        'and': '并且',
        'or': '或者',
    };
    transform(value: any): string {
        return this.mustMap[value] || value;
    }
}

@NgModule({
    imports: [],
    exports: [CrowdCreatePipe],
    declarations: [CrowdCreatePipe]
})
export class CrowdCreatePipeModule {
}
