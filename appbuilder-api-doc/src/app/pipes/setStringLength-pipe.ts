import { Component, NgModule, Injectable } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'setValueLengthPipe' })
@Injectable()
export class SetValueLengthPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(val: string, length: number): any {
        if (val && val.length > 15) {
            val = val.slice(0, length) + '...';
        }
        return val;
    }
}

@NgModule({
    imports: [],
    exports: [SetValueLengthPipe],
    declarations: [SetValueLengthPipe]
})
export class SetValueLengthPipeModule {
}
