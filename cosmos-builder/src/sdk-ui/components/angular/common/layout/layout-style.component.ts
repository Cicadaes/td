import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigApi } from '../../../../api/config-api';
import { StylePanel } from '../../common/style.panel';
import { DataStore } from 'cosmos-td-sdk';

@Component({
    selector: 'layout',
    templateUrl: './layout-style.component.html',
    styleUrls: ['./layout-style.component.less'],
})
export class LayoutComponent extends StylePanel implements OnInit {
    private level: string = 'leftFloat';
    private vertical: string = 'topFloat';
    private width: string = '100%';
    private height: string = '100px';
    private highAuto: boolean = false;
    private widthAuto: boolean = false;
    private marginBottom: string = '0';
    private marginTop: string = '0';
    private marginLeft: string = '0';
    private marginRight: string = '0';
    private paddingTop: string = '0';
    private paddingBottom: string = '0';
    private paddingLeft: string = '0';
    private paddingRight: string = '0';
    private _align: string = 'level';
    private dircLevel: boolean = false;
    private dircVertical: boolean = false;
    layout: any = {
        bgAndBorder: this.bgBdStyle,
        widthAndHeight: {},
        paddingAndMargin: {},
        align: {}
    }

    


    constructor(
        public configApi: ConfigApi,
    ) {
        super(configApi);
    }

    numberValidators(value:any){
        const Name_REGEXP = /^\d&/;
        if (Name_REGEXP.test(value)) {

        }else{

        }
    }

    ngOnInit() {
        this.marginChange();
        this.paddingChange();
        this.whChange();
        this.OptionChange();
        if (!this.dircLevel) {
            this.layout.align.positionLevel = '';
        }
        if (!this.dircVertical) {
            this.layout.align.positionVertical = '';
        }
    }
    @Input()
    set cmPadding(cmPadding: any) {
        let padding = cmPadding;
        padding = padding.replace(/\s/g, "");
        padding = padding.split('px');
        this.paddingTop = padding[0];
        this.paddingRight = padding[1];
        this.paddingBottom = padding[2];
        this.paddingLeft = padding[3];
    };
    @Input()
    set cmHeightAuto(cmHeightAuto: any) {
        this.highAuto = cmHeightAuto;
    };
    @Input()
    set cmHeight(height: any) {
        this.height = height;
    };
    @Input()
    set cmAlign(cmAlign: any) {
        this._align = cmAlign;
        this.layout.align.dirc = this._align;
    };
    @Input()
    set cmDircLevel(dircLevel: any) {
        this.dircLevel = dircLevel;
    };

    @Input()
    set cmDircVertical(dircVertical: any) {
        this.dircVertical = dircVertical;
    };

    @Input()
    set layoutData(data: any) {
        let styleConfig = data;
        if (styleConfig && styleConfig['align']) {
            this.level = styleConfig['align']['positionLevel'];
            this.vertical = styleConfig['align']['positionVertical'];
        }
        if (styleConfig && styleConfig['widthAndHeight']) {
            this.highAuto = styleConfig['widthAndHeight']['highAuto'];
            this.widthAuto = styleConfig['widthAndHeight']['widthAuto'];
            if (this.highAuto) {
                this.height = '100px';
            } else {
                this.height = styleConfig['widthAndHeight']['height'];
            }
            if (this.widthAuto) {
                this.width = '100%';
            } else {
                this.width = styleConfig['widthAndHeight']['width'];
            }
        }
        if (styleConfig && styleConfig['paddingAndMargin'] && styleConfig['paddingAndMargin']['margin']) {
            let margin = styleConfig['paddingAndMargin']['margin'];
            margin = margin.replace(/\s/g, "");
            margin = margin.split('px');
            this.marginTop = margin[0];
            this.marginRight = margin[1];
            this.marginBottom = margin[2];
            this.marginLeft = margin[3];
        }
        if (styleConfig && styleConfig['paddingAndMargin'] && styleConfig['paddingAndMargin']['padding']) {
            let padding = styleConfig['paddingAndMargin']['padding'];
            padding = padding.replace(/\s/g, "");
            padding = padding.split('px');
            this.paddingTop = padding[0];
            this.paddingRight = padding[1];
            this.paddingBottom = padding[2];
            this.paddingLeft = padding[3];
        }
        this.componentStyleConf(styleConfig);
    }

    @Output() provinceOut = new EventEmitter();

    /**
     * 外边距改变
     */
    marginChange(event?: Event) {
        let margin = '';
        if (this.marginTop) {
            margin = margin + ' ' + this.marginTop + 'px';
        } else {
            margin = margin + ' ' + '0px';
        }

        if (this.marginRight) {
            margin = margin + ' ' + this.marginRight + 'px';
        } else {
            margin = margin + ' ' + '0px';
        }

        if (this.marginBottom) {
            margin = margin + ' ' + this.marginBottom + 'px';
        } else {
            margin = margin + ' ' + '0px';
        }

        if (this.marginLeft) {
            margin = margin + ' ' + this.marginLeft + 'px';
        } else {
            margin = margin + ' ' + '0px';
        }

        this.layout.paddingAndMargin['margin'] = margin;
        this.OptionChange();
    }

    /**
    * 宽高改变
    */
    whChange(event?: Event) {
        this.layout.widthAndHeight['highAuto'] = this.highAuto;
        this.layout.widthAndHeight['widthAuto'] = this.widthAuto;
        if (this.highAuto) {
            this.layout.widthAndHeight['height'] = 'auto';
        } else {
            if (this.height) {
                this.layout.widthAndHeight['height'] = this.height;
            } else {
                this.layout.widthAndHeight['height'] = 0;
            }
        }

        if (this.widthAuto) {
            this.layout.widthAndHeight['width'] = 'auto';
        } else {
            if (this.width) {
                this.layout.widthAndHeight['width'] = this.width;
            } else {
                this.layout.widthAndHeight['width'] = 0;
            }
        }

        this.OptionChange();
    }

    /**
     * 内边距改变
     */
    paddingChange(event?: Event) {
        let padding = '';
        if (this.paddingTop) {
            padding = padding + ' ' + this.paddingTop + 'px';
        } else {
            padding = padding + ' ' + '0px';
        }

        if (this.paddingRight) {
            padding = padding + ' ' + this.paddingRight + 'px';
        } else {
            padding = padding + ' ' + '0px';
        }

        if (this.paddingBottom) {
            padding = padding + ' ' + this.paddingBottom + 'px';
        } else {
            padding = padding + ' ' + '0px';
        }

        if (this.paddingLeft) {
            padding = padding + ' ' + this.paddingLeft + 'px';
        } else {
            padding = padding + ' ' + '0px';
        }

        this.layout.paddingAndMargin['padding'] = padding;

        this.OptionChange();
    }

    /**
     * 数据改变事件
     */
    OptionChange() {
        if (this.dircLevel) {
            this.layout.align.positionLevel = this.level;
        } else {
            this.layout.align.positionLevel = '';
        }

        if (this.dircVertical) {
            this.layout.align.positionVertical = this.vertical;
        } else {
            this.layout.align.positionVertical = '';
        }
        this.layout.bgAndBorder = this.bgBdStyle;
        this.provinceOut.emit(this.layout);
    }
}
