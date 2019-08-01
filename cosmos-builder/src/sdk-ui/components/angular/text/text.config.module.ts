import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextDataComponent } from './text-data/text-data.component';
import { TextStyleComponent } from './text-style/text-style.component';
import { LayoutModule } from './../common/layout/layout-style.module';
import { LegendStyleModule } from './../common/legend/legend-style.module';
import { filterModule } from '../common/filter/filter.module';
import { ReportConfigService } from '../../../service/report-config.service';
import { textLinkService } from './text-style/text-style-link/text-style-link.service'
import { colorPickerStyleModule } from './../common/colorPicker/color-picker-style.module';

import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { colorPickerModule } from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { SliderModule } from 'ng-cosmos-td-ui/src/base/slider/slider.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import TextModule from './text.module';

@NgModule({
    declarations: [
        TextDataComponent,
        TextStyleComponent
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
        TextModule,
        colorPickerStyleModule
    ],
    entryComponents: [TextDataComponent, TextStyleComponent],
    providers: [ReportConfigService,textLinkService]
})
export default class TextConfigModule {

}