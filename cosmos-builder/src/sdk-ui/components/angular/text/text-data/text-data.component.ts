import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { ReportConfigService } from '../../../../service/report-config.service';
import { DataPanel, DataConfigKey } from '../../common/data.panel';
import { ConfigApi } from '../../../../api/config-api';
import { DataStore, EventEmitter, EventType } from 'cosmos-td-sdk';

@Component({
    templateUrl: './text-data.component.html',
    styleUrls: ['./text-data.component.less'],
})
export class TextDataComponent extends DataPanel implements OnInit {
    link: any = {
        content: "",
        protocol: "https://",
        site: "",
        dataLabel: true
    }
    constructor(
        public configApi: ConfigApi,
    ) {
        super(configApi);
    }

    async ngOnInit() {
        let config = DataStore.getConfigData(this.configApi.scope);
        if (config && config["dataConfig"]) {
            if (config["dataConfig"] && config["dataConfig"].protocol) {
                this.link = config["dataConfig"];
            } else {
                this.link.protocol = "https://"
            }
        } else {
            this.link = {
                content: "",
                protocol: "https://",
                site: "",
                dataLabel: true
            };
        }
    }
    /**
     * 改变count
     * @param value 
     */
    OptionChange(value: any) {

        DataStore.saveConfigData(this.configApi.scope, "dataConfig", value);
        EventEmitter.trigger(EventType.DATACHANGE,
            {
                scope: this.configApi.scope,
                data: {
                    code: "200",
                    data: [value]
                }
            }
        );
    }

}

