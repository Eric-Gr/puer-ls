//cookie
function getCookie(){//获取cookie
    var cookie = {};
    var all = document.cookie;
    if (all === '')
        return cookie;
    var list = all.split('; ');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}
function setCookie(name, value, expires, path, domain, secure){//设置cookie
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires)
        cookie += '; expires=' + expires.toGMTString();
    if (path)
        cookie += '; path=' + path;
    if (domain)
        cookie += '; domain=' + domain;
    if (secure)
        cookie += '; secure=' + secure;
    document.cookie = cookie;
}
function removeCookie(name, path, domain){//删除cookie
    document.cookie = name + '='
    + '; path=' + path
    + '; domain=' + domain
    + '; max-age=0';
}

//class操作
function hasClass(object,clsname){
    var clsname = clsname.replace(".","");
    var sCls = " "+(object.className)+" ";
    return (sCls.indexOf(" "+clsname+" ") != -1) ? true : false;
}
function toClass(str){
    var str = str.toString();
    str = str.replace(/(^\s*)|(\s*$)/g,"");
    str = str.replace(/\s{2,}/g," ");
    return str;
}
function addClass(object,clsname){
    var clsname = clsname.replace(".","");
    if(!hasClass(object,clsname)){
        object.className = toClass(object.className+(" "+clsname));
    }
}
function delClass(object,clsname){
    var clsname = clsname.replace(".","");
    if(hasClass(object,clsname)){
        object.className = toClass(object.className.replace(new RegExp("(?:^|\\s)"+clsname+"(?=\\s|$)","g")," "));
    }
}

//Ajax方法
function get(url,options,callback){
    var xml = new XMLHttpRequest();
    xml.onreadystatechange = function(){
        if(xml.readyState == 4){
            if((xml.status >= 200 && xml.status < 300) || xml.status == 304){
                callback(xml.responseText);
            }else{
                console.log("请求未成功：" + xml.status );
            }
        }
    }
    var seriUrl = url + '?' + serialize(options);
    xml.open('get', seriUrl, true);
    xml.send(null);
}
function serialize(data){
    if(!data) return '';
    var pairs = [], value;
    for(name in data){
        if(!data.hasOwnProperty(name)) continue;
        if(typeof data[name] === 'function') continue;
        value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}

//getElementsByClassName兼容
function getElementsByClassName(element, names) {
    if (element.getElementsByClassName) {
        return element.getElementsByClassName(names);
    } else {
        var elements = element.getElementsByTagName('*');
        var result = [];
        var element,
            classNameStr,
            flag;
        names = names.split(' ');
        for (var i = 0; element = elements[i]; i++) {
            classNameStr = ' ' + element.className + ' ';
            flag = true;
            for (var j = 0, name; name = names[j]; j++) {
                if (classNameStr.indexOf(' ' + name + '') == -1) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                result.push(element);
            }
        }
        return result;
    }
}

//弹窗
function createPop(popup,close){
    var body = document.getElementsByTagName("body")[0];
    var mask = document.createElement("div");
    addClass(mask,"mask");
    body.appendChild(mask);
    body.appendChild(popup);
    function popClose(){
        body.removeChild(popup);
        body.removeChild(mask);
    }
    mask.onclick = popClose;
    close.onclick = popClose;
}