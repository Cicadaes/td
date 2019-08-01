import { TenantsRolesTabsRoutingModule } from './tenants-roles-tabs-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { TenantsRolesTabsComponent } from './tenants-roles-tabs.component';
import { TenantsRolesTabsService } from './tenants-roles-tabs.service';
import { UserAuthModule } from './user-auth/user-authTab.module';
import { FuncAuthModule } from './func-auth/func-authTab.module';
import { DateFormatPipeModule } from '../../../../pipes/dateFormat-pipe';
import { RouterModule } from '../../../../../../node_modules/@angular/router';

@NgModule({
    declarations: [
        TenantsRolesTabsComponent
    ],
    imports: [
        RouterModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        TenantsRolesTabsRoutingModule,
        DateFormatPipeModule,
        UserAuthModule,
        FuncAuthModule
    ],
    providers: [TenantsRolesTabsService],
    exports: [TenantsRolesTabsComponent]
})
export class TenantsRolesTabsModule {

}
