import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabDataComponent } from './tab-data/tab-data.component';
import { TabStyleComponent } from './tab-style/tab-style.component';
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
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import TabModule from './tab.module';

@NgModule({
    declarations: [
        TabDataComponent,
        TabStyleComponent,
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
        ButtonModule,
        TabModule,
        LayoutModule
    ],
    entryComponents: [TabDataComponent, TabStyleComponent],
    providers: [ReportConfigService]
})
export default class TabConfigModule {

}