import { RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { MainService } from '../../../main.service';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { StoreModule, Store } from 'ng-cosmos-td-common';
interface AppState {
    reportTabs: any;
}

@Component({
    selector: 'reportfolder-detail',
    templateUrl: './reportfolder-detail.component.html',
    styleUrls: ['./reportfolder-detail.component.less'],
    providers: [FormBuilder]
})
export class ReportfolderDetailComponent implements OnInit {
    title: Array<any>;
    id:number;
    portdataId:any;

    constructor(
        private route: ActivatedRoute, 
        private mainService: MainService,
        private fb: FormBuilder,
        private store: Store<AppState>
    ) {
        this.title = this.route.snapshot.data['title'];
        this.id = this.route.snapshot.params.id;
        this.portdataId = this.route.params['value']['id'];
        // this.title[2]['url'] = `reportconfig/${this.route.snapshot.url[0]['path']}/${this.portdataId}`;       
        if (this.title[1].name == "文件夹") {
            this.store.dispatch({ type:'文件夹'});
        }
    }

    changeTitle(title: Array<any>) {
        setTimeout(() => {
            this.mainService.titleMission(title);
        }, 0);
    }

    ngOnInit() {
        this.changeTitle(this.title);
    }

}
