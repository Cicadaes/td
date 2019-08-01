import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {FastSearchComponent} from './fast-search.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule
    ],
    declarations: [
        FastSearchComponent
    ],
    exports: [FastSearchComponent]
})
export class FastSearchModule {
}
