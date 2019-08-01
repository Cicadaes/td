import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AreaDataComponent } from './area-data/area-data.component';
import { AreaStyleComponent } from './area-style/area-style.component';
import { ConfigApi } from '../../../api/config-api';
import { BgBdStyleModule } from './../common/bgAndBorder/BgBd-style.module';
import { LegendStyleModule } from './../common/legend/legend-style.module';
import { AxisStyleModule } from '../common/axisStyle/axis-style.module';
import { gridStyleModule } from './../common/grid/grid-style.module';
import { filterModule } from '../common/filter/filter.module';
import { colorStyleModule } from './../common/color/color-style.module';
import { LayoutModule } from './../common/layout/layout-style.module';

import { SelectModule} from 'ng-cosmos-td-ui/src/base/select/select.module';
import { CheckboxModule} from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule} from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { colorPickerModule} from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { datePickerModule} from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { ButtonModule} from 'ng-cosmos-td-ui/src/base/button//button.module';
import { ReportConfigService } from '../../../service/report-config.service';
import { DimensionValueListModule } from '../common/dimension-value-list/dimension-value-list.module';
import AreaModule from './area.module';
import { DateRangeModule } from '../common/public-data-panel/date-range/date-range.module';

@NgModule({
    declarations: [
        AreaDataComponent,
        AreaStyleComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        BgBdStyleModule,
        LegendStyleModule,
        AxisStyleModule,
        gridStyleModule,
        filterModule,
        SelectModule,
        CheckboxModule,
        RadioModule,
        colorPickerModule,
        datePickerModule,
        DimensionValueListModule,
        ButtonModule,
        colorStyleModule,
        AreaModule,
        DateRangeModule,
        LayoutModule
    ],
    entryComponents: [AreaDataComponent,AreaStyleComponent],
    providers: [ReportConfigService]
})
export default class AreaConfigModule{

}