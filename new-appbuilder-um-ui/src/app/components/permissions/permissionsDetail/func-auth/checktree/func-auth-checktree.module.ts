import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { funcAuthChecktreeService } from './func-auth-checktree.service';
import { funcAuthChecktreeComponent } from './func-auth-checktree.component';
import { NzTreeModule, NgZorroAntdModule } from 'ng-cosmos-ui';
import { funcAuthPageModule } from '../page/func-auth-page.module';
import { InstanceAuthorizationRoleComponent } from '../instance-authorization-role/instance-authorization-role.component';


@NgModule({
    declarations: [
        funcAuthChecktreeComponent,
        InstanceAuthorizationRoleComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        funcAuthPageModule,
        NzTreeModule,
        NgZorroAntdModule
    ],
    providers: [funcAuthChecktreeService],
    exports: [funcAuthChecktreeComponent]
})

export class FuncAuthChecktreeModule {

}
