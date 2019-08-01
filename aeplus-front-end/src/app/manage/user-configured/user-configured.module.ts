import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserConfiguredRoutingModule} from './user-configured.routing';
import {UserConfiguredService} from './user-configured.service';
import {SharedModule} from './shared/shared.module';
import {PortrayalDialogComponent} from './components/portrayal-dialog/portrayal-dialog.component';
import {ModalDialogModule} from '../../common/modal-dialog/modal-dialog.module';
import {UserConfiguredCrowdComponent} from './user-configured-crowd/user-configured-crowd.component';
import {UserConfiguredInsightComponent} from './user-configured-insight/user-configured-insight.component';
import {TabListModule} from '../../common/tab-list/tab-list.module';
import {UserConfiguredTagComponent} from './user-configured-tag/user-configured-tag.component';
import {TagListTableComponent} from './user-configured-tag/table/tag-list-table.component';
import {MoreSearchModule} from '../../main/more-search/more-search.module';
import {StatusCrowdPipeModule} from '../../../pipes/status-crowd-pipe';
import {CalStatusCrowdPipeModule} from '../../../pipes/cal-status-crowd-pipe';
import {FastSearchModule} from '../../main/fast-search/fast-search.module';
import {SelectCustomModule} from '../../main/select/select-custom/select-custom.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ModalDialogModule,
        UserConfiguredRoutingModule,
        TabListModule,
        MoreSearchModule,
        StatusCrowdPipeModule,
        CalStatusCrowdPipeModule,
        FastSearchModule,
        SelectCustomModule
    ],
    declarations: [
        PortrayalDialogComponent,
        UserConfiguredCrowdComponent,
        UserConfiguredInsightComponent,
        UserConfiguredTagComponent,
        TagListTableComponent
    ],
    providers: [
        UserConfiguredService
    ]
})

export class UserConfiguredModule {
}
