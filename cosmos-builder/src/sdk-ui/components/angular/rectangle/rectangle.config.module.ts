import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RectangleDataComponent } from './rectangle-data/rectangle-data.component';
import { RectangleStyleComponent } from './rectangle-style/rectangle-style.component';
import { ConfigApi } from '../../../api/config-api';
import { BgBdStyleModule } from './../common/bgAndBorder/BgBd-style.module';
import { LegendStyleModule } from './../common/legend/legend-style.module';
import { AxisStyleModule } from '../common/axisStyle/axis-style.module';
import { gridStyleModule } from './../common/grid/grid-style.module';
import { filterModule } from '../common/filter/filter.module';
import { LayoutModule } from './../common/layout/layout-style.module';

import { SelectModule} from 'ng-cosmos-td-ui/src/base/select/select.module';
import { CheckboxModule} from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule} from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { colorPickerModule} from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { datePickerModule} from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { ButtonModule} from 'ng-cosmos-td-ui/src/base/button//button.module';
import { ReportConfigService } from '../../../service/report-config.service';
import { DimensionValueListModule } from '../common/dimension-value-list/dimension-value-list.module';
import RectangleModule from './rectangle.module';

@NgModule({
    declarations: [
        RectangleDataComponent,
        RectangleStyleComponent
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
        RectangleModule,
        LayoutModule
    ],
    entryComponents: [RectangleDataComponent,RectangleStyleComponent],
    providers: [ReportConfigService]
})
export default class RectangleConfigModule{

}