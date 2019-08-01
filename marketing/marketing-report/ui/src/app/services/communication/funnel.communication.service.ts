import { Injectable } from '@angular/core';

@Injectable()
export class FunnelCommunicationService {

    funnelListName: any =[{}];

    isEditFunnel:boolean = false;

    campaignId: number;

    selectedFunnelId: number;
    
    constructor(){
    }

}