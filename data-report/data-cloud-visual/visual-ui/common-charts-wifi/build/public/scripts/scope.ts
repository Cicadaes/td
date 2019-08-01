/**
 * Created by wangshouyun on 2017/3/9.
 */
export class Scope {

    private static _instance: Scope = null;

    public static getInstance(): Scope {
        if (!Scope._instance) {
            Scope._instance = new Scope();
        }
        return Scope._instance;
    }

    private randomIDArray: any[] = [];

    public get scopeID(): string {
        let randomID = this.randomID();
        bk:for (let id of this.randomIDArray) {
            if (randomID == id) {
                randomID = this.randomID();
                break bk;
            }
        }
        this.randomIDArray.push(randomID);
        return randomID;
    }

    public set scopeID(id:string){
        this.randomIDArray.push(id);
    }

    private randomID(len?: number): string {
        len = len || 16;
        let $chars = 'abcdefhijkmnprstwxyz2345678';
        var maxPos = $chars.length;
        var id = '';
        for (let i = 0; i < len; i++) {
            id += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return id;
    }

}