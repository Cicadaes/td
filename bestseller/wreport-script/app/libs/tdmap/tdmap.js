(function () {
//window.onerror=function(){return false};
    var console = window.console || {
            log: function () {
            }
        };
    window.TD = window.TD || {};
    var TD = {Config: {}};
    (function () {
        var counter = 0;
        window.tdmap_instances = {};

        /**
         * TD框架的基类
         * @namespace
         * @name TD.BaseClass
         */
        TD.BaseClass = function (hc) {
            tdmap_instances[(this.hashCode = (hc || TD.BaseClass.guid()))] = this;
        };

        /** @ignore */
        TD.BaseClass.guid = function () {
            return "td_" + (counter++).toString(36);
        };


        /**
         * 根据参数(hashCode)的指定，返回对应的实例对象引用
         * @param {String} hashCode 需要获取实例的hashCode
         * @return {Object/Null} 如果存在的话，返回;否则返回Null。
         */
        window.Instance = TD.I = function (hashCode) {
            return tdmap_instances[hashCode];
        };

        /**
         * 释放对象所持有的资源。
         * 主要是自定义事件。
         * 好像没有将_listeners中绑定的事件剔除掉..
         */
        TD.BaseClass.prototype.dispose = function () {
            if (this.hashCode) {
                delete tdmap_instances[this.hashCode];
            }

            for (var i in this) {
                if (typeof this[i] != "function") {
                    delete this[i];
                }
            }
        };

        /**
         * 返回对象的hashCode，如果没有的话，添加一个新的hashCode并将其返回
         * @return {String} 对象的hashCode
         */
        TD.BaseClass.prototype.getHashCode = function () {
            if (!this.hashCode) {
                tdmap_instances[(this.hashCode = TD.BaseClass.guid())] = this;
            }
            return this.hashCode;
        };

        /**
         * 从tdmap_instances数组中将对象的引用删除掉。
         * 删除之后就无法使用TD.I()函数获取对象了。
         */
        TD.BaseClass.prototype.decontrol = function () {
            delete tdmap_instances[this.hashCode];
        };


        /**
         * 将source中的所有属性拷贝到target中。
         * @param {Object} target 属性的接收者
         * @param {Object} source 属性的来源
         * @return {Object} 返回的内容是o
         */
        TD.extend = function (target, source) {

            if (target && source && typeof (source) == "object") {
                for (var p in source) {
                    target[p] = source[p];
                }

                var prototype_fields = [
                    'constructor',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'toLocaleString',
                    'toString',
                    'valueOf'
                ];

                for (var j = 0, key; j < prototype_fields.length; j++) {
                    key = prototype_fields[j];
                    if (Object.prototype.constructor.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };


    })();

    /**
     * 父类继承
     * @param {Object} parentClass
     * @param {Object} className
     */
    Function.prototype.inherits = function (parentClass, className) {
        var i, p, op = this.prototype, C = function () {
        };
        C.prototype = parentClass.prototype;
        p = this.prototype = new C();
        if (typeof (className) == "string") {
            p.className = className;
        }
        for (i in op) {
            p[i] = op[i];
        }
        this.prototype.constructor = op.constructor;
        op = C = null;
        return p;
    };

    /**
     * 自定义的事件对象
     * @namespace
     * @name TD.BaseEvent
     */
    TD.BaseEvent = function (type, target) {
        /**
         * 事件的名称
         * @type {String}
         */
        this.type = type;

        /**
         * 当事件发生之后处理结果的返回值
         * @type {Boolean}
         */
        this.returnValue = true;

        /**
         * 在事件被触发后传递的对象
         * @type {TD.BaseClass}
         */
        this.target = target || null;

        /**
         * 触发该事件的对象
         * @type {TD.BaseClass}
         */
        this.currentTarget = this.srcElement = null;

        /**
         * 作为阻止事件冒泡的一个标志参数
         * @type {Boolean}
         */
        this.cancelBubble = false;

        this.domEvent = null;
    };

    /**
     * 扩展TD.BaseClass来添加自定义事件
     * @param {String} type 自定义事件的名称
     * @param {Function} handler 自定义事件被触发时应该调用的回调函数
     * @param {String} key 可选参数，绑定到事件上的函数对应的索引key
     */
    TD.BaseClass.prototype.addEventListener = function (type, handler, key) {
        if (typeof handler != "function") {
            return;
        }
        if (!this._listeners) {
            this._listeners = {};
        }
        var t = this._listeners, id;
        if (typeof key == "string" && key) {
            if (!/[^\w\-]/.test(key)) {
                handler.hashCode = key;
                id = key;
            }
        }
        if (type.indexOf("on") != 0) {
            type = "on" + type;
        }
        if (typeof t[type] != "object") {
            t[type] = {};
        }
        id = id || TD.BaseClass.guid();
        handler.hashCode = id;
        t[type][id] = handler;
    };

    /**
     * 删除自定义事件中绑定的一个回调函数。如果第二个参数handler没有被
     * 绑定到对应的自定义事件中，什么也不做。
     * @param {String} type 自定义事件的名称
     * @param {Function} handler 需要删除的自定义事件的函数或者该函数对应的索引key
     */
    TD.BaseClass.prototype.removeEventListener = function (type, handler) {
        if (typeof handler == "function") {
            handler = handler.hashCode;
        } else if (typeof handler != "string") {
            return;
        }
        if (!this._listeners) {
            this._listeners = {};
        }
        if (type.indexOf("on") != 0) {
            type = "on" + type;
        }
        var t = this._listeners;
        if (!t[type]) {
            return;
        }
        if (t[type][handler]) {
            delete t[type][handler];
        }
    };

    /**
     * 清除掉自定义事件中绑定的所有回调函数。(慎用)
     * @param {String} type 自定义事件的名称
     */
    TD.BaseClass.prototype.clearEventListener = function (type) {
        if (!this._listeners) {
            this._listeners = {};
        }
        if (type.indexOf("on") != 0) {
            type = "on" + type;
        }
        var t = this._listeners;
        if (!t[type]) {
            return;
        }
        for (var handler in t[type]) {
            if(!t[type].hasOwnProperty(handler)){
                continue;
            }
            delete t[type][handler];
        }
    };

    /**
     * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。
     * 但是这些绑定函数的执行顺序无法保证。
     * 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用
     * 直接绑定到对象上面的自定义事件。例如：
     * myobj.onMyEvent = function(){}
     * myobj.addEventListener("onMyEvent", function(){});
     * @param {TD.BaseEvent} event 派发的自定义事件类型
     * @param {TD.BaseEvent} key 事件参数
     */
    TD.BaseClass.prototype.dispatchEvent = function (event, key) {
        if (!this._listeners) {
            this._listeners = {};
        }
        var i, t = this._listeners, p = event.type;
        event.target = event.srcElement = event.target || event.srcElement || this;
        event.currentTarget = this;

        key = key || {};
        for (var k in key) {
            event[k] = key[k];
        }

        if (typeof this[p] == "function") {
            this[p](event);
        }
        if (typeof t[p] == "object") {
            for (i in t[p]) {
                if (typeof t[p][i] == "function") {
                    t[p][i].call(this, event);
                }
            }
        }
        return event.returnValue;
    };
    /**
     * 是否是函数
     * @param {Mix}
     * @returns {Boolean}
     */
    function isFunction(func) {
        return typeof func == "function";
    }

    /**
     * 是否是数字
     * @param {Mix}
     * @returns {Boolean}
     */
    function isNumber(number) {
        return typeof number == "number";
    }

    /**
     * 是否是字符串
     * @param {Mix}
     * @returns {Boolean}
     */
    function isString(string) {
        return typeof string == "string";
    }

    /**
     * 是否定义
     * @param {Mix}
     * @returns {Boolean}
     */
    function isDefined(object) {
        return typeof object != "undefined";
    }

    /**
     * 是否为对象类型
     * @param {Mix}
     * @returns {Boolean}
     */
    function isObject(object) {
        return typeof object == 'object';
    }

    /**
     * 判断目标参数是否Array对象
     * @param {Mix}
     * @returns {boolean} 类型判断结果
     */
    function isArray(source) {
        return '[object Array]' == Object.prototype.toString.call(source);
    };
    /**
     * 判断字符串长度英文占1个字符，中文汉字占2个字符
     * @param {Object} str
     */
    function getBlen(str) {
        return str.replace(/[^\x00-\xff]/g, "01").length;
    }

    /*
     *获取鼠标相对于canvas 的距离
     */
    function captureMouse(element) {
        var mouse = {x: 0, y: 0, event: null};

        element.addEventListener('mousemove', function (event) {
            var bounding = element.getBoundingClientRect();
            var offsetLeft = bounding.left;
            var offsetTop = bounding.top;
            var body_scrollTop = document.body.scrollTop;
            var body_scrollLeft = document.body.scrollLeft;
            var x, y;
            x = event.pageX - offsetLeft - body_scrollLeft;
            y = event.pageY - offsetTop - body_scrollTop;
            mouse.x = x;
            mouse.y = y;
            mouse.event = event;
        }, false);

        return mouse;
    };
    /**
     * worker
     */
    var TD = TD || {}
    TD.workerMrg = {
        /**
         * 创建worker实例
         */
        createWorker: function () {
            this.worker = new Worker('app/util/worker.js');
            //接受消息
            this.worker.addEventListener('message', this.message);
            this.worker.onerror = function (e) {
                //console.log('worker.onerror', e)
            }
        }

        /**
         * 接收消息
         */
        , message: function (e) {
            var data = e.data;
            var hashCode = data.request.hashCode;
            var msgId = data.request.msgId;
            var classPath = data.request.classPath;
            //console.log(TD.workerMrg.instances[classPath], hashCode+'_'+msgId, TD.workerMrg.instances[classPath] && TD.workerMrg.instances[classPath] == hashCode+'_'+msgId)
            if (TD.workerMrg.instances[classPath + '_' + hashCode] && TD.workerMrg.instances[classPath + '_' + hashCode] == hashCode + '_' + msgId) {
                TD.workerMrg.instances[hashCode + '_' + msgId](data.response.data);
            } else {
                delete TD.workerMrg.instances[hashCode + '_' + msgId];
            }
        }
        /**
         * 发送消息到worker
         * @param {JSON} data 发送的数据
         * @param {Function} callback 返回的回调
         */
        , postMessage: function (data, callback) {
            //console.log('callback', callback)
            var hashCode = data.request.hashCode;
            var msgId = data.request.msgId;
            var classPath = data.request.classPath;
            this.instances[hashCode + '_' + msgId] = callback;
            //worker队列唯一性判断，
            this.instances[classPath + '_' + hashCode] = hashCode + '_' + msgId;
            this.worker.postMessage(data);
        }

        /**
         * worker索引管理
         */
        , instances: {}

    };
//初始化分配worker线程
    TD.workerMrg.createWorker();

//本算法的思想是把地图分成多个网格，当要计算的点落入某个网格时，将选取该网格最近的点进行匹配转换。
//使用尽量多的参考点，形成格网,选取的点越多，格网越密集，格网四边形越趋近于正方形，则精度越高
//目前点集形成格网精度10m
var TD = TD || {}

/**
 * 以像素坐标表示的地图上的一点
 * @param {Number} x 屏幕像素坐标x
 * @param {Number} y 屏幕像素坐标y
 */
function Pixel(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Pixel.prototype.equals = function (other) {
    return other && other.x == this.x && other.y == this.y;
}


/**
 * 基本点类,代表地理点坐标;
 * 坐标支持base64编码
 * @param {Object} lng 墨卡托X(经度).
 * @param {Object} lat 墨卡托Y(纬度);.
 * @return {Point} 返回一个地理点坐标对象.
 */
function Point(lng, lat) {
    // 新增base64支持 - by jz
    if (isNaN(lng)) {
        lng = decode64(lng);
        lng = isNaN(lng) ? 0 : lng;
    }
    if (isString(lng)) {
        lng = parseFloat(lng);
    }
    if (isNaN(lat)) {
        lat = decode64(lat);
        lat = isNaN(lat) ? 0 : lat;
    }
    if (isString(lat)) {
        lat = parseFloat(lat);
    }
    this.lng = lng;
    this.lat = lat;
}

Point.isInRange = function (pt) {
    return pt && pt.lng <= 180 && pt.lng >= -180 && pt.lat <= 74 && pt.lat >= -74;
}
Point.prototype.equals = function (other) {
    return other && this.lat == other.lat && this.lng == other.lng;
};

/**
 * 圆球
 * @param {Object} ctx
 * @param {Object} opts {radius:radius, fillStyle:'#FF0000'}
 */

function Circle(ctx, opts) {
    DrawElement.call(this, arguments);
    this.context = ctx;
    this.radius = 10;
}

Circle.prototype = new DrawElement();
TD.extend(Circle.prototype, {
    setContext: function (ctx) {
        this.context = ctx;
    },
    draw: function (pixels, drawOptions, margin) {

        for (var i = 0, len = pixels.length; i < len; i++) {
            var pixel = pixels[i];
            var size = typeof drawOptions.size === 'function' ? drawOptions.size(pixel.count) : drawOptions.size;
            var lineWidth = typeof drawOptions.lineWidth === "function" ? drawOptions.lineWidth(pixel.count) : drawOptions.lineWidth;
            var fillStyle = typeof drawOptions.fillStyle === "function" ? drawOptions.fillStyle(pixel.count) : drawOptions.fillStyle;
            var strokeStyle = typeof drawOptions.strokeStyle === "function" ? drawOptions.strokeStyle(pixel.count) : drawOptions.strokeStyle;
            this.drawCircle(pixel.x + margin, pixel.y + margin, size, fillStyle, lineWidth, strokeStyle);

        }
    },
    drawCircle: function (x, y, radius, color, lineWidth, strokeStyle) {
        var ctx = this.context;
        radius = radius || 10;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
        ctx.fill();
        if (lineWidth) {
            ctx.lineWidth = lineWidth;
            if (strokeStyle) {
                ctx.strokeStyle = strokeStyle;
            }
            ctx.stroke();
        }
    }
})

function DrawElement(ctx) {
    this.ctx = ctx;
}

TD.extend(DrawElement.prototype, {})


    function horerImage(id, x, y, width, height) {
        DrawElement.call(this, arguments);
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.heigth = height;


    }

    horerImage.prototype = new DrawElement();
    TD.extend(horerImage.prototype, {
        draw: function (ctx, img) {
            ctx.drawImage(img, this.x, this.y, this.width, this.heigth);
        },
        /*
         *判断点是矩形内
         */
        isMouseOver: function (x, y) {
            return !(x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.heigth);
        }
    });

/**
 * 探针
 *
 */
function Probe(opts) {
    this.anBorderColor = opts.anBorderColor;//同比边框
    this.anBgColor = opts.anBgColor;//同比背景
    this.anRadius = opts.anRadius;  //同比半径
    this.thanBorderColor = opts.thanBorderColor; //环比边框
    this.thanBgColor = opts.thanBgColor; //环比背景
    this.thanRadius = opts.thanRadius;//环比半径
    this.pixelX = opts.pixelX;
    this.pixelY = opts.pixelY;
    this.ellipseSize = opts.ellipseSize;//椭圆扁扁平系数
    this.img1 = opts.img1;
    this.img2 = opts.img2;
    this.isLoadImg = false;
    this.id = opts.id;

    //头部小标属性
    this.img1Point = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    //最大圆环属性
    this.maxCirPoint = {
        x: 0,
        y: 0,
        a: 0,
        b: 0
    };
}

TD.extend(Probe.prototype, {
    loadImg: function (fun) {
        var me = this;
        if (this.isLoadImg) {
            fun(me.img, me.img2);
        } else {
            var img = new Image();
            img.src = me.imgsrc1;
            img.onload = function () {
                me.isLoadImg = true;
                var img2 = new Image();
                img2.src = me.imgsrc2;

                img2.onload = function () {
                    me.img = img;
                    me.img2 = img2;
                    fun(me.img, me.img2);
                }
            }
        }
    },
    draw: function (ctx) {
        var me = this;

        var height = me.img2.height;
        var width = me.img2.width;
        var imgY = me.pixelY - height;
        var imgX = me.pixelX - width / 2;

        ctx.drawImage(me.img2, imgX, imgY);
        me.maxCirPoint = {
            x: me.pixelX,
            y: imgY,
            a: me.anRadius > me.thanRadius ? me.anRadius : me.thanRadius,
            b: (me.anRadius > me.thanRadius ? me.anRadius : me.thanRadius) * me.ellipseSize
        };
        if (me.anRadius > me.thanRadius) {
            me.drawCircle(ctx, me.pixelX, imgY, me.anRadius, me.anRadius * me.ellipseSize, me.anBorderColor, me.anBgColor);
            me.drawCircle(ctx, me.pixelX, imgY, me.thanRadius, me.thanRadius * me.ellipseSize, me.thanBorderColor, me.thanBgColor);

        } else {
            me.drawCircle(ctx, me.pixelX, imgY, me.thanRadius, me.thanRadius * me.ellipseSize, me.thanBorderColor, me.thanBgColor);

            me.drawCircle(ctx, me.pixelX, imgY, me.anRadius, me.anRadius * me.ellipseSize, me.anBorderColor, me.anBgColor);
        }

        me.img1Point = {
            x: imgX,
            y: imgY - me.img1.height,
            width: me.img1.width,
            height: me.img1.height
        };
        ctx.drawImage(me.img1, imgX, me.img1Point.y);

    },
    drawCircle: function (ctx, x, y, a, b, borderColor, bgColor, lineWidth) {

        var step = (a > b) ? 1 / a : 1 / b;
        ctx.beginPath();
        ctx.moveTo(x + a, y);
        for (var i = 0; i < 2 * Math.PI; i += step) {
            ctx.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
        }
        ctx.closePath();
        ctx.fillStyle = bgColor;
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

    },
    /*
     * 是否在环内
     */
    containsRing: function (h, k) {
        return (this.maxCirPoint.x - h) * (this.maxCirPoint.x - h) / (this.maxCirPoint.a * this.maxCirPoint.a) + (this.maxCirPoint.y - k) * (this.maxCirPoint.y - k) / (this.maxCirPoint.b * this.maxCirPoint.b) <= 1;
    },
    /*
     *是否在头部
     */
    containstop: function (x, y) {
        return !(x < this.img1Point.x || x > this.img1Point.x + this.img1Point.width || y < this.img1Point.y || y > this.img1Point.y + this.img1Point.height);
    }


});

function CanvasOverlay() {
    TD.BaseClass.call(this);
    this.margin = 0;	//画布margin距离px
    this.ctx = null;	//canvas对象
    this._count = 0;		//消息ID key
    this.eventType = 'moveend'
}

CanvasOverlay.inherits(TD.BaseClass, "CanvasOverlay");
CanvasOverlay.inherits(BMap.Overlay, "CanvasOverlay");
TD.extend(CanvasOverlay.prototype, {
    initialize: function (map) {
        var me = this;
        this.map = map;
        this.container = document.createElement('canvas');
        this.ctx = this.container.getContext('2d');
        this.container.style.cssText = 'position:absolute;left:0;top:0;__background:#F00';
        map.getPanes().labelPane.appendChild(this.container);
        var size = map.getSize();
        this.container.width = size.width + me.margin * 2;
        this.container.height = size.height + me.margin * 2;
        map.addEventListener('resize', function (event) {
            //console.log(me.hashCode, event.type)
            me.setCanvasSize();
            me._draw(me, event);
        });

        map.addEventListener("load", function (e) {
            me._draw(me, e)
        });
        map.addEventListener("moveend", function (e) {
//            console.log(me.hashCode, e.type)
            me._draw(me, e);
            me.eventType = e.type
        });
        map.addEventListener("zoomstart", function (e) {
            me.clearCanvas()
        });
        map.addEventListener("zoomend", function (e) {
            me._draw(me, e)
        });
        map.addEventListener("moving", function (e) {
            me.eventType = e.type
        })

        this.setDrawElement();
        this._overlayParentZIndex();
        return this.container;
    }
    , draw: function () {

    }
    , _draw: function (me, event) {
        var me = this || me;
        this.eventType = event.type;
        me.resize();
        if (!me.keysss) {
            //me.canvasResize();
        }
        me.keysss = true;

    }

    , resize: function () {
    }
    , setDrawElement: function () {
    }

    , canvasResize: function (me) {
        //console.log('canvasResize',new Date().getTime())
        var me = this || me;
        var map = this.map;
        var container = this.container;
        var point = map.getCenter();
        var size = map.getSize();
        ///
        var pixel = map.pointToOverlayPixel(point);

        container.style.left = (pixel.x - size.width / 2 - me.margin) + 'px';
        container.style.top = (pixel.y - size.height / 2 - me.margin) + 'px';
    }

    , clearCanvas: function () {
        var size = this.map.getSize();
        this.getContext().clearRect(0, 0, size.width, size.height);//调整画布
    }

    , setCanvasSize: function () {
        var size = this.map.getSize();
        this.container.width = size.width + this.margin * 2;
        this.container.height = size.height + this.margin * 2;
    }
    , getContext: function () {
        return this.ctx;
    }
    /**
     * push消息，
     * @param {string} workerClassPath worker请求的path
     * @param {json} data提交的json数据
     * @param {Function} callback
     */
    , postMessage: function (workerClassPath, data, callback) {
        var map = this.map;
        var center = map.getCenter();
        var size = map.getSize();
        var msgId = this.setMsgId();
        var request = {
            'type': 'web'
            , 'data': data
            , 'hashCode': this.hashCode
            , 'className': this.className
            , 'classPath': workerClassPath
            , 'msgId': msgId
            , 'map': {
                'center': {lng: center.lng, lat: center.lat}
                , 'size': {width: size.width, height: size.height}
                , 'zoom': map.getZoom()
                , 'margin': this.margin
            }
        };
        TD.workerMrg.postMessage({request: request}, callback);
    }


    , getMsgId: function () {
        return "msgId_" + this._count.toString(36);
    }
    , setMsgId: function () {
        this._count++
        return "msgId_" + (this._count).toString(36);
    }

    , _overlayParentZIndex: function () {
        this.container.parentNode.style.zIndex = 200;
    }

    /**
     * 设置overlay z-index
     */
    , setZIndex: function (zIndex) {
        this.container.style.zIndex = zIndex;
    }

});
/*
 * 地图边界绘画
 */
function BoundaryOverlay(points, opts) {
    CanvasOverlay.call(this, arguments);
    this.points = points;
    this.drawOptions = {
        max: 100,
        label: { // 显示label文字
            show: true, // 是否显示
            font: "11px", // 设置字号
            minZoom: 7, // 最小显示的级别
            fillStyle: 'rgba(255, 255, 255, 1)',
            text: '{@count}'
        },

        bgcolor: [
            "rgba(238,1,3,1)",
            "rgba(244,73,6,1)",
            "rgba(247,139,7,1)",
            "rgba(250,211,8,1)",
            "rgba(216,249,7,1)",
            "rgba(149,253,7,1)",
            "rgba(94,253,6,1)",
            "rgba(32,251,6,1)"
        ],
        strokeStyle: null, //画线的样式
        lineWidth: 0,//画线的宽度

    };
    this.setDrawOptions(opts);
    this.data = null;
    this.currentItem = null;  //当前悬浮选中

}

BoundaryOverlay.inherits(CanvasOverlay, "BoundaryOverlay");

TD.extend(BoundaryOverlay.prototype, {
    resize: function () {
        this.setPoints();
    },
    getGeoCenter: function (geo) {
        var minX = geo[0][0];
        var minY = geo[0][1];
        var maxX = geo[0][0];
        var maxY = geo[0][1];
        for (var i = 1; i < geo.length; i++) {
            minX = Math.min(minX, geo[i][0]);
            maxX = Math.max(maxX, geo[i][0]);
            minY = Math.min(minY, geo[i][1]);
            maxY = Math.max(maxY, geo[i][1]);
        }
        return [minX + (maxX - minX) / 2, minY + (maxY - minY) / 2];
    },

    _calculatePixel: function(map, data, margin) {
        for (var j = 0; j < data.length; j++) {
            if (data[j].geo) {
                var tmp = [];
                for (var i = 0; i < data[j].geo.length; i++) {
                    var pixel = map.pointToPixel(new BMap.Point(data[j].geo[i][0], data[j].geo[i][1]));
                    tmp.push([pixel.x + margin, pixel.y + margin, parseFloat(data[j].geo[i][2])]);
                }
                data[j].pgeo = tmp;
            }
        }

        return data;
    },
    setPoints: function (points) {
        var me = this;
        this.points = points || this.points;
        if (!this.ctx || !this.points) {
            return
        }
        this.ctx.canvas.style.zIndex = "6";
        this.postMessage('BoundaryOverlay.calculatePixel', this.points, function (pixels) {
            if (me.eventType == 'onmoving') {
                return;
            }

            me.currentItem = null;

            me.drawLine(pixels);
            me.setData(pixels);
        });
    },

    appendPoints: function (points) {
        var me = this;
        if (!this.ctx) {
            return
        }
        if (this.points == null) {
            this.points = [];
        }
        for (var i = 0; i < points.length; i++) {
            this.points.push(points[i]);
        }

        this.ctx.canvas.style.zIndex = "6";
        this.postMessage('BoundaryOverlay.calculatePixel', this.points, function (pixels) {
            if (me.eventType == 'onmoving') {
                return;
            }

            me.currentItem = null;

            me.drawLine(pixels, true);
            me.setData(pixels);
        });
    },

    setData: function (pixels) {
        this.data = [];
        for (var i = 0; i < pixels.length; i++) {
            var temp = pixels[i];
            temp.lats = [];
            temp.lngs = [];
            for (var j = 0; j < temp.geo.length; j++) {
                var arr = temp.pgeo[j];
                temp.lats.push(arr[0]);
                temp.lngs.push(arr[1]);
            }

            this.data.push(temp);
        }
    },
    drawLine: function (data, append) {
        this.canvasResize();
        if (!append) {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }

        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            var geo = item.pgeo;
            this.ctx.beginPath();
            this.ctx.moveTo(geo[0][0], geo[0][1]);

            for (var j = 1; j < geo.length; j++) {
                this.ctx.lineTo(geo[j][0], geo[j][1]);
            }
            this.ctx.closePath();
            var bgColor = null;
            if (this.currentItem == item) {
                if (this.drawOptions.overColor) {
                    bgColor = this.drawOptions.overColor;
                } else {
                    if (item.bgColor) {
                        bgColor = item.bgColor;
                    } else {
                        bgColor = typeof this.drawOptions.bgcolor === "function" ? this.drawOptions.bgcolor(item, i) : this.drawOptions.bgcolor;
                        item.bgColor = bgColor;
                    }

                }
            } else {
                if (item.bgColor) {
                    bgColor = item.bgColor;
                } else {
                    bgColor = typeof this.drawOptions.bgcolor === "function" ? this.drawOptions.bgcolor(item, i) : this.drawOptions.bgcolor;
                    item.bgColor = bgColor;
                }
            }
            this.ctx.fillStyle = bgColor;

            this.ctx.fill();

            if (this.currentItem == item) {
                if (this.drawOptions.overBordorColor) {
                    this.ctx.strokeStyle = this.drawOptions.overBordorColor;
                } else {
                    if (this.drawOptions.lineColor) {
                        this.ctx.strokeStyle = this.drawOptions.lineColor;
                    }
                }

            } else {
                if (this.drawOptions.lineColor) {
                    this.ctx.strokeStyle = this.drawOptions.lineColor;
                }
            }

            this.ctx.lineWidth = this.drawOptions.lineWidth || 1;

            this.ctx.stroke();


            var label = this.drawOptions.label, zoom = this.map.getZoom();
            if (label && label.show && (!label.minZoom || label.minZoom && zoom >= label.minZoom)) {
                if (label.fillStyle) {
                    this.ctx.fillStyle = label.fillStyle;
                }
                var center = this.getGeoCenter(geo);
                var text = label.text,
                    fontsize = label.font.replace('px', ''),
                    d = data[i], re, x, y;
                for (var k in d) {
                    if (!isString(d[k]) && !isNumber(d[k])) {
                        continue
                    }
                    re = new RegExp('{@' + k + '}', 'gi');
                    text = text.replace(re, d[k]);
                }
                x = center[0] - getBlen(text) * fontsize / 4;
                this.ctx.fillText(text, x, center[1]);
            }
        }

    },
    isPolyContainsPt: function (lat, lng, pointLat, pointLng) {
        var ret = false;
        var latMin = 90.0;
        var latMax = -90.0;
        var lngMin = 180.0;
        var lngMax = -180.0;
        for (var i = 0; i < lat.length; i++) {
            if (lat[i] > latMax) latMax = lat[i];
            if (lat[i] < latMin) latMin = lat[i];
            if (lng[i] > lngMax) lngMax = lng[i];
            if (lng[i] < lngMin) lngMin = lng[i];
        }
        if (!(pointLat < latMin || pointLat > latMax || pointLng < lngMin || pointLng > lngMax)) {

            for (var i = 0; i < lat.length; i++) {
                var j = (i + 1) % lat.length;
                if ((lat[i] < pointLat) != (lat[j] < pointLat) && (pointLng < (lng[j] - lng[i]) * (pointLat - lat[i]) / (lat[j] - lat[i]) + lng[i])) {
                    ret = !ret
                }
            }
        }
        return ret
    },
    setCurrentItem: function (val, index) {
        if (this.currentItem != val) {
            this.data[index] = this.data[this.data.length - 1];
            this.data[this.data.length - 1] = val;
            this.currentItem = val;

            this.drawLine(this.data);
        }

    },
    bindEvent: function () {
        var me = this;
        if (me.drawOptions.onMouseOver) {
            me.map.addEventListener("mousemove", function (event) {
                if (me.data) {
                    for (var j = 0; j < me.data.length; j++) {
                        var per = me.data[j];
                        if (me.isPolyContainsPt(per.lats, per.lngs, event.pixel.x, event.pixel.y)) {
                            if (me.drawOptions.onMouseOver) {
                                me.setCurrentItem(per, j);
                                me.drawOptions.onMouseOver(per, event, true);
                            }

                            break;
                        } else {
                            me.currentItem = null;
                            if (me.drawOptions.onMouseLeave) {
                                me.drawOptions.onMouseLeave();
                            }
                        }
                    }
                }
            });
        }
        me.map.addEventListener("movestart", function (event) {
            me.data = null;
            if (me.drawOptions.onMouseLeave) {
                me.drawOptions.onMouseLeave();
            }
        });
        me.map.addEventListener("zoomstart", function (event) {
            me.data = null;
            if (me.drawOptions.onMouseLeave) {
                me.drawOptions.onMouseLeave();
            }
        });
    },
    setDrawOptions: function (opts) {
        for (var i in opts) {
            this.drawOptions[i] = opts[i];
        }
    },
    setDrawElement: function () {
        this.bindEvent();
    }
});

/*
 * 点的绘制
 */
function DotOverlay(points, opts) {
    CanvasOverlay.call(this, arguments);
    this.points = points;
    this.drawOptions = {
        fillStyle: null, // 填充颜色
        lineWidth: 0,                       // 描边宽度
        shadowColor: null, // 投影颜色
        shadowBlur: 0,                      // 投影模糊级数
        globalCompositeOperation: null, // 颜色叠加方式
        size: 4, // 半径
        draw: Circle  //绘画对象

    };
    this.drawElement = null;
    this.map = null;
    this.setDrawOptions(opts);
}

DotOverlay.inherits(CanvasOverlay, "DotOverlay");

TD.extend(DotOverlay.prototype, {
    resize: function () {
        this.setPoints();
    },

    setPoints: function (points) {
        var me = this;
        this.points = points || this.points;
        if (!this.drawElement || !this.points) {
            return
        }

        var pixels = [];

        this.postMessage('HeatOverlay.pointsToPixels', this.points, function (pixels) {
            if (me.eventType == 'onmoving') {
                return
            }
            ;
            var size = me.map.getSize();
            me.getContext().clearRect(0, 0, size.width, size.height);//调整画布
            me.canvasResize(me);

            me._setCtx();

            me.drawElement.draw(pixels, me.drawOptions, me.margin, me.map)
        });

    },

    appendPoints: function (points) {
        var me = this;
        if (!this.drawElement) {
            return
        }
        if (this.points == null) {
            this.points = [];
        }
        for (var i = 0; i < points.length; i++) {
            this.points.push(points[i]);
        }

        var pixels = [];

        this.postMessage('HeatOverlay.pointsToPixels', this.points, function (pixels) {
            if (me.eventType == 'onmoving') {
                return
            }
            ;
            var size = me.map.getSize();
            me.getContext().clearRect(0, 0, size.width, size.height);//调整画布
            me.canvasResize(me);

            me._setCtx();

            me.drawElement.draw(pixels, me.drawOptions, me.margin, me.map)
        });

    },

    setDrawOptions: function (opts) {
        for (var i in opts) {
            this.drawOptions[i] = opts[i];
        }
    },
    _setCtx: function () {
        if (this.drawOptions.shadowBlur) {
            this.ctx.shadowBlur = this.drawOptions.shadowBlur;
        }
        if (this.drawOptions.shadowColor) {
            this.ctx.shadowColor = this.drawOptions.shadowColor;
        }
        if (this.drawOptions.globalCompositeOperation) {
            this.ctx.globalCompositeOperation = this.drawOptions.globalCompositeOperation;
        }
        if (this.drawOptions.lineWidth) {
            this.ctx.lineWidth = this.drawOptions.lineWidth;
        }
    },
    setDrawElement: function () {
        this.drawElement = new this.drawOptions.draw(this.ctx);
    },
    setDraw: function (cir) {
        this.drawElement = new cir(this.ctx);
    }
});
    /*
     * 点的绘制
     */
    function ImageOverlay(points, opts) {
        CanvasOverlay.call(this, arguments);
        this.points = points;
        this.drawOptions = {
            fillStyle: null, // 填充颜色
            lineWidth: 0,                       // 描边宽度
            shadowColor: null, // 投影颜色
            shadowBlur: 0,                      // 投影模糊级数
            globalCompositeOperation: null, // 颜色叠加方式
            size: 4, // 半径
            imgUrl: null

        };
        this.drawElement = null;
        this.map = null;
        this.setDrawOptions(opts);
        this.data = [];

    }

    ImageOverlay.inherits(CanvasOverlay, "ImageOverlay");

    TD.extend(ImageOverlay.prototype, {
        resize: function () {
            this.setPoints();
        },

        setPoints: function (points) {
            var me = this;
            this.points = points || this.points;

            var pixels = [];
            var img = new Image();
            img.src = me.drawOptions.imgUrl;

            img.onload = function () {
                me.postMessage('HeatOverlay.pointsToPixels', me.points, function (pixels) {
                    if (me.eventType == 'onmoving') {
                        return;
                    }
                    var size = me.map.getSize();
                    me.getContext().clearRect(0, 0, size.width, size.height);//调整画布
                    me.canvasResize(me);
                    me._setCtx();


                    me.data = [];
                    var drawOptions = me.drawOptions;
                    for (var i = 0; i < pixels.length; i++) {
                        var pixel = pixels[i];

                        var obj = me.drawOptions.getSize(pixel);
                        var temp = new horerImage(null, pixel.x, pixel.y, obj.width, obj.height);
                        me.data.push(temp);
                        temp.draw(me.ctx, img);

                    }


                });
            }
        },
        bingEvent: function () {
            var me = this;
            me.map.addEventListener("mousemove", function (event) {

                for (var j = 0; j < me.data.length; j++) {
                    var per = me.data[j];
                    if (per.isMouseOver(event.pixel.x, event.pixel.y)) {

                        if (me.drawOptions.onMouseOver) {
                            me.drawOptions.onMouseOver(me.points[j], event, true);
                        }

                        break;
                    } else {

                        if (me.drawOptions.onMouseLeave) {
                            me.drawOptions.onMouseLeave();
                        }
                    }
                }
            });


        },
        setDrawOptions: function (opts) {
            for (var i in opts) {
                this.drawOptions[i] = opts[i];
            }
        },
        _setCtx: function () {
            if (this.drawOptions.shadowBlur) {
                this.ctx.shadowBlur = this.drawOptions.shadowBlur;
            }
            if (this.drawOptions.shadowColor) {
                this.ctx.shadowColor = this.drawOptions.shadowColor;
            }
            if (this.drawOptions.globalCompositeOperation) {
                this.ctx.globalCompositeOperation = this.drawOptions.globalCompositeOperation;
            }
            if (this.drawOptions.lineWidth) {
                this.ctx.lineWidth = this.drawOptions.lineWidth;
            }
        },
        setDrawElement: function () {

            this.bingEvent();
        },
        setDraw: function (cir) {

        }
    });
/**
 * 室内地图覆盖物类
 * @param {String} imgurl  地图URL
 * @param {Int} width
 * @param {Int} height
 * @param {String} align       auto || width || height
 */
function IndoorOverlay(imgurl, width, height, align) {
    TD.BaseClass.call(this);
    this.imgurl = imgurl;	//室内地图图片URL
    this.width = width;
    this.height = height;
    this.imgZoom = 1;			//当前缩放级别
    this.image = new Image();	//创建地图图片实例
    this.margin = 0;
    this.defaultLevel = 20;		//初始化地图级别
    this.defaultCenter = null;	//初始化地图中心点
    this.defaultInfo = {}		//初始化室内地图图片信息,{width:,height:,left:,top:}
    this.nowInfo = {}			//当前信息
    this.align = align || 'auto';
}

IndoorOverlay.inherits(BMap.Overlay, "IndoorOverlay");
TD.extend(IndoorOverlay.prototype, {
    initialize: function (map) {
        var me = this;
        this.map = map;
        var zoom = map.getZoom();
        this.defaultLevel = zoom;
        map.setMaxZoom(zoom + 2);
        map.setMinZoom(zoom - 2);
        map.addEventListener('tilesloaded', function (e) {
            me.hideTileLayer()
        })

        this.container = document.createElement('div');
        var size = map.getSize();
        this.container.style.cssText = 'position:absolute;left:' + size.width / 2 + 'px;top:' + size.height / 2 + 'px;width:5px;height:5px';
        this.image.onload = function () {
            me.imageLoad();
        };
        this.image.src = this.imgurl;

        map.getPanes().labelPane.appendChild(this.container);
        var parentDiv = map.getPanes().labelPane.parentNode.parentNode;
        this.hideTileLayer();

        var size = map.getSize();

        map.addEventListener('zoomend', function (e) {
            me.zoomTo(this.getZoom());
            setTimeout(function () {
                parentDiv.style.marginTop = 0;
            }, 50)
        })

        map.addEventListener('zoomstart', function (e) {
            parentDiv.style.marginTop = '-10000px';
            var a = 1;
        })
        //this.getViewport();
        //		map.addEventListener('resize', function(event){
        //			me.setCanvasSize();
        //			me._draw(me, event);
        //		});
        //
        //		map.addEventListener("load", function(e){me._draw(me, e)});
        //		map.addEventListener("moveend", function(e){me._draw(me, e);me.eventType = e.type});
        //		map.addEventListener("zoomstart", function(e){me.clearCanvas()});
        //		map.addEventListener("zoomend", function(e){me._draw(me, e)});
        //		map.addEventListener("moving", function(e){me.eventType = e.type})
        //
        //		this.setDrawElement();
        //		this._overlayParentZIndex();
        return this.container;
    }
    , draw: function (e) {
    }

    , resize: function () {

    }
    /**
     * 室内地图load完成
     */
    , imageLoad: function () {

        var defaultInfo = this.defaultInfo = this.getMapAlign();
        this.defaultCenter = this.map.getCenter();
        //初始化地图bound
        var size = this.map.getSize();
        this.defaultLevel = this.map.getZoom();
        this.imgZoom = defaultInfo.zoom	// Math.pow(2, defaultInfo.zoom);
        //左下角经纬度坐标
        var pointLB = this.map.pixelToPoint(new BMap.Pixel(size.width / 2 - defaultInfo.width / 2, size.height / 2 + defaultInfo.height / 2));
        //右上角经纬度坐标
        var pointRT = this.map.pixelToPoint(new BMap.Pixel(size.width / 2 + defaultInfo.width / 2, size.height / 2 - defaultInfo.height / 2));
        this.bounds = new BMap.Bounds(pointLB, pointRT);

        this.nowInfo = defaultInfo;
        this.image.style.cssText = 'position:absolute;width:' + defaultInfo.width + 'px; height: ' + defaultInfo.height + 'px;left:' + defaultInfo.left + 'px;top:' + defaultInfo.top + 'px';
        this.container.appendChild(this.image);
        this.container.parentNode.style.zIndex = 150;
        //派发load事件
        this.dispatchEvent(new TD.BaseEvent('onload'));
    }
    /**
     * 设置地图对齐
     */
    , getMapAlign: function () {
        var map = this.map;
        var size = map.getSize();
        var mapw = size.width;
        var maph = size.height;
        var mapScale = mapw / maph;

        var imgw = this.width;
        var imgh = this.height;
        var imgScale = imgw / imgh;

        var obj = {}

        /**
         * 宽优先
         */
        function widthFirst() {
            obj.width = mapw;
            obj.height = mapw / imgScale;
            obj.left = 0 - size.width / 2;
            obj.top = (maph - obj.height) / 2 - size.height / 2;
            obj.zoom = obj.height / imgh;

            return obj;
        }

        /**
         * 高优先
         */
        function heightFirst() {

            obj.width = maph * imgScale;
            obj.height = maph;
            obj.left = (mapw - obj.width) / 2 - size.width / 2;
            obj.top = 0 - size.height / 2;
            obj.zoom = obj.width / imgw;
            return obj;
        }

        /**
         * 真实大小
         */
        function realImg() {
            obj.width = imgw;
            obj.height = imgh;
            obj.top = -imgh / 2;
            obj.left = -imgw / 2;
            obj.zoom = 1;
            return obj;
        }

        switch (this.align) {
            //宽优先
            case 'width':
                return widthFirst();
            //高优先
            case 'height':
                return heightFirst();
            //全部显示
            default:
                if (mapw > imgw && maph > imgh) {
                    return realImg();
                }
                if (mapScale > imgScale) {
                    return heightFirst();
                } else {
                    return widthFirst();
                }
        }
    }

    , zoomTo: function (zoom) {
        if (!zoom || !this.defaultInfo) return;
        var defaultInfo = this.defaultInfo;
        var defaultImgZoom = this.defaultLevel;
        var mapOffest = this.map.pointToOverlayPixel(this.defaultCenter || this.map.getCenter());
        this.container.style.left = mapOffest.x + 'px';
        this.container.style.top = mapOffest.y + 'px';

        this.imgZoom = Math.pow(2, zoom - defaultImgZoom);


        var width = defaultInfo.width * this.imgZoom;
        var height = defaultInfo.height * this.imgZoom;
        var left = -width / 2;
        var top = -height / 2;
        this.image.style.width = width + 'px';
        this.image.style.height = height + 'px';
        this.image.style.left = left + 'px';
        this.image.style.top = top + 'px';
        this.nowInfo = {
            width: width
            , height: height
            , left: left
            , top: top
        };

    }


    , getViewport: function () {
        if (!this.map) return;
        var map = this.map;
        var width = this.width;
        var height = this.height;

        var viewPort = map.getViewport([map.pixelToPoint(new BMap.Pixel(0, height)), map.pixelToPoint(new BMap.Pixel(width, 0))]);
        var center = viewPort.center;
        var level = viewPort.level;

    }


    /**
     * 隐藏百度地图瓦片
     */
    , hideTileLayer: function () {

        var map = this.map;
        var mapContainer = map.getContainer();
        var tiles = mapContainer.getElementsByTagName('IMG');
        var cvs = mapContainer.getElementsByTagName('canvas');
        var tplDiv = document.createElement('div');
        if (tiles.length == 0 && cvs.length == 0) return;
        //PC 图片瓦片
        for (var i = 0, len = tiles.length; i < len; i++) {
            if (tiles[i].src.indexOf('bdimg.com/tile/') > 0) {
                tiles[i].parentNode.parentNode.setAttribute('tile', 'tileDiv')
                tiles[i].parentNode.parentNode.style.display = 'none'
                tiles[i].parentNode.parentNode.innerHTML = '';
                return;
            }
        }
        //无线canva瓦片
        for (var j = 0, len = cvs.length; j < len; j++) {
            if (!!cvs[j] && !!cvs[j].id && cvs[j].id.indexOf('_') == 0) {
                cvs[j].parentNode.parentNode.style.display = 'none';
                tplDiv.appendChild(cvs[j].parentNode.parentNode);
                return;
            }
        }

    }
    /**
     * 获取室内地图地理bounds
     */
    , getBounds: function () {
        return this.bounds;
    }
    , getZoom: function () {
        return this.defaultInfo.zoom;
    }
    /**
     *
     */
    , getMapSize: function () {
        if (!this.bounds) return;
        return {}
    }
    /**
     *
     */
    , setBackground: function (color) {
        var container = this.map.getContainer();
        container.style.background = color;
    }
    /**
     * 获取当前级别下，坐标原点像素坐标
     */
    , getOrigin: function () {
        var bounds = this.getBounds();
        if (!bounds) return;
        //西南角像素
        var sw = this.map.pointToPixel(bounds.getSouthWest());
        var ne = this.map.pointToPixel(bounds.getNorthEast());
        var origin = new BMap.Pixel(sw.x, ne.y);
        return origin;
    }

    /**
     * 室内地图像素坐标转经纬度
     */
    , inPixelToPoint: function (x, y) {
        var origin = this.getOrigin();
        if (!origin) return;
        var imgScale = this.width / (this.nowInfo.width || this.defaultInfo.width);
        //console.log('imgScale', imgScale)
        //		var point = this.map.pixelToPoint(new BMap.Pixel((origin.x + x *this.imgZoom), (origin.y + y*this.imgZoom)));
        var point = this.map.pixelToPoint(new BMap.Pixel((origin.x + x / imgScale), (origin.y + y / imgScale)));
        return point;

    }
    , inPixelToPointOrigin: function (x, y) {
        var origin = this.getOrigin();
        if (!origin) return;
        var point = this.map.pixelToPoint(new BMap.Pixel((origin.x + x), (origin.y + y)));
        return point;

    }
    , pointToInPixel: function (point) {
        var origin = this.getOrigin();
        if (!origin) return;
        var pixel = this.map.pointToPixel(point);
        var imgScale = this.width / (this.nowInfo.width || this.defaultInfo.width);
        //var inPixel = {x: (pixel.x - origin.x) / this.imgZoom, y : (pixel.y - origin.y) / this.imgZoom};
        //console.log(this.width, this.defaultInfo.width, this.imgZoom, (this.defaultInfo.width))
        //console.log(pixel.x, origin.x, imgScale)
        var inPixel = {x: (pixel.x - origin.x) * imgScale, y: (pixel.y - origin.y) * imgScale};
        return inPixel;
    }
});

/*
 * 点的绘制
 */
function Marker(opts) {
    CanvasOverlay.call(this, arguments);
    this.mouse = null;
    this.drag = null; //拖拽元素
    this.drawOptions = {
        anBorderColor: null, //同比边框
        anBgColor: null, //同比背景
        thanBorderColor: null, //环比边框
        thanBgColor: null, //环比背景
        ellipseSize: 0,  //椭圆扁扁平系数
        onMouseOver: null,
        onMOuseLeave: null,
        draw: TDMap.Probe,
        imgsrc1: opts.imgsrc1,
        imgsrc2: opts.imgsrc2,
        isDrag: false //是否拖拽
    };
    this.setDrawOptions(opts);
    this.points = [];
    this.img1 = null;
    this.img2 = null;
    this.isLoadImg = false;
}

Marker.inherits(CanvasOverlay, "Marker");

TD.extend(Marker.prototype, {
    resize: function () {
        this.draw();
    },
    clear: function () {
        var size = this.map.getSize();
        this.getContext().clearRect(0, 0, size.width, size.height);//调整画布
    },
    loadImg: function (fun) {
        var me = this;
        if (this.isLoadImg) {
            fun(me.img1, me.img2);
        } else {
            var img1 = new Image();
            img1.src = me.drawOptions.imgsrc1;
            img1.onload = function () {
                me.isLoadImg = true;
                var img2 = new Image();
                img2.src = me.drawOptions.imgsrc2;

                img2.onload = function () {
                    me.img1 = img1;
                    me.img2 = img2;
                    fun(me.img1, me.img2);
                }
            }
        }
    },
    setPoints: function (data) {
        if (!this.ctx) {
            return;
        }
        var me = this;

        me.loadImg(function (img1, img2) {

            for (var i = 0; i < data.length; i++) {
                me.points.push(
                    new me.drawOptions.draw({
                        anBorderColor: me.drawOptions.anBorderColor,
                        anBgColor: me.drawOptions.anBgColor,
                        anRadius: data[i].anRadius,
                        thanBorderColor: me.drawOptions.thanBorderColor,
                        thanBgColor: me.drawOptions.thanBgColor,
                        thanRadius: data[i].thanRadius,
                        ellipseSize: me.drawOptions.ellipseSize,
                        pixelX: data[i].pixelX,
                        pixelY: data[i].pixelY,
                        img1: img1,
                        img2: img2,
                        id: data[i].id
                    }));
            }
            me.draw();
        });


    },
    draw: function () {
        if (this.points) {
            this.clear();
            for (var i = 0; i < this.points.length; i++) {
                this.points[i].draw(this.ctx);
            }
        }

    },
    onMousemove: function (me, event) {
        for (var j = 0; j < this.points.length; j++) {
            var per = me.points[j];
            if (per.containstop(me.mouse.x, me.mouse.y)) {
                if (me.drawOptions.isDrag) {
                    this.map.setDefaultCursor("move");
                } else {
                    if (me.drawOptions.onMouseOver) {
                        me.drawOptions.onMouseOver(per, event, true);
                    }
                }
                break;
            } else if (per.containsRing(me.mouse.x, me.mouse.y)) {
                this.map.setDefaultCursor("default");
                if (me.drawOptions.onMouseOver) {
                    me.drawOptions.onMouseOver(per, event, false);
                }
                break;
            } else {
                this.map.setDefaultCursor("default");
                if (me.drawOptions.onMouseLeave) {
                    me.drawOptions.onMouseLeave();
                }
            }
        }
    },

    bindEvent: function () {
        var me = this;
        me.container.addEventListener("mousemove", function () {

            if (me.drag && me.drawOptions.isDrag) {
                me.drag.pixelX = me.mouse.x;
                me.drag.pixelY = me.mouse.y + me.drag.img2.height;
                me.draw();
            } else {
                me.onMousemove(me, event);
            }
        }, false);
        me.container.addEventListener('mousedown', function () {
            if (me.drawOptions.isDrag) {
                for (var i = 0; i < me.points.length; i++) {
                    var pelbeMar = me.points[i];
                    if (pelbeMar.containstop(me.mouse.x, me.mouse.y)) {
                        me.drag = pelbeMar;
                        map.setDefaultCursor("move");
                        break;
                    }
                }
            }

        }, false);
        me.container.addEventListener('mouseup', function () {
            if (me.drawOptions.isDrag) {
                me.drag = null;
                map.setDefaultCursor("default");
            }

        }, false);
    },
    setDrawElement: function () {
        this.mouse = captureMouse(this.container);
        this.bindEvent();
        this.map.setDefaultCursor("default");
    },
    setDrawOptions: function (opts) {
        for (var i in opts) {
            this.drawOptions[i] = opts[i];
        }
    },
});

window.TDMap = {
    CanvasOverlay: CanvasOverlay
    , DotOverlay: DotOverlay
    , BoundaryOverlay: BoundaryOverlay
    , IndoorOverlay: IndoorOverlay
    , Circle: Circle
    , Probe: Probe
    , Marker: Marker
    , ImageOverlay: ImageOverlay
};
})
()
