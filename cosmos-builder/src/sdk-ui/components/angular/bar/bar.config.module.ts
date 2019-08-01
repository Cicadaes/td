import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BarStyleComponent } from './bar-style/bar-style.component';
import { BarDataComponent } from './bar-data/bar-data.component';

import { LegendStyleModule } from '../common/legend/legend-style.module';
import { BgBdStyleModule } from '../common/bgAndBorder/BgBd-style.module';
import { AxisStyleModule } from '../common/axisStyle/axis-style.module';
import { gridStyleModule } from '../common/grid/grid-style.module';
import { filterModule } from '../common/filter/filter.module';
import { LayoutModule } from './../common/layout/layout-style.module';
import { colorPickerStyleModule } from './../common/colorPicker/color-picker-style.module';


import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { colorPickerModule } from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button//button.module';
import { ReportConfigService } from '../../../service/report-config.service';
import BarModule from './bar.module';
import { DimensionValueListModule } from '../common/dimension-value-list/dimension-value-list.module';
import { DateRangeModule } from '../common/public-data-panel/date-range/date-range.module';


@NgModule({
    declarations: [
        BarStyleComponent,
        BarDataComponent
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
        BgBdStyleModule,
        gridStyleModule,
        filterModule,
        BarModule,
        DimensionValueListModule,
        DateRangeModule,
        LayoutModule,
        colorPickerStyleModule
    ],
    entryComponents: [BarStyleComponent, BarDataComponent],
    providers: [ReportConfigService]
})
export default class BarConfigModule {

}