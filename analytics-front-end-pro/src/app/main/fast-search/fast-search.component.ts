import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';

@Component({
    selector: 'app-fast-search',
    templateUrl: './fast-search.component.html',
    styleUrls: ['./fast-search.component.less']
})
export class FastSearchComponent implements OnInit, OnChanges {
    @Input() placeHolder: string;
    @Input() size: string;
    @Input() keyup: boolean;
    @Input() value: any;
    @Output() onSearch = new EventEmitter<any>();
    _value: any;
    _placeholder: string;
    _size: string;
    _keyup: boolean;
    _times: any;

    constructor() {
        this._placeholder = '输入关键字搜索';
        this._size = 'small';
    }

    trim(str: string) {
        if (str) {
            return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        } else {
            return '';
        }
    }

    changeInputValue(obj: any) {
        const value = obj.target.value;
        this._value = this.trim(value);
        try{
            clearTimeout(this._times);
        }catch(e) {
        };
    }

    _onSearch() {
        this.onSearch.emit(this._value);
    }

    enterKeyword(obj: any) {
        console.dir([obj]);
        this._value = this.trim(obj.target.value);
        this._onSearch();
    }

    onKeyup(value: any) {
        if (this._keyup) {
            try{
                clearTimeout(this._times);
            }catch(e){
            };
            this._times = setTimeout(() => {
                this._value = this.trim(value);
                this._onSearch();
            }, 1000);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.placeHolder) {
            this._placeholder = changes.placeHolder.currentValue;
        }

        if (changes.size) {
            this._size = changes.size.currentValue;
        }
        if (changes.keyup) {
            this._keyup = changes.keyup.currentValue;
        }
        if (changes.value) {
            this._value = changes.value.currentValue;
        }
    }

    ngOnInit() {
    }

}
