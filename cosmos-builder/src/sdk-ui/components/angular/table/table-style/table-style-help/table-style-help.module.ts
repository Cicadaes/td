import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableStyleHelpComponent } from './table-style-help.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';


@NgModule({
    declarations: [
        TableStyleHelpComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
    ],
    exports: [TableStyleHelpComponent]
})
export class TableStyleHelpModule {

}
