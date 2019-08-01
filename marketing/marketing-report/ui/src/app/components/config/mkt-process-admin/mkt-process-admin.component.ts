import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ErrorHandlingService } from './../../../services/exceptional/error-handling.service';
import { CampaignResourceService } from './../../../services/campaign/campaign.resource.service';
import { PipelineDefinitionResourceService } from './../../../services/admin/pipeline-definition.resource.service';
@Component({
    selector: 'mkt-process-admin',
    templateUrl: 'mkt-process-admin.component.html',
    styleUrls: ['mkt-process-admin.component.css'],
    providers: [ErrorHandlingService, CampaignResourceService,PipelineDefinitionResourceService]
})

export class MktProcessAdminComponent {
    constructor () {

    }
}