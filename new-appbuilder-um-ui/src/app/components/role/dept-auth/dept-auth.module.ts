import { DeptAuthRoutingModule } from './dept-auth-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { DeptAuthService } from './dept-auth.service';
import { DeptAuthComponent } from './dept-auth.component';
import { CommonModule } from '@angular/common';
import { DeptAuthTableModule } from './table/dept-auth-table.module';
import { OrganizationTreeModule } from '../../../main/tree/organization-tree/organization-tree.module';

@NgModule({
    declarations: [
        DeptAuthComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DeptAuthRoutingModule,
        DeptAuthTableModule,
        OrganizationTreeModule,
        NgZorroAntdModule
    ],
    providers: [DeptAuthService],
    exports: [DeptAuthComponent]
})
export class DeptAuthModule {

}
