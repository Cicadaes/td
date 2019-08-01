import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AppAttributeComponent } from './app-attribute.component';
import { AppAttributeService } from './app-attribute.service';
import { AddAppDialogModule } from '../dialog/add-app-dialog.module';
import { AppAttributeRoutingModule } from './app-attribute-routing.module';
import { AddAppAttributeDialogModule } from '../addAttribute/add-app-attribute-dialog.module';
import { EditAppAttributeDialogModule } from '../editAttribute/edit-app-attribute-dialog.module';

@NgModule({
    declarations: [
        AppAttributeComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AddAppDialogModule,
        AddAppAttributeDialogModule,
        EditAppAttributeDialogModule,
        AppAttributeRoutingModule,
        NgZorroAntdModule
        ],
    providers: [AppAttributeService],
    exports: [AppAttributeComponent]
})
export class AppAttributeModule {

}
