import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CosmosModule } from 'ng-cosmos-td-ui/src/cosmos.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { DateRangeComponent } from './date-range.component';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
@NgModule({
    declarations: [
        DateRangeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosModule,
        RadioModule,
        SelectModule,
        InputModule,
        datePickerModule
    ],
    exports: [DateRangeComponent]
})
export class DateRangeModule { }