export class Scope {

    private static _instance: Scope = null;

    public static getInstance(): Scope {
        if (!Scope._instance) {
            Scope._instance = new Scope();
        }
        return Scope._instance;
    }

    public getscope(): number {
        return this.uuid();
    }

    private uuid() {
        var num = Math.random()*1000000000 + 100;
        num = Math.floor(num);
        return num;
    }

}