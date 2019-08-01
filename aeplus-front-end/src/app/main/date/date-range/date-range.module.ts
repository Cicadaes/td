import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateRangeComponent} from './date-range.component';
import {NgZorroAntdModule} from 'ng-cosmos-ui';

@NgModule({
    declarations: [DateRangeComponent],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [DateRangeComponent]
})
export class DateRangeModule {

}
