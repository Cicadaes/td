import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


// import Modules
import { SharedModule } from '../../../../config/shared/shared.module';

// import Components
import { CreateConnectComponent } from './create-connect.component';
import { ConnectListComponent } from './connect-list/connect-list.component'

@NgModule({
    declarations: [
      CreateConnectComponent,
      ConnectListComponent,  
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([{
            path: '',
            component: CreateConnectComponent
        }])
    ],
    exports: [
      CreateConnectComponent
    ]
})
export class CreateConnectModule { }
