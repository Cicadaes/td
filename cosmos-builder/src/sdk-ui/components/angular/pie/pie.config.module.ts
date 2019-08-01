import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PieDataComponent } from './pie-data/pie-data.component';
import { PieStyleComponent } from './pie-style/pie-style.component';
import { LayoutModule } from './../common/layout/layout-style.module';
import { LegendStyleModule } from './../common/legend/legend-style.module';
import { filterModule } from '../common/filter/filter.module';
import { ReportConfigService } from '../../../service/report-config.service';
import { colorPickerStyleModule } from './../common/colorPicker/color-picker-style.module';

import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { colorPickerModule } from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { SliderModule } from 'ng-cosmos-td-ui/src/base/slider/slider.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import PieModule from './pie.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button//button.module';
import { DimensionValueListModule } from '../common/dimension-value-list/dimension-value-list.module';
import { DateRangeModule } from '../common/public-data-panel/date-range/date-range.module';

@NgModule({
    declarations: [
        PieStyleComponent,
        PieDataComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        LayoutModule,
        LegendStyleModule,
        filterModule,
        SelectModule,
        CheckboxModule,
        RadioModule,
        colorPickerModule,
        datePickerModule,
        SliderModule,
        InputModule,
        PieModule,
        ButtonModule,
        DimensionValueListModule,
        DateRangeModule,
        colorPickerStyleModule
    ],
    entryComponents: [PieStyleComponent, PieDataComponent],
    providers: [ReportConfigService]
})
export default class PieConfigModule {

}