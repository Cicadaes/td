import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddUgUserPageService } from './add-uguser-page.service';
import { AddUgUserPageComponent } from './add-uguser-page.component';
import { CommonModule } from "@angular/common";
import { AddUgUserFormModule } from "../form/add-uguser-form.module";
import { AddUgUserPageRoutingModule } from "./add-uguser-page-routing.module";

@NgModule({
    declarations: [
        AddUgUserPageComponent
    ],
    imports: [
        AddUgUserPageRoutingModule,
        CommonModule,
        FormsModule,
        AddUgUserFormModule,
        NgZorroAntdModule
    ],
    providers: [AddUgUserPageService],
    exports: [AddUgUserPageComponent]
})
export class AddUgUserPageModule {

}