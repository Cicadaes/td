import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DayWeekMonthDataComponent } from './dayWeekMonth-data/dayWeekMonth-data.component';
import { DayWeekMonthStyleComponent } from './dayWeekMonth-style/dayWeekMonth-style.component';
import { LayoutModule } from './../common/layout/layout-style.module';
import { LegendStyleModule } from './../common/legend/legend-style.module';

import { CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { DimensionValueListModule } from '../common/dimension-value-list/dimension-value-list.module';
import DayWeekMonthModule from './dayWeekMonth.module';
import { alignmentStyleModule } from '../common/alignment/alignment-style.module';

@NgModule({
    declarations: [
        DayWeekMonthDataComponent,
        DayWeekMonthStyleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        LayoutModule,
        LegendStyleModule,
        CheckboxModule,
        DayWeekMonthModule,
        alignmentStyleModule
    ],
    entryComponents: [DayWeekMonthDataComponent, DayWeekMonthStyleComponent],
})
export default class DayWeekMonthConfigModule {

}