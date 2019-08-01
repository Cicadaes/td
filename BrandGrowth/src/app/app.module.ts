import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

// import Mpdules
import { CoreModule } from './config/core/core.module';
import { SharedModule } from './config/shared/shared.module';
import { CosmosModule } from 'ng-cosmos-td-ui';
import { AppLayoutModule } from './components/app-layout/app-layout.module';

// import Routing_Config
import { routes } from './app-routing.module';

// import ngRx
import { reducer } from './ngrx/reducer';

// import Components
import { AppComponent } from './app.component';
import { EntryContainerComponent } from './container/entry/entry-container.component';
import { MarketingCenterTableComponent } from './container/entry/marketing-center-table/marketing-center-table.component';

@NgModule({
  declarations: [
    AppComponent,
    EntryContainerComponent,
    MarketingCenterTableComponent,
  ],
  imports: [
    CommonModule,
    HttpModule,
    BrowserAnimationsModule,
    CoreModule,
    AppLayoutModule,
    RouterModule.forRoot(routes, { useHash: true }),
    StoreModule.forRoot(reducer),
    CosmosModule.forRoot(),
  ],
  providers: [
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
