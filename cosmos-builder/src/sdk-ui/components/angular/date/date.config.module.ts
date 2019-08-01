import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DateStyleComponent } from './date-style/date-style.component';
import { DateDataComponent } from './date-data/date-data.component';

import { LegendStyleModule } from '../common/legend/legend-style.module';
import { LayoutModule } from './../common/layout/layout-style.module';
import { AxisStyleModule } from '../common/axisStyle/axis-style.module';
import { gridStyleModule } from '../common/grid/grid-style.module';
import { filterModule } from '../common/filter/filter.module';
import { alignmentStyleModule } from '../common/alignment/alignment-style.module';


import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { colorPickerModule } from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { CmDatePickerShortcutModule } from 'ng-cosmos-td-ui/src/base/cmDatePickerShortcut/cmDatePickerShortcut.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button//button.module';
import { ReportConfigService } from '../../../service/report-config.service';
import DateModule from './date.module';


@NgModule({
    declarations: [
        DateStyleComponent,
        DateDataComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SelectModule,
        CheckboxModule,
        RadioModule,
        colorPickerModule,
        datePickerModule,
        InputModule,
        ButtonModule,
        AxisStyleModule,
        LegendStyleModule,
        LayoutModule,
        gridStyleModule,
        filterModule,
        CmDatePickerShortcutModule,
        DateModule,
        alignmentStyleModule
    ],
    entryComponents: [DateStyleComponent, DateDataComponent],
    providers: [ReportConfigService]
})
export default class DateConfigModule {

}