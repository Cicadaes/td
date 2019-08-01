import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap } from '@angular/router';
import { LogsService } from '../logs.service';

@Component({
    selector: 'log-detail',
    templateUrl: './log-detail.component.html',
    styleUrls: ['./log-detail.component.css'],
    providers: [LogsService]
})

export class LogDetailComponent implements OnInit {
    @Input() logId = 0;
    log: any = {};

    constructor(private service: LogsService, private route: ActivatedRoute) {
        this.logId = this.route.snapshot.params['logId'];
    }

    ngOnInit() {
        this.service.getLogById(this.logId).then((data: any) => {
            if (data.success === true) {
                this.log = data.data;
            }
        });
    }
}
