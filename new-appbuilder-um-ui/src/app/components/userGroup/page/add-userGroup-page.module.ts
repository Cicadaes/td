import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddUserGroupPageService } from './add-userGroup-page.service';
import { AddUserGroupPageComponent } from './add-userGroup-page.component';
import { CommonModule } from '@angular/common';
import {AddUserGroupFormModule} from '../form/add-userGroup-form.module';
import {AddUserGroupPageRoutingModule} from './add-userGroup-page-routing.module';

@NgModule({
    declarations: [
        AddUserGroupPageComponent
    ],
    imports: [
        AddUserGroupPageRoutingModule,
        CommonModule,
        FormsModule,
        AddUserGroupFormModule,
        NgZorroAntdModule
    ],
    providers: [AddUserGroupPageService],
    exports: [AddUserGroupPageComponent]
})
export class AddUserGroupPageModule { }
