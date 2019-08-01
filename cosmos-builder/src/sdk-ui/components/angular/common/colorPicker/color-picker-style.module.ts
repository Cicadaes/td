import { NgModule, ApplicationRef, ComponentFactoryResolver, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { colorPickStyleComponent } from './color-picker-style.component'
import { TooltipModule} from 'ng-cosmos-td-ui/src/base/tooltip/tooltip.module';

@NgModule({
    declarations: [
        colorPickStyleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ColorPickerModule,
        TooltipModule
    ],
    exports: [colorPickStyleComponent],

})
export class colorPickerStyleModule implements OnInit, OnDestroy {
    constructor() {
    }
    ngOnInit() {

    }
    ngOnDestroy() {

    }
}