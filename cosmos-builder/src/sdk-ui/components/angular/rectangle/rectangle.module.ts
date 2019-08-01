import { NgModule, ComponentFactoryResolver } from '@angular/core';

import { RectangleComponent } from "./rectangle.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        RectangleComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
    ],
    entryComponents: [RectangleComponent]
})
export default class RectangleModule{
    
}