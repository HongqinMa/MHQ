/**
 * Created by mhq on 2016/10/27.
 */

// window 的两个作用： 减少作用域的搜素，提高压缩效率
(function (window) {
    /*在闭包内部作用域中定义变量，提高效率*/
    var arr = [];
    var push = arr.push;
    var slice = arr.slice;
    var concat = arr.concat;
    // 其他全局数据与函数等
    var loads = [];

    // MHQ的原型对象中的init构造函数创建对象，影藏了new关键字，返回一个伪数组
    function MHQ(selector) {
        return new MHQ.fn.init(selector);
    }

    // 替换原型对象的方式实现继承
    MHQ.fn = MHQ.prototype = {
        // 还原构造器
        constructor: MHQ,
        // 添加length属性，返回时是伪数组
        length: 0,
        init: function (selector) {
            // 判断选择器类型
            if (!selector) return this;
            if (typeof selector === "string") {
                // HTML格式的字符串
                if (selector.charAt(0) === "<") {
                    push.apply(this, parseHTML(selector));
                    return this;
                } else { // 选择器
                    push.apply(this, document.querySelectorAll(selector));
                    return this;
                }
            }
            if (typeof selector === "function") {
                // 传入类型是函数  将来处理事件
                loads.push(selector);
            }
            if (selector.nodeType) {  // 是DOM对象时
                this[0] = selector;
                this.length = 1;
                return this;
            }
            if (selector.constructor.name === MHQ) { // 是MHQ类型的对象
                return selector;
            }
            if (selector.length >= 0) { // 是数组或者伪数组
                push.apply(this, selector);
            } else {
                this[0] = selector;
                this.length = 1;
            }
        }
    };

    // 使init构造函数的实例能够访问MHQ原型对象中的方法
    MHQ.fn.init.prototype = MHQ.fn;

    // 静态 extend 和实例 extend 方法扩展属性和方法
    MHQ.extend = MHQ.fn.extend = function (obj) {
        var k;
        for (k in obj) {
            this[k] = obj[k];
        }
    };

    MHQ.fn.extend({
        each: function (callback) {
            return MHQ.each(this, callback);
        },
        map: function (callback) {
            return MHQ.map(this, callback);
        }
    });

    // 工具方法
    MHQ.extend({
        
        each: function (obj, callback) {
            var i,
                len = obj.length,
                isArray = len >= 0;
            if (isArray) {
                for (i = 0; i < len; i++) {
                    if (callback.call(obj[i], i, obj[i]) === false) break;
                }
            } else {
                for (i in obj) {
                    if (callback.call(obj[i], i, obj[i]) === false) break;
                }
            }
            return obj;
        },
        map: function (obj, callback) {
            var i,
                len = obj.length,
                isArray = len >= 0,
                result,
                ret = [];
            if (isArray) {
                for (i = 0; i < len; i++) {
                    result = callback(obj[i], i);
                    if (result != null) {
                        ret.push(result);
                    }
                }
            } else {
                for (i in obj) {
                    result = callback(obj[i], i);
                    if (result != null) {
                        ret.push(result);
                    }
                }
            }
            return ret;
        },
        next: function (dom) {
            var node = dom;
            while (node = node.nextSibling) {
                if (node.nodeType === 1) {
                    return node;
                }
            }
            return null;
        },
        nextAll: function (node) {
            var tmpNode = node,
                ret = [];
            while (tmpNode = tmpNode.nextSibling) {
                if (tmpNode.nodeType === 1) {
                    ret.push(tmpNode);
                }
            }
            return ret;
        },
        prev: function (node) {
            var tmpNode = node,
                ret = [];
            while (tmpNode = tmpNode.previousSibling) {
                if (tmpNode.nodeType === 1) {
                    ret.push(tmpNode);
                }
            }
            return ret;
        },
        prevAll: function (node) {
            var tmpNode = node,
                ret = [];
            while (tmpNode = tmpNode.previousSibling) {
                if (tmpNode.nodeType === 1) {
                    ret.push(tmpNode);
                }
            }
            return ret;
        },

        deepCloneNode: function (node, targetNode) {
            var i, newNode, list;
            if (!targetNode) {
                newNode = node.cloneNode();
                MHQ.deepCloneNode(node, newNode);
            } else {
                list = node.childNodes;
                for (i = 0; i < list.length; i++) {
                    targetNode.appendChild(newNode = list[i].cloneNode());
                    // 将 list[ i ] 拷贝, 加到 targetNode 中.
                    // 同时 list[ i ] 下面的内容应该添加到 刚刚拷贝的对象上
                    MHQ.deepCloneNode(list[i], newNode);
                }
            }
            return newNode;
        },
        unique: function (obj) {
            var target = MHQ(),
                i;
            MHQ.each(obj, function (k, v) {
                // v 就是元素, 在 target 中如果没有 v 就加入
                if (!MHQ.contains(target, v)) {
                    push.call(target, v);
                }
            });
            return target;
        },
        contains: function (container, contained) {
            // 在 container 中判断是否存在 contained
            var er = MHQ(container),
                ed = MHQ(contained),
                i, j, len;
            for (i = 0; i < er.length; i++) {
                len = 0;
                for (j = 0; j < ed.length; j++) {
                    if (er[i] === ed[j]) len++;
                }
                if (len === ed.length) return true;
            }
            return false;
        },
        filter: function (src, sear) {
            // 在 src 中过滤 sear, 符合的才过滤出来
            var s = MHQ(src),
                c = MHQ(sear),
                o = MHQ(),
                i, j;
            MHQ.each(s, function (i, v) {
                MHQ.each(c, function (i2, v2) {
                    if (v === v2) {
                        MHQ.push.call(o, v);
                    }
                });
            });

            return o;
        },
        trim: (function () {
            var r = /^\s+|\s+$/g;
            return function (str) {
                return str.replace(r, '');
            };
        })(),
        push: push,
        slice: slice,
        concat: concat
    });

    // 实现toArray方法、get方法（获取DOM元素）
    MHQ.fn.extend({
        toArray: function () {
            return slice.call(this);
        },
        get: function (index) {
            if (index === undefined) {
                return this.toArray();
            } else {
                return this[index >= 0 ? index : this.length + index];
            }
        },
        pushStack: function (array) {
            var newObj = MHQ(array);
            newObj.prevObj = this;
            return newObj;
        }
    });

    // DOM 操作的工具方法
    var insertAfter = function (newNode, node) {
            var parent = node.parentNode;
            if (parent.lastChild === node) {
                parent.appendChild(newNode);
            } else {
                parent.insertBefore(newNode, node.nextSibling);
            }
        },
        insertBefore = function (newNode, node) {
            node.parentNode.insertBefore(newNode, node);
        },
        prependChild = function (newNode, parentNode) {
            if (parentNode.firstChild) {
                parentNode.insertBefore(newNode, parentNode.firstChild);
            } else {
                parentNode.appendChild(newNode);
            }
        },
        appendChild = function (newNode, parentNode) {
            parentNode.appendChild(newNode);
        };

    // 处理HTML字符串的方法
    function parseHTML(htmlStr) {
        var div = document.createElement("div"),
            i = 0,
            nodeArr = [];
        div.innerHTML = htmlStr;
        for (; i < div.childNodes.length; i++) {
            nodeArr.push(div.childNodes[i]);
        }
        return nodeArr;
    }

    // DOM元素操作模块
    MHQ.fn.extend({
        appendTo: function (selector) {
            var i,
                j,
                tmpObj,
                ret = [],
                destinationObj = MHQ(selector);

            for (i = 0; i < this.length; i++) {
                for (j = 0; j < destinationObj.length; j++) {
                    tmpObj = j === destinationObj.length - 1 ? this[i] : this[i].cloneNode(true);
                    ret.push(tmpObj);
                    destinationObj[j].appendChild(tmpObj);
                }
            }
            return this.pushStack(ret);
        },
        prependTo: function (selector) {
            // 将 this[i] 加入到 selector[j] 中, 链会破坏
            // MHQ( selector ).prepend( this );
            var tmpObj, ret = [],
                i, j,
                destinationObj = MHQ(selector);
            for (i = 0; i < this.length; i++) {
                for (j = 0; j < destinationObj.length; j++) {
                    tmpObj = j === destinationObj.length - 1 ? this[i] : this[i].cloneNode(true);
                    ret.push(tmpObj);
                    destinationObj[j].insertBefore(tmpObj, destinationObj[j].firstChild);
                }
            }

            return this.pushStack(ret);
        },
        prepend: function (selector) {
            MHQ(selector).appendTo(this);
            return this;
        },
        append: function (selector) {
            // 将 selector[j] 加到 this[i] 中
            // 不会造成链破坏
            MHQ(selector).appendTo(this);
            return this;
        },
        next: function () {
            /*
             var ret = [];
             this.each(function () {
             ret.push( this.nextElementSibling );
             });
             return this.pushStack( ret );
             */
            return this.pushStack(
                this.map(function (v) {
                    return MHQ.next(v);
                }));
        },
        prev: function (selector) {
            return this.pushStack(this.map(function (v) {
                return MHQ.prev(v);
            }));
        },
        remove: function () {
            this.each(function () {
                this.parentNode.removeChild(this);
            });
        },

        after: function (elem) {
            // 将 elem 加到 this 的后面
            var target = MHQ(elem),
                node,
                i, j;

            for (i = 0; i < this.length; i++) {
                for (j = 0; j < target.length; j++) {
                    // 将 target[ j ] 加到 this[ i ] 后面
                    node = i === this.length - 1 && j === target.length - 1 ?
                        target[j] :
                        MHQ.deepCloneNode(target[j]);
                    insertAfter(node, this[i]);
                }
            }

            return this;
        },
        before: function (elem) {
            // 将 elem 加到 this 的前面
            var target = MHQ(elem),
                node,
                i, j;

            for (i = 0; i < this.length; i++) {
                for (j = 0; j < target.length; j++) {
                    // 将 target[ j ] 加到 this[ i ] 前面
                    node = i === this.length - 1 && j === target.length - 1 ?
                        target[j] :
                        MHQ.deepCloneNode(target[j]);

                    insertBefore(node, this[i]);
                }
            }

            return this;
        },
        parent: function (selector) {
            // 获得 this 的父节点, 如果有 selector 则在中间筛选
            var target = MHQ(selector),
                obj = MHQ(),
                i, j;

            // this[ i ] 的 父节点
            for (i = 0; i < this.length; i++) {
                if (!target.length) {
                    push.call(obj, this[i].parentNode);
                    continue;
                }

                for (j = 0; j < target.length; j++) {
                    if (this[i].parentNode === target[j]) {
                        push.call(obj, this[i].parentNode);
                    }

                }
            }
            return MHQ.unique(obj);
        },
        children: function (selector) {
            var target = MHQ(selector),
                obj = MHQ(),
                temp,
                i;
            // 获得 this 中的所有元素
            for (i = 0; i < this.length; i++) {
                // MHQ.push.apply( obj, this[ i ].childNodes );
                MHQ.each(this[i].childNodes, function (index, v) {

                    if (v.nodeType !== undefined && v.nodeType === 3) return;

                    MHQ.push.apply(obj, selector ? MHQ(v).filter(selector) : MHQ(v));
                    // 递归
                    // MHQ.push.apply( obj, MHQ( v ).children( selector ) );
                });
            }

            return MHQ.unique(obj);
        },
        find: function (selector) {
            var target = MHQ(selector),
                obj = MHQ();
            // 在 this 后代中找所有的 复合 selector 的数据
            MHQ.each(this, function (i, v) {
                // v 就是每一个元素, 看的是 它的子元素
                if (v.nodeType !== undefined && v.nodeType === 3) return;
                // 看当前元素是否符合要求
                MHQ.push.apply(obj, MHQ(v).filter(selector));
                // 在后代元素中看是否复合要求
                MHQ.each(v.childNodes, function (index, value) {
                    // 递归
                    MHQ.push.apply(obj, MHQ(value).find(selector));
                });
            });

            return MHQ.unique(obj);
        },
        filter: function (selector) {
            return MHQ.filter(this, selector);
        }
    });

    // 恢复链
    MHQ.fn.extend({
        end: function () {
            return this.prevObj || this;
        }
    });

    // DOM 属性操作模块
    MHQ.fn.extend({
        attr: function (name, value) {
            if (value === undefined) {  // 只有一个参数时
                if (typeof name === "string") { // 参数类型为string时获取
                    return this.get(0).getAttribute(name);
                } else { // 参数是 一个对象 设置属性
                    return this.each(function () {
                        var that = this;
                        MHQ.each(name, function (k, v) {
                            that.setAttribute(k, v);
                        });
                    });
                }
            } else { // 两个参数 设置属性
                return this.each(function () {
                    this.setAttribute(name, value);
                });
            }
        },
        prop: function (name, value) {
            if (value !== undefined) {
                // 传入, 需设置
                return this.each(function () {
                    this[name] = value;
                });
            } else {
                // 未传入, 需返回
                return this.get(0)[name];
            }
        }
    });

    // CSS 样式操作
    MHQ.fn.extend({
        css: function (name, value) {
            if (value == undefined) { // 一个参数
                if (typeof name === 'string') { // 返回数据
                    return this.get(0).style[name] ||
                        window.getComputedStyle(this.get(0))[name];
                } else { // 设置多个样式
                    return this.each(function () {
                        var that = this;
                        MHQ.each(name, function (k, v) {
                            that.style[k] = v;
                        });
                    });
                }
            } else { // 两个参数
                return this.each(function () {
                    this.style[name] = value;
                });
            }
        },
        hasClass: function (className) {
            this.toArray().some(function (v) {
                return v.className.split(" ").indexOf(className);
            });
        },
        addClass: function (className) {
            return this.each(function () {
                var classNameValue = this.className;
                var classNameValues = classNameValue.split(' ');

                if (classNameValue.trim().length == 0) {
                    // 没有样式
                    this.className = className;
                } else if (classNameValues.indexOf(className) >= 0) {
                    // 有, 就什么也不做
                } else {
                    // 没有, 但是有其他样式
                    this.className += ' ' + className;
                }
            });
        },

        toggleClass: function (className) {
            if (this.hasClass(className)) {
                this.removeClass(className);
            } else {
                this.addClass(className);
            }
            return this;
        },
        removeClass: function (className) {
            return this.each(function () {

                var classNameValues = this.className.trim().split(' ');
                var index;

                var arr = [];
                for (var i = 0; i < classNameValues.length; i++) {
                    if (classNameValues[i] != className) {
                        arr[arr.length++] = classNameValues[i];
                    }
                }
                this.className = classNameValues.join(' ');
            });
        }
    });

    MHQ.each({val: 'value', html: 'innerHTML', text: 'innerText'}, function (k, v) {
        MHQ.fn[k] = function (value) {
            if (value) {
                return this.each(function () {
                    this[v] = value;
                });
            } else {
                return this.get(0)[v];
            }
        }
    });


    // 事件处理
    var addEvent = function (obj, type, fn) {
        var fEventHandler = function (e) {
            e = window.event || e;
            fn.call(this, MHQ.Event(e));  // 修改上下文调用
        };

        if (obj.addEventListener) {
            obj.addEventListener(type, fEventHandler);
        } else {
            obj.attachEvent('on' + type, fEventHandler);
        }
    };


    MHQ.fn.extend({
        on: function (type, fn) {
            this.each(function () {
                addEvent(this, type, fn);
            });
            return this;
        }
    });

    MHQ.each([
        "onabort", "onblur", "oncancel", "oncanplay", "oncanplaythrough", "onchange",
        "onclick", "onclose", "oncontextmenu", "oncuechange", "ondblclick", "ondrag",
        "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop",
        "ondurationchange", "onemptied", "onended", "onerror", "onfocus", "oninput",
        "oninvalid", "onkeydown", "onkeypress", "onkeyup", "onload", "onloadeddata",
        "onloadedmetadata", "onloadstart", "onmousedown", "onmouseenter", "onmouseleave",
        "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onmousewheel", "onpause",
        "onplay", "onplaying", "onprogress", "onratechange", "onreset", "onresize",
        "onscroll", "onseeked", "onseeking", "onselect", "onshow", "onstalled",
        "onsubmit", "onsuspend", "ontimeupdate", "ontoggle", "onvolumechange",
        "onwaiting", "onbeforecopy", "onbeforecut", "onbeforepaste", "oncopy",
        "oncut", "onpaste", "onsearch", "onselectstart", "onwheel", "onwebkitfullscreenchange",
        "onwebkitfullscreenerror"], function (i, v) {
        v = v.slice(2);

        MHQ.fn[v] = function (eventFn) {
            return this.on(v, eventFn);
        }

    });

    window.onload = function () {
        // 将数组中的 每一个 函数取出来执行
        MHQ.each(loads, function (i, v) {
            this();
        });
    };

    // 事件对象
    MHQ.Event = function (e) {
        return new MHQ.Event.fn.init(e);
    };
    MHQ.Event.fn = MHQ.Event.prototype = {
        constructor: MHQ.Event,
        init: function (e) {
            this.event = e;
            // 事件类型
            this.type = e.type;
            // 坐标
            this.clientX = e.clientX;
            this.clientY = e.clientY;
            this.screenX = e.screenX;
            this.screenY = e.screenY;
            this.pageX = e.pageX;
            this.pageY = e.pageY;

            // 控制属性
            this.altKey = e.altKey;
            this.shiftKey = e.shiftKey;
            this.ctrlKey = e.ctrlKey;

            // 事件源对象与事件对象(未考虑 IE)
            // IE 使用 srcElement
            // 火狐中使用 target
            this.target = this.target || this.srcElement;

            // 鼠标键属性
            // IE 左中右: 142
            // 火狐 : 012
            if (e === window.event) {
                // 1 4 2
                this.which = [undefined, 0, 2, undefined, 1][e.button];
            } else {
                this.which = e.button;
            }
        },

        stopPropagation: function () {
            if (this.event.stopPropagation) {
                this.event.stopPropagation();
            }
            this.event.cancelBubble = true;
        }
    };

    MHQ.Event.fn.init.prototype = MHQ.Event.prototype;


    window.MHQ = window.M = MHQ;

})(window);
