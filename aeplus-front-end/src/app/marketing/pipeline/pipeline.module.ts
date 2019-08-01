import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { DirectiveModule } from '../../common/directive/directive.module';

// component 开始
import { PipelineComponent } from './pipeline.component';
import { EntrancePanelComponent } from './common-panel/entrance-panel/entrance-panel.component';
import { CrowdPanelComponent } from './common-panel/crowd-panel/crowd-panel.component';
import { TimerPanelComponent } from './common-panel/timer-panel/timer-panel.component';
import { FilterPanelComponent } from './common-panel/filter-panel/filter-panel.component';
import { ShuntPanelComponent } from './common-panel/shunt-panel/shunt-panel.component';
import { TriggerPanelComponent } from './common-panel/trigger-panel/trigger-panel.component';
import { PushPanelComponent } from './common-panel/push-panel/push-panel.component';
import { EdmPanelComponent } from './common-panel/edm-panel/edm-panel.component';
import { SmsPanelComponent } from './common-panel/sms-panel/sms-panel.component';

// service 开始
import { PipelineService } from './pipeline.service';
import { PipelineCommunicationService } from './pipeline-communication.service';
import { PipelineBusinessService } from './pipeline-business.service';

// pipe 开始
import { RelationPipeModule } from '../../../pipes/relation-pipe';

import { Utiles } from '../../utils/utiles';

import {ReportModule} from '../report/report.module';
import {InsightsModule} from '../../user/insights/insights.module';
import { GlobalRuleComponent } from './common-panel/global-rule/global-rule.component';
import { CKEditorModule } from '../../../../node_modules/ng2-ckeditor';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { DebugPanelComponent } from './debug-panel/debug-panel.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        ReportModule,
        InsightsModule,
        RouterModule.forChild([
            {
                path: '',
                component: PipelineComponent
            }
        ]),
        RelationPipeModule,
        DirectiveModule,
        CKEditorModule
    ],
    declarations: [
        PipelineComponent,
        EntrancePanelComponent,
        CrowdPanelComponent,
        TimerPanelComponent,
        FilterPanelComponent,
        ShuntPanelComponent,
        TriggerPanelComponent,
        PushPanelComponent,
        EdmPanelComponent,
        SmsPanelComponent,
        GlobalRuleComponent,
        ToolBarComponent,
        DebugPanelComponent
    ],
    providers: [
        PipelineService,
        PipelineCommunicationService,
        PipelineBusinessService,
        Utiles
    ]
})
export class PipelineModule { }
