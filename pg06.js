
/**
 * Defination
 * Author: Sisiliu
 * Date: 2015/9/23.
 */

//页面
(function(){

    var wait = 300;
    var isSroll=0;
    $(function(){

        //设置REM
        var setRem=function () {
            var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
                fontSize = 40;
            if((clientHeight/clientWidth)<(3/2)){
                var nowRem = clientHeight*fontSize / 960;
            }else{
                var nowRem = clientWidth*fontSize / 640;

            }
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
        document.onreadystatechange = dosome;//当页面加载状态改变的时候执行这个方法.
        function dosome() {
            if(document.readyState == "complete"){ //当页面加载状态完成
                setTimeout(function(){
                    pw.next();
                    pw.remove(0);
                    pw.freeze(false);
                },2000);
            }
        }

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
        //按钮
        //$(".btn-top").on(,function(){
        //
        //});
        //选中介
        $(".btn-top .btn-xzj").on("click",function(){
            pw.slide(2);
        });
        //选速聘
        $(".btn-top .btn-xsp").on("click",function(){
            pw.slide(6);
        });
        $(".btn-top .btn-xsp2").on("click",function(){
            pw.slide(6);
        });
        //去报名
        $(".btn-top  .btn-qbm").on("click",function(){
            pw.slide(8);
        });
        //分享给老乡
        $(".btn-top .btn-fx").on("click",function(){
            popShare(1);
        });
        //拉上老乡一起
        $(".btn-top .btn-lslx").on("click",function(){
            popShare(1);
        });
        //验证
        $(".info input").on("blur",function(){
            checkInfo($(this));
        });
        //获取验证码
        $("#code").on("click",getCode);
        //提交
        $("#submit").on("click",function(){
            submitInfo();
        });
        //黑幕
        $("#blackmask").on("click",function(){
            popShare(0);
        });

        //禁止滑屏
        document.addEventListener('touchmove', function(event) {
            //判断条件,条件成立才阻止背景页面滚动,其他情况不会再影响到页面滚动
            if(isSroll){
                event.preventDefault();
            }
        });
    }

    //获取验证码
    function getCode(){
        var $ele = $("#code").prev("input");
        if(checkInfo($ele)){
            //发送接口
            $.ajax({
                type: "get",
                dataType: 'json',
                url: "authcode.json",
                //data: {
                //    "mobile":  tel
                //},
                error: function(data) {
                },
                success: function(data) {
                    if(data.isSuccess){
                        countDown($("#code"));
                    }else{
                        alert(data.returnMessage);
                    }
                }
            });
        }
    }
    //验证码倒计时
    function countDown(o){
        if(wait==0){
            $("#code").on("click",getCode);
            $("#code").removeClass("disabled").addClass("green");
            o.html("获取验证码");
            wait=300;
        }else{
            $("#code").off("click",getCode);
            $("#code").removeClass("green").addClass("disabled");
            o.html("重发("+wait+")秒");
            wait--;
            setTimeout(function(){
                countDown(o);
            },1000);
        }
    }
    //提交表单
    function submitInfo(){
        var $forms = $(".form .info");
        var result = 0;
        for(var i=0;i<$forms.length;i++){
            result += ({true:1,false:0})[checkInfo($($forms[i]).find("input"))];
        }
        if(result==4){
            //TODO 提交表单
            $.ajax({
                type: "get",
                dataType: 'json',
                url: "submit.json",
                error: function(data) {
                },
                success: function(data) {
                    if(data.isSuccess){
                        if(data.isNew){
                            $(".bmsuc-p").html("您已经完成报名，赶快分享给老乡<br>拒绝黑中介，找靠谱好工作，尽在58速聘");
                        }else{
                            $(".bmsuc-p").html("工作人员将会在24小时内与您联系<br>请保持手机处于开机状态。");
                        }
                        $(".page-form").hide();
                        pw.freeze(true);
                        $(".page-bmsuc").show();
                    }else{
                        alert(data.returnMessage);
                    }
                }
            });
        }
    }
    //校验表单
    function checkInfo($ele){
        var value = $ele.val();
        var type = $ele.attr("infotype");
        var result;
        switch(type){
            case "name":
                var reg = /^[\u4E00-\u9fa5]{2,4}$/;
                result = reg.test(value);
                break;
            case "factory":
                result = true;
                break;
            case "tel":
                //var reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
                var reg = /^1[0-9]{10}$/;
                result = reg.test(value);
                break;
            case "code":
                var reg = /^([a-z]|[A-Z]|[0-9]){4}$/;
                result = reg.test(value);
                break;
        }
        if(!result){
            $ele.parents(".info").find("p").css("visibility","visible");
        }else{
            $ele.parents(".info").find("p").css("visibility","hidden");
        }
        return result;
    }
    //isShow为1显示，为0隐藏
    function popShare(isShow){
        if(isShow){
            $("#blackmask").show();
            if(isWeiXin()){
                $(".share-wx").show();
            }else{
                $(".share-m").show();
            }
            isSroll=1;
        }else{
            $("#blackmask").hide();
            if(isWeiXin()){
                $(".share-wx").hide();
            }else{
                $(".share-m").hide();
            }
            isSroll=0;
        }
    }

    function sendAjax(type,url,dataType,callBack){

    }
    //判断是不是微信
    function isWeiXin(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;
        }
    }

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
                imgUrl: "http://c.58cdn.com.cn/crop/zt/sp/pugong/img/share_icon.jpg",
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


