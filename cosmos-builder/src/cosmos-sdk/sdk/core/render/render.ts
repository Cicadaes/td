import { DomSign } from "../base/base.view";
import { Single } from '../single';
export class Render {

    private static _instance: Render = null;
    private _style: string = null;
    private _template: string = null;

    constructor(single: Single) {
        if (!(single instanceof Single)) {
            throw "Render 不能被实例化，必须先调用 style() 方法获取实例";
        }
    }

    public static style(style?: string): Render {
        if (!Render._instance) {
            Render._instance = new Render(new Single());
        }
        let instance = Render._instance;
        instance._style = style;
        return instance;
    }

    public template(template: string): Render {
        this._template = template;
        return this;
    }

    public render(scope: string): HTMLElement {
        // 文档头部插入样式
        let scopeStyle: HTMLElement = document.head.querySelector(`[${DomSign.scope}]`) as HTMLElement;
        if (!scopeStyle) {
            let dom: HTMLElement = document.createElement('style');
            dom.setAttribute(DomSign.scope, "");
            document.head.appendChild(dom);
            scopeStyle = dom;
        }
        // 动态添加样式
        scopeStyle.appendChild(document.createTextNode(this.renderStyle(scope)));

        // 返回当前组件 dom
        return this.renderTemplate(scope);
    }

    private renderStyle(scope: string): string {
        if (this._style) {
            let style: string = this._style;
            style = style.trim();
            // style = style.replace(/\n+/g, ""); //去换行
            style = style.replace(/[^\}\n\s].+\{+?/g, (word) => {
                word = word.replace("{", "");
                let words = word.split(",");
                // console.log(words);
                let newWords = [];
                for (let w of words) {
                    if (w.substr(0, 1) == "#") {
                        newWords.push(w);
                    } else {
                        newWords.push(`[${DomSign.scope}="${scope}"]${w}`);
                    }
                }
                return newWords.join(",").toString() + "{";
            });
            this._style = style;
            return this._style;
        }
        return "";
    }

    // 渲染模板
    private renderTemplate(scope: string): HTMLElement {
        // console.log(this._template);
        let dom: HTMLElement = document.createElement('div');
        dom.innerHTML = this._template;
        return dom.firstElementChild as HTMLElement;
    }

    // 替换 dom 节点中的类名
    private replaceClassName(scope: string, className: string): void {
        let template = this._template;
        template = template.replace(/class=\".+\"+?/g, (word) => {
            word = word.replace(/^class=\"|\"$/g, "");
            let words = word.split(" ");
            let newWords = [];
            for (let w of words) {
                if (w == className) {
                    newWords.push(w + "_" + scope);
                } else {
                    newWords.push(w);
                }
            }
            return `class="${newWords.join(" ").toString()}"`;
        });
        this._template = template;
    }

}