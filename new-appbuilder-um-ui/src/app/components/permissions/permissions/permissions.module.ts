import { permissionsRoutingModule } from './permissions-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { permissionsService } from './permissions.service';
import { permissionsComponent } from './permissions.component';
import { CommonModule } from '@angular/common';
import { TenantPermissionsTableModule } from './tenant/table/tenant-permissions-table.module';
import { MoreSearchModule } from '../../../main/more-search/more-search.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
@NgModule({
    declarations: [
        permissionsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        permissionsRoutingModule,
        MoreSearchModule,
        TenantPermissionsTableModule,
        NgZorroAntdModule
    ],
    providers: [permissionsService],
    exports: [permissionsComponent]
})

export class permissionsModule {

}
