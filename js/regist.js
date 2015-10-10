/**
 * Defination
 * Author: Sisiliu
 * Date: 2015/9/23.
 */

//页面
(function(){

    var wait = 300;
    var url = "http://yunying.wx.supin.58.com";
    $(function(){

        $(function(){
            //设置REM
            var setRem=function () {
                var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                    fontSize = 40;
                if(clientWidth>450){
                    clientWidth = 450;
                }
                var nowRem = clientWidth*fontSize / 640;
                $("html").css("font-size", nowRem + "px");
            };
            onresize = setRem;
            setRem();
        });
        bindEvent();

    });

    function bindEvent(){

        //分享给老乡
        $(".btn-top.btn-fx").on("click",function(){
            if(isWeiXin()){
                popShow(".share-wx");
            }else{
                //window.history.replaceState({}, document.title, "http://yunying.wx.supin.58.com/generalwork/index/");
                window.history.replaceState({}, document.title, "http://sisiliu.ml/supin");
                popShow(".share-m");
            }
        });
        //拉上老乡一起
        $(".btn-top.btn-lslx").on("click",function(){
            if(isWeiXin()){
                popShow(".share-wx");
            }else{
                //window.history.replaceState({}, document.title, "http://yunying.wx.supin.58.com/generalwork/index/");
                window.history.replaceState({}, document.title, "http://sisiliu.ml/supin");
                popShow(".share-m");
            }
        });
        //验证
        $(".info .input").on("blur",function(){
            checkInfo($(this));
        });
        //报名工厂
        $("#factory").on("click",function(){
            if($(".conLeft ul li").length==0){
                createList();
            }
            popShow("#blackBox .popSelCon");
            return false;
        });
        //获取验证码
        $("#code").on("click",getCode);
        //提交
        $("#submit").on("click",submitInfo);
        //黑幕
        $("#blackBox").on("click",function(){
            popHide();
        });

    }

    //获取验证码
    function getCode(){
        var $ele = $("#code").prev("input");
        if(checkInfo($ele)){
            //发送接口
            $.ajax({
                type: "get",
                dataType: 'jsonp',
                url: url+"/generalwork/sendPhoneVC/",//http://yunying.wx.supin.58.com/generalwork/sendPhoneVC/
                data: {
                    "mobile":  $ele.val()
                },
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
            result += ({true:1,false:0})[(checkInfo($($forms[i]).find("input"))||checkInfo($($forms[i]).find("span")))];
        }
        if(result==4){
            $("#submit").off("click",submitInfo);
            var realName = $($forms[0]).find("input").val();
            var enterprise = $($forms[1]).find("span").html();
            var mobile = $($forms[2]).find("input").val();
            var authCode = $($forms[3]).find("input").val();
            $.ajax({
                type: "get",
                dataType: 'jsonp',
                url: url+"/generalwork/enroll/",//http://yunying.wx.supin.58.com/generalwork/senroll/,
                data:{
                    realName:realName,
                    enterprise:enterprise,
                    mobile:mobile,
                    authCode:authCode
                },
                error: function(data) {
                    $("#submit").on("click",submitInfo);
                },
                success: function(data) {
                    if(data.entity==2){
                        $(".bmsuc-p").html("工作人员将会在24小时内与您联系<br>请保持手机处于开机状态。");
                        $(".page-form").hide();
                        $(".page-bmsuc").show();
                    }else if(data.entity==1){
                        $(".bmsuc-p").html("您已经完成报名，赶快分享给老乡<br>拒绝黑中介，找靠谱好工作，尽在58速聘");
                        $(".page-form").hide();
                        $(".page-bmsuc").show();
                    }else {
                        alert(data.returnMessage);
                    }
                    $("#submit").on("click",submitInfo);
                }
            });
        }
    }
    //校验表单
    function checkInfo($ele){
        var value = $ele.val()||$ele.html();
        var type = $ele.attr("infotype");
        var result;
        switch(type){
            case "name":
                var reg = /^[\u4E00-\u9fa5]{2,4}$/;
                result = reg.test(value);
                break;
            case "factory":
                result = (value.length>0);
                break;
            case "tel":
                var reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
                result = reg.test(value);
                break;
            case "code":
                var reg = /^([a-z]|[A-Z]|[0-9]){6}$/;
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

    //生成下拉列表
    function createList (){

        $.ajax({
            type: "get",
            dataType: 'jsonp',
            url: url+"/generalwork/factoryname/",//http://yunying.wx.supin.58.com/generalwork/factoryname/
            error: function(data) {
            },
            success: function(data) {
                renderList(data.entity);
            }
        });

    }

    //渲染和绑定
    function renderList(data){

        var htmlStr = "";
        var length = data.length;
        for(var i=0;i<length;i++){
            htmlStr +='<li value="'+data[i]+'">'+data[i]+"</li>";
        }
        $('.popSelMain ul').html(htmlStr);

        conSwipe.doSwipe({list:$(".popSelMain .conLeft ul"),parent:$(".popSelMain .conLeft"),isInteger:false});

        $(".popSelMain .conLeft").on("click","li",function(){
            $(".popSelMain .conLeft .selected").removeClass("selected");
            $(this).addClass("selected");
            $("#factory").html($(this).text());
            popHide("#blackBox .popSelCon");
        });
    }

    function popShow(id){
        $("#blackBox").show();
        $(id).show();
    }
    function popHide(){
        $("#blackBox").hide();
        if(isWeiXin()){
            $(".share-wx").hide();
        }else{
            $(".share-m").hide();
        }
        $("#blackBox .popSelCon").hide();
        isSroll=0;
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
                link: "http://yunying.wx.supin.58.com/generalwork/index/",
                imgUrl: "http://c.58cdn.com.cn/crop/zt/supin/koubei/img/ele/200x200_wx.png",
                success: function(){
                },
                cancel: function() {
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


