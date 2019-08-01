import { FuncAuthRoutingModule } from './func-auth-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { FuncAuthService } from './func-auth.service';
import { FuncAuthComponent } from './func-auth.component';
import {CommonModule} from '@angular/common';
import {FuncAuthChecktreeModule} from './checktree/func-auth-checktree.module';


@NgModule({
    declarations: [
        FuncAuthComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FuncAuthRoutingModule,
        FuncAuthChecktreeModule,
        NgZorroAntdModule
    ],
    providers: [FuncAuthService],
    exports: [FuncAuthComponent]
})
export class FuncAuthModule {

}
