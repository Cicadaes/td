export class RadioValue {

    private static _radio: RadioValue = null;

    public static getRadio(): RadioValue {
        if (!RadioValue._radio) {
            RadioValue._radio = new RadioValue();
        }
        return RadioValue._radio;
    }

    public getRadioValue(value:any): string {
        return value;
    }

}