/**
 * Defination
 * Author: Sisiliu
 * Date: 2015/9/23.
 */

//页面
(function(){

    var isSroll=0;
    $(function(){

        //设置REM
        var setRem=function () {
            var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                fontSize = 40;
            if(clientWidth>500){
                clientWidth = 500;
            }
            var nowRem = clientWidth*fontSize / 640;

            $("html").css("font-size", nowRem + "px");
        };
        onresize = setRem;
        setRem();

        pw=new pageSwitch('pages',{
            duration:1,                  //int 页面过渡时间
            direction:1,                    //int 页面切换方向，0横向，1纵向
            start:0,                        //int 默认显示页面
            loop:false,                      //bool 是否循环切换
            //ease:/flip(?!Paper)/.test(ts)?'bounce':'ease',
            ease:'ease',                    //string|function 过渡曲线动画，详见下方说明
            transition:'fade',             //string|function转场方式，详见下方说明
            mouse:true,                     //bool 是否启用鼠标
            mousewheel:true,                //bool 是否启用鼠标滚轮切换
            arrowkey:true                   //bool 是否启用键盘
        });

        //Loading
        $("#pages").show();
        pw.freeze(true);
        preLoadImg();
        //document.onreadystatechange = dosome;//当页面加载状态改变的时候执行这个方法.
        //function dosome() {
        //    if(document.readyState == "complete"){ //当页面加载状态完成
        //        //setTimeout(function(){
        //        //    pw.next();
        //        //    pw.remove(0);
        //        //    pw.freeze(false);
        //        //},2000);
        //    }
        //}

        //事件绑定
        pw.on("after",function(next,prev){
            if(prev==6&&next==5){
                pw.slide(1);
            }
            if(next==7&&prev==8){
                pw.slide(1);
            }
        });
        pw.on("before",function(next,prev){
            //console.log(prev,next);
            //if(next==8&&prev==7){
            //    pw.slide(1);
            //}
        });
        bindEvent();

    });

    function bindEvent(){

        //选中介
        $(".btn-top.btn-xzj").on("click",function(){
            pw.slide(2);
        });
        //选速聘
        $(".btn-top.btn-xsp").on("click",function(){
            pw.slide(6);
        });
        $(".btn-top.btn-xsp2").on("click",function(){
            pw.slide(6);
        });

        //禁止滑屏
        document.addEventListener('touchmove', function(event) {
            //判断条件,条件成立才阻止背景页面滚动,其他情况不会再影响到页面滚动
            if(isSroll){
                event.preventDefault();
            }
        });
    }

    //里面有两种方式
    function preLoadImg() {

        var imgNum = 0;
        var images = [];
        //第一种方式：通过dom方法获取页面中的所有img，包括<img>标签和css中的background-image
        //get all imgs those tag is <img>
        var imgs = document.images;
        for (var i = 0; i < imgs.length; i++) {
            images.push(imgs[i].src);
        }
        //get all images in style
        var cssImages = getallBgimages();
        for (var j = 0; j < cssImages.length; j++) {
            images.push(cssImages[j]);
        }

        /*这里是真正的图片预加载 preload*/
        $.imgpreload(images,
            {
                each: function () {
                    /*this will be called after each image loaded*/
                    var status = $(this).data('loaded') ? 'success' : 'error';
                    if (status == "success") {
                        var v = (parseFloat(++imgNum) / images.length).toFixed(2);
                        $(".loading-per").html(Math.round(v * 100) + "%");
                        $(".loading-per").css("left",2.5375+v*8+"rem");
                        $(".loading-barUp").css("width",v*10.925+"rem");
                    }
                },
                all: function () {
                    setTimeout(function(){
                        pw.next();
                        pw.remove(0);
                        pw.freeze(false);
                    },2000);
                }
            });
    }

    //get all images in style（此方法引用其他博客的）
    function getallBgimages() {
        var url, B = [], A = document.getElementsByTagName('*');
        A = B.slice.call(A, 0, A.length);
        while (A.length) {
            url = document.deepCss(A.shift(), 'background-image');
            if (url) url = /url\(['"]?([^")]+)/.exec(url) || [];
            url = url[1];
            if (url && B.indexOf(url) == -1) B[B.length] = url;
        }
        return B;
    }

    document.deepCss = function (who, css) {
        if (!who || !who.style) return '';
        var sty = css.replace(/\-([a-z])/g, function (a, b) {
            return b.toUpperCase();
        });
        if (who.currentStyle) {
            return who.style[sty] || who.currentStyle[sty] || '';
        }
        var dv = document.defaultView || window;
        return who.style[sty] ||
                dv.getComputedStyle(who, "").getPropertyValue(css) || '';
    };

    Array.prototype.indexOf = Array.prototype.indexOf ||
    function (what, index) {
        index = index || 0;
        var L = this.length;
        while (index < L) {
            if (this[index] === what) return index;
            ++index;
        }
        return -1;
    };

    //微信分享
    (function() {
        wx.config({
            debug: false,
            appId: "",
            timestamp: new Date().getTime(),
            nonceStr: "",
            signature: "",
            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone"]
        });

        wx.ready(function() {
            var wxconfig={
                title: "想骗钱，没门",
                desc: "可恶的黑中介，竟然••••••",
                link: location.href,
                imgUrl: "http://c.58cdn.com.cn/crop/zt/supin/koubei/img/ele/200x200_wx.png",
                success: function(){
                    pw.slide(0);
                },
                cancel: function() {
                    pw.slide(0);
                }
            };
            wx.onMenuShareTimeline(wxconfig);
            wx.onMenuShareAppMessage(wxconfig);
            wx.onMenuShareQQ(wxconfig);
            wx.onMenuShareWeibo(wxconfig);
            wx.onMenuShareQZone(wxconfig);
        })
    })();

})();


