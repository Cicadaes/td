import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { InstanceLicencePageComponent} from './instance-licence-page.component';
import {InstanceLicencePageService} from './instance-licence-page.service';
import {DateFormatPipeModule} from "../../../pipes/dateFormat-pipe";

@NgModule({
    declarations: [
        InstanceLicencePageComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        DateFormatPipeModule,
        NgZorroAntdModule
    ],
    providers: [InstanceLicencePageService],
    exports: [InstanceLicencePageComponent]
})
export class InstanceLicencePageModule {

}