import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FunnelDataComponent } from './funnel-data/funnel-data.component';
import { FunnelStyleComponent } from './funnel-style/funnel-style.component';
import { colorStyleModule } from './../common/color/color-style.module';
import { LayoutModule } from './../common/layout/layout-style.module';
import { filterModule } from '../common/filter/filter.module';
import { LegendStyleModule } from './../common/legend/legend-style.module';
import { colorPickerStyleModule } from './../common/colorPicker/color-picker-style.module';

import { ReportConfigService } from '../../../service/report-config.service';

import { FunnelPopoutModule } from './funnel-data/funnel-data-popout/funnel-popout.module'

import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { colorPickerModule } from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import FunnelModule from './funnel.module';
import { DateRangeModule } from '../common/public-data-panel/date-range/date-range.module';


@NgModule({
    declarations: [
        FunnelDataComponent,
        FunnelStyleComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        colorStyleModule,
        LayoutModule,
        filterModule,
        SelectModule,
        CheckboxModule,
        RadioModule,
        colorPickerModule,
        datePickerModule,
        FunnelPopoutModule,
        LegendStyleModule,
        FunnelModule,
        DateRangeModule,
        colorPickerStyleModule
    ],
    entryComponents: [FunnelDataComponent, FunnelStyleComponent],
    providers: [ReportConfigService]
})
export default class FunnelConfigModule {

}