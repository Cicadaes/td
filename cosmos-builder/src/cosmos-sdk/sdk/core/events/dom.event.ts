

export class DomEvent {
    public static addEvent(el: HTMLElement, type: string, fn: any, capture: boolean) {
        if (window.addEventListener) {
            el.addEventListener(type, fn, capture);        
        } else if (window['attachEvent']) {
            el['attachEvent']("on" + type, fn);
        }
        return this;
    }
    public static fireEvent(el: any, eventName: any,data:any) {
        if (typeof (el) == 'object') {
            eventName = eventName.replace(/^on/i, '');
            if (document.all) {
                eventName = "on" + eventName;
                el.fireEvent(eventName);
            } else {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent(eventName, true, true);
                evt['data'] = data;
                el.dispatchEvent(evt);
            }
        }
        return this;
    }
    public static removeEvent(el: HTMLElement, type: string, fn: any, capture: boolean) {
        if (window.removeEventListener) {
            el.removeEventListener(type, fn, capture || false);
        } else if (document['attachEvent']) {
            el['detachEvent']("on" + type, fn);
        }
        return this;
    }
}

