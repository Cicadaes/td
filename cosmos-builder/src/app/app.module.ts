import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from 'ng-cosmos-td-common';
import { reducers } from "./reducer/reducer";
import { CanDeactivateProvide } from './service/canDeactivate.service'
import { DatasourceProvide } from './service/Datasource.service';
import { CosmosModule, iconConfig } from 'ng-cosmos-td-ui/src/cosmos.module';
import { AppService } from './app.service';

iconConfig.extraFontName = 'anticon';
iconConfig.extraFontUrl = './assets/fonts/iconfont';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HttpModule,
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        CosmosModule.forRoot(),
        StoreModule.forRoot(reducers),
        AppRoutingModule
    ],
    providers: [CanDeactivateProvide, DatasourceProvide, AppService],
    bootstrap: [AppComponent]
})
export class AppModule {

}