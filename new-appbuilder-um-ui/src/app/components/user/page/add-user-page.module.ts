import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AddUserPageService } from './add-user-page.service';
import { AddUserPageComponent } from './add-user-page.component';
import { CommonModule } from '@angular/common';
import {AddUserFormModule} from '../form/add-user-form.module';
import {AddUserPageRoutingModule} from './add-user-page-routing.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        AddUserPageComponent
    ],
    imports: [
        AddUserPageRoutingModule,
        CommonModule,
        FormsModule,
        AddUserFormModule,
        NgZorroAntdModule
    ],
    providers: [AddUserPageService],
    exports: [AddUserPageComponent]
})
export class AddUserPageModule {

}
