import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {SelectCustomComponent} from './select-custom.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule
    ],
    declarations: [
        SelectCustomComponent
    ],
    exports: [SelectCustomComponent]
})
export class SelectCustomModule {
}
