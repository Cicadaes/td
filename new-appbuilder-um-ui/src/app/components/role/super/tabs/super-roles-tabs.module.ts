import { SuperRolesTabsRoutingModule } from './super-roles-tabs-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { SuperRolesTabsComponent } from './super-roles-tabs.component';
import { SuperRolesTabsService } from './super-roles-tabs.service';
import { UserAuthModule } from '../../user-auth/user-auth.module';
import { FuncAuthModule } from '../../func-auth-home/func-auth/func-auth.module';
import { DateFormatPipeModule } from '../../../../pipes/dateFormat-pipe';

@NgModule({
    declarations: [
        SuperRolesTabsComponent
    ],
    imports: [
        DateFormatPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        SuperRolesTabsRoutingModule,
        UserAuthModule,
        FuncAuthModule,
        NgZorroAntdModule,
    ],
    providers: [SuperRolesTabsService],
    exports: [SuperRolesTabsComponent]
})
export class SuperRolesTabsModule {

}
