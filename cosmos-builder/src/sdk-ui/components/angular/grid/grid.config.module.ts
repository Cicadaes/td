import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridDataComponent } from './grid-data/grid-data.component';
import { GridStyleComponent } from './grid-style/grid-style.component';
import { ConfigApi } from '../../../api/config-api';
import { LayoutModule } from './../common/layout/layout-style.module';
import { LegendStyleModule } from './../common/legend/legend-style.module';
import { AxisStyleModule } from '../common/axisStyle/axis-style.module';
import { gridStyleModule } from './../common/grid/grid-style.module';
import { filterModule } from '../common/filter/filter.module';
import { heightStyleModule } from '../common/height/height-style.module';
import { GridModule } from './grid-style/grid-style-help/grid-style-help.module'
import { colorPickerStyleModule } from './../common/colorPicker/color-picker-style.module';


import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { colorPickerModule } from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button//button.module';
import { ReportConfigService } from '../../../service/report-config.service';

@NgModule({
    declarations: [
        GridDataComponent,
        GridStyleComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        LayoutModule,
        LegendStyleModule,
        AxisStyleModule,
        gridStyleModule,
        filterModule,
        SelectModule,
        CheckboxModule,
        RadioModule,
        colorPickerModule,
        datePickerModule,
        ButtonModule,
        GridModule,
        heightStyleModule,
        GridModule,
        colorPickerStyleModule
    ],
    entryComponents: [GridDataComponent, GridStyleComponent],
    providers: [ReportConfigService]
})
export default class GridConfigModule {

}