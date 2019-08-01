import {NgModule} from '@angular/core';
import {BrowserModule}  from '@angular/platform-browser';
import {AppRoutingModule} from '../routers/app-routing.module';
import {AppComponent} from '../components/app.component';
import {HttpModule} from "@angular/http";
import {FormsModule} from '@angular/forms';



@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        AppRoutingModule,
        FormsModule
    ],
    declarations: [
        AppComponent,

    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
