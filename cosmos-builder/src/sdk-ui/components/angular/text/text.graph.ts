import { TdBaseGraph } from '../common/td-base.graph';

export class TextGraph extends TdBaseGraph {

    constructor(obj: any, data: any = {}) {
        super("text");

        data && data.data && data.data.length && this.setPieData(data.data);
        data && data.style && this.setPieStyle(obj, data.style);
    }

    /**
     * 设置text图的数据
     * @param  {Array<any> = []}          gpdata [description]
     * @return {[type]}          [description]
     */
    private setPieData(gpdata: any[] = []) {

    }

    /**
     * 图表样式数据转换
     * @param  {any}    gpstyle [description]
     * @return {[type]}         [description]
     */
    private setPieStyle(type: any, data: any) {
        if (!data) {
            return;
        }
        data.bgAndBorder && this.setBackgroundColor(data.bgAndBorder);
        data.label && this.labelset(type, data.label);
        // data.margin && this.setMargin(type, data.margin);
        data.styles && this.setStyles(type, data.styles);
    }
    /**
     * 设置字体和段落
     * @param data 
     */
    labelset(type: any, data: any) {
        type.nativeElement.style.textAlign = data.layout;
        type.nativeElement.style.color = data.color;
        type.nativeElement.style.fontSize = data.fontSize;
        type.nativeElement.style.fontFamily = data.fontFamily;
    }
    /**
     * 设置内边距
     * @param data 
     */
    setMargin(type: any, data: any) {
        type.nativeElement.style.lineHeight = data.height;
        type.nativeElement.style.paddingLeft = data.left;
        type.nativeElement.style.paddingRight = data.right;
        type.nativeElement.style.paddingTop = data.top;
    }
    /**
     * 设置字体和段落-文字样式
     * @param data 
     */
    setStyles(type: any, data: any) {
        if (data["FontWigth"]) {
            type.nativeElement.style.fontWeight = "bold";
        } else {
            type.nativeElement.style.fontWeight = "normal";
        }
        if (data["FontStyle"]) {
            type.nativeElement.style.fontStyle = "oblique";//italic
        } else {
            type.nativeElement.style.fontStyle = "normal";
        }
        if (data["textDecoration"] && !data["decoration"]) {
            type.nativeElement.style.textDecoration = "underline";
        } else if (data["decoration"] && !data["textDecoration"]) {
            type.nativeElement.style.textDecoration = 'line-through';
        } else if (data["textDecoration"] && data["decoration"]) {
            type.nativeElement.style.textDecoration = "underline line-through";
        } else {
            type.nativeElement.style.textDecoration = "none";
        }
    }
    //深拷贝
    private deepCopy(data: any): any {
        let json = JSON.stringify(data);
        return JSON.parse(json);
    }
}
