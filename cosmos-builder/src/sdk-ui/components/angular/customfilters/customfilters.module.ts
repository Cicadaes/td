import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { customfiltersComponent } from './customfilters.component';
import { DropdownModule } from 'ng-cosmos-td-ui/src/base/dropdown/dropdown.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { CheckCascaderModule } from 'ng-cosmos-td-ui/src/business/checkcascader/checkcascader.module';

@NgModule({
    declarations: [
        customfiltersComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropdownModule,
        SelectModule,
        ButtonModule,
        InputModule,
        CheckCascaderModule
    ],
    entryComponents: [customfiltersComponent]
})


export default class customfiltersModule {

}