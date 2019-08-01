import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddTenantuserPageService } from './add-tenantuser-page.service';
import { AddTenantuserPageComponent } from './add-tenantuser-page.component';
import { CommonModule } from "@angular/common";
import {AddTenantUserFormModule} from "../form/add-tenantuser-form.module";
import {AddTenantuserPageRoutingModule} from "./add-tenantuser-page-routing.module";
import {AddTenantUserFormComponent} from "../form/add-tenantuser-form.component";

@NgModule({
    declarations: [
        AddTenantuserPageComponent
    ],
    imports: [
        AddTenantuserPageRoutingModule,
        CommonModule,
        FormsModule,
        AddTenantUserFormModule,
        NgZorroAntdModule
    ],
    providers: [AddTenantuserPageService],
    exports: [AddTenantuserPageComponent]
})
export class AddTenantuserPageModule {

}