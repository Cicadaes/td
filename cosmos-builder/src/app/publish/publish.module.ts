import { NgModule } from '@angular/core';
import { PublishService } from './publish.service';
import { PublishComponent } from './publish.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ng-cosmos-td-ui/src/base/tabs/tabs.module';
import { PublishRoutingModule } from './publish-routing.module';
import { ConfigApi } from '../../sdk-ui/api/config-api';
import { ReportConfigService } from '../../sdk-ui/service/report-config.service';
import { AngularModule } from '../../sdk-ui/components/angular/angular.module';
import { BreadcrumbModule } from 'ng-cosmos-td-ui/src/base/breadcrumb/breadcrumb.module';

@NgModule({
    declarations: [
        PublishComponent,
    ],
    imports: [
        FormsModule,
        CommonModule,
        TabsModule,
        AngularModule,
        PublishRoutingModule,
        BreadcrumbModule
    ],
    providers: [PublishService,ConfigApi,ReportConfigService]
})
export class PublishModule {

}
