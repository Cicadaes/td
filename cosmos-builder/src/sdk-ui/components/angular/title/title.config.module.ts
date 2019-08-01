import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TitleStyleComponent } from './title-style/title-style.component';
import { TitleDataComponent } from './title-data/title-data.component';

import { LegendStyleModule } from '../common/legend/legend-style.module';
import { LayoutModule } from './../common/layout/layout-style.module';
import { AxisStyleModule } from '../common/axisStyle/axis-style.module';
import { gridStyleModule } from '../common/grid/grid-style.module';
import { filterModule } from '../common/filter/filter.module';
import { TitleHelpModule } from './title-style/title-style-help/title-style-help.module'


import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { colorPickerModule } from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { ReportConfigService } from '../../../service/report-config.service';
import TitleModule from './title.module';

@NgModule({
    declarations: [
        TitleStyleComponent,
        TitleDataComponent
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
        TitleHelpModule,
        TitleModule
    ],
    entryComponents: [TitleStyleComponent, TitleDataComponent],
    providers: [ReportConfigService]
})
export default class TitleConfigModule {

}