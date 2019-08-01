import { AddAppPageRoutingModule } from './add-app-page-routing.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddAppPageComponent } from './add-app-page.component';
import { AddAppPageService } from './add-app-page.service';
import {AddAppFormModule} from "../form/add-app-form.module";
import {AddAppAttributeModule} from "../addAppAttribute/add-app-attribute.module";
import {AddAppExtendModule} from "../addAppExtend/add-app-extend.module";


@NgModule({
    declarations: [
        AddAppPageComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AddAppPageRoutingModule,
        AddAppFormModule,
        AddAppAttributeModule,
        AddAppExtendModule,
        NgZorroAntdModule
    ],
    providers: [AddAppPageService],
    exports: [AddAppPageComponent]
})
export class AddAppPageModule {

}