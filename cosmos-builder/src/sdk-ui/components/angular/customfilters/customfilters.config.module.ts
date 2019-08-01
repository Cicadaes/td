import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { customfiltersStyleComponent } from './customfilters-style/customfilters-style.component';
import { customfiltersDataComponent } from './customfilters-data/customfilters-data.component';

import { LegendStyleModule } from '../common/legend/legend-style.module';
import { LayoutModule } from './../common/layout/layout-style.module';
import { AxisStyleModule } from '../common/axisStyle/axis-style.module';
import { gridStyleModule } from '../common/grid/grid-style.module';
import { filterModule } from '../common/filter/filter.module';

import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { colorPickerModule } from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { CheckCascaderModule } from 'ng-cosmos-td-ui/src/business/checkcascader/checkcascader.module';

import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { ReportConfigService } from '../../../service/report-config.service';
import customfiltersModule from './customfilters.module';

@NgModule({
    declarations: [
        customfiltersStyleComponent,
        customfiltersDataComponent
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
        CheckCascaderModule,
        customfiltersModule
    ],
    entryComponents: [customfiltersStyleComponent, customfiltersDataComponent],
    providers: [ReportConfigService]
})
export default class customfiltersConfigModule {

}