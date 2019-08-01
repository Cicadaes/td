import {Component, NgModule} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'keysPipe'})
export class KeysPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
        const keys = [];
        for (const key in value) {
            keys.push({key: key, value: value[key]});
        }
        return keys;
    }
}

@NgModule({
    imports: [],
    exports: [KeysPipe],
    declarations: [KeysPipe]
})
export class KeysPipeModule {
}
