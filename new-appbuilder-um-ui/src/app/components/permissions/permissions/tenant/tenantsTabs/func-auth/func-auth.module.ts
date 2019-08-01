import { FuncAuthRoutingModule } from './func-auth-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { FuncAuthService } from './func-auth.service';
import { FuncAuthComponent } from './func-auth.component';
import {CommonModule} from "@angular/common";
import {FuncAuthCheckTreeModule} from "./checktree/func-auth-checktree.module";
import { CarouselAppManageModule } from '../../../../../../main/carousel/carousel-app-manage/carousel-app-manage.module';

@NgModule({
    declarations: [
        FuncAuthComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
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