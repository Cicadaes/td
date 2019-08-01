import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunnelPopoutComponent } from './funnel-popout.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';


@NgModule({
    declarations: [
        FunnelPopoutComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
    ],
    exports: [FunnelPopoutComponent]
})
export class FunnelPopoutModule {

}
