import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid-style-help.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';


@NgModule({
    declarations: [
        GridComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
    ],
    exports: [GridComponent]
})
export class GridModule {

}
