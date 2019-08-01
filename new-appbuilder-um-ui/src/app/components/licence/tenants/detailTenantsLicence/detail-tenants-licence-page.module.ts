import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import {DetailTenantsLicencePageService} from "./detail-tenants-licence-page.service";
import {DetailTenantsLicencePageComponent} from "./detail-tenants-licence-page.component";
import { DetailTenantsLicencePageRoutingModule} from "./detail-tenants-licence-page-routing.module";
@NgModule({
    declarations: [
        DetailTenantsLicencePageComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        DetailTenantsLicencePageRoutingModule,
        NgZorroAntdModule
        ],
    providers: [DetailTenantsLicencePageService],
    exports: [DetailTenantsLicencePageComponent]
})
export class DetailTenantsLicencePageModule {

}