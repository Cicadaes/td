import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectDataComponent } from './select-data/select-data.component';
import { SelectStyleComponent } from './select-style/select-style.component';
import { BgBdStyleModule } from './../common/bgAndBorder/BgBd-style.module';
import { LegendStyleModule } from './../common/legend/legend-style.module';
import { filterModule } from '../common/filter/filter.module';
import { ReportConfigService } from '../../../service/report-config.service';
import { LayoutModule } from './../common/layout/layout-style.module';

import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { colorPickerModule } from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { SliderModule } from 'ng-cosmos-td-ui/src/base/slider/slider.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { DimensionValueListModule } from '../common/dimension-value-list/dimension-value-list.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import FilterSelectModule from './select.module';

@NgModule({
    declarations: [
        SelectDataComponent,
        SelectStyleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        BgBdStyleModule,
        LegendStyleModule,
        filterModule,
        SelectModule,
        CheckboxModule,
        RadioModule,
        colorPickerModule,
        datePickerModule,
        SliderModule,
        InputModule,
        DimensionValueListModule,
        ButtonModule,
        SelectModule,
        FilterSelectModule,
        LayoutModule
    ],
    entryComponents: [SelectDataComponent, SelectStyleComponent],
    providers: [ReportConfigService]
})
export default class SelectConfigModule {

}