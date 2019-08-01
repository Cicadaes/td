import { EditAppPageRoutingModule } from './edit-app-page-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { EditAppPageComponent } from './edit-app-page.component';
import { EditAppPageService } from './edit-app-page.service';
import { AddAppFormModule } from '../form/add-app-form.module';
import { EditAppFormModule } from '../../editForm/edit-app-form.module';

@NgModule({
    declarations: [
        EditAppPageComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AddAppFormModule,
        EditAppFormModule,
        EditAppPageRoutingModule,
        NgZorroAntdModule
    ],
    providers: [EditAppPageService],
    exports: [EditAppPageComponent]
})
export class EditAppPageModule {

}
