function getParams() {
  var url = document.location.href;
  var params = url.split('?')[1];
  if (!params) {
    return {};
  } else {
    var tempList = params.split('&');
    var json = {};
    for (var i = 0; i < tempList.length; i++) {
      var temp = tempList[i].split('=');
      if (temp.length === 2) {
        json[temp[0]] = temp[1];
      }
    }
    return json;
  }
}

function setCookies(name, value, exptime) {
  try {
    if (arguments.length == 2) return arguments.callee(name, value, 30 * 24 * 60 * 60 * 1000);
    var exp = new Date();
    exp.setTime(exp.getTime() + exptime);
    document.cookie = name + '=' + escape(value) + ';path=/;expires=' + exp.toGMTString();
  } catch (e) {
    throw new Error('SetCookies: ' + e.message);
  }
}

function getUrlParam() {
  var token = getParams() && getParams()['token'];
  var product_id = getParams() && getParams()['product_id'];
  var appkey = getParams() && getParams()['appkey'];

  if (token && token !== 'undefined') {
    localStorage.setItem('token', token);
    setCookies('x-client-token', token);
  }
  if (product_id && product_id !== 'undefined') {
    localStorage.setItem('productId', product_id);
  }
  if (appkey && appkey !== 'undefined') {
    localStorage.setItem('appkey', appkey);
  }
}

getUrlParam();

function getSysParam() {
  var xmlHttp;
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
  }

  if (!xmlHttp) {
    throw new Error('XMLHttpRequest 未创建');
  }

  xmlHttp.onreadystatechange = function(response) {
    if (4 == xmlHttp.readyState) {
      if (200 == xmlHttp.status) {
        var retObj = JSON.parse(xmlHttp.responseText);
        var obj = retObj.data || {};

        localStorage.setItem('analytics_custom_report_url', obj['analytics.custom.report.url']);
        localStorage.setItem('my_report_url', obj['my.report.url']);
        localStorage.setItem('share_report_url', obj['share.report.url']);
        localStorage.setItem('user_group_report_url', obj['user.group.report.url']);
        localStorage.setItem('user_manage_report_url', obj['user.manage.report.url']);
      }
    }
  };

  var token = localStorage.getItem('token');

  xmlHttp.open('post', window.location.origin + '/crowd/admin/params/query', false);
  xmlHttp.setRequestHeader('Content-Type', 'application/json');
  xmlHttp.setRequestHeader('x-client-token', token);
  xmlHttp.send(
    JSON.stringify({
      data: [
        'analytics.custom.report.url',
        'my.report.url',
        'share.report.url',
        'user.group.report.url',
        'user.manage.report.url'
      ]
    })
  );
}

getSysParam();
