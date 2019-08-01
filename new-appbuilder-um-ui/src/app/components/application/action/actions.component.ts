import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionsService } from './actions.service';
import { UsersService } from '../../user/users.service';

@Component({
    selector: 'actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit, OnDestroy {
    actionFieldArray: any[];
    actionTableFieldParams: any;
    actionTableAjaxUrl: string;
    isShowAddActionModal: boolean = false;
    constructor(private service: ActionsService) {
        this.actionTableAjaxUrl = service.getActionsUrl;
    }

    showAddActionModal() {
        this.isShowAddActionModal = true;
    }

    hideAddActionModal(params: any) {
        this.isShowAddActionModal = false;
    }

    onSearchActtionList(params: any) {
        this.actionTableFieldParams = params;
    }

    initActionFieldArray(): void {
        this.actionFieldArray = [{
            id: 1,
            fieldName: 'name',
            fieldLabel: '功能名称',
            fieldType: 'input'
        }];
    }

    ngOnInit() {
        this.initActionFieldArray();
    }

    ngOnDestroy() {

    }

}
