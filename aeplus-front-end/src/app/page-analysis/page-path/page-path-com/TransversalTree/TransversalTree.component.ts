import {Component, OnInit, OnDestroy, Input, ElementRef, OnChanges, SimpleChanges} from '@angular/core';
import {PagePathComService} from '../page-path-com.service';

@Component({
    selector: 'cm-TransversalTree',
    templateUrl: './TransversalTree.component.html',
    styleUrls: ['./TransversalTree.component.less']
})
export class TransversalTreeComponent implements OnInit, OnChanges {
    @Input() filter: any;
    _cmData: any;
    _cmDirct: any;
    _rootList:Array<any> = [];
    showSelect: boolean = false;
    isOnly: boolean = false;
    noLeft: boolean = false;
    showIcon: boolean = true;
    selectOption: any;
    loading: boolean = false;
    options: any;
    maxNum: number;
    i: number = 0;
    _treeFilter: any = {};
    @Input()
    set cmData(cmData: any) {
        this._cmData = cmData;
        if (this._cmData.length == 1) {
            this.isOnly = true;
        } else {
            this.isOnly = false;
        }
    }

    @Input()
    set cmDirct(cmDirct: any) {
        this._cmDirct = cmDirct;
    }

    @Input()
    set rootList(rootList: any) {
        this._rootList = rootList;
        if (this._rootList && this._rootList.length > 0) {         
            if (!this.selectOption) {
                this.selectOption = this._rootList[0].id;
            }
            this.options = this._rootList;
            /*this.maxNum = Math.ceil(this._rootList.length/50);
             if (this._rootList.length < 50) {
             this.options = this._rootList;
             } else {
             this.options = this._rootList.slice(0, 50);
             }*/
        }
    }

    ngOnInit() {
        if (this._cmData.length == 1) {
            this.isOnly = true;
        } else {
            this.isOnly = false;
        }
        if (this._cmData.length == 0) {
            this.noLeft = true;
        }
    }

    constructor(private pagePathComService: PagePathComService) {

    }

    trim(str: string) {
        if (str) {
            return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        } else {
            return '';
        }
    }

    onSearch(value: any) {

        this.pagePathComService.onSearchPageData(this.trim(value));
    }

    scrollToBottom() {
        this.pagePathComService.loadMoreData(true);
        /*this.i++;
         if(this.i < this.maxNum){
         if (!this.loading) {
         this.loading = true;
         setTimeout(() => {
         this.generateFakeData();
         this.loading = false;
         }, 300);
         }
         }*/
    }

    generateFakeData() {
        for (let i = this.i * 50; i < (this.i + 1) * 50; i++) {
            // console.log(i);
            if (this._rootList[i]) {
                this.options.push(this._rootList[i]);
            }
        }
        // console.log(this.options);
    }

    _getObjById(id: any) {
        let obj;
        for(let i=0;i<this._rootList.length;i++){
                 if(id === this._rootList[i].id){
                    obj = this._rootList[i];
                 }
             }
             return obj;
    }
    selectedChange(value: any) {
        const obj = this._getObjById(value);
        this.showSelect = false;
        this.pagePathComService.switchRoot(obj);
    }

    closeLeft(state: boolean) {
        this.showIcon = !this.showIcon;
        this.pagePathComService.showLeft(state);
    }

    closeSelect() {
        this.showSelect = !this.showSelect;
    }

    showChange(data: any) {
        data.showArrow = false;
        for (let i = 0; i < this._cmData.length; i++) {
            if (this._cmData[i].id == data.id) {
                this._cmData[i].isShow = true;
            } else {
                this._cmData[i].isShow = false;
            }
        }
        this.pagePathComService.loadData(data);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.filter) {
            this._treeFilter = changes.filter.currentValue;
        }
    }
}
