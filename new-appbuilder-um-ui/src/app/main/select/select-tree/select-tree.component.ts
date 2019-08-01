import { Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Observable } from 'rxjs';
import { SelectTreeService } from './select-tree.service';

@Component({
    selector: 'select-tree',
    templateUrl: './select-tree.component.html',
    styleUrls: ['./select-tree.component.css'],
    providers: [ SelectTreeService ]
})

export class SelectTreeComponent implements OnInit, OnDestroy{
    @Input() select: any = {};
    @Output() onSelect = new EventEmitter<any>();


    placeHolder: string = "请选择";
    _value: any[] = [];

    _console(value: any) {
        this.selectedOption = value;
        console.log(value);
        this.onSelect.emit(this.selectedOption);
    }

    selectedOption: any;
    searchOptions: any = [];
    dataList: any[];

    constructor(private service: SelectTreeService) { }

    searchChange(searchText: any) {
        let data$ = Observable.create((observer:any) => {
            observer.next(this.dataList);
        }).throttleTime(1000).map((heroes:any) => {
            return heroes.filter((item:any) => {
                return new RegExp(searchText, 'gi').test(item.label)
            });
        }).delay(2000);
        data$.subscribe((result:any) => {
            this.searchOptions = result;
        });
    }

    querySelectDatas(){
        if(this.select.apiData){
            this.service.getDatas(this.select.apiUrl,this.select.params).subscribe((data: any) => {
                this.dataList = data.result;
                this.searchOptions = this.dataList;
            })
        }else{
            this.dataList = this.select.selectOptions;
            this.searchOptions = this.dataList;
        }
    }

    buildSelectOptionByValue(){
        let options:any[] = [];
        if(this._value && this._value.length > 0){
            for(let i = 0;i < this._value.length;i++){
               options.push(this._value[i].value);
            }
        }
        return options;
    }

    ngOnInit() {
        this._value = this.select.initValue || [];
        this.selectedOption = this.buildSelectOptionByValue();
        this.querySelectDatas();
        //this.selectedOption = this.select.initValue || [];
        this.onSelect.emit(this.selectedOption);
    }

    ngOnDestroy() {

    }


}