import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { MoreSearchComponent } from './more-search.component';
import { SelectSearchModule } from '../select/select-search/select-search.module';
import { DateRangeModule } from '../date/date-range/date-range.module';

@NgModule({
    declarations: [
        MoreSearchComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        SelectSearchModule,
        DateRangeModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [MoreSearchComponent]
})
export class MoreSearchModule {

}
