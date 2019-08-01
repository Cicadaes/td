import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { FuncAuthService } from './func-auth.service';
import { FuncAuthComponent } from './func-auth.component';
import { CommonModule } from '@angular/common';
import { CarouselAppManageModule } from '../../../../main/carousel/carousel-app-manage/carousel-app-manage.module';
import { FuncAuthCheckTreeModule } from './checktree/func-auth-checktree.module';
// 待处理树
@NgModule({
    declarations: [
        FuncAuthComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CarouselAppManageModule,
        FuncAuthCheckTreeModule,
        NgZorroAntdModule

    ],
    providers: [FuncAuthService],
    exports: [FuncAuthComponent]
})
export class FuncAuthModule {

}
