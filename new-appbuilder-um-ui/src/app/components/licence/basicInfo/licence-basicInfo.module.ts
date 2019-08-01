import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LicenceBasicInfoService } from './licence-basicInfo.service';
import { LicenceBasicInfoComponent } from './licence-basicInfo.component';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        LicenceBasicInfoComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgZorroAntdModule
    ],
    providers: [LicenceBasicInfoService],
    exports: [LicenceBasicInfoComponent]
})
export class LicenceBasicInfoModule {

}