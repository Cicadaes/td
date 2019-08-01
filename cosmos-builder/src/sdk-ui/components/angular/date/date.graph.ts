
export class DateGraph {
    startDate: any = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
    endDate: any = new Date();
    public data: any = {
        _dateRange: [this.startDate, this.endDate],
    }
    constructor(type: any, data?: any) {
        data && data.data && this.setDateData(data.data);
    }
    /**
     * 解析数据格式
     * @param  {any}       gpdata [description]
     * @param  {string =      'date'}       gptype [description]
     * @return {[type]}           [description]
     */
    setDateData(gpdata: any[] = []) {
        if (gpdata) {
            gpdata = this.deepCopy(gpdata);
            if (gpdata["value"].length > 1) {
                if (gpdata["direction"] == "minus") {
                    let now = new Date();
                    this.endDate = new Date(now.getTime() - gpdata["value"][1] * 24 * 60 * 60 * 1000);
                    this.startDate = new Date(this.endDate.getTime() - gpdata["value"][0] * 24 * 60 * 60 * 1000);
                }
                if (gpdata["direction"] == "add") {
                    let now = new Date();
                    this.startDate = new Date(now.getTime() + gpdata["value"][1] * 24 * 60 * 60 * 1000);
                    this.endDate = new Date(this.startDate.getTime() + gpdata["value"][0] * 24 * 60 * 60 * 1000);
                }
                if (gpdata["direction"] == "both") {
                    let now = new Date();
                    this.startDate = new Date(now.getTime() - gpdata["value"][0] * 24 * 60 * 60 * 1000);;
                    this.endDate = new Date(now.getTime() + gpdata["value"][1] * 24 * 60 * 60 * 1000);
                }
                this.data._dateRange = [this.startDate, this.endDate];
            } else {
                if (gpdata["direction"] == "minus") {
                    let now = new Date();
                    this.startDate = new Date(now.getTime() - gpdata["value"] * 24 * 60 * 60 * 1000);
                    this.endDate = now;
                }
                this.data._dateRange = [this.startDate, this.endDate];
            }
        } else {
            this.data._dateRange = [this.startDate, this.endDate];
        }
    }
    
    //深拷贝
    private deepCopy(data: any): any {
        let json = JSON.stringify(data);
        return JSON.parse(json);
    }
}
