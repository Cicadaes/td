import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAppAttributeComponent } from './add-app-attribute.component';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddAppAttributeService } from './add-app-attribute.service';
import { AddAppDialogModule } from '../dialog/add-app-dialog.module';
import { AddAppAttributeRoutingModule } from './add-app-attribute-routing.module';
import { AddAppAttributeDialogModule } from '../addAttribute/add-app-attribute-dialog.module';

@NgModule({
    declarations: [
        AddAppAttributeComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AddAppDialogModule,
        AddAppAttributeDialogModule,
        AddAppAttributeRoutingModule,
        NgZorroAntdModule
    ],
    providers: [AddAppAttributeService],
    exports: [AddAppAttributeComponent]
})
export class AddAppAttributeModule {

}
