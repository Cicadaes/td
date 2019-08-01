import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorizontalLayoutStyleComponent } from './horizontal-layout-style/horizontal-layout-style.component';
import { LayoutModule } from './../common/layout/layout-style.module';
import { ReportConfigService } from '../../../service/report-config.service';

@NgModule({
    declarations: [
        HorizontalLayoutStyleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        LayoutModule
    ],
    entryComponents: [ HorizontalLayoutStyleComponent],
    providers: [ReportConfigService]
})
export default class HorizontalLayoutConfigModule {

}