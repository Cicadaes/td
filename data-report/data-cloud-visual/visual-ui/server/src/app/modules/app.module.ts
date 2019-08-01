import {NgModule} from '@angular/core';
import {BrowserModule}  from '@angular/platform-browser';
import {AppRoutingModule} from '../routers/app-routing.module';
import {AppComponent} from '../components/app.component';
import {HeaderComponent} from '../components/header.component';
import {UserComponent} from '../components/user/user.component';
import {HttpModule} from "@angular/http";
import {DialogModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {AppCommunicationService} from "../services/app.communication.service";
import {GrowlModule}    from 'primeng/primeng';
import {DialogDataModule} from '../common/dialog/dialog.module'
import { CommonModule }     from '@angular/common';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    DialogModule,
    FormsModule,
    DialogDataModule,
    CommonModule,
    GrowlModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    UserComponent
  ],
  bootstrap: [AppComponent],
  providers: [AppCommunicationService]
})
export class AppModule {

}
