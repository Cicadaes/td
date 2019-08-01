import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';

import { EventImpactComponent } from './eventImpact.component';
import { DropdownModule } from 'ng-cosmos-td-ui/src/base/dropdown/dropdown.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';


@NgModule({
    declarations: [
        EventImpactComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        DropdownModule,
        SelectModule,
        ButtonModule,
        InputModule
    ],
    entryComponents: [EventImpactComponent]
})


export default class EventImpactModule{
    
}