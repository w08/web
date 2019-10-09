var g_key = '2963814750';
var g_tip1 = '欢迎主人回来 ^_^';
var g_tip2 = '请勿泄漏地址和暗号，谢谢您！';
var g_bitxor_key = 25;
class storage {
    constructor(props) {
        this.props = props || {};
        this.source = this.props.source || window.localStorage;
        this.initRun();
    }
    initRun() {
        const reg = new RegExp("__expires__");
        let data = this.source;
        let list = Object.keys(data);
        if (list.length > 0) {
            list.map((key, v) => {
                if (!reg.test(key)) {
                    let now = Date.now();
                    let expires = data[`${key}__expires__`] || Date.now + 1;
                    if (now >= expires) {
                        this.remove(key);
                    };
                };
                return key;
            });
        };
    }
    set(key, value, expired) {
        let source = this.source;
        source[key] = JSON.stringify(value);
        if (expired) {
            source[`${key}__expires__`] = Date.now() + 1000 * 60 * 60 * 24 * expired;
        };
        return value;
    }

    get(key) {
        const source = this.source,
            expired = source[`${key}__expires__`] || Date.now + 1;
        const now = Date.now();

        if (now >= expired) {
            this.remove(key);
            return;
        }
        const value = source[key] ? JSON.parse(source[key]) : source[key];
        return value;
    }

    remove(key) {
        const data = this.source,
            value = data[key];
        delete data[key];
        delete data[`${key}__expires__`];
        return value;
    }
}
/*质朴长存法*/
function pad(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}

function x_enc(str, key) {
    var crytxt = '';
    var k, keylen = key.length;
    for (var i = 0; i < str.length; i++) {
        k = i % keylen;
        crytxt += key.charAt(str.charAt(k));
    }
    return crytxt;
}

function x_dec(str, key) {
    var crytxt = '';
    var k, keylen = key.length;
    for (var i = 0; i < str.length; i++) {
        k = i % keylen;
        de = key.indexOf(str.charAt(k));
        crytxt += de.toString();
    }
    return crytxt;
}

function toast(msg) {
    setTimeout(function () {
        document.getElementsByClassName('toast-wrap')[0].getElementsByClassName('toast-msg')[0].innerHTML = msg;
        var toastTag = document.getElementsByClassName('toast-wrap')[0];
        toastTag.className = toastTag.className.replace('toastAnimate', '');
        setTimeout(function () {
            toastTag.className = toastTag.className + ' toastAnimate';
        }, 100);
    }, 500);
}

//get server date
var g_date = new Date();
$.ajax({
    url: '',
    type: 'get',
    success: function (data, status, xhr) {
        var str = xhr.getResponseHeader('Date');
        g_date = new Date(str); //把GMT 2 北京时间
        toast(g_tip1);
    }
});

//get stor data
var stor = new storage();
$('#un').val(stor.get("pw"));

//click1
$('#login-button').click(function (event) {
    if ((x_chkun($('#un').val())) || (hex_md5("#pw" + $('#un').val()) == "9026c0abb4baba84d2977743fbcc62ad")) //没服务器省钱请不要破解谢谢^.^
    {
        $.getJSON("data.json", "", function (data) {　 //each循环 使用$.each方法遍历返回的数据date
            curday = g_date.getDate();
            index = curday - 1;
            if (index < data.length) {
                url = data[index];
                location.href = url;
            }
        });
        stor.set("pw", $('#un').val(), 31);
    }
    else {
        alert($t);
    }
});

//click2
$('.info').click(function (event) {
    toast(g_tip2);
});

function x_chkun(enstr) {
    var destr = x_dec(enstr, g_key);
    var v_month, v_day, v_chk;
    if (destr.length >= 2)
        v_month = destr.substring(0, 2);
    if (destr.length >= 4)
        v_day = destr.substring(2, 4);
    if (destr.length >= 6)
        v_chk = destr.substring(4, 6);
    if ((parseInt(v_month) ^ parseInt(v_day) ^ g_bitxor_key) == parseInt(v_chk)) {//check chk
        var nowDate = new Date();
        var buDate = new Date();
        buDate.setMonth(v_month - 1);
        buDate.setDate(v_day);
        buDate.setHours(0);
        buDate.setMinutes(0);
        buDate.setSeconds(0);
        var difDay = (nowDate - buDate) / (1000 * 60 * 60 * 24);
        if (difDay <= 31 && nowDate > buDate)
            return true;
    }
    return false;
}

/* 不发行函数*/
/*
function test() {
    var start = new Date("2020-01-01".replace(/-/g, "/"));
    var end = new Date("2020-12-31".replace(/-/g, "/"));
    do {
        var xcheck = (start.getMonth() + 1) ^ start.getDate() ^ g_bitxor_key;
        show(pad(start.getMonth() + 1, 2).toString() + pad(start.getDate(), 2).toString(), pad(xcheck, 2).toString());
        start.setDate(start.getDate() + 1);
    } while (end >= start);

}
function show(ymd, check) {
    var enstr = x_enc(ymd + check, g_key);
    var destr = x_dec(enstr, g_key);
    console.log(ymd + ":" + enstr);
}
*/