import { FuncAuthRoutingModule } from './func-authTab-routing.module';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { FuncAuthService } from './func-authTab.service';
import { FuncAuthComponent } from './func-authTab.component';
import { CommonModule } from '@angular/common';
import { CarouselAppManageModule } from '../../../../../main/carousel/carousel-app-manage/carousel-app-manage.module';
import { FuncAuthCheckTreeModule } from './checktree/func-auth-checktree.module';

@NgModule({
    declarations: [
        FuncAuthComponent
    ],
    imports: [
        CommonModule,
        FuncAuthRoutingModule,
        CarouselAppManageModule,
        FuncAuthCheckTreeModule,
        NgZorroAntdModule
    ],
    providers: [FuncAuthService],
    exports: [FuncAuthComponent]
})
export class FuncAuthModule {

}
