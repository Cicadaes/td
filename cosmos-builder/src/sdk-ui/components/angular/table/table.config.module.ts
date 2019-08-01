import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableDataComponent } from './table-data/table-data.component';
import { TableStyleComponent } from './table-style/table-style.component';
import { ConfigApi } from '../../../api/config-api';
import { LayoutModule } from './../common/layout/layout-style.module';
import { LegendStyleModule } from './../common/legend/legend-style.module';
import { AxisStyleModule } from '../common/axisStyle/axis-style.module';
import { TableStyleModule } from './../common/table/table-style.module';
import { filterModule } from '../common/filter/filter.module';
import { heightStyleModule } from '../common/height/height-style.module';
import { TableStyleHelpModule } from './table-style/table-style-help/table-style-help.module'
import { colorPickerStyleModule } from './../common/colorPicker/color-picker-style.module';

import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { colorPickerModule } from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button//button.module';
import { ReportConfigService } from '../../../service/report-config.service';
import CmTableModule from './table.module';
import { DateRangeModule } from '../common/public-data-panel/date-range/date-range.module';

@NgModule({
    declarations: [
        TableDataComponent,
        TableStyleComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        LayoutModule,
        LegendStyleModule,
        AxisStyleModule,
        TableStyleModule,
        filterModule,
        SelectModule,
        CheckboxModule,
        RadioModule,
        colorPickerModule,
        datePickerModule,
        ButtonModule,
        TableStyleHelpModule,
        heightStyleModule,
        CmTableModule,
        DateRangeModule,
        colorPickerStyleModule
    ],
    entryComponents: [TableDataComponent, TableStyleComponent],
    providers: [ReportConfigService]
})
export default class TableConfigModule {

}