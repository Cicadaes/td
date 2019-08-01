import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TransversalTreeComponent} from './TransversalTree.component';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NumberToThousandsPipeModule} from '../../../../../pipes/number-to-thousands-pipe';

@NgModule({
    declarations: [
        TransversalTreeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NumberToThousandsPipeModule
    ],
    exports: [TransversalTreeComponent]
})
export class TransversalTreeModule {
}
