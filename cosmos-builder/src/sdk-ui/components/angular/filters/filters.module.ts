import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FiltersComponent } from './filters.component';
import { DropdownModule } from 'ng-cosmos-td-ui/src/base/dropdown/dropdown.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';

@NgModule({
    declarations: [
        FiltersComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DropdownModule,
        SelectModule,
        ButtonModule,
        InputModule
    ],
    entryComponents: [FiltersComponent]
})


export default class FiltersModule {

}