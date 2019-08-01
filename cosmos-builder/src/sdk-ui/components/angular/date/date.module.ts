import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DateComponent } from './date.component';

import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';

@NgModule({
    declarations: [
        DateComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        datePickerModule,
        SelectModule
    ],
    entryComponents: [DateComponent]
})
export default class DateModule {
    
}