import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {SelectSearchComponent} from './select-search.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule
    ],
    declarations: [
        SelectSearchComponent
    ],
    exports: [SelectSearchComponent]
})
export class SelectSearchModule {
}
