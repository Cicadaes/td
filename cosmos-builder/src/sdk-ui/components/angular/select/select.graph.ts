export class SelectGraph {
    public data: any = {
        name: '',
        List: [
            {
                label: '1',
                value: '1'
            },
            {
                label: '2',
                value: '2'
            },
            {
                label: '3',
                value: '3'
            }
        ]
    };

    constructor(data: any = {}, culbid?: any) {
        data && data.data && this.setSelectData(data.data);
        data && data.style && this.setFilterStyle(data.style);
    }

    /**
     * 设置select的数据
     * @param  
     */
    private setSelectData(data: any) {
        if (data && data["dimensionValueData"] && data["dimensionValueData"]["options"] && data["dimensionValueData"]["options"].length > 0) {
            this.data.dimensionDefault = data.dimensionDefault;
        } else {
            this.data.dimensionDefault = [];
        }
        this.data['List'] = [];
        if (data.name && data.isShowName) {
            this.data.name = data.name + '：';
        }
        this.data.dimension = data.dimension;
        if (data && data["dimensionValueData"] && data["dimensionValueData"]["options"] && data["dimensionValueData"]["options"].length > 0) {
            let options = data.dimensionValueData.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].checked) {
                    this.data.List.push({ label: options[i].label, value: options[i].value });
                }
            }
        }
    }

    /**
     * 筛选器样式数据转换
     * @param  
     */
    setFilterStyle(data: any) {

    }
}
