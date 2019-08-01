import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RetentionFilterComponent } from './retentionFilter.component';

import { TooltipModule } from 'ng-cosmos-td-ui/src/base/tooltip/tooltip.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
@NgModule({
    declarations: [
        RetentionFilterComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TooltipModule,
        SelectModule,
        datePickerModule
    ],
    entryComponents: [RetentionFilterComponent]
})


export default class RetentionFilterModule{
    
}