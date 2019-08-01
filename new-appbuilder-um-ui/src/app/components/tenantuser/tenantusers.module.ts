import { TenantusersRoutingModule } from './tenantusers-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TenantusersService } from './tenantusers.service';
import { TenantusersComponent } from './tenantusers.component';
import { CommonModule } from '@angular/common';
import { MoreSearchModule } from '../../main/more-search/more-search.module';
import { AddTenantUserDialogModule } from './dialog/add-tenantuser-dialog.module';
import { TenantusersTableModule } from './table/tenantusers-table.module';
import { InnerMenuModule } from '../../main/inner-menu/inner-menu.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        TenantusersComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TenantusersRoutingModule,
        MoreSearchModule,
        TenantusersTableModule,
        AddTenantUserDialogModule,
        InnerMenuModule,
        NgZorroAntdModule,
    ],
    providers: [TenantusersService],
    exports: [TenantusersComponent]
})
export class TenantusersModule {

}
