import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './title-style-help.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';


@NgModule({
    declarations: [
        TitleComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
    ],
    exports: [TitleComponent]
})
export class TitleHelpModule {

}
