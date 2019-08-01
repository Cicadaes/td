import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionAttributeComponent } from './action-attribute.component';
import { ActionAttributeService } from './action-attribute.service';
import { ActionAttributeRoutingModule } from './action-attribute-routing.module';
import { AddActionAttributeDialogModule } from '../addAttribute/add-action-attribute-dialog.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
@NgModule({
    declarations: [
        ActionAttributeComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AddActionAttributeDialogModule,
        ActionAttributeRoutingModule,
        NgZorroAntdModule
    ],
    providers: [ActionAttributeService],
    exports: [ActionAttributeComponent]
})
export class ActionAttributeModule {

}
