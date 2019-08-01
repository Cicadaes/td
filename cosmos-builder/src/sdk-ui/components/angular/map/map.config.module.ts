import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapDataComponent } from './map-data/map-data.component';
import { MapStyleComponent } from './map-style/map-style.component';
import { ConfigApi } from '../../../api/config-api';
import { BgBdStyleModule } from './../common/bgAndBorder/BgBd-style.module';
import { filterModule } from '../common/filter/filter.module';
import { LayoutModule } from './../common/layout/layout-style.module';
import { colorPickerStyleModule } from './../common/colorPicker/color-picker-style.module';

import { SelectModule} from 'ng-cosmos-td-ui/src/base/select/select.module';
import { CheckboxModule} from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule} from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { InputNumberModule } from 'ng-cosmos-td-ui/src/base/inputNumber/inputNumber.module';
import { colorPickerModule} from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { datePickerModule} from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { ButtonModule} from 'ng-cosmos-td-ui/src/base/button/button.module';
import { ReportConfigService } from '../../../service/report-config.service';
import { DimensionValueListModule } from '../common/dimension-value-list/dimension-value-list.module';
import MapModule from './map.module';
import { DateRangeModule } from '../common/public-data-panel/date-range/date-range.module';

@NgModule({
    declarations: [
        MapDataComponent,
        MapStyleComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        BgBdStyleModule,
        filterModule,
        SelectModule,
        CheckboxModule,
        RadioModule,
        InputModule,
        InputNumberModule,
        colorPickerModule,
        datePickerModule,
        DimensionValueListModule,
        ButtonModule,
        MapModule,
        DateRangeModule,
        LayoutModule,
        colorPickerStyleModule
    ],
    entryComponents: [MapDataComponent,MapStyleComponent],
    providers: [ReportConfigService]
})
export default class MapConfigModule{

}