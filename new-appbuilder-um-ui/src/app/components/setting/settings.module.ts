import { SettingsRoutingModule } from './settings-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { SettingsService } from './settings.service';
import { SettingsComponent } from './settings.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        SettingsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SettingsRoutingModule,
        NgZorroAntdModule
    ],
    providers: [SettingsService],
    exports: [SettingsComponent]
})
export class SettingsModule {

}
