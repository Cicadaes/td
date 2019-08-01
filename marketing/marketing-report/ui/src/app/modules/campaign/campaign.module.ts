import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

//module引入开始
import {
    GrowlModule,
    SelectButtonModule,
    InputTextModule,
    DataTableModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    TabViewModule
        }    from 'primeng/primeng';
import {PaginatorxModule} from '../../common/paginator/paginator.module';
import { CampaignRoutingModule } from "../../routers/campaign/campaign.routing";
import { DatePickerModule } from '../../common/datePicker/datePicker.module';
import { TranslateModule } from "ng2-translate";
import { DateFromatPipeModule } from '../pipes/dateFormat-pipe.module';

//component引入开始
import { CampaignComponent } from "../../components/campaign/index/campaign.component";
import { CampaignListComponent } from './../../components/campaign/index/campaign-list.component';
import { NewCampaignComponent } from './../../components/campaign/index/dialog/new-campaign.component';
import { TextFomatPipe } from "../../pipes/textFomat-pipe";
import { CampaignOverviewComponent } from './../../components/campaign/index/campaign-overview.component';

//service 引入
import { ErrorHandlingService } from "../../services/exceptional/error-handling.service";

//Pipe 引入
import { CampaignStatusPipe } from "../../pipes/campaignStatus-pipe";

@NgModule({
    imports: [
        CommonModule,
        GrowlModule,
        FormsModule,
        CampaignRoutingModule,
        SelectButtonModule,
        InputTextModule,
        DataTableModule,
        PaginatorxModule,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        DatePickerModule,
        TranslateModule,
        TabViewModule,
        DateFromatPipeModule
    ],
    declarations: [
        CampaignStatusPipe,
        CampaignComponent,
        CampaignListComponent,
        NewCampaignComponent,
        TextFomatPipe,
        CampaignOverviewComponent
    ],
    providers: [
        ErrorHandlingService
    ]
})

export class CampaignModule {}