import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CosmosModule } from 'ng-cosmos-td-ui/src/cosmos.module';
import { DimensionValueListComponent } from './dimension-value-list.component';
import { CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
@NgModule({
    declarations: [
        DimensionValueListComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosModule,
        CheckboxModule,
        RadioModule,
        SelectModule,
        InputModule,
        ButtonModule
    ],
    exports: [DimensionValueListComponent]
})
export class DimensionValueListModule { }