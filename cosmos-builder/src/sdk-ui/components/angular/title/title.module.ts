import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';

import { TitleComponent } from './title.component';

import { OverlayModule } from '@angular/cdk/overlay';
import { SortselectorModule } from 'ng-cosmos-td-ui/src/business/sortselector/sortselector.module';
import { DropdownModule } from 'ng-cosmos-td-ui/src/base/dropdown/dropdown.module';
import { TooltipModule } from 'ng-cosmos-td-ui/src/base/tooltip/tooltip.module';
@NgModule({
    declarations: [
        TitleComponent
    ],
    imports: [
        CommonModule,
        OverlayModule,
        SortselectorModule,
        DropdownModule,
        TooltipModule
    ],
    entryComponents: [TitleComponent]
})


export default class TitleModule{
    
}