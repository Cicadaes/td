import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextComponent } from "./text.component";
import { CosmosChartModule } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.module';
import { textLinkService } from './text-style/text-style-link/text-style-link.service'

@NgModule({
    declarations: [
        TextComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CosmosChartModule
    ],
    providers: [textLinkService],
    entryComponents: [TextComponent]
})
export default class TextModule{
    
}