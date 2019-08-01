import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateSingleComponent } from './date-single.component';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [DateSingleComponent],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [DateSingleComponent]
})
export class DateSingleModule {

}
