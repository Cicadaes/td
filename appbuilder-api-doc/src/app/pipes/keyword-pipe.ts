import { Pipe, Injectable, PipeTransform, NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
    name: 'keyword'
})
@Injectable()
export class KeywordPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }
    transform(str: any, keyword: string): any {
        let arr = [];
        let strRes = '[';
        if (keyword.indexOf(' ') > -1) {
            arr = keyword.split(' ');
            for (let i = 0; i < arr.length; i++) {
                if (arr[i]) {
                    if (i ===  arr.length - 1) {
                        strRes += arr[i];
                    } else {
                        strRes += arr[i] + ',';
                    }
                }
            }
            strRes += ']';
            const reg = new RegExp(strRes, 'g');
            str.replace(reg, (match, offset, string) => {
                const tempArr = str.split(match);
                str = tempArr.join('<b>' + match + '</b>');
            });
            return this.sanitizer.bypassSecurityTrustHtml(str);
        } else {
            const Reg = new RegExp(keyword, 'i');
            if (str) {
                str = str.replace(Reg, `<b>${keyword}</b>`);
                return this.sanitizer.bypassSecurityTrustHtml(str);
            }
        }
    }
}

@NgModule({
    imports: [],
    exports: [ KeywordPipe ],
    declarations: [ KeywordPipe ]
})
export class KeywordPipeModule {
}


