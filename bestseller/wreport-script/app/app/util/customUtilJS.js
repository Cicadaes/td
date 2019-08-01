;(function ($) {
    $.extend({
        //提示框
        Pop: {
            alerts: function (text, hashSrc) {
                var confirm = "";
                (appConfig.language == "chinese")? confirm = "确认": confirm = "Confirm";

                var btn = '<div class="btn-box"><a href="javascript:void(0)" id="confirms" class="btn btn-blue">'+confirm+'</a></div>';
                this.createDiv(text, btn, '', hashSrc);
            },
            confirms: function (text, fn) {
                var confirm = "";
                var cancel = "";
                (appConfig.language == "chinese")? confirm = "确认": confirm = "Confirm";
                (appConfig.language == "chinese")? cancel = "取消": cancel = "Cancel";
                var btn = '<div class="btn-box"><a href="javascript:void(0)" id="confirms" class="btn btn-blue">'+confirm+'</a><a href="javascript:void(0)" id="cancel" class="btn btn-gray">'+cancel+'</a></div>';
                this.createDiv(text, btn, fn);
            },
            createDiv: function (text, btn, fn, hashSrc) {
                var oBg = document.createElement('div');
                var oDiv = document.createElement('div');
                oBg.className = 'pop-bg';
                oDiv.className = "pop-box";

                text = text || '';
                var windowObj = window.parent || window;
                var htmlChild = windowObj.document.getElementsByTagName('body')[0];
                var html = '';
                var info = "";
                (appConfig.language == "chinese")? info = "信息": info = "Info";
                if (fn) {
                    html += '<div class="head"><i class="icons-big icons-big-confirm"></i>'+info+'</div>';
                    html += '<div class="pop-text confirms-text"><div class="text">' + text + '</div>' + btn + '</div>';
                    console.log("===>fn",fn)
                } else {
                    html += '<div class="head"><i class="icons-big icons-big-alert"></i>'+info+'</div>';
                    html += '<div class="pop-text alerts-text"><div class="text">' + text + '</div>' + btn + '</div>';
                    console.log("===>fn",fn)
                }

                oDiv.innerHTML = html;
                htmlChild.appendChild(oBg);
                htmlChild.appendChild(oDiv);
                var oDivW = oDiv.offsetWidth / 2;
                var windowW = htmlChild.offsetWidth / 2;

                oDiv.style.left = windowW - oDivW + 'px';
                oDiv.childNodes[1].childNodes[1].childNodes[0].onclick = function () {
                    htmlChild.removeChild(oBg);
                    htmlChild.removeChild(oDiv);
                    if (hashSrc) {
                        if (hashSrc == 'history_back') {//返回历史记录上一页
                            window.history.back();
                        } else {//返回指定的url地址
                            location.hash = hashSrc;
                        }
                    }
                    if (fn) {
                        fn();
                    }
                };
                if (fn) {
                    oDiv.childNodes[1].childNodes[1].childNodes[1].onclick = function () {
                        htmlChild.removeChild(oBg);
                        htmlChild.removeChild(oDiv);
                    };
                }
            }
        },
        //加载等待
        layerLoading: {
            show: function () {
                this._createLoadingHtml();
            },
            hide: function () {
                if (window.parent) {
                    $('#layer-loading', parent.document).remove();
                } else {
                    $("#layer-loading").remove();
                }
            },
            _createLoadingHtml: function () {
                var html = '<div class="layer-loading" id="layer-loading">';
                html += '<div class="loading-bg"></div>';
                html += '<div class="loading-con"></div>';
                html += '</div>';

                var windowObj = window.parent || window;
                var htmlChild = windowObj.document.getElementsByTagName('body')[0];
                if ($(htmlChild).find("#layer-loading").length == 0) {
                    $(htmlChild).append(html);
                }
            }
        },

        hideAlertDiv: function () {
            var divInfo = document.getElementById("PassengerDistribution-divInfo");
            divInfo.style.display = "none";
        },

        encode64: function (input) {
            var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv"
                + "wxyz0123456789+/" + "=";
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
                    + keyStr.charAt(enc3) + keyStr.charAt(enc4);
            } while (i < input.length);

            return output;
        }
    });
})(jQuery);
