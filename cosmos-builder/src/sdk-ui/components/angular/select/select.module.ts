import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from "./select.component";
import { CosmosChartModule } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';

@NgModule({
    declarations: [
        SelectComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosChartModule,
        SelectModule,
        ReactiveFormsModule,
        FormModule,
    ],
    entryComponents: [SelectComponent]
})
export default class FilterSelectModule{
    
}