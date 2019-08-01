import { FormsModule } from '@angular/forms';
import { HeaderModule } from './header.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../routers/app.routing';
import { AppComponent } from '../components/app.component';
import { HttpModule, Http } from "@angular/http";
import { MenuComponent } from './../components/menu.component';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from "ng2-translate";

export function HttpLoaderFactory(http: Http) {
    return new TranslateStaticLoader(http, '/marketing/public/i18n', '.json');
}

//module引入开始
import {
    GrowlModule,
    SelectButtonModule,
    InputTextModule,
    DataTableModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule
} from 'primeng/primeng';
import { CampaignResourceService } from '../services/campaign/campaign.resource.service';
import { PipelineDefinitionResourceService } from '../services/admin/pipeline-definition.resource.service';


// directives

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        AppRoutingModule,
        HeaderModule,
        FormsModule,
        DialogModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (HttpLoaderFactory),
            deps: [Http]
        })
    ],
    declarations: [
        AppComponent,
        MenuComponent,
    ],
    providers:[
        CampaignResourceService,
        PipelineDefinitionResourceService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
