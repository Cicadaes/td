import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {SelectSearchMultipleComponent} from './select-search-multiple.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule
    ],
    declarations: [
        SelectSearchMultipleComponent
    ],
    exports: [SelectSearchMultipleComponent]
})
export class SelectSearchMultipleModule {
}
