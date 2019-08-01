import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MarketingActivitiesComponent} from './marketing-activities.component';
import {MarketingActivitiesRoutingModule} from './marketing-activities.routing';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {FormsModule} from '@angular/forms';
import {ToDateStrPipe} from './to-date-str.pipe';
import {MarketingActivitiesService} from './marketing-activities.service';

@NgModule({
    imports: [
        CommonModule,
        MarketingActivitiesRoutingModule,
        FormsModule,
        NgZorroAntdModule.forRoot()
    ],
    declarations: [MarketingActivitiesComponent, ToDateStrPipe],
    providers: [
        MarketingActivitiesService,
    ]
})
export class MarketingActivitiesModule {
}
