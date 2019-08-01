import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { DateRangeComponent } from './date-range.component';

@NgModule({
    declarations: [DateRangeComponent],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule,
        // CosmosAllModule.forChild()
    ],
    providers: [],
    exports: [DateRangeComponent]
})
export class DateRangeModule {

}
