import { UserAuthRoutingModule } from './user-authTab-routing.module';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { UserAuthService } from './user-authTab.service';
import { UserAuthComponent } from './user-authTab.component';
import { UserAuthTableModule } from './table/user-auth-table.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        UserAuthComponent
    ],
    imports: [
        UserAuthRoutingModule,
        UserAuthTableModule,
        RouterModule,
        NgZorroAntdModule
    ],
    providers: [UserAuthService],
    exports: [UserAuthComponent]
})
export class UserAuthModule { }

