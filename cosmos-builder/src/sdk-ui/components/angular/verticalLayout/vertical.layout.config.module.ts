import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VerticalLayoutStyleComponent } from './vertical-layout-style/vertical-layout-style.component';
import { LayoutModule } from './../common/layout/layout-style.module';
import { LegendStyleModule } from './../common/legend/legend-style.module';
import { ReportConfigService } from '../../../service/report-config.service';


@NgModule({
    declarations: [
        VerticalLayoutStyleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        LayoutModule
    ],
    entryComponents: [ VerticalLayoutStyleComponent],
    providers: [ReportConfigService]
})
export default class VerticalLayoutConfigModule {

}