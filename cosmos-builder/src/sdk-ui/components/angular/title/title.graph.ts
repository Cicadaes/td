export class TitleGraph {
    public option = {
        gridName: {},
        gridHelp: {},
        gridDownload: {},
        bgAndBorder: {}
    };
    constructor(data: any = {}) {
        data && data.data && data.data.length && this.setRetentionData(data.data);
        data && data.style && this.setRetentionStyle(data.style);
    }

    /**
     * 设置title的数据
     * @param  data 原始数据
     */
    setRetentionData(data: any) {

    }

    /**
    * 设置title的样式
    * @param  style 配置样式
    */
    setRetentionStyle(style: any) {
        // if (!style.gridName.name) {
        //     this.option['gridName']['name'] = "标题";
        // } else {
            this.option['gridName']['name'] = style.gridName.name;
        // }
        this.option['gridName']['style'] = {
            "color": `${style.gridName.color}`,
            "font-family": `${style.gridName.fontFamily}`,
            "font-size": `${style.gridName.fontSize}px`
        }
        this.option['gridName']['layout'] = style.gridName.layout;
        // this.option.bgAndBorder = {
        //     "border-width": `${style.bgAndBorder.borderWidth}`,
        //     "border-style": `${style.bgAndBorder.borderStyle}`,
        //     "border-color": `${style.bgAndBorder.borderColor}`,
        //     "border-radius":`${style.bgAndBorder.borderRadius}`,
        //     "background-color":`${style.bgAndBorder.backgroundColor}`,
        //     "box-shadow":`${style.bgAndBorder.boxShadow}`
        // };
        this.option.gridDownload = style.gridDownload;
        this.option.gridHelp = style.gridHelp;
    }


}
