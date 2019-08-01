export class RetentionFilterGraph {
    constructor(data: any = {}) {
        data && data.data && data.data.length && this.setRetentionData(data.data);
        data && data.style && this.setRetentionStyle(data.style);
    }

    /**
     * 设置留存图的数据
     * @param  data 原始数据
     */
    setRetentionData(data: any) {

    }

    /**
    * 设置留存图的样式
    * @param  style 配置样式
    */
    setRetentionStyle(style: any) {
        
    }

}
