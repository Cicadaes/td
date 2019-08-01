import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
    selector: 'crowd-category-dialog',
    templateUrl: 'crowd-category-dialog.component.html',
    styleUrls: ['crowd-category-dialog.component.css'],
    providers: []
})
export class CrowdCategoryDialogComponent{

    private show:boolean;

    showPreciseCrowdDialog:boolean = false;

    showLookalikeCrowdDialog: boolean = false;

    iFshowLookalikeCrowdDialog: boolean = false;

    dialogData: any = {
        tp: 'lookalike',
        tp2: '2',
    };

    @Input()
    set showCrowdCategoryDialog(bl:boolean){
        this.show = bl;
    }

    @Output() hideCrowdCateDialog = new EventEmitter<boolean>();

    @Output() updateUnit = new EventEmitter<boolean>();

    constructor(){

    }

    afterDialogHide(){
        this.hideCrowdCateDialog.emit(this.show);
    }

    clickShowCrowdDialog(type: string,flag:string) {
        let that = this;
        that.showLookalikeCrowdDialog = !that.showLookalikeCrowdDialog;
        that.iFshowLookalikeCrowdDialog = true;
        let json = {
            tp: type,
            tp2: flag,
        };
       

        that.dialogData = Object.assign({}, json);
    }

    hidePreciseCrowdDialog(show:boolean){
        this.showPreciseCrowdDialog = show;
    }

    hideLookalikeCrowdDialog(bl: boolean) {
        this.showLookalikeCrowdDialog = bl;
        this.iFshowLookalikeCrowdDialog = false;
    }

    hideParentDialog(show: boolean) {
        this.show = show;
        this.hideCrowdCateDialog.emit(this.show);
        if(!show) {
            this.updateUnit.emit(true);
        }
    }
}